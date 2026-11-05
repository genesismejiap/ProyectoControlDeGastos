
import { Router } from "express";
import { body, param } from "express-validator";

import { crearGasto, consultarGastos, actualizarGasto, eliminarGasto } from "../controladores/gastosControlador.js";
import { validarCampos } from "../middlewares/validarCampos.js";

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
            .withMessage("El ID del proyecto debe ser válido")
            .toInt(),

        body("categoria")
            .isString()
            .withMessage("El nombre de la categoría debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("El nombre de la categoría es obligatorio")
            .isLength({ max: 100 })
            .withMessage("El nombre de la categoría no debe superar los 100 caracteres"),

        body("descripcion")
            .isString()
            .withMessage("La descripción del gasto debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("La descripción del gasto es obligatoria")
            .isLength({ max: 255 })
            .withMessage("La descripción no debe superar los 255 caracteres"),

        body("monto")
            .isFloat({ min: 0, max: 9999999999.99 })
            .withMessage("El monto debe estar entre 0 y 9999999999.99")
            .toFloat(),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("La fecha debe tener el formato AAAA-MM-DD")
            .bail()
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida")
    ],
    validarCampos,
    crearGasto
);

// Ruta para actualizar un gasto
router.put(
    "/actualizar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del gasto debe ser válido")
            .toInt(),

        body("proyecto_id")
            .notEmpty()
            .withMessage("El proyecto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser válido")
            .toInt(),

        body("categoria")
            .isString()
            .withMessage("El nombre de la categoría debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("La categoría es obligatoria")
            .isLength({ max: 100 })
            .withMessage("El nombre de la categoría no debe superar los 100 caracteres"),

        body("descripcion")
            .isString()
            .withMessage("La descripción del gasto debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("La descripción es obligatoria")
            .isLength({ max: 255 })
            .withMessage("La descripción no debe superar los 255 caracteres"),

        body("monto")
            .isFloat({ min: 0, max: 9999999999.99 })
            .withMessage("El monto debe estar entre 0 y 9999999999.99")
            .toFloat(),

        body("fecha")
            .notEmpty()
            .withMessage("La fecha es obligatoria")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("La fecha debe tener el formato AAAA-MM-DD")
            .bail()
            .isISO8601({ strict: true })
            .withMessage("La fecha debe ser válida")
    ],
    validarCampos,
    actualizarGasto
);

// Ruta para eliminar un gasto
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del gasto debe ser un número entero positivo")
            .toInt()
    ],
    validarCampos,
    eliminarGasto
);

export default router;
