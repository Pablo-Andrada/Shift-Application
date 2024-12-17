import { Router } from "express";
import { getAppointments,getAppointmentId,createAppointment,updateAppointment } from "../controllers/appointmentsController";

export const appointmentsRouter = Router();

appointmentsRouter.use("/schedule", createAppointment);
appointmentsRouter.use("/:id", getAppointmentId);
appointmentsRouter.use("/", getAppointments);
appointmentsRouter.use("/cancel", updateAppointment);