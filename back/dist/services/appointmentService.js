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
exports.getAllAppointmentsService = getAllAppointmentsService;
exports.getAppointmentByIdService = getAppointmentByIdService;
exports.createAppointmentService = createAppointmentService;
exports.cancelAppointmentService = cancelAppointmentService;
const data_source_1 = require("../config/data-source");
/**
 * Obtiene todos los turnos (appointments) de la base de datos.
 * Se incluyen las relaciones con el usuario (user) para obtener información completa.
 */
// export async function getAllAppointmentsService(): Promise<Appointment[]> {
//   // Buscamos todos los turnos y, opcionalmente, traemos el usuario relacionado
//   return await AppointmentModel.find({
//     relations: { user: true }
//   });
// }
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
// export async function getAppointmentByIdService(id: number): Promise<Appointment | null> {
//   return await AppointmentModel.findOne({
//     where: { id },
//     relations: { user: true } // Incluye el usuario relacionado para verificar que existe
//   });
// }
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
 * @param date - La fecha del turno.
 * @param time - La hora del turno.
 * @param userId - El ID del usuario que solicita el turno.
 */
function createAppointmentService(date, time, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificamos que el usuario exista usando el repositorio de usuarios
        const user = yield data_source_1.UserModel.findOneBy({ id: userId });
        if (!user) {
            console.error('No se puede crear un turno sin un usuario válido.');
            return null;
        }
        // Creamos la instancia del turno
        const newAppointment = data_source_1.AppointmentModel.create({
            date,
            time,
            userId, // Se guarda el ID del usuario
            status: "active" // Estado inicial del turno
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
 * @param id - El ID del turno a cancelar.
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
// import { IAppointment } from '../interfaces/IAppointment';
// // Precarga de datos
// let appointments: IAppointment[] = [
//   {
//     id: 1,
//     date: new Date('2024-12-25'),
//     time: '14:00',
//     userId: 1,
//     status: 'active',
//   },
//   {
//     id: 2,
//     date: new Date('2024-12-26'),
//     time: '16:00',
//     userId: 2,
//     status: 'active',
//   },
// ];
// // Generador de ID único
// let nextAppointmentId = appointments.length + 1;
// // Función para retornar el arreglo completo de turnos
// export function getAllAppointments(): IAppointment[] {
//   return appointments;
// }
// // Función para obtener el detalle de un turno por ID
// export function getAppointmentById(id: number): IAppointment | null {
//   const appointment = appointments.find((appt) => appt.id === id);
//   return appointment || null;
// }
// // Función para crear un nuevo turno
// export function createAppointment(
//   date: Date,
//   time: string,
//   userId: number
// ): IAppointment | null {
//   if (!userId) {
//     console.error('No se puede crear un turno sin un ID de usuario.');
//     return null;
//   }
//   const newAppointment: IAppointment = {
//     id: nextAppointmentId++,
//     date,
//     time,
//     userId,
//     status: 'active', // Estado inicial es siempre "active"
//   };
//   appointments.push(newAppointment);
//   return newAppointment;
// }
// // Función para cancelar un turno
// export function cancelAppointment(id: number): boolean {
//   const appointment = appointments.find((appt) => appt.id === id);
//   if (!appointment) {
//     console.error('El turno con el ID especificado no existe.');
//     return false;
//   }
//   appointment.status = 'cancelled'; // Cambiar el estado a "cancelled"
//   return true;
// }
