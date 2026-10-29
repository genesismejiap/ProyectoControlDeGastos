
import { Router } from "express";
import { body, param } from "express-validator";

import { crearGasto, consultarGastos, actualizarGasto, eliminarGasto } from "../controladores/gastosControlador.js";

const router = Router();
// Ruta para consultar todos los gastos
router.get("/", consultarGastos);

// Ruta para registrar un nuevo gasto
router.post(
    "/guardar",
    [
        body("proyecto_id")
            .notEmpty()
            .withMessage("El proyecto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser válido"),

        body("categoria")
            .trim()
            .notEmpty()
            .withMessage("El nombre de la categoría es obligatorio")
            .isLength({ max: 100 })
            .withMessage("El nombre de la categoría no debe superar los 100 caracteres"),

        body("descripcion")
            .trim()
            .notEmpty()
            .withMessage("La descripción del gasto es obligatoria")
            .isLength({ max: 255 })
            .withMessage("La descripción no debe superar los 255 caracteres"),

        body("monto")
            .isFloat({ min: 0 })
            .withMessage("El monto debe ser un número mayor o igual a cero"),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida")
    ],
    crearGasto
);

// Ruta para actualizar un gasto
router.put(
    "/actualizar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del gasto debe ser válido"),

        body("proyecto_id")
            .notEmpty()
            .withMessage("El proyecto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser válido"),

        body("categoria")
            .trim()
            .notEmpty()
            .withMessage("La categoría es obligatoria")
            .isLength({ max: 100 })
            .withMessage("El nombre de la categoría no debe superar los 100 caracteres"),

        body("descripcion")
            .trim()
            .notEmpty()
            .withMessage("La descripción es obligatoria")
            .isLength({ max: 255 })
            .withMessage("La descripción no debe superar los 255 caracteres"),

        body("monto")
            .isFloat({ min: 0 })
            .withMessage("El monto debe ser un número mayor o igual a cero"),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida")
    ],
    actualizarGasto
);

// Ruta para eliminar un gasto
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del gasto debe ser un número entero positivo")
    ],
    eliminarGasto
);

export default router;
