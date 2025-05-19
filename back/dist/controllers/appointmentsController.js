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
exports.deleteAppointmentController = exports.getAppointmentsByUserController = exports.updateAppointmentController = exports.createAppointmentController = exports.getAppointmentIdController = exports.getAppointmentsController = void 0;
const appointmentService_1 = require("../services/appointmentService");
const appointmentService_2 = require("../services/appointmentService");
// Importamos la función para enviar correos de confirmación y de cancelación
const emailService_1 = require("../services/emailService");
/**
 * GET /appointments
 * Obtener el listado de todos los turnos de todos los usuarios.
 */
const getAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield (0, appointmentService_1.getAllAppointmentsService)();
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener los turnos",
            error,
        });
    }
});
exports.getAppointmentsController = getAppointmentsController;
/**
 * GET /appointments/:id
 * Obtener el detalle de un turno específico.
 */
const getAppointmentIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Se asume que el ID llega como parámetro de ruta, ej: /appointments/123
        const { id } = req.params;
        const appointment = yield (0, appointmentService_1.getAppointmentByIdService)(Number(id));
        if (!appointment) {
            return res.status(404).json({ message: "No se encontró el turno" });
        }
        res.status(200).json(appointment);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener el turno",
            error,
        });
    }
});
exports.getAppointmentIdController = getAppointmentIdController;
/**
 * POST /appointments/schedule
 * Agendar un nuevo turno.
 *
 * Se encarga de:
 * 1. Crear el turno en la base de datos.
 * 2. Si la creación es exitosa, enviar un correo de confirmación al usuario.
 */
const createAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, userId, comentarios } = req.body;
        // Convertimos `date` a un objeto Date y `userId` a number
        const newAppointment = yield (0, appointmentService_1.createAppointmentService)(new Date(date), time, Number(userId), comentarios);
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
                comentarios: newAppointment.comentarios || ""
            };
            try {
                yield (0, emailService_1.sendAppointmentConfirmationEmail)(appointmentData);
                console.log("✅ Correo de confirmación enviado a:", newAppointment.user.email);
            }
            catch (emailError) {
                console.error("❌ Error al enviar el correo de confirmación:", emailError.message || emailError);
                // Decisión: continuar sin fallar la petición
            }
        }
        else {
            console.warn("⚠️ El turno creado no tiene usuario asociado para enviar el correo de confirmación.");
        }
        res.status(201).json(newAppointment);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al crear el turno",
            error,
        });
    }
});
exports.createAppointmentController = createAppointmentController;
/**
 * PUT /appointments/cancel/:id
 * Cambiar el estatus de un turno a “cancelled” y enviar un correo de confirmación de cancelación.
 */
const updateAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Se recibe el ID del turno en la URL
        // Obtenemos primero el turno para tener sus datos
        const appointment = yield (0, appointmentService_1.getAppointmentByIdService)(Number(id));
        if (!appointment) {
            return res.status(404).json({ message: "No se encontró el turno a cancelar" });
        }
        // Cancelamos el turno
        const success = yield (0, appointmentService_1.cancelAppointmentService)(Number(id));
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
                yield (0, emailService_1.sendAppointmentCancellationEmail)(cancellationData);
                console.log("✅ Correo de cancelación enviado a:", appointment.user.email);
            }
            catch (emailError) {
                console.error("❌ Error al enviar el correo de cancelación:", emailError.message || emailError);
                // Continuamos sin fallar la petición
            }
        }
        else {
            console.warn("⚠️ El turno cancelado no tiene usuario asociado para enviar el correo de cancelación.");
        }
        res.status(200).json({ message: "Turno cancelado exitosamente" });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al cancelar el turno",
            error,
        });
    }
});
exports.updateAppointmentController = updateAppointmentController;
/**
 * GET /appointments/user/:userId
 * Obtener todos los turnos de un usuario específico.
 */
const getAppointmentsByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Este servicio trae todos los turnos del usuario cuyo ID es userId
        const appointments = yield (0, appointmentService_2.getAppointmentsByUserIdService)(Number(userId));
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener los turnos del usuario",
            error,
        });
    }
});
exports.getAppointmentsByUserController = getAppointmentsByUserController;
/**
 * DELETE /appointments/:id
 * Elimina un turno de la base de datos.
 */
const deleteAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Llamamos al service para eliminar el turno
        const success = yield (0, appointmentService_1.deleteAppointmentService)(Number(id));
        if (!success) {
            return res.status(404).json({ message: "Turno no encontrado para eliminar" });
        }
        res.status(200).json({ message: "Turno eliminado exitosamente" });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al eliminar el turno",
            error,
        });
    }
});
exports.deleteAppointmentController = deleteAppointmentController;
