
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UsuarioToken {
    id: number;
    correo: string;
}

export const verificarToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const autorizacion = req.headers.authorization;

    // Comprobar que se envió un token
    if (!autorizacion?.startsWith("Bearer ")) {
        res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a este recurso"
        });
        return;
    }

    const token = autorizacion.slice(7).trim();
    const claveSecreta = process.env.JWT_SECRET;

    if (!claveSecreta) {
        res.status(500).json({
            mensaje: "No se configuró la clave de autenticación"
        });
        return;
    }

    try {
        // Verificar firma y vencimiento del JWT
        const datos = jwt.verify(token, claveSecreta, {
            algorithms: ["HS256"]
        });

        // Validar que el token contenga los datos esperados
        if (
            typeof datos === "string" ||
            typeof datos.id !== "number" ||
            !Number.isInteger(datos.id) ||
            datos.id <= 0 ||
            typeof datos.correo !== "string"
        ) {
            res.status(401).json({
                mensaje: "Token inválido"
            });
            return;
        }

        // Guardar los datos del usuario autenticado
        res.locals.usuario = {
            id: datos.id,
            correo: datos.correo
        } satisfies UsuarioToken;

        next();

    } catch (error) {
        res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};
