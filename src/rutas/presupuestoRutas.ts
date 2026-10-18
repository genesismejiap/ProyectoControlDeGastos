
import { Router } from "express";
import { body,param } from "express-validator";

import { crearPresupuesto,
     consultarPresupuestos, 
     actualizarPresupuesto,
    eliminarPresupuesto
 } from "../controladores/presupuestoControlador.js";

const router = Router();


// Ruta para consultar todos los presupuestos
router.get("/", consultarPresupuestos);


// Ruta para actualizar un presupuesto
router.put(
    "/actualizar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del presupuesto debe ser válido"),

        body("proyecto_id")
            .notEmpty()
            .withMessage("El proyecto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser válido"),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida"),

        body("estado")
            .notEmpty()
            .withMessage("El estado es obligatorio")
            .isIn(["Borrador", "Aprobado"])
            .withMessage("El estado debe ser Borrador o Aprobado")
    ],
    actualizarPresupuesto
);

 
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


// Ruta para eliminar un presupuesto
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del presupuesto debe ser un número entero positivo")
    ],
    eliminarPresupuesto
);


export default router;
