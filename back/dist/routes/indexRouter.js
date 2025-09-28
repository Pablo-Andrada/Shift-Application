"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/indexRouter.ts
const express_1 = require("express");
const usersRouter_1 = require("./usersRouter");
const appointmentsRouter_1 = require("./appointmentsRouter");
const credentialsRouter_1 = require("./credentialsRouter");
const contactRouter_1 = require("./contactRouter");
const router = (0, express_1.Router)();
// Montamos el usersRouter en la ruta "/user"
router.use("/user", usersRouter_1.usersRouter);
// Montamos el appointmentsRouter en la ruta "/appointments"
router.use("/appointments", appointmentsRouter_1.appointmentsRouter);
// Montamos el credentialsRouter en la ruta "/credentials"
router.use("/credentials", credentialsRouter_1.credentialsRouter);
// Montamos el contactRouter en la ruta "/contact"
router.use("/contact", contactRouter_1.contactRouter);
exports.default = router;
