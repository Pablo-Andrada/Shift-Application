"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersRouter_1 = require("./usersRouter");
const appointmentsRouter_1 = require("./appointmentsRouter");
const credentialsRouter_1 = require("./credentialsRouter");
const router = (0, express_1.Router)();
const contactRouter_1 = __importDefault(require("./contactRouter"));
router.use("/user", usersRouter_1.usersRouter);
router.use("/appointments", appointmentsRouter_1.appointmentsRouter);
router.use("/credentials", credentialsRouter_1.credentialsRouter);
router.use("/contact", contactRouter_1.default); // ruta contact
exports.default = router;
