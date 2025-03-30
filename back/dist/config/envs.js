"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.RECEIVER_EMAIL = exports.EMAIL_PASSWORD = exports.EMAIL_USER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.EMAIL_USER = process.env.EMAIL_USER || "";
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
exports.RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || "";
exports.PORT = process.env.PORT || 3000;
