
/**
 * controladores del módulo de imágenes.
 */

import { Request, Response } from "express";
import fs from "fs";

import { Archivo } from "../modelos/archivoModelo.js";
import { rutaArchivo } from "../configuraciones/multerConfig.js";
import { UsuarioToken } from "../seguridad/verificarToken.js";
import {
    formatearArchivo,
    registrarArchivoSubido
} from "./archivoControlador.js";

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

/**
 * listar las imágenes que pertenecen al usuario del token.
 */
export const listarImagenes = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuario = res.locals.usuario as UsuarioToken;

        const imagenes = await Archivo.findAll({
            where: {
                usuario_id: usuario.id,
                tipo: "imagen"
            },
            order: [["id", "DESC"]]
        });

        res.status(200).json({
            total: imagenes.length,
            imagenes: imagenes.map(formatearArchivo)
        });

    } catch (error) {
        console.error("Error al listar imágenes:", error);

        res.status(500).json({
            mensaje: "Error al consultar las imágenes"
        });
    }
};

/**
 * consultar una imagen por su id.
 */
export const consultarImagen = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const usuario = res.locals.usuario as UsuarioToken;

        const imagen = await Archivo.findByPk(id);

        if (
            !imagen ||
            imagen.tipo !== "imagen" ||
            imagen.usuario_id !== usuario.id
        ) {
            res.status(404).json({
                mensaje: "Imagen no encontrada"
            });
            return;
        }

        res.status(200).json({
            imagen: formatearArchivo(imagen)
        });

    } catch (error) {
        console.error("Error al consultar la imagen:", error);

        res.status(500).json({
            mensaje: "Error al consultar la imagen"
        });
    }
};

/**
 * reemplazar una imagen guardada.
 */
export const reemplazarImagen = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!req.file) {
        res.status(400).json({
            mensaje: "No se ha enviado ninguna imagen. Usa el campo 'imagen'."
        });
        return;
    }

    try {
        const id = Number(req.params.id);
        const usuario = res.locals.usuario as UsuarioToken;
        const imagen = await Archivo.findByPk(id);

        if (
            !imagen ||
            imagen.tipo !== "imagen" ||
            imagen.usuario_id !== usuario.id
        ) {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(404).json({
                mensaje: "Imagen no encontrada"
            });
            return;
        }

        const rutaImagenAnterior = rutaArchivo("imagen", imagen.nombre);

        imagen.nombre = req.file.filename;
        imagen.nombre_original = req.file.originalname;
        imagen.mimetype = req.file.mimetype;
        imagen.tamano_bytes = req.file.size;

        await imagen.save();

        // después de actualizar MySQL, borrar la imagen anterior del disco
        if (fs.existsSync(rutaImagenAnterior)) {
            try {
                fs.unlinkSync(rutaImagenAnterior);
            } catch (error) {
                console.warn("No se pudo borrar la imagen anterior:", error);
            }
        }

        res.status(200).json({
            mensaje: "Imagen reemplazada correctamente",
            imagen: formatearArchivo(imagen)
        });

    } catch (error) {
        console.error("Error al reemplazar la imagen:", error);

        // si MySQL falla, borrar la imagen nueva que Multer guardó
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            mensaje: "Error al reemplazar la imagen"
        });
    }
};

/**
 * eliminar una imagen de MySQL y del disco.
 */
export const eliminarImagen = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const usuario = res.locals.usuario as UsuarioToken;
        const imagen = await Archivo.findByPk(id);

        if (
            !imagen ||
            imagen.tipo !== "imagen" ||
            imagen.usuario_id !== usuario.id
        ) {
            res.status(404).json({
                mensaje: "Imagen no encontrada"
            });
            return;
        }

        const rutaImagen = rutaArchivo("imagen", imagen.nombre);

        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
        }

        await imagen.destroy();

        res.status(200).json({
            mensaje: "Imagen eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar la imagen:", error);

        res.status(500).json({
            mensaje: "Error al eliminar la imagen"
        });
    }
};
