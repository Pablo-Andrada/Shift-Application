import { Request, Response } from "express";
import {
  getAllAppointmentsService,
  getAppointmentByIdService,
  createAppointmentService,
  cancelAppointmentService,
} from "../services/appointmentService";
import { Appointment } from "../entities/Appointment";
import { getAppointmentsByUserIdService } from "../services/appointmentService";

// Importamos la función para enviar correos de confirmación y de cancelación
import { sendAppointmentConfirmationEmail, sendAppointmentCancellationEmail } from "../services/emailService";

/**
 * GET /appointments
 * Obtener el listado de todos los turnos de todos los usuarios.
 */
export const getAppointmentsController = async (req: Request, res: Response) => {
  try {
    const appointments: Appointment[] = await getAllAppointmentsService();
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
    // Se asume que el ID llega como parámetro de ruta, ej: /appointments/123
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
 *
 * Se encarga de:
 * 1. Crear el turno en la base de datos.
 * 2. Si la creación es exitosa, enviar un correo de confirmación al usuario.
 */
export const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const { date, time, userId } = req.body;
    // Convertimos `date` a un objeto Date y `userId` a number
    const newAppointment: Appointment | null = await createAppointmentService(
      new Date(date),
      time,
      Number(userId)
    );

    if (!newAppointment) {
      return res.status(400).json({ message: "No se pudo crear el turno (usuario inexistente)" });
    }

    // Enviar el correo de confirmación sólo si la relación con el usuario está definida
    if (newAppointment.user) {
      // Construimos el objeto de datos para el correo de confirmación
      const appointmentData = {
        appointmentId: newAppointment.id,
        date: newAppointment.date.toISOString(), // Convertimos a ISO para estandarizar la fecha
        time: newAppointment.time,
        userName: newAppointment.user.name,
        userEmail: newAppointment.user.email,
      };

      try {
        await sendAppointmentConfirmationEmail(appointmentData);
        console.log("✅ Correo de confirmación enviado a:", newAppointment.user.email);
      } catch (emailError: any) {
        console.error("❌ Error al enviar el correo de confirmación:", emailError.message || emailError);
        // Decisión: continuar sin fallar la petición
      }
    } else {
      console.warn("⚠️ El turno creado no tiene usuario asociado para enviar el correo de confirmación.");
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
 * Cambiar el estatus de un turno a “cancelled” y enviar un correo de confirmación de cancelación.
 */
export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Se recibe el ID del turno en la URL

    // Obtenemos primero el turno para tener sus datos
    const appointment = await getAppointmentByIdService(Number(id));
    if (!appointment) {
      return res.status(404).json({ message: "No se encontró el turno a cancelar" });
    }

    // Cancelamos el turno
    const success = await cancelAppointmentService(Number(id));
    if (!success) {
      return res.status(404).json({ message: "No se encontró el turno a cancelar" });
    }

    // Enviar el correo de cancelación solo si el usuario está asociado al turno
    if (appointment.user) {
      const cancellationData = {
        appointmentId: appointment.id,
        date: appointment.date.toISOString(),
        time: appointment.time,
        userName: appointment.user.name,
        userEmail: appointment.user.email,
      };
      try {
        await sendAppointmentCancellationEmail(cancellationData);
        console.log("✅ Correo de cancelación enviado a:", appointment.user.email);
      } catch (emailError: any) {
        console.error("❌ Error al enviar el correo de cancelación:", emailError.message || emailError);
        // Continuamos sin fallar la petición
      }
    } else {
      console.warn("⚠️ El turno cancelado no tiene usuario asociado para enviar el correo de cancelación.");
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
 * Obtener todos los turnos de un usuario específico.
 */
export const getAppointmentsByUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Este servicio trae todos los turnos del usuario cuyo ID es userId
    const appointments: Appointment[] = await getAppointmentsByUserIdService(Number(userId));
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los turnos del usuario",
      error,
    });
  }
};
