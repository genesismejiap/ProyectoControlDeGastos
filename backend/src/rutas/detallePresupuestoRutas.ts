
import { Router } from "express";
import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";


import {
    crearDetallePresupuesto,
    consultarDetallesPresupuesto,
    actualizarDetallePresupuesto,
     eliminarDetallePresupuesto
} from "../controladores/detallePresupuestoControlador.js";


const router = Router();
// Consultar todos los detalles de presupuestos
router.get("/", consultarDetallesPresupuesto);
// Ruta para registrar un detalle de presupuesto
router.post(
    "/guardar",
    [
        body("presupuesto_id")
            .notEmpty()
            .withMessage("El presupuesto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del presupuesto debe ser válido")
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


        body("entregable")
            .isString()
            .withMessage("El entregable debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("El entregable es obligatorio")
            .isLength({ max: 150 })
            .withMessage("El entregable no debe superar los 150 caracteres"),

        body("cantidad")
            .isInt({ min: 1, max: 2147483647 })
            .withMessage("La cantidad debe ser un entero entre 1 y 2147483647")
            .toInt(),

        body("precio_unitario")
            .isFloat({ min: 0, max: 9999999999.99 })
            .withMessage("El precio unitario debe estar entre 0 y 9999999999.99")
            .toFloat()
    ],
    validarCampos,
    crearDetallePresupuesto
);

// Ruta para actualizar un detalle de presupuesto
router.put(
    "/actualizar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del detalle debe ser válido")
            .toInt(),

        body("presupuesto_id")
            .notEmpty()
            .withMessage("El presupuesto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del presupuesto debe ser válido")
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

        body("entregable")
            .isString()
            .withMessage("El entregable debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("El entregable es obligatorio")
            .isLength({ max: 150 })
            .withMessage("El entregable no debe superar los 150 caracteres"),

        body("cantidad")
            .isInt({ min: 1, max: 2147483647 })
            .withMessage("La cantidad debe ser un entero entre 1 y 2147483647")
            .toInt(),

        body("precio_unitario")
            .isFloat({ min: 0, max: 9999999999.99 })
            .withMessage("El precio unitario debe estar entre 0 y 9999999999.99")
            .toFloat()
    ],
    validarCampos,
    actualizarDetallePresupuesto
);

// Ruta para eliminar un detalle de presupuesto
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del detalle debe ser un número entero positivo")
            .toInt()
    ],
    validarCampos,
    eliminarDetallePresupuesto
);


export default router;
