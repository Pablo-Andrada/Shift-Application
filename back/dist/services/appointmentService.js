"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentReminderSent = void 0;
exports.getAllAppointmentsService = getAllAppointmentsService;
exports.getAppointmentByIdService = getAppointmentByIdService;
exports.createAppointmentService = createAppointmentService;
exports.cancelAppointmentService = cancelAppointmentService;
exports.getAppointmentsByUserIdService = getAppointmentsByUserIdService;
exports.deleteAppointmentService = deleteAppointmentService;
// src/services/appointmentService.ts
const data_source_1 = require("../config/data-source");
const Appointment_1 = require("../entities/Appointment");
const data_source_2 = require("../config/data-source");
/**
 * Obtiene todos los turnos (appointments) de la base de datos.
 * Se incluyen las relaciones con el usuario (user) para obtener información completa.
 */
function getAllAppointmentsService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield data_source_1.AppointmentModel.find({
            relations: ["user"]
        });
    });
}
/**
 * Obtiene un turno específico por su ID.
 * @param id - El ID del turno.
 */
function getAppointmentByIdService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield data_source_1.AppointmentModel.findOne({
            where: { id },
            relations: ["user"]
        });
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
function createAppointmentService(date, time, userId, comentarios) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificamos que el usuario exista usando el repositorio de usuarios
        const user = yield data_source_1.UserModel.findOneBy({ id: userId });
        if (!user) {
            console.error('No se puede crear un turno sin un usuario válido.');
            return null;
        }
        // Creamos la instancia del turno
        // Se incluye el campo 'comentarios'; se utiliza substring para asegurarse de no exceder 50 caracteres.
        const newAppointment = data_source_1.AppointmentModel.create({
            date,
            time,
            userId, // Guardamos el ID del usuario
            status: "active", // Estado inicial del turno
            comentarios: comentarios ? comentarios.substring(0, 50) : ""
        });
        // Asignamos la relación con el usuario (opcional, pero recomendable para tener acceso al objeto completo)
        newAppointment.user = user;
        // Guardamos el turno en la base de datos
        yield data_source_1.AppointmentModel.save(newAppointment);
        return newAppointment;
    });
}
/**
 * Cancela un turno cambiando su estado a "cancelled".
 *
 * @param id - El ID del turno a cancelar.
 * @returns true si se cancela el turno exitosamente; false si el turno no existe.
 */
function cancelAppointmentService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Buscamos el turno en la base de datos
        const appointment = yield data_source_1.AppointmentModel.findOneBy({ id });
        if (!appointment) {
            console.error('El turno con el ID especificado no existe.');
            return false;
        }
        // Actualizamos el estado del turno
        appointment.status = 'cancelled';
        yield data_source_1.AppointmentModel.save(appointment);
        return true;
    });
}
/**
 * Obtiene todos los turnos de un usuario específico, usando su ID.
 * Se incluyen también los datos del usuario (relación con la entidad User).
 *
 * @param userId - El ID del usuario.
 * @returns Un arreglo con todos los turnos pertenecientes a ese usuario.
 */
function getAppointmentsByUserIdService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield data_source_1.AppointmentModel.find({
            where: {
                user: {
                    id: userId, // Filtramos los turnos cuyo usuario tenga este ID
                },
            },
            relations: ["user"], // Incluimos también los datos del usuario (join)
        });
    });
}
/**
 * updateAppointmentReminderSent:
 * Actualiza el turno para marcar que ya se envió el recordatorio.
 *
 * @param appointmentId - El ID del turno al cual se le actualiza la bandera de recordatorio enviado.
 */
const updateAppointmentReminderSent = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentRepo = data_source_2.AppDataSource.getRepository(Appointment_1.Appointment);
    yield appointmentRepo.update(appointmentId, { reminderSent: true });
});
exports.updateAppointmentReminderSent = updateAppointmentReminderSent;
/**
 * DELETE Appointment:
 * Elimina un turno de la base de datos.
 *
 * @param id - El ID del turno a eliminar.
 * @returns true si se elimina el turno exitosamente; false si no existe.
 */
function deleteAppointmentService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Buscamos el turno por su ID
        const appointment = yield data_source_1.AppointmentModel.findOneBy({ id });
        if (!appointment) {
            console.error("El turno con el ID especificado no existe.");
            return false;
        }
        // Eliminamos el turno
        yield data_source_1.AppointmentModel.delete(id);
        return true;
    });
}
