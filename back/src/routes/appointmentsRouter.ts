import { Router } from "express";
import {
  getAppointmentsController,
  getAppointmentIdController,
  createAppointmentController,
  updateAppointmentController,
  getAppointmentsByUserController,
  deleteAppointmentController
} from "../controllers/appointmentsController";

export const appointmentsRouter = Router();

// GET /appointments
appointmentsRouter.get("/", getAppointmentsController);

// GET /appointments/:id
appointmentsRouter.get("/:id", getAppointmentIdController);

// POST /appointments/schedule
appointmentsRouter.post("/schedule", createAppointmentController);

// PUT /appointments/cancel/:id
appointmentsRouter.put("/cancel/:id", updateAppointmentController);

// GET /appointments/user/:userId
appointmentsRouter.get("/user/:userId", getAppointmentsByUserController);

// DELETE /appointments/:id  --> Nueva ruta para eliminar un turno
appointmentsRouter.delete("/:id", deleteAppointmentController);