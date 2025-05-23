"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRouter = void 0;
const express_1 = require("express");
const appointmentsController_1 = require("../controllers/appointmentsController");
exports.appointmentsRouter = (0, express_1.Router)();
// GET /appointments
exports.appointmentsRouter.get("/", appointmentsController_1.getAppointmentsController);
// GET /appointments/:id
exports.appointmentsRouter.get("/:id", appointmentsController_1.getAppointmentIdController);
// POST /appointments/schedule
exports.appointmentsRouter.post("/schedule", appointmentsController_1.createAppointmentController);
// PUT /appointments/cancel/:id
exports.appointmentsRouter.put("/cancel/:id", appointmentsController_1.updateAppointmentController);
// GET /appointments/user/:userId
exports.appointmentsRouter.get("/user/:userId", appointmentsController_1.getAppointmentsByUserController);
// DELETE /appointments/:id  --> Nueva ruta para eliminar un turno
exports.appointmentsRouter.delete("/:id", appointmentsController_1.deleteAppointmentController);
