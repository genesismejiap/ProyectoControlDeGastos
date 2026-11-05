
/**
 * rutas para subir documentos.
 * prefijo: /api/documentos
 *
 * la consulta, descarga y eliminación se hacen en /api/archivos.
 */

import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { uploadDocumento, manejarSubida } from "../configuraciones/multerConfig.js";
import { subirDocumento } from "../controladores/documentoControlador.js";
import { Proyecto } from "../modelos/proyectoModelo.js";
import { verificarToken } from "../seguridad/verificarToken.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

const validarProyecto = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const proyecto = await Proyecto.findByPk(req.body.proyecto_id);

        if (!proyecto) {
            res.status(404).json({
                mensaje: "El proyecto no existe"
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/documentos/subir:
 *   post:
 *     summary: Subir un documento
 *     description: >
 *       Recibe un documento PDF, DOC, DOCX, XLS o XLSX de máximo 10 MB,
 *       asociado a un proyecto existente y al usuario del token. Solo ese usuario
 *       podrá consultarlo, descargarlo o eliminarlo.
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documento, proyecto_id]
 *             properties:
 *               proyecto_id:
 *                 type: integer
 *                 description: ID del proyecto al que pertenece el documento
 *                 example: 1
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
 *         description: Proyecto inválido, documento ausente, formato no válido o tamaño superior a 10 MB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: Solo se permiten documentos en formato PDF, DOC, DOCX, XLS o XLSX
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       404:
 *         description: El proyecto no existe
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post(
    "/subir",
    verificarToken,
    body("proyecto_id")
        .notEmpty()
        .withMessage("El ID del proyecto es obligatorio")
        .bail()
        .isInt({ min: 1 })
        .withMessage("El ID del proyecto debe ser un número entero positivo")
        .bail()
        .toInt(),
    validarCampos,
    validarProyecto,
    manejarSubida(
        uploadDocumento.single("documento"),
        "El documento supera el tamaño máximo permitido de 10 MB"
    ),
    subirDocumento
);

export default router;
