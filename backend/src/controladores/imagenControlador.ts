
/**
 * controladores de imágenes.
 */

import { Request, Response } from "express";
import { registrarArchivoSubido } from "./archivoControlador.js";

/**
 * registra la imagen que multer ya validó y guardó en `uploads/imagenes`,
 * asignándola al usuario del token.
 *
 * form-data: imagen (jpg, jpeg o png, máx. 5 mb)
 * respuestas: 201 { mensaje, archivo } · 400 sin imagen o formato inválido · 401 sin token · 500 error
 */
export const subirImagen = async (
    req: Request,
    res: Response
): Promise<void> => {
    await registrarArchivoSubido(
        req,
        res,
        "imagen",
        "imagen",
        "Imagen recibida, validada y guardada correctamente"
    );
};
