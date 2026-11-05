
/**
 * Rutas de usuarios: registro, inicio de sesión, y consulta, actualización
 * y eliminación de usuarios.
 * Prefijo: /api/usuarios
 *
 * - /registro y /login son públicas.
 * - El resto exige token y se restringe por rol:
 *     listar y eliminar  -> solo administrador
 *     consultar y actualizar -> administrador o el propio usuario
 */

import { Router, Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import {
    registrarUsuario,
    iniciarSesion,
    listarUsuarios,
    consultarUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controladores/usuarioControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";
import {
    soloAdministrador,
    administradorOPropietario
} from "../seguridad/verificarRol.js";
import { ROLES } from "../modelos/usuarioModelo.js";

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


// ---------------------------------------------------------------------------
// Consulta, actualización y eliminación (requieren token)
// ---------------------------------------------------------------------------

// validación del id que llega en la ruta
const validarId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID del usuario debe ser un número entero positivo")
];

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar usuarios (solo administradores)
 *     description: >
 *       Devuelve los usuarios paginados. Nunca incluye contraseñas.
 *       Un usuario sin rol de administrador recibe 403.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pagina
 *         in: query
 *         required: false
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - name: limite
 *         in: query
 *         required: false
 *         description: Usuarios por página (máximo 100)
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuariosPaginados'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         description: El usuario no es administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Esta operación es solo para administradores
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/",
    verificarToken,
    [
        query("pagina")
            .optional()
            .isInt({ min: 1 })
            .withMessage("La página debe ser un número entero positivo"),

        query("limite")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("El límite debe ser un entero entre 1 y 100")
    ],
    validarCampos,
    soloAdministrador,
    listarUsuarios
);


/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Consultar un usuario
 *     description: >
 *       Un administrador puede consultar a cualquier usuario; un usuario
 *       normal solo su propia cuenta. Nunca incluye la contraseña.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermiso'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 *   put:
 *     summary: Actualizar un usuario
 *     description: >
 *       Un administrador puede actualizar a cualquier usuario; un usuario
 *       normal solo su propia cuenta. Se envía al menos un campo.
 *
 *       - Solo un administrador puede cambiar el `rol`, y nadie puede cambiar el suyo.
 *       - Para cambiar la propia contraseña se debe enviar `contrasena_actual`.
 *         Un administrador que restablece la de otro usuario no la necesita.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarUsuarioEntrada'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario actualizado correctamente
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioPublico'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermiso'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 *   delete:
 *     summary: Eliminar un usuario (solo administradores)
 *     description: >
 *       Elimina al usuario y todos sus archivos (registros y archivos del
 *       servidor). Un administrador no puede eliminar su propia cuenta.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario eliminado correctamente
 *                 archivos_eliminados:
 *                   type: integer
 *                   example: 3
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermiso'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/:id",
    verificarToken,
    validarId,
    validarCampos,
    administradorOPropietario,
    consultarUsuario
);

router.put(
    "/:id",
    verificarToken,
    [
        ...validarId,

        body("nombre")
            .optional()
            .isString()
            .withMessage("El nombre debe ser texto")
            .trim()
            .notEmpty()
            .withMessage("El nombre no puede estar vacío")
            .isLength({ max: 100 })
            .withMessage("El nombre no debe superar los 100 caracteres"),

        body("correo")
            .optional()
            .isEmail()
            .withMessage("Ingrese un correo válido")
            .isLength({ max: 150 })
            .withMessage("El correo no debe superar los 150 caracteres")
            .normalizeEmail(),

        body("contrasena")
            .optional()
            .isString()
            .withMessage("La contraseña debe ser texto")
            .bail()
            .isLength({ min: 8, max: 72 })
            .withMessage("La contraseña debe tener entre 8 y 72 caracteres"),

        body("contrasena_actual")
            .optional()
            .isString()
            .withMessage("La contraseña actual debe ser texto"),

        body("rol")
            .optional()
            .isIn([...ROLES])
            .withMessage(`El rol debe ser uno de: ${ROLES.join(", ")}`),

        // evitar peticiones vacías
        body().custom((cuerpo) => {
            const campos = ["nombre", "correo", "contrasena", "rol"];

            if (!campos.some((campo) => cuerpo?.[campo] !== undefined)) {
                throw new Error(
                    `Envía al menos uno de estos campos: ${campos.join(", ")}`
                );
            }

            return true;
        })
    ],
    validarCampos,
    administradorOPropietario,
    actualizarUsuario
);

router.delete(
    "/:id",
    verificarToken,
    validarId,
    validarCampos,
    soloAdministrador,
    eliminarUsuario
);


export default router;
