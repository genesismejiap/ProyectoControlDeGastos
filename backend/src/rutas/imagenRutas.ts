
/**
 * rutas para subir, listar, consultar, reemplazar y eliminar imágenes.
 * prefijo: /api/imagenes
 */

import { Router, Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";
import { uploadImagen, manejarSubida } from "../configuraciones/multerConfig.js";
import {
    subirImagen,
    listarImagenes,
    consultarImagen,
    reemplazarImagen,
    eliminarImagen
} from "../controladores/imagenControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";

const router = Router();

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

const validarId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID de la imagen debe ser un número entero positivo")
];

// todas las rutas de imágenes necesitan un token válido
router.use(verificarToken);

/**
 * @swagger
 * /api/imagenes/subir:
 *   post:
 *     summary: Subir una imagen
 *     description: >
 *       Recibe una imagen JPG, JPEG o PNG de máximo 5 MB y la guarda a nombre
 *       del usuario del token. Solo ese usuario podrá consultarla, descargarla o eliminarla.
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [imagen]
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Imagen JPG, JPEG o PNG (máx. 5 MB)
 *     responses:
 *       201:
 *         description: Imagen guardada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArchivoSubido'
 *       400:
 *         description: No se envió la imagen, el formato no es válido o supera 5 MB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Solo se permiten imágenes en formato JPG, JPEG o PNG
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post(
    "/subir",
    manejarSubida(
        uploadImagen.single("imagen"),
        "La imagen supera el tamaño máximo permitido de 5 MB"
    ),
    subirImagen
);

/**
 * @swagger
 * /api/imagenes:
 *   get:
 *     summary: Listar las imágenes del usuario
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de imágenes
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 */
router.get("/", listarImagenes);

/**
 * @swagger
 * /api/imagenes/{id}:
 *   get:
 *     summary: Consultar una imagen por ID
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Imagen encontrada
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 */
router.get(
    "/:id",
    validarId,
    validarCampos,
    consultarImagen
);

/**
 * @swagger
 * /api/imagenes/{id}:
 *   put:
 *     summary: Reemplazar una imagen
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [imagen]
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen reemplazada correctamente
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 */
router.put(
    "/:id",
    validarId,
    validarCampos,
    manejarSubida(
        uploadImagen.single("imagen"),
        "La imagen supera el tamaño máximo permitido de 5 MB"
    ),
    reemplazarImagen
);

/**
 * @swagger
 * /api/imagenes/{id}:
 *   delete:
 *     summary: Eliminar una imagen
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Imagen eliminada correctamente
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 */
router.delete(
    "/:id",
    validarId,
    validarCampos,
    eliminarImagen
);

export default router;
