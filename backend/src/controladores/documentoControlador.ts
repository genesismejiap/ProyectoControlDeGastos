
/**
 * controladores de documentos.
 */

import { Request, Response } from "express";
import { registrarArchivoSubido } from "./archivoControlador.js";

/**
 * registra el documento que multer ya validó y guardó en `uploads/documentos`,
 * asignándolo al usuario del token.
 *
 * form-data: documento (pdf, doc, docx, xls o xlsx, máx. 10 mb)
 * respuestas: 201 { mensaje, archivo } · 400 sin documento o formato inválido · 401 sin token · 500 error
 */
export const subirDocumento = async (
    req: Request,
    res: Response
): Promise<void> => {
    await registrarArchivoSubido(
        req,
        res,
        "documento",
        "documento",
        "Documento recibido, validado y guardado correctamente"
    );
};
