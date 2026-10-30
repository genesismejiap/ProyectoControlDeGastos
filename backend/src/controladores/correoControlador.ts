
import { Request, Response } from "express";
import { transporter } from "../configuraciones/correoConfig.js";

/**
 * Envía un correo electrónico en texto plano usando la cuenta configurada en EMAIL_USER.
 * Requiere el middleware verificarToken en la ruta.
 *
 * Body: { destinatario, asunto, mensaje }
 * Respuestas: 200 enviado · 400 campos faltantes · 500 error de envío
 */
export const enviarCorreo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { destinatario, asunto, mensaje } = req.body;

    // Verificar que los campos estén completos
    if (!destinatario || !asunto || !mensaje) {
      res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
      return;
    }

    // Enviar el correo electrónico
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      text: mensaje
    });

    res.status(200).json({
      mensaje: "Correo enviado correctamente"
    });

  } catch (error) {
    console.error("Error al enviar correo:", error);

    res.status(500).json({
      mensaje: "Error al enviar el correo"
    });
  }
};
