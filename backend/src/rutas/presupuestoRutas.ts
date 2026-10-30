
/**
 * Rutas de presupuestos.
 * Prefijo: /api/presupuestos
 */

import { Router } from "express";
import { body,param } from "express-validator";

import { crearPresupuesto,
     consultarPresupuestos,
     actualizarPresupuesto,
    eliminarPresupuesto
 } from "../controladores/presupuestoControlador.js";

const router = Router();


/**
 * @swagger
 * /api/presupuestos:
 *   get:
 *     summary: Consultar todos los presupuestos
 *     tags: [Presupuestos]
 *     responses:
 *       200:
 *         description: Lista de presupuestos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presupuestos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Presupuesto'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", consultarPresupuestos);


/**
 * @swagger
 * /api/presupuestos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un presupuesto
 *     description: En la actualización el campo `estado` es obligatorio.
 *     tags: [Presupuestos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/PresupuestoEntrada'
 *               - required: [estado]
 *     responses:
 *       200:
 *         description: Presupuesto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Presupuesto actualizado correctamente
 *                 presupuesto:
 *                   $ref: '#/components/schemas/Presupuesto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El presupuesto o el proyecto no existe
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


/**
 * @swagger
 * /api/presupuestos/guardar:
 *   post:
 *     summary: Registrar un nuevo presupuesto
 *     description: Si no se envía `estado`, se guarda como "Borrador".
 *     tags: [Presupuestos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresupuestoEntrada'
 *     responses:
 *       201:
 *         description: Presupuesto registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Presupuesto registrado correctamente
 *                 presupuesto:
 *                   $ref: '#/components/schemas/Presupuesto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El proyecto no existe
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


/**
 * @swagger
 * /api/presupuestos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un presupuesto
 *     tags: [Presupuestos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Presupuesto eliminado correctamente
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
            .withMessage("El ID del presupuesto debe ser un número entero positivo")
    ],
    eliminarPresupuesto
);


export default router;
