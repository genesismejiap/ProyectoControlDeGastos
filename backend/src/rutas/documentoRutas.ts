
/**
 * rutas para subir documentos.
 * prefijo: /api/documentos
 *
 * la consulta, descarga y eliminación se hacen en /api/archivos.
 */

import { Router } from "express";
import { uploadDocumento, manejarSubida } from "../configuraciones/multerConfig.js";
import { subirDocumento } from "../controladores/documentoControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";

const router = Router();

/**
 * @swagger
 * /api/documentos/subir:
 *   post:
 *     summary: Subir un documento
 *     description: >
 *       Recibe un documento PDF, DOC, DOCX, XLS o XLSX de máximo 10 MB y lo guarda
 *       a nombre del usuario del token. Solo ese usuario podrá consultarlo,
 *       descargarlo o eliminarlo.
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documento]
 *             properties:
 *               documento:
 *                 type: string
 *                 format: binary
 *                 description: Documento PDF, DOC, DOCX, XLS o XLSX (máx. 10 MB)
 *     responses:
 *       201:
 *         description: Documento guardado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArchivoSubido'
 *       400:
 *         description: No se envió el documento, el formato no es válido o supera 10 MB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Solo se permiten documentos en formato PDF, DOC, DOCX, XLS o XLSX
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post(
    "/subir",
    verificarToken,
    manejarSubida(
        uploadDocumento.single("documento"),
        "El documento supera el tamaño máximo permitido de 10 MB"
    ),
    subirDocumento
);

export default router;
