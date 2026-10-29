
import nodemailer from "nodemailer";
import "dotenv/config";

// Configuración para enviar correos con Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
