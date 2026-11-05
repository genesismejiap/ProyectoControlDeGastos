
/**
 * rutas para consultar, descargar y eliminar archivos (imágenes y documentos).
 * prefijo: /api/archivos
 *
 * todas requieren token y solo permiten acceder a los archivos del propio usuario.
 */

import { Router } from "express";
import { param, query } from "express-validator";

import {
    consultarArchivos,
    consultarArchivo,
    descargarArchivo,
    eliminarArchivo
} from "../controladores/archivoControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// validación del id que llega en la ruta
const validarId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID del archivo debe ser un número entero positivo")
        .toInt()
];

// todas las rutas de archivos exigen haber iniciado sesión
router.use(verificarToken);

/**
 * @swagger
 * /api/archivos:
 *   get:
 *     summary: Consultar mis archivos
 *     description: >
 *       Devuelve solo las imágenes y documentos del usuario del token,
 *       del más reciente al más antiguo. Se puede filtrar por tipo y proyecto.
 *     tags: [Archivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tipo
 *         in: query
 *         required: false
 *         description: Filtrar por tipo de archivo
 *         schema:
 *           type: string
 *           enum: [imagen, documento]
 *       - name: proyecto_id
 *         in: query
 *         required: false
 *         description: Limitar la consulta a los archivos de un proyecto
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Lista de archivos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 archivos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Archivo'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/",
    [
        query("tipo")
            .optional()
            .isIn(["imagen", "documento"])
            .withMessage("El tipo debe ser 'imagen' o 'documento'"),
        query("proyecto_id")
            .optional()
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo")
            .toInt()
    ],
    validarCampos,
    consultarArchivos
);

/**
 * @swagger
 * /api/archivos/{id}:
 *   get:
 *     summary: Consultar la información de un archivo
 *     tags: [Archivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Información del archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 archivo:
 *                   $ref: '#/components/schemas/Archivo'
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
router.get("/:id", validarId, validarCampos, consultarArchivo);

/**
 * @swagger
 * /api/archivos/{id}/descargar:
 *   get:
 *     summary: Descargar un archivo
 *     description: Envía el archivo como adjunto con su nombre original.
 *     tags: [Archivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Contenido del archivo
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
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
router.get("/:id/descargar", validarId, validarCampos, descargarArchivo);

/**
 * @swagger
 * /api/archivos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un archivo
 *     description: Borra el archivo del servidor y su registro en la base de datos.
 *     tags: [Archivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Archivo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Archivo eliminado correctamente
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
router.delete("/eliminar/:id", validarId, validarCampos, eliminarArchivo);

export default router;
