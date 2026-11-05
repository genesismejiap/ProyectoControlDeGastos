import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validarCampos = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        res.status(400).json({
            mensaje: "Datos inválidos",
            errores: errores.array()
        });
        return;
    }

    next();
};
