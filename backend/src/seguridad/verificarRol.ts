
import { Request, Response, NextFunction } from "express";
import { Usuario } from "../modelos/usuarioModelo.js";
import { UsuarioToken } from "./verificarToken.js";

/**
 * middlewares de autorización por rol.
 *
 * se usan DESPUÉS de verificarToken. el rol se consulta en mysql en cada
 * petición (no se lee del token) para que un cambio de rol o la eliminación
 * de la cuenta se apliquen de inmediato, sin esperar a que el token expire.
 *
 * ambos guardan en `res.locals.esAdministrador` (boolean) el resultado.
 */

/**
 * busca en mysql al usuario del token. si la cuenta ya no existe responde 401
 * y devuelve null.
 */
const buscarActor = async (
    res: Response
): Promise<{ id: number; esAdministrador: boolean } | null> => {
    const { id } = res.locals.usuario as UsuarioToken;

    const actor = await Usuario.findByPk(id, { attributes: ["id", "rol"] });

    if (!actor) {
        res.status(401).json({
            mensaje: "La cuenta de este token ya no existe"
        });
        return null;
    }

    return {
        id: Number(actor.get("id")),
        esAdministrador: actor.get("rol") === "administrador"
    };
};

/**
 * solo deja pasar a los usuarios con rol "administrador".
 * - 401 si la cuenta del token ya no existe.
 * - 403 si el usuario no es administrador.
 */
export const soloAdministrador = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const actor = await buscarActor(res);

        if (!actor) {
            return;
        }

        if (!actor.esAdministrador) {
            res.status(403).json({
                mensaje: "Esta operación es solo para administradores"
            });
            return;
        }

        res.locals.esAdministrador = true;
        next();

    } catch (error) {
        console.error("Error al verificar el rol:", error);

        res.status(500).json({
            mensaje: "Error al verificar los permisos"
        });
    }
};

/**
 * deja pasar a un administrador o al dueño de la cuenta (`req.params.id`
 * igual al id del token). cualquier otro usuario recibe 403 sin que se
 * consulte si el id pedido existe, así no se puede averiguar qué ids existen.
 * - 401 si la cuenta del token ya no existe.
 * - 403 si no es administrador ni el dueño de la cuenta.
 */
export const administradorOPropietario = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const actor = await buscarActor(res);

        if (!actor) {
            return;
        }

        if (!actor.esAdministrador && actor.id !== Number(req.params.id)) {
            res.status(403).json({
                mensaje: "No tienes permiso para acceder a este usuario"
            });
            return;
        }

        res.locals.esAdministrador = actor.esAdministrador;
        next();

    } catch (error) {
        console.error("Error al verificar el rol:", error);

        res.status(500).json({
            mensaje: "Error al verificar los permisos"
        });
    }
};
