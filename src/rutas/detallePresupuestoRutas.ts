
import { Router } from "express";
import { body, param } from "express-validator";


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
            .withMessage("El ID del presupuesto debe ser válido"),

       
        body("categoria")
             .trim()
             .notEmpty()
            .withMessage("El nombre de la categoría es obligatorio")
            .isLength({ max: 100 })
            .withMessage("El nombre de la categoría no debe superar los 100 caracteres"),


        body("entregable")
            .trim()
            .notEmpty()
            .withMessage("El entregable es obligatorio")
            .isLength({ max: 150 })
            .withMessage("El entregable no debe superar los 150 caracteres"),

        body("cantidad")
            .isInt({ min: 1 })
            .withMessage("La cantidad debe ser un número entero mayor que cero"),

        body("precio_unitario")
            .isFloat({ min: 0 })
            .withMessage("El precio unitario debe ser un número con máximo dos decimales")
            .withMessage("El precio unitario no puede ser negativo")
    ],
    crearDetallePresupuesto
);

// Ruta para actualizar un detalle de presupuesto
router.put(
    "/actualizar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del detalle debe ser válido"),

        body("presupuesto_id")
            .notEmpty()
            .withMessage("El presupuesto es obligatorio")
            .isInt({ min: 1 })
            .withMessage("El ID del presupuesto debe ser válido"),

        body("categoria")
            .trim()
            .notEmpty()
            .withMessage("La categoría es obligatoria")
            .isLength({ max: 100 })
            .withMessage("El nombre de la categoría no debe superar los 100 caracteres"),

        body("entregable")
            .trim()
            .notEmpty()
            .withMessage("El entregable es obligatorio")
            .isLength({ max: 150 })
            .withMessage("El entregable no debe superar los 150 caracteres"),

        body("cantidad")
            .isInt({ min: 1 })
            .withMessage("La cantidad debe ser mayor que cero"),

        body("precio_unitario")
           .isFloat({ min: 0 })
            .withMessage("El precio debe tener máximo dos decimales")
            .withMessage("El precio no puede ser negativo")
    ],
    actualizarDetallePresupuesto
);

// Ruta para eliminar un detalle de presupuesto
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del detalle debe ser un número entero positivo")
    ],
    eliminarDetallePresupuesto
);


export default router;
