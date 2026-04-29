import { Request, Response } from "express";
import {
    getAllAppointmentsService,
    getAppointmentByIdService,
    createAppointmentService,
    cancelAppointmentService,
    deleteAppointmentService,
    getAppointmentsByUserIdService,
    updateAppointmentAdminService,
    getAvailableSlotsService
} from "../services/appointmentService";
import { sendAppointmentConfirmationEmail, sendAppointmentCancellationEmail } from "../services/emailService";

export const getAppointmentsController = async (req: Request, res: Response) => {
    try {
        const appointments = await getAllAppointmentsService();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los turnos", error });
    }
};

export const getAppointmentIdController = async (req: Request, res: Response) => {
    try {
        const appointment = await getAppointmentByIdService(Number(req.params.id));
        if (!appointment) return res.status(404).json({ message: "No se encontró el turno" });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el turno", error });
    }
};

export const createAppointmentController = async (req: Request, res: Response) => {
    try {
        const {
            date, time, userId,
            descripcionFalla, vehicleBrand, vehicleModel, vehiclePlate, vehicleYear,
            repairType, adminNotes, adminMessage, estimatedDuration, comentarios
        } = req.body;

        const newAppointment = await createAppointmentService({
            date: new Date(date),
            time,
            userId: Number(userId),
            descripcionFalla,
            vehicleBrand,
            vehicleModel,
            vehiclePlate,
            vehicleYear,
            repairType,
            adminNotes,
            adminMessage,
            estimatedDuration,
            comentarios
        });

        if (!newAppointment) return res.status(400).json({ message: "No se pudo crear el turno (usuario inexistente)" });

        if (newAppointment.user) {
            try {
                await sendAppointmentConfirmationEmail({
                    appointmentId: newAppointment.id,
                    date: newAppointment.date.toISOString(),
                    time: newAppointment.time,
                    userName: newAppointment.user.name,
                    userEmail: newAppointment.user.email,
                    comentarios: newAppointment.comentarios || ""
                });
            } catch (e) { /* no bloquear si falla el email */ }
        }

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el turno", error });
    }
};

export const updateAppointmentController = async (req: Request, res: Response) => {
    try {
        const appointment = await getAppointmentByIdService(Number(req.params.id));
        if (!appointment) return res.status(404).json({ message: "No se encontró el turno a cancelar" });

        const success = await cancelAppointmentService(Number(req.params.id));
        if (!success) return res.status(404).json({ message: "No se encontró el turno a cancelar" });

        if (appointment.user) {
            try {
                await sendAppointmentCancellationEmail({
                    appointmentId: appointment.id,
                    date: appointment.date.toISOString(),
                    time: appointment.time,
                    userName: appointment.user.name,
                    userEmail: appointment.user.email,
                });
            } catch (e) { /* no bloquear */ }
        }

        res.status(200).json({ message: "Turno cancelado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar el turno", error });
    }
};

export const getAppointmentsByUserController = async (req: Request, res: Response) => {
    try {
        const appointments = await getAppointmentsByUserIdService(Number(req.params.userId));
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los turnos del usuario", error });
    }
};

export const deleteAppointmentController = async (req: Request, res: Response) => {
    try {
        const success = await deleteAppointmentService(Number(req.params.id));
        if (!success) return res.status(404).json({ message: "Turno no encontrado para eliminar" });
        res.status(200).json({ message: "Turno eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el turno", error });
    }
};

// ADMIN: editar datos de un turno (fecha, hora, notas, mensaje, duración, tipo reparación)
export const updateAppointmentAdminController = async (req: Request, res: Response) => {
    try {
        const { date, time, adminNotes, adminMessage, estimatedDuration, repairType } = req.body;
        const updates: any = {};
        if (date) updates.date = new Date(date);
        if (time) updates.time = time;
        if (adminNotes !== undefined) updates.adminNotes = adminNotes;
        if (adminMessage !== undefined) updates.adminMessage = adminMessage;
        if (estimatedDuration !== undefined) updates.estimatedDuration = estimatedDuration;
        if (repairType !== undefined) updates.repairType = repairType;

        const updated = await updateAppointmentAdminService(Number(req.params.id), updates);
        if (!updated) return res.status(404).json({ message: "Turno no encontrado" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el turno", error });
    }
};

// Horarios disponibles para una fecha
export const getAvailableSlotsController = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        if (!date || typeof date !== "string") return res.status(400).json({ message: "Se requiere el parámetro 'date' (YYYY-MM-DD)" });
        const slots = await getAvailableSlotsService(date);
        res.status(200).json({ date, slots });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los horarios", error });
    }
};
