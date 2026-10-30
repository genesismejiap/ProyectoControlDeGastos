
/**
 * Rutas de usuarios: registro e inicio de sesión.
 * Prefijo: /api/usuarios
 */

import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { registrarUsuario, iniciarSesion } from "../controladores/usuarioControlador.js";

const router = Router();

/**
 * Middleware que revisa el resultado de express-validator.
 * Si hay errores responde 400 con la lista; si no, continúa al controlador.
 */
const validarCampos = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        res.status(400).json({
            mensaje: "Datos inválidos",
            errores: errores.array()
        });
        return;
    }

    next();
};

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: >
 *       La contraseña se guarda cifrada con bcrypt. Además se envía un correo de
 *       bienvenida al usuario (si el envío falla, el registro no se interrumpe).
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroEntrada'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario registrado correctamente
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       409:
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post(
    "/registro",
    [
        body("nombre")
            .isString()
            .withMessage("El nombre debe ser texto")
            .trim()
            .notEmpty()
            .withMessage("El nombre es obligatorio"),

        body("correo")
            .isEmail()
            .withMessage("Ingrese un correo válido")
            .normalizeEmail(),

        body("contrasena")
            .isString()
            .withMessage("La contraseña debe ser texto")
            .bail()
            .isLength({ min: 8 })
            .withMessage("La contraseña debe tener al menos 8 caracteres")
    ],
    validarCampos,
    registrarUsuario
);


/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: >
 *       Devuelve un token JWT válido por 1 hora. Úsalo en el botón **Authorize**
 *       para probar las rutas protegidas. Además envía un correo de notificación
 *       al usuario (si el envío falla, el inicio de sesión no se interrumpe).
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginEntrada'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         description: Correo o contraseña incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post(
    "/login",
    [
        body("correo")
            .isEmail()
            .withMessage("Ingrese un correo válido")
            .normalizeEmail(),

        body("contrasena")
            .isString()
            .withMessage("La contraseña debe ser texto")
            .bail()
            .notEmpty()
            .withMessage("La contraseña es obligatoria")
    ],
    validarCampos,
    iniciarSesion
);


export default router;
