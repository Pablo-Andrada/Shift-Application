// src/cronJobs.ts

// Importamos 'node-cron' para programar tareas recurrentes.
import cron from "node-cron";
// Importamos el servicio que obtiene todos los turnos de la base de datos.
import { getAllAppointmentsService, updateAppointmentReminderSent } from "../services/appointmentService";
// Importamos la función para enviar el correo de recordatorio al usuario.
// Asegurate de haber agregado y exportado sendAppointmentReminderEmail en emailService.ts.
import { sendAppointmentReminderEmail } from "../services/emailService";

/**
 * getDateWithoutTime:
 * Función auxiliar para obtener la fecha sin la hora, lo que nos permite comparar únicamente la fecha.
 *
 * @param {Date} date - Objeto Date completo.
 * @returns {Date} Objeto Date ajustado a la medianoche (sin hora).
 */
const getDateWithoutTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * sendRemindersJob:
 * Función que se encarga de revisar todos los turnos y enviar recordatorios por correo
 * a los usuarios que tengan un turno programado para mañana.
 */
const sendRemindersJob = async () => {
  try {
    // Obtenemos todos los turnos desde la base de datos.
    const appointments = await getAllAppointmentsService();

    // Obtenemos la fecha actual sin incluir la hora.
    const today = getDateWithoutTime(new Date());
    // Calculamos la fecha de mañana.
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filtramos los turnos cuya fecha (sin hora) es igual a la fecha de mañana.
    // Y que no tengan el recordatorio ya enviado.
    const appointmentsTomorrow = appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      const apptDateOnly = getDateWithoutTime(apptDate);
      return (
        apptDateOnly.getTime() === tomorrow.getTime() &&
        appt.status === "active" &&
        !appt.reminderSent // ✅ Solo si aún no se envió el recordatorio
      );
    });

    // Para cada turno programado para mañana, intentamos enviar un correo de recordatorio.
    for (const appt of appointmentsTomorrow) {
      if (appt.user) {
        const appointmentData = {
          appointmentId: appt.id,
          date: new Date(appt.date).toISOString(),
          time: appt.time,
          userName: appt.user.name,
          userEmail: appt.user.email,
        };
        try {
          await sendAppointmentReminderEmail(appointmentData);
          console.log(`✅ Recordatorio enviado para turno #${appt.id} a ${appt.user.email}`);

          // ✅ Marcamos el turno como recordatorio ya enviado
          await updateAppointmentReminderSent(appt.id);
        } catch (emailError: any) {
          console.error(`❌ Error al enviar recordatorio para turno #${appt.id}:`, emailError.message || emailError);
        }
      } else {
        console.warn(`⚠️ Turno #${appt.id} sin usuario asociado, no se pudo enviar recordatorio.`);
      }
    }
  } catch (error) {
    console.error("❌ Error en el job de recordatorios:", error);
  }
};

// Configuramos el cron job para que se ejecute cada minuto.
// Nota: En producción podrías configurar un cron job con una expresión diferente (p.ej., una vez al día a una hora específica).
cron.schedule("* * * * *", () => {
  console.log("⏰ Ejecutando cron job para enviar recordatorios de turnos...");
  sendRemindersJob();
});

// Exportamos la función del cron job (opcional) para permitir iniciar o detener el job desde otros módulos.
export { sendRemindersJob };
