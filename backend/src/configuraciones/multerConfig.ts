import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde se guardarán las imágenes subidas
export const carpetaUploads = path.join(__dirname, "../../uploads");

// Crear la carpeta uploads automáticamente si no existe
if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads, { recursive: true });
}

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, carpetaUploads);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, nombreUnico);
    }
});

// Filtro para validar que solo se permitan imágenes JPG, JPEG y PNG
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    const extensionesPermitidas = [".jpg", ".jpeg", ".png"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (
        tiposPermitidos.includes(file.mimetype) &&
        extensionesPermitidas.includes(extension)
    ) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes en formato JPG, JPEG o PNG"));
    }
};

// Instancia configurada de Multer (límite de 5 MB por imagen)
export const uploadImagen = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

