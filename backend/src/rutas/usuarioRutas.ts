
import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { registrarUsuario, iniciarSesion } from "../controladores/usuarioControlador.js";

const router = Router();

const validarCampos = (
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

// Registrar usuarios
router.post(
    "/registro",
    [
        body("nombre")
            .isString()
            .withMessage("El nombre debe ser texto")
            .trim()
            .notEmpty()
            .withMessage("El nombre es obligatorio"),

        body("correo")
            .isEmail()
            .withMessage("Ingrese un correo válido")
            .normalizeEmail(),

        body("contrasena")
            .isString()
            .withMessage("La contraseña debe ser texto")
            .bail()
            .isLength({ min: 8 })
            .withMessage("La contraseña debe tener al menos 8 caracteres")
    ],
    validarCampos,
    registrarUsuario
);


router.post(
    "/login",
    [
        body("correo")
            .isEmail()
            .withMessage("Ingrese un correo válido")
            .normalizeEmail(),

        body("contrasena")
            .isString()
            .withMessage("La contraseña debe ser texto")
            .bail()
            .notEmpty()
            .withMessage("La contraseña es obligatoria")
    ],
    validarCampos,
    iniciarSesion
);


export default router;
