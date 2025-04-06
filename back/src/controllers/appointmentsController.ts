import { Request, Response } from "express";
import {
  getAllAppointmentsService,
  getAppointmentByIdService,
  createAppointmentService,
  cancelAppointmentService,
} from "../services/appointmentService";
import { Appointment } from "../entities/Appointment";
import { getAppointmentsByUserIdService } from "../services/appointmentService";
/**
 * GET /appointments
 * Obtener el listado de todos los turnos de todos los usuarios.
 */
export const getAppointmentsController = async (req: Request, res: Response) => {
  try {
    const appointments : Appointment[] = await getAllAppointmentsService();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los turnos",
      error,
    });
  }
};

/**
 * GET /appointments/:id
 * Obtener el detalle de un turno específico.
 */
export const getAppointmentIdController = async (req: Request, res: Response) => {
  try {
    // Aquí se asume que el ID llega como parámetro de ruta: /appointments/123
    const { id } = req.params;
      const appointment: Appointment | null = await getAppointmentByIdService(Number(id));

    if (!appointment) {
      return res.status(404).json({ message: "No se encontró el turno" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el turno",
      error,
    });
  }
};

/**
 * POST /appointments/schedule
 * Agendar un nuevo turno.
 */
export const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const { date, time, userId } = req.body;
    // Convertimos `date` a un objeto Date, y `userId` a number
    const newAppointment :Appointment |null= await createAppointmentService(
      new Date(date),
      time,
      Number(userId)
    );

    if (!newAppointment) {
      return res
        .status(400)
        .json({ message: "No se pudo crear el turno (usuario inexistente)" });
    }
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el turno",
      error,
    });
  }
};

/**
 * PUT /appointments/cancel/:id
 * Cambiar el estatus de un turno a “cancelled”.
 */
export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Podrías también recibirlo por URL: /appointments/:id

    const success = await cancelAppointmentService(Number(id));
    if (!success) {
      return res.status(404).json({ message: "No se encontró el turno a cancelar" });
    }

    res.status(200).json({ message: "Turno cancelado exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar el turno",
      error,
    });
  }
};

/**
 * GET /appointments/user/:userId
 * Obtener todos los turnos de un usuario específico
 */
export const getAppointmentsByUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Este servicio debe traerte todos los turnos con ese userId
    const appointments: Appointment[] = await getAppointmentsByUserIdService(Number(userId));

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los turnos del usuario",
      error,
    });
  }
};


