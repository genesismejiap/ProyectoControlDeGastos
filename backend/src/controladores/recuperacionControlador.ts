
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { Op } from "sequelize";

import { db } from "../configuraciones/db.js";
import { transporter } from "../configuraciones/correoConfig.js";
import { Usuario } from "../modelos/usuarioModelo.js";
import { RecuperacionContrasena } from "../modelos/recuperacionModelo.js";

const DURACION_TOKEN = 15 * 60 * 1000;

const calcularHash = (token: string): string =>
    createHash("sha256").update(token).digest("hex");

// 1. Solicitar recuperación
export const solicitarRecuperacion = async (
    req: Request,
    res: Response
): Promise<void> => {
    const mensaje =
        "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña";

    try {
        const { correo } = req.body;

        const usuario = await Usuario.findOne({
            where: { correo }
        });

        if (usuario) {
            const token = randomBytes(32).toString("hex");
            const tokenHash = calcularHash(token);

            const fechaExpiracion = new Date(
                Date.now() + DURACION_TOKEN
            );

            const frontendUrl = process.env.FRONTEND_URL;

            if (!frontendUrl) {
                throw new Error("FRONTEND_URL no está configurada");
            }

            const enlace = new URL(
                "/restablecer-contrasena",
                frontendUrl
            );

            enlace.searchParams.set("token", token);

            // Enviar primero el correo y luego guardar la solicitud.
            // Si falla el guardado, se informa internamente.
            await RecuperacionContrasena.create({
                usuario_id: usuario.get("id"),
                token_hash: tokenHash,
                fecha_expiracion: fechaExpiracion,
                utilizado: false
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: usuario.get("correo") as string,
                subject: "Recuperación de contraseña - Control de Gastos",
                text: `Hola ${usuario.get("nombre")},

Recibimos una solicitud para recuperar tu contraseña.

Utiliza este enlace para crear una nueva:

${enlace.toString()}

El enlace expira en 15 minutos y solo puede utilizarse una vez.

Si no solicitaste este cambio, ignora el correo.`
            });
        }

        res.status(200).json({ mensaje });
    } catch (error) {
        console.error("Error al solicitar recuperación:", error);

        res.status(200).json({
            mensaje:
                "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña"
        });
    }
};

// 2. Verificar token
export const verificarRecuperacion = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const token = req.query.token as string;

        if (!/^[a-f0-9]{64}$/.test(token ?? "")) {
            res.status(400).json({
                mensaje: "Token inválido"
            });
            return;
        }

        const solicitud = await RecuperacionContrasena.findOne({
            where: {
                token_hash: calcularHash(token),
                utilizado: false,
                fecha_expiracion: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!solicitud) {
            res.status(400).json({
                mensaje: "Token inválido o expirado"
            });
            return;
        }

        res.status(200).json({
            mensaje: "Token válido"
        });
    } catch (error) {
        console.error("Error al verificar recuperación:", error);

        res.status(500).json({
            mensaje: "Error al verificar el token"
        });
    }
};

// 3. Restablecer contraseña
export const restablecerContrasena = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token, contrasena } = req.body;

        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/.test(token) ||
            typeof contrasena !== "string" ||
            contrasena.length < 8 ||
            contrasena.length > 72
        ) {
            res.status(400).json({
                mensaje: "Datos inválidos"
            });
            return;
        }

        const nuevaContrasena = await bcrypt.hash(contrasena, 10);

        const actualizado = await db.transaction(async (transaction) => {
            const solicitud = await RecuperacionContrasena.findOne({
                where: { token_hash: calcularHash(token) },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (
                !solicitud ||
                Boolean(solicitud.get("utilizado")) ||
                new Date(
                    solicitud.get("fecha_expiracion") as string
                ).getTime() <= Date.now()
            ) {
                return false;
            }

            const usuarioId = Number(solicitud.get("usuario_id"));

            const [cantidad] = await Usuario.update(
                { contrasena: nuevaContrasena },
                {
                    where: { id: usuarioId },
                    transaction
                }
            );

            if (cantidad !== 1) return false;

            await RecuperacionContrasena.update(
                { utilizado: true },
                {
                    where: { usuario_id: usuarioId },
                    transaction
                }
            );

            return true;
        });

        if (!actualizado) {
            res.status(400).json({
                mensaje: "Token inválido o expirado"
            });
            return;
        }

        res.status(200).json({
            mensaje: "Contraseña restablecida correctamente"
        });
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);

        res.status(500).json({
            mensaje: "Error al restablecer la contraseña"
        });
    }
};
