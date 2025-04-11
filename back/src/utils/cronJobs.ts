// src/cronJobs.ts

// Importamos 'node-cron' para programar tareas recurrentes.
// Si ves errores de tipo, asegúrate de instalar @types/node-cron.
import cron from "node-cron";
// Importamos el servicio que obtiene todos los turnos de la base de datos.
import { getAllAppointmentsService } from "../services/appointmentService";
// Importamos la función para enviar el correo de recordatorio al usuario.
// Asegúrate de que sendAppointmentReminderEmail esté correctamente exportado en emailService.ts.
import { sendAppointmentReminderEmail } from "../services/emailService";

/**
 * getDateWithoutTime:
 * Función auxiliar para obtener la fecha sin incluir la hora.
 * Esto nos permite comparar únicamente la parte de la fecha.
 *
 * @param {Date} date - Objeto Date completo.
 * @returns {Date} Objeto Date ajustado a la medianoche (sin hora).
 */
const getDateWithoutTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * sentReminders:
 * Objeto en memoria para rastrear los turnos a los cuales ya se envió el recordatorio.
 * Se utiliza para evitar envíos repetidos para el mismo turno.
 */
const sentReminders: { [appointmentId: number]: boolean } = {};

/**
 * sendRemindersJob:
 * Función encargada de revisar todos los turnos y, para aquellos que cumplan la condición de 
 * que el recordatorio debe enviarse exactamente 24 horas antes del turno, envía el correo de recordatorio.
 *
 * La lógica es la siguiente:
 * - Se obtienen todos los turnos mediante getAllAppointmentsService.
 * - Para cada turno activo, se calcula el momento exacto del recordatorio restándole 24 horas (en milisegundos)
 *   a la hora del turno.
 * - Si el tiempo actual (en milisegundos) se encuentra dentro de una ventana de 1 minuto (0 a 60000 ms)
 *   del momento del recordatorio, y además, no se haya enviado el recordatorio para ese turno,
 *   se envía el correo de recordatorio y se marca ese turno en el objeto sentReminders.
 */
const sendRemindersJob = async (): Promise<void> => {
  try {
    // Obtenemos todos los turnos desde la base de datos.
    const appointments = await getAllAppointmentsService();
    
    // Obtenemos el tiempo actual en milisegundos.
    const now = new Date().getTime();

    // Iteramos sobre cada turno.
    for (const appt of appointments) {
      // Solo procesamos turnos activos.
      if (appt.status !== "active") continue;

      // Obtenemos la hora del turno en milisegundos.
      const appointmentTime = new Date(appt.date).getTime();

      // Calculamos el momento de recordatorio: 24 horas antes del turno.
      const reminderTime = appointmentTime - (24 * 60 * 60 * 1000);

      // Calculamos la diferencia en milisegundos entre el tiempo actual y el momento de recordatorio.
      const diff = now - reminderTime;

      // Verificamos si el tiempo actual está dentro de la ventana de 1 minuto
      // (entre 0 y 60000 ms) y que no se haya enviado todavía el recordatorio para este turno.
      if (diff >= 0 && diff < 60000 && !sentReminders[appt.id]) {
        if (appt.user) {
          // Construimos el objeto de datos para enviar en el correo de recordatorio.
          const appointmentData = {
            appointmentId: appt.id,
            date: new Date(appt.date).toISOString(), // Enviamos la fecha en formato ISO.
            time: appt.time,
            userName: appt.user.name,
            userEmail: appt.user.email,
          };
          try {
            // Enviamos el correo de recordatorio.
            await sendAppointmentReminderEmail(appointmentData);
            console.log(`✅ Recordatorio enviado para turno #${appt.id} a ${appt.user.email}`);
            // Marcamos este turno como notificado para evitar envíos repetidos.
            sentReminders[appt.id] = true;
          } catch (emailError: any) {
            console.error(`❌ Error al enviar recordatorio para turno #${appt.id}:`, emailError.message || emailError);
          }
        } else {
          console.warn(`⚠️ Turno #${appt.id} sin usuario asociado, no se pudo enviar recordatorio.`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error en el job de recordatorios:", error);
  }
};


cron.schedule("*/1 * * * *", () => {
  console.log("⏰ Ejecutando cron job para enviar recordatorios de turnos...");
  sendRemindersJob();
});

// Exportamos la función del cron job para permitir iniciar o detener el job desde otros módulos (opcional).
export { sendRemindersJob };
