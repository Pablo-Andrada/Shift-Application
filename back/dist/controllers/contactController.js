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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleContactForm = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const envs_1 = require("../config/envs");
const handleContactForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: envs_1.EMAIL_USER,
                pass: envs_1.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: envs_1.EMAIL_USER,
            to: envs_1.RECEIVER_EMAIL,
            subject: `Nuevo mensaje de contacto de ${name}`,
            text: `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Mensaje enviado correctamente" });
    }
    catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ error: "Hubo un error al enviar el mensaje" });
    }
});
exports.handleContactForm = handleContactForm;
