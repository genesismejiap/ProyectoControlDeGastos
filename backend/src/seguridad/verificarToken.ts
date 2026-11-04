
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * datos del usuario que viajan dentro del token jwt
 * (se firman en post /api/usuarios/login).
 */
export interface UsuarioToken {
    id: number;
    correo: string;
}

/**
 * middleware que protege rutas exigiendo un token jwt válido.
 *
 * espera el encabezado `Authorization: Bearer <token>`, firmado con JWT_SECRET.
 * si el token es válido guarda sus datos en `res.locals.usuario` (UsuarioToken)
 * para que los controladores sepan qué usuario hizo la petición.
 * - 401 si no se envía el token o si es inválido / expiró.
 * - 500 si JWT_SECRET no está configurada.
 *
 * @param req - petición http
 * @param res - respuesta http
 * @param next - continúa con el siguiente middleware si el token es válido
 */
export const verificarToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const autorizacion = req.headers.authorization;

    // comprobar que se envió un token
    if (!autorizacion?.startsWith("Bearer ")) {
        res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a este recurso"
        });
        return;
    }

    const token = autorizacion.split(" ")[1];
    const claveSecreta = process.env.JWT_SECRET;

    if (!claveSecreta) {
        res.status(500).json({
            mensaje: "No se configuró la clave de autenticación"
        });
        return;
    }

    try {
        // verificar que el token sea válido y guardar el usuario que lo envió
        res.locals.usuario = jwt.verify(token, claveSecreta) as UsuarioToken;
        next();

    } catch (error) {
        res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};
