import dotenv from "dotenv";

dotenv.config();

export const EMAIL_USER = process.env.EMAIL_USER || "";
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
export const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || "";
export const PORT = process.env.PORT || 3000;
