
/**
 * Configuración del servicio de correo (Nodemailer + Gmail).
 *
 * Variables de entorno (.env): EMAIL_USER (cuenta de Gmail) y EMAIL_PASSWORD
 * (contraseña de aplicación de Google).
 */

import nodemailer from "nodemailer";
import "dotenv/config";

/** Transportador reutilizable para enviar correos con Gmail. */
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
