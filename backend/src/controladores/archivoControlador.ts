
/**
 * controladores de archivos (imágenes y documentos):
 * consulta, descarga y eliminación.
 *
 * todas las operaciones verifican que el archivo pertenezca al usuario
 * del token (`res.locals.usuario`, guardado por verificarToken).
 */

import { Request, Response } from "express";
import fs from "fs";

import { Archivo } from "../modelos/archivoModelo.js";
import { rutaArchivo, TipoArchivo } from "../configuraciones/multerConfig.js";
import { UsuarioToken } from "../seguridad/verificarToken.js";

/**
 * convierte un registro de la tabla `archivos` en la respuesta pública de la api.
 * no expone la ruta física del servidor, solo la url de descarga.
 */
export const formatearArchivo = (archivo: Archivo) => ({
    id: archivo.id,
    tipo: archivo.tipo,
    proyecto_id: archivo.proyecto_id,
    nombre: archivo.nombre,
    nombre_original: archivo.nombre_original,
    mimetype: archivo.mimetype,
    tamano_bytes: archivo.tamano_bytes,
    fecha_subida: archivo.createdAt,
    url_descarga: `/api/archivos/${archivo.id}/descargar`
});

/**
 * elimina un archivo del disco sin fallar si ya no existe.
 */
const borrarDelDisco = async (ruta: string): Promise<void> => {
    try {
        await fs.promises.unlink(ruta);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
        }
    }
};

/**
 * registra en mysql el archivo que multer acaba de guardar,
 * asignándolo como dueño al usuario del token.
 * lo usan los controladores de subida de imágenes y documentos.
 *
 * respuestas: 201 { mensaje, archivo } · 400 no se envió archivo · 500 error
 *
 * @param tipo - tipo de archivo recibido
 * @param campo - nombre del campo form-data (para el mensaje de error)
 * @param mensajeExito - mensaje de la respuesta 201
 */
export const registrarArchivoSubido = async (
    req: Request,
    res: Response,
    tipo: TipoArchivo,
    campo: string,
    mensajeExito: string,
    proyectoId: number | null = null
): Promise<void> => {
    if (!req.file) {
        res.status(400).json({
            mensaje: `No se ha enviado ningún archivo. Usa el campo '${campo}'.`
        });
        return;
    }

    const usuario = res.locals.usuario as UsuarioToken;

    try {
        // guardar el registro con el dueño del archivo
        const archivo = await Archivo.create({
            usuario_id: usuario.id,
            proyecto_id: proyectoId,
            tipo,
            nombre: req.file.filename,
            nombre_original: req.file.originalname,
            mimetype: req.file.mimetype,
            tamano_bytes: req.file.size
        });

        res.status(201).json({
            mensaje: mensajeExito,
            archivo: formatearArchivo(archivo)
        });

    } catch (error) {
        console.error(`Error al registrar el ${tipo}:`, error);

        // si no se pudo registrar, no dejar el archivo huérfano en el disco
        await borrarDelDisco(req.file.path).catch(() => undefined);

        res.status(500).json({
            mensaje: `Error interno al guardar el ${tipo}`
        });
    }
};

/**
 * busca un archivo por el id de la ruta y verifica que pertenezca al usuario del token.
 * si no existe o no tiene permiso, responde y devuelve null.
 *
 * respuestas: 404 no existe · 403 pertenece a otro usuario
 */
const buscarArchivoPropio = async (
    req: Request,
    res: Response
): Promise<Archivo | null> => {
    const id = Number(req.params.id);
    const usuario = res.locals.usuario as UsuarioToken;

    const archivo = await Archivo.findByPk(id);

    if (!archivo) {
        res.status(404).json({
            mensaje: "El archivo no existe"
        });
        return null;
    }

    // verificar el permiso de acceso: solo el dueño puede usar el archivo
    if (archivo.usuario_id !== usuario.id) {
        res.status(403).json({
            mensaje: "No tienes permiso para acceder a este archivo"
        });
        return null;
    }

    return archivo;
};

/**
 * consulta los archivos del usuario del token, del más reciente al más antiguo.
 *
 * query: tipo (opcional) = "imagen" | "documento", proyecto_id (opcional)
 * respuestas: 200 { archivos } · 400 tipo inválido · 401 sin token · 500 error
 */
export const consultarArchivos = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuario = res.locals.usuario as UsuarioToken;
        const tipo = req.query.tipo as TipoArchivo | undefined;
        const proyectoId = req.query.proyecto_id
            ? Number(req.query.proyecto_id)
            : undefined;

        // solo los archivos del usuario y, si se indica, del tipo pedido
        const archivos = await Archivo.findAll({
            where: {
                usuario_id: usuario.id,
                ...(tipo ? { tipo } : {}),
                ...(proyectoId ? { proyecto_id: proyectoId } : {})
            },
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            archivos: archivos.map(formatearArchivo)
        });

    } catch (error) {
        console.error("Error al consultar archivos:", error);

        res.status(500).json({
            mensaje: "Error al consultar los archivos"
        });
    }
};

/**
 * consulta la información de un archivo del usuario del token.
 *
 * params: id
 * respuestas: 200 { archivo } · 400 id inválido · 401 sin token · 403 sin permiso · 404 no existe · 500 error
 */
export const consultarArchivo = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const archivo = await buscarArchivoPropio(req, res);

        if (!archivo) {
            return;
        }

        res.status(200).json({
            archivo: formatearArchivo(archivo)
        });

    } catch (error) {
        console.error("Error al consultar el archivo:", error);

        res.status(500).json({
            mensaje: "Error al consultar el archivo"
        });
    }
};

/**
 * descarga un archivo del usuario del token con su nombre original.
 *
 * params: id
 * respuestas: 200 archivo binario · 400 id inválido · 401 sin token · 403 sin permiso
 *             · 404 no existe (en la base de datos o en el disco) · 500 error
 */
export const descargarArchivo = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const archivo = await buscarArchivoPropio(req, res);

        if (!archivo) {
            return;
        }

        const ruta = rutaArchivo(archivo.tipo, archivo.nombre);

        // el registro existe pero el archivo físico pudo borrarse manualmente
        if (!fs.existsSync(ruta)) {
            res.status(404).json({
                mensaje: "El archivo ya no se encuentra en el servidor"
            });
            return;
        }

        res.download(ruta, archivo.nombre_original, (error) => {
            if (error) {
                console.error("Error al enviar el archivo:", error);

                if (!res.headersSent) {
                    res.status(500).json({
                        mensaje: "Error al descargar el archivo"
                    });
                }
            }
        });

    } catch (error) {
        console.error("Error al descargar el archivo:", error);

        res.status(500).json({
            mensaje: "Error al descargar el archivo"
        });
    }
};

/**
 * elimina un archivo del usuario del token, tanto del disco como de mysql.
 *
 * params: id
 * respuestas: 200 eliminado · 400 id inválido · 401 sin token · 403 sin permiso · 404 no existe · 500 error
 */
export const eliminarArchivo = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const archivo = await buscarArchivoPropio(req, res);

        if (!archivo) {
            return;
        }

        // borrar primero el archivo físico y luego su registro
        await borrarDelDisco(rutaArchivo(archivo.tipo, archivo.nombre));
        await archivo.destroy();

        res.status(200).json({
            mensaje: "Archivo eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar el archivo:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el archivo"
        });
    }
};
