
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Verificar que el usuario haya iniciado sesión
export const verificarToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const autorizacion = req.headers.authorization;

    // Comprobar que se envió un token
    if (!autorizacion?.startsWith("Bearer ")) {
        res.status(401).json({
            mensaje: "Debes iniciar sesión para enviar correos"
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
        // Verificar que el token sea válido
        jwt.verify(token, claveSecreta);
        next();

    } catch (error) {
        res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};
