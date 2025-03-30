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
exports.updateAppointmentController = exports.createAppointmentController = exports.getAppointmentIdController = exports.getAppointmentsController = void 0;
const appointmentService_1 = require("../services/appointmentService");
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
        // Aquí se asume que el ID llega como parámetro de ruta: /appointments/123
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
 */
const createAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, userId } = req.body;
        // Convertimos `date` a un objeto Date, y `userId` a number
        const newAppointment = yield (0, appointmentService_1.createAppointmentService)(new Date(date), time, Number(userId));
        if (!newAppointment) {
            return res
                .status(400)
                .json({ message: "No se pudo crear el turno (usuario inexistente)" });
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
 * Cambiar el estatus de un turno a “cancelled”.
 */
const updateAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Podrías también recibirlo por URL: /appointments/:id
        const success = yield (0, appointmentService_1.cancelAppointmentService)(Number(id));
        if (!success) {
            return res.status(404).json({ message: "No se encontró el turno a cancelar" });
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
// import { Request, Response } from "express";
// //GET /appointments => Obtener el listado de todos los turnos de todos los usuarios.
// export const getAppointments = async (req:Request,res:Response) => {
//     res.status(200).json({message:"Obtener el listado de todos los turnos de todos los usuarios"})
// }
// //GET /appointments => Obtener el detalle de un turno específico.
// export const getAppointmentId = async (req: Request, res: Response) => {
//     res.status(200).json({message:"Obtener el detalle de un turno específico"})
// }
// //POST /appointments/schedule => Agendar un nuevo turno.
// export const createAppointment = async (req:Request,res:Response) => {
//     res.status(200).json({message:"Agendar un nuevo turno"})
// }
// //PUT /appointments/cancel => Cambiar el estatus de un turno a “cancelled”.
// export const updateAppointment = async (req:Request,res:Response) => {
//     res.status(200).json({message:"Cambiar el estatus de un turno a “cancelled”"});
// }
