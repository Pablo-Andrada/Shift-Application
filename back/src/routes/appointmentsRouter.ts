import { Router } from "express";
import {
    getAppointmentsController,
    getAppointmentIdController,
    createAppointmentController,
    updateAppointmentController,
    getAppointmentsByUserController,
    deleteAppointmentController,
    updateAppointmentAdminController,
    getAvailableSlotsController
} from "../controllers/appointmentsController";

export const appointmentsRouter = Router();

// Horarios disponibles: GET /appointments/slots?date=YYYY-MM-DD
appointmentsRouter.get("/slots", getAvailableSlotsController);

// Todos los turnos (admin)
appointmentsRouter.get("/", getAppointmentsController);

// Turnos por usuario
appointmentsRouter.get("/user/:userId", getAppointmentsByUserController);

// Turno por ID
appointmentsRouter.get("/:id", getAppointmentIdController);

// Crear turno
appointmentsRouter.post("/schedule", createAppointmentController);

// Cancelar turno
appointmentsRouter.put("/cancel/:id", updateAppointmentController);

// Admin: editar turno (fecha, notas, mensaje, duración)
appointmentsRouter.patch("/admin/:id", updateAppointmentAdminController);

// Eliminar turno
appointmentsRouter.delete("/:id", deleteAppointmentController);
