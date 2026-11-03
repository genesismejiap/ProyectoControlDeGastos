import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadImagen } from "../configuraciones/multerConfig.js";
import { subirImagen } from "../controladores/imagenControlador.js";

const router = Router();

// Middleware para capturar errores de validación y tamaño de Multer
const validarSubidaImagen = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const upload = uploadImagen.single("imagen");

    upload(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                res.status(400).json({
                    mensaje: "La imagen supera el tamaño máximo permitido de 5 MB"
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

// Ruta para subir una imagen (campo form-data: "imagen")
router.post("/subir", validarSubidaImagen, subirImagen);

export default router;

