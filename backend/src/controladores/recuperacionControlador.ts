import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { Op } from "sequelize";

import { db } from "../configuraciones/db.js";
import { transporter } from "../configuraciones/correoConfig.js";
import { Usuario } from "../modelos/usuarioModelo.js";
import { RecuperacionContrasena } from "../modelos/recuperacionModelo.js";

const DURACION_CODIGO = 5 * 60 * 1000;
const DURACION_TOKEN = 5 * 60 * 1000;
const MAX_INTENTOS = 3;

const calcularHash = (token: string): string =>
    createHash("sha256").update(token).digest("hex");

// 1. Solicitar recuperación
export const solicitarRecuperacion = async (
    req: Request,
    res: Response
): Promise<void> => {

    const mensaje =
        "Si el correo está registrado, recibirás un código de verificación";

    try {

        const { correo } = req.body;

        const usuario = await Usuario.findOne({
            where: { correo }
        });

        if (usuario) {

            const codigo = randomInt(0, 1000000)
                .toString()
                .padStart(6, "0");

            const codigoHash = await bcrypt.hash(codigo, 12);

            const fechaExpiracion = new Date(
                Date.now() + DURACION_CODIGO
            );

            await db.transaction(async (transaction) => {

                await Usuario.findByPk(
                    Number(usuario.get("id")),
                    {
                        transaction,
                        lock: transaction.LOCK.UPDATE
                    }
                );

                // Invalidar solicitudes anteriores
                await RecuperacionContrasena.update(
                    { utilizado: true },
                    {
                        where: {
                            usuario_id: usuario.get("id"),
                            utilizado: false
                        },
                        transaction
                    }
                );

                await RecuperacionContrasena.create(
                    {
                        usuario_id: usuario.get("id"),
                        codigo_hash: codigoHash,
                        token_hash: null,
                        fecha_expiracion: fechaExpiracion,
                        intentos: 0,
                        verificado: false,
                        utilizado: false
                    },
                    { transaction }
                );

            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: usuario.get("correo") as string,
                subject: "Código de recuperación - Taruma Arquitectos",
                text: `Hola ${usuario.get("nombre")},

Recibimos una solicitud para recuperar tu contraseña.

Tu código de verificación es: ${codigo}

Este código expira en 5 minutos y solo puede utilizarse una vez.

Si no solicitaste este cambio, ignora el correo.`
            });
        }

        res.status(200).json({ mensaje });

    } catch (error) {

        console.error("Error al solicitar recuperación:", error);

        res.status(200).json({ mensaje });
    }
};

// 2. Verificar código
export const verificarRecuperacion = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const { correo, codigo } = req.body;

        if (
            typeof correo !== "string" ||
            typeof codigo !== "string" ||
            !/^\d{6}$/.test(codigo)
        ) {
            res.status(400).json({
                mensaje: "Datos inválidos"
            });
            return;
        }

        const resultado = await db.transaction(async (transaction) => {

            const usuario = await Usuario.findOne({
                where: { correo },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!usuario) return null;

            const solicitud = await RecuperacionContrasena.findOne({
                where: {
                    usuario_id: usuario.get("id"),
                    utilizado: false,
                    verificado: false,
                    fecha_expiracion: {
                        [Op.gt]: new Date()
                    },
                    intentos: {
                        [Op.lt]: MAX_INTENTOS
                    }
                },
                order: [["id", "DESC"]],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!solicitud) return null;

            const codigoHash = solicitud.get("codigo_hash") as string;

            if (!codigoHash) return null;

            const codigoValido = await bcrypt.compare(
                codigo,
                codigoHash
            );

            if (!codigoValido) {

                const intentos =
                    Number(solicitud.get("intentos")) + 1;

                await solicitud.update(
                    {
                        intentos,
                        utilizado: intentos >= MAX_INTENTOS
                    },
                    { transaction }
                );

                return null;
            }

            const token = randomBytes(32).toString("hex");

            await solicitud.update(
                {
                    verificado: true,
                    codigo_hash: null,
                    token_hash: calcularHash(token),
                    fecha_expiracion: new Date(
                        Date.now() + DURACION_TOKEN
                    )
                },
                { transaction }
            );

            return token;
        });

        if (!resultado) {
            res.status(400).json({
                mensaje: "Código incorrecto, expirado o sin intentos disponibles"
            });
            return;
        }

        res.status(200).json({
            mensaje: "Código verificado correctamente",
            token: resultado
        });

    } catch (error) {

        console.error("Error al verificar código:", error);

        res.status(500).json({
            mensaje: "Error al verificar el código"
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
            Buffer.byteLength(contrasena, "utf8") > 72
        ) {
            res.status(400).json({
                mensaje: "Datos inválidos"
            });
            return;
        }

        const nuevaContrasena = await bcrypt.hash(
            contrasena,
            10
        );

        const actualizado = await db.transaction(async (transaction) => {

            const candidata = await RecuperacionContrasena.findOne({
                where: {
                    token_hash: calcularHash(token)
                },
                transaction
            });

            if (!candidata) return false;

            const usuarioId = Number(
                candidata.get("usuario_id")
            );

            const usuario = await Usuario.findByPk(
                usuarioId,
                {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );

            if (!usuario) return false;

            const solicitud = await RecuperacionContrasena.findOne({
                where: {
                    token_hash: calcularHash(token),
                    utilizado: false,
                    verificado: true,
                    fecha_expiracion: {
                        [Op.gt]: new Date()
                    }
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!solicitud) return false;

            const [cantidad] = await Usuario.update(
                { contrasena: nuevaContrasena },
                {
                    where: { id: usuarioId },
                    transaction
                }
            );

            if (cantidad !== 1) return false;

            await RecuperacionContrasena.update(
                {
                    utilizado: true,
                    codigo_hash: null
                },
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