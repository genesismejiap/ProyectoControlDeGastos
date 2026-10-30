
/**
 * Rutas de detalles de presupuesto (entregables de cada presupuesto).
 * Prefijo: /api/detalle-presupuestos
 */

import { Router } from "express";
import { body, param } from "express-validator";


import {
    crearDetallePresupuesto,
    consultarDetallesPresupuesto,
    actualizarDetallePresupuesto,
     eliminarDetallePresupuesto
} from "../controladores/detallePresupuestoControlador.js";


const router = Router();
/**
 * @swagger
 * /api/detalle-presupuestos:
 *   get:
 *     summary: Consultar todos los detalles de presupuestos
 *     tags: [Detalle de presupuestos]
 *     responses:
 *       200:
 *         description: Lista de detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detalles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DetallePresupuesto'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", consultarDetallesPresupuesto);
/**
 * @swagger
 * /api/detalle-presupuestos/guardar:
 *   post:
 *     summary: Registrar un detalle de presupuesto
 *     description: La categoría se indica por su nombre y debe existir previamente.
 *     tags: [Detalle de presupuestos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetallePresupuestoEntrada'
 *     responses:
 *       201:
 *         description: Detalle de presupuesto registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Detalle de presupuesto registrado correctamente
 *                 detalle:
 *                   $ref: '#/components/schemas/DetallePresupuesto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El presupuesto o la categoría no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
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
            .withMessage("El precio unitario debe ser un número mayor o igual a cero")
    ],
    crearDetallePresupuesto
);

/**
 * @swagger
 * /api/detalle-presupuestos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un detalle de presupuesto
 *     tags: [Detalle de presupuestos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetallePresupuestoEntrada'
 *     responses:
 *       200:
 *         description: Detalle de presupuesto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Detalle de presupuesto actualizado correctamente
 *                 detalle:
 *                   $ref: '#/components/schemas/DetallePresupuesto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El detalle, el presupuesto o la categoría no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
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
            .withMessage("El precio unitario debe ser un número mayor o igual a cero")
    ],
    actualizarDetallePresupuesto
);

/**
 * @swagger
 * /api/detalle-presupuestos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un detalle de presupuesto
 *     tags: [Detalle de presupuestos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Detalle de presupuesto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
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
