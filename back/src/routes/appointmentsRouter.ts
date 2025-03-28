import { Router } from "express";
import {
  getAppointmentsController,
  getAppointmentIdController,
  createAppointmentController,
  updateAppointmentController,
} from "../controllers/appointmentsController";

export const appointmentsRouter = Router();

// GET /appointments
appointmentsRouter.get("/", getAppointmentsController);

// GET /appointments/:id
appointmentsRouter.get("/:id", getAppointmentIdController);

// POST /appointments/schedule
appointmentsRouter.post("/schedule", createAppointmentController);

// PUT /appointments/cancel
appointmentsRouter.put("/cancel/:id", updateAppointmentController);
