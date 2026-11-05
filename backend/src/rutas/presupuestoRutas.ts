
import { Router } from "express";
import { body,param } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";

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
            .withMessage("El ID del presupuesto debe ser válido")
            .toInt(),

        body("proyecto_id")
            .notEmpty()
            .withMessage("El proyecto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser válido")
            .toInt(),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("La fecha debe tener el formato AAAA-MM-DD")
            .bail()
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida"),

        body("estado")
            .notEmpty()
            .withMessage("El estado es obligatorio")
            .isIn(["Borrador", "Aprobado"])
            .withMessage("El estado debe ser Borrador o Aprobado")
    ],
    validarCampos,
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
            .withMessage("El ID del proyecto debe ser un número entero positivo")
            .toInt(),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("La fecha debe tener el formato AAAA-MM-DD")
            .bail()
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida"),

        body("estado")
            .optional()
            .isIn(["Borrador", "Aprobado"])
            .withMessage("El estado debe ser Borrador o Aprobado")
    ],
    validarCampos,
    crearPresupuesto
);


// Ruta para eliminar un presupuesto
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del presupuesto debe ser un número entero positivo")
            .toInt()
    ],
    validarCampos,
    eliminarPresupuesto
);


export default router;
