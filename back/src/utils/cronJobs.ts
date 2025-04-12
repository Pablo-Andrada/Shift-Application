// src/cronJobs.ts

// Importamos 'node-cron' para programar tareas recurrentes.
import cron from "node-cron";
// Importamos el servicio que obtiene todos los turnos de la base de datos.
import { getAllAppointmentsService } from "../services/appointmentService";
// Importamos la función para enviar el correo de recordatorio al usuario.
// Asegúrate de haber agregado y exportado sendAppointmentReminderEmail en emailService.ts.
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
 * sentReminders:
 * Objeto en memoria para rastrear los turnos para los cuales ya se envió el recordatorio.
 * Se utiliza para evitar envíos repetidos del mismo recordatorio.
 */
const sentReminders: { [appointmentId: number]: boolean } = {};

/**
 * sendRemindersJob:
 * Función que se encarga de revisar todos los turnos y enviar recordatorios por correo
 * a los usuarios que tengan un turno programado para 24 horas después del tiempo actual,
 * es decir, el recordatorio se enviará exactamente 24 horas antes del turno.
 *
 * La lógica es la siguiente:
 * - Se obtienen todos los turnos.
 * - Para cada turno activo, se calcula el momento exacto de recordatorio (hora del turno menos 24 horas).
 * - Se verifica si el tiempo actual (en milisegundos) se encuentra dentro de una ventana de 1 minuto
 *   a partir de ese momento de recordatorio y, además, que no se haya enviado el correo para ese turno.
 * - Si se cumplen ambas condiciones, se envía el recordatorio y se marca el turno para evitar envíos repetidos.
 */
const sendRemindersJob = async () => {
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

      // Calculamos la diferencia entre el tiempo actual y el momento de recordatorio.
      const diff = now - reminderTime;

      // Si el tiempo actual está dentro de la ventana de 0 a 60000 ms (1 minuto)
      // y no se ha enviado aún el recordatorio para este turno, procedemos a enviar el correo.
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

/**
 * Configuración del cron job:
 * Esta es la línea que configura la ejecución del cron job cada minuto usando la expresión CRON "*/1 //* //* * *".
 //* Para deshabilitar el cron job, simplemente comenta o elimina esta línea.
 //*/
// cron.schedule("*/1 * * * *", () => {
//   console.log("⏰ Ejecutando cron job para enviar recordatorios de turnos...");
//   sendRemindersJob();
// });

// Exportamos la función del cron job (opcional) para permitir iniciar o detener el job desde otros módulos.
//export { sendRemindersJob };
