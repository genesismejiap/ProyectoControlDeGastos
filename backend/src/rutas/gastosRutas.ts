
/**
 * Rutas de gastos.
 * Prefijo: /api/gastos
 */

import { Router } from "express";
import { body, param } from "express-validator";

import { crearGasto, consultarGastos, actualizarGasto, eliminarGasto } from "../controladores/gastosControlador.js";

const router = Router();
/**
 * @swagger
 * /api/gastos:
 *   get:
 *     summary: Consultar todos los gastos
 *     tags: [Gastos]
 *     responses:
 *       200:
 *         description: Lista de gastos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gastos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gasto'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", consultarGastos);

/**
 * @swagger
 * /api/gastos/guardar:
 *   post:
 *     summary: Registrar un nuevo gasto
 *     description: La categoría se indica por su nombre y debe existir previamente.
 *     tags: [Gastos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GastoEntrada'
 *     responses:
 *       201:
 *         description: Gasto registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Gasto registrado correctamente
 *                 gasto:
 *                   $ref: '#/components/schemas/Gasto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El proyecto o la categoría no existe
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

/**
 * @swagger
 * /api/gastos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un gasto
 *     tags: [Gastos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GastoEntrada'
 *     responses:
 *       200:
 *         description: Gasto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Gasto actualizado correctamente
 *                 gasto:
 *                   $ref: '#/components/schemas/Gasto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El gasto, el proyecto o la categoría no existe
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

/**
 * @swagger
 * /api/gastos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un gasto
 *     tags: [Gastos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Gasto eliminado correctamente
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
            .withMessage("El ID del gasto debe ser un número entero positivo")
    ],
    eliminarGasto
);

export default router;
