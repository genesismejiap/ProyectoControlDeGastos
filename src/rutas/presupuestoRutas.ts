
import { Router } from "express";
import { body } from "express-validator";

import { crearPresupuesto } from "../controladores/presupuestoControlador.js";

const router = Router();

// Ruta para registrar un presupuesto
router.post(
    "/guardar",
    [
        body("proyecto_id")
            .notEmpty()
            .withMessage("El proyecto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo"),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida"),

        body("estado")
            .optional()
            .isIn(["Borrador", "Aprobado"])
            .withMessage("El estado debe ser Borrador o Aprobado")
    ],
    crearPresupuesto
);

export default router;
