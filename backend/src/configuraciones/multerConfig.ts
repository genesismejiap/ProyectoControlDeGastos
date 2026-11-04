
/**
 * configuración de multer para recibir, validar y guardar archivos.
 *
 * - imágenes (jpg, jpeg, png, máx. 5 mb) en `uploads/imagenes`.
 * - documentos (pdf, word, excel, máx. 10 mb) en `uploads/documentos`.
 *
 * la carpeta `uploads` no se publica como estática: los archivos solo se
 * entregan por la api, verificando que pertenezcan al usuario que los pide.
 */

import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** tipos de archivo que maneja la api */
export type TipoArchivo = "imagen" | "documento";

// carpeta raíz donde se guardan los archivos subidos
export const carpetaUploads = path.join(__dirname, "../../uploads");

// subcarpeta de cada tipo de archivo
const carpetas: Record<TipoArchivo, string> = {
    imagen: path.join(carpetaUploads, "imagenes"),
    documento: path.join(carpetaUploads, "documentos")
};

// crear las carpetas automáticamente si no existen
for (const carpeta of Object.values(carpetas)) {
    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, { recursive: true });
    }
}

/**
 * devuelve la ruta física de un archivo guardado.
 *
 * @param tipo - tipo del archivo (imagen o documento)
 * @param nombre - nombre con el que multer guardó el archivo
 */
export const rutaArchivo = (tipo: TipoArchivo, nombre: string): string =>
    path.join(carpetas[tipo], path.basename(nombre));

/**
 * crea el almacenamiento en disco para un tipo de archivo.
 * cada archivo se guarda con un nombre único para evitar sobrescribir otros.
 */
const crearStorage = (tipo: TipoArchivo) =>
    multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb) => {
            cb(null, carpetas[tipo]);
        },
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
            cb(null, nombreUnico);
        }
    });

/**
 * crea un filtro que solo acepta los tipos mime y extensiones indicados.
 *
 * @param tiposPermitidos - tipos mime aceptados
 * @param extensionesPermitidas - extensiones aceptadas (con punto)
 * @param mensajeError - mensaje cuando el archivo no cumple
 */
const crearFiltro = (
    tiposPermitidos: string[],
    extensionesPermitidas: string[],
    mensajeError: string
) => (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
        tiposPermitidos.includes(file.mimetype) &&
        extensionesPermitidas.includes(extension)
    ) {
        cb(null, true);
    } else {
        cb(new Error(mensajeError));
    }
};

// instancia de multer para imágenes jpg, jpeg y png (límite de 5 mb)
export const uploadImagen = multer({
    storage: crearStorage("imagen"),
    fileFilter: crearFiltro(
        ["image/jpeg", "image/jpg", "image/png"],
        [".jpg", ".jpeg", ".png"],
        "Solo se permiten imágenes en formato JPG, JPEG o PNG"
    ),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// instancia de multer para documentos pdf, word y excel (límite de 10 mb)
export const uploadDocumento = multer({
    storage: crearStorage("documento"),
    fileFilter: crearFiltro(
        [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ],
        [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
        "Solo se permiten documentos en formato PDF, DOC, DOCX, XLS o XLSX"
    ),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

/**
 * crea un middleware que recibe un archivo con multer y responde 400
 * con un mensaje claro si no cumple el formato o supera el tamaño.
 *
 * @param subida - middleware de multer, por ejemplo `uploadImagen.single("imagen")`
 * @param mensajeTamano - mensaje cuando el archivo supera el tamaño máximo
 */
export const manejarSubida = (
    subida: RequestHandler,
    mensajeTamano: string
) => (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    subida(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                res.status(400).json({
                    mensaje: mensajeTamano
                });
                return;
            }
            res.status(400).json({
                mensaje: `Error al subir el archivo: ${err.message}`
            });
            return;
        } else if (err instanceof Error) {
            res.status(400).json({
                mensaje: err.message
            });
            return;
        }

        next();
    });
};
