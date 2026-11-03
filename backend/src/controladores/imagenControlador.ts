import { Request, Response } from "express";

// Controlador para recibir y guardar una imagen
export const subirImagen = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                mensaje: "No se ha enviado ninguna imagen. Usa el campo 'imagen'."
            });
            return;
        }

        res.status(201).json({
            mensaje: "Imagen recibida, validada y guardada correctamente",
            archivo: {
                nombre: req.file.filename,
                nombreOriginal: req.file.originalname,
                tipo: req.file.mimetype,
                tamanoBytes: req.file.size,
                ruta: `/uploads/${req.file.filename}`
            }
        });
    } catch (error) {
        console.error("Error al subir la imagen:", error);

        res.status(500).json({
            mensaje: "Error interno al procesar la imagen"
        });
    }
};

