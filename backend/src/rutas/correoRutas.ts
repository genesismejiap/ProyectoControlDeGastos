
/**
 * Rutas para el envío de correos electrónicos.
 * Prefijo: /api/correos
 */

import { Router } from "express";
import { enviarCorreo } from "../controladores/correoControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";

const router = Router();

/**
 * @swagger
 * /api/correos/enviar:
 *   post:
 *     summary: Enviar un correo electrónico
 *     description: Requiere haber iniciado sesión (token JWT en el encabezado Authorization).
 *     tags: [Correos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CorreoEntrada'
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Correo enviado correctamente
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Todos los campos son obligatorios
 *       401:
 *         description: No se envió token o es inválido / expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/enviar", verificarToken, enviarCorreo);

export default router;
