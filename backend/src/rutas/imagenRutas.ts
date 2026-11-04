
/**
 * rutas para subir imágenes.
 * prefijo: /api/imagenes
 *
 * la consulta, descarga y eliminación se hacen en /api/archivos.
 */

import { Router } from "express";
import { uploadImagen, manejarSubida } from "../configuraciones/multerConfig.js";
import { subirImagen } from "../controladores/imagenControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";

const router = Router();

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
    verificarToken,
    manejarSubida(
        uploadImagen.single("imagen"),
        "La imagen supera el tamaño máximo permitido de 5 MB"
    ),
    subirImagen
);

export default router;
