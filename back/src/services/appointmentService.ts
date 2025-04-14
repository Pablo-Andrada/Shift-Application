// src/services/appointmentService.ts
import { AppointmentModel, UserModel } from "../config/data-source";
import { Appointment } from "../entities/Appointment";
import { AppDataSource } from "../config/data-source";

/**
 * Obtiene todos los turnos (appointments) de la base de datos.
 * Se incluyen las relaciones con el usuario (user) para obtener información completa.
 */
export async function getAllAppointmentsService(): Promise<Appointment[]> {
  return await AppointmentModel.find({
    relations: ["user"]
  });
}

/**
 * Obtiene un turno específico por su ID.
 * @param id - El ID del turno.
 */
export async function getAppointmentByIdService(id: number): Promise<Appointment | null> {
  return await AppointmentModel.findOne({
    where: { id },
    relations: ["user"]
  });
}

/**
 * Crea un nuevo turno (appointment) en la base de datos.
 * Se verifica que el usuario exista antes de crearlo, ya que no puede haber un turno sin un usuario.
 * Además, se incluye el nuevo campo 'comentarios' para almacenar comentarios adicionales (máximo 50 caracteres).
 *
 * @param date - La fecha del turno.
 * @param time - La hora del turno.
 * @param userId - El ID del usuario que solicita el turno.
 * @param comentarios - (Opcional) Texto con comentarios adicionales. Si se proporciona, se recorta a 50 caracteres.
 * @returns Un turno creado o null en caso de error (por ejemplo, si el usuario no existe).
 */
export async function createAppointmentService(
  date: Date,
  time: string,
  userId: number,
  comentarios?: string
): Promise<Appointment | null> {
  // Verificamos que el usuario exista usando el repositorio de usuarios
  const user = await UserModel.findOneBy({ id: userId });
  if (!user) {
    console.error('No se puede crear un turno sin un usuario válido.');
    return null;
  }

  // Creamos la instancia del turno
  // Se incluye el campo 'comentarios'; se utiliza substring para asegurarse de no exceder 50 caracteres.
  const newAppointment = AppointmentModel.create({
    date,
    time,
    userId,            // Guardamos el ID del usuario
    status: "active",  // Estado inicial del turno
    comentarios: comentarios ? comentarios.substring(0, 50) : ""
  });

  // Asignamos la relación con el usuario (opcional, pero recomendable para tener acceso al objeto completo)
  newAppointment.user = user;

  // Guardamos el turno en la base de datos
  await AppointmentModel.save(newAppointment);
  return newAppointment;
}

/**
 * Cancela un turno cambiando su estado a "cancelled".
 *
 * @param id - El ID del turno a cancelar.
 * @returns true si se cancela el turno exitosamente; false si el turno no existe.
 */
export async function cancelAppointmentService(id: number): Promise<boolean> {
  // Buscamos el turno en la base de datos
  const appointment = await AppointmentModel.findOneBy({ id });
  if (!appointment) {
    console.error('El turno con el ID especificado no existe.');
    return false;
  }

  // Actualizamos el estado del turno
  appointment.status = 'cancelled';
  await AppointmentModel.save(appointment);
  return true;
}

/**
 * Obtiene todos los turnos de un usuario específico, usando su ID.
 * Se incluyen también los datos del usuario (relación con la entidad User).
 *
 * @param userId - El ID del usuario.
 * @returns Un arreglo con todos los turnos pertenecientes a ese usuario.
 */
export async function getAppointmentsByUserIdService(userId: number): Promise<Appointment[]> {
  return await AppointmentModel.find({
    where: {
      user: {
        id: userId, // Filtramos los turnos cuyo usuario tenga este ID
      },
    },
    relations: ["user"], // Incluimos también los datos del usuario (join)
  });
}

/**
 * updateAppointmentReminderSent:
 * Actualiza el turno para marcar que ya se envió el recordatorio.
 *
 * @param appointmentId - El ID del turno al cual se le actualiza la bandera de recordatorio enviado.
 */
export const updateAppointmentReminderSent = async (appointmentId: number): Promise<void> => {
  const appointmentRepo = AppDataSource.getRepository(Appointment);
  await appointmentRepo.update(appointmentId, { reminderSent: true });
};

/**
 * DELETE Appointment:
 * Elimina un turno de la base de datos.
 *
 * @param id - El ID del turno a eliminar.
 * @returns true si se elimina el turno exitosamente; false si no existe.
 */
export async function deleteAppointmentService(id: number): Promise<boolean> {
  // Buscamos el turno por su ID
  const appointment = await AppointmentModel.findOneBy({ id });
  if (!appointment) {
    console.error("El turno con el ID especificado no existe.");
    return false;
  }

  // Eliminamos el turno
  await AppointmentModel.delete(id);
  return true;
}