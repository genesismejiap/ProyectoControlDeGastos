
/**
 * Rutas de proyectos.
 * Prefijo: /api/proyectos
 */

import { Router } from "express";
import { body, param, query } from "express-validator";
import {
	consultarProyectos,
	buscarProyecto,
	crearProyecto,
	actualizarProyecto,
	eliminarProyecto
} from "../controladores/proyectosModelos.js";

const router = Router();

// Validaciones compartidas para registrar y actualizar un proyecto
const validacionesProyecto = [
    body("nombre")
        .isString()
        .withMessage("El nombre del proyecto debe ser un texto")
        .trim()
        .notEmpty()
        .withMessage("El nombre del proyecto es obligatorio")
        .isLength({ max: 150 })
        .withMessage("El nombre no debe superar los 150 caracteres"),

    body("descripcion")
        .optional({ nullable: true })
        .isString()
        .withMessage("La descripción debe ser un texto"),

    body("ubicacion")
        .optional({ nullable: true })
        .isString()
        .withMessage("La ubicación debe ser un texto")
        .isLength({ max: 150 })
        .withMessage("La ubicación no debe superar los 150 caracteres"),

    body("presupuesto")
        .notEmpty()
        .withMessage("El presupuesto es obligatorio")
        .isFloat({ min: 0 })
        .withMessage("El presupuesto debe ser un número mayor o igual a cero")
        .toFloat(),

    body("fecha_inicio")
        .optional({ nullable: true })
        .isISO8601({ strict: true })
        .withMessage("La fecha de inicio debe ser válida"),

    body("fecha_fin")
        .optional({ nullable: true })
        .isISO8601({ strict: true })
        .withMessage("La fecha de fin debe ser válida")
        .custom((fechaFin, { req }) => {
            const fechaInicio = req.body.fecha_inicio;

            if (fechaInicio && new Date(fechaFin) < new Date(fechaInicio)) {
                throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
            }

            return true;
        })
];


/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Consultar todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proyectos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proyecto'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", consultarProyectos);


/**
 * @swagger
 * /api/proyectos/buscar:
 *   get:
 *     summary: Buscar proyectos por nombre
 *     description: Búsqueda parcial (contiene el texto indicado).
 *     tags: [Proyectos]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         description: Texto a buscar dentro del nombre del proyecto
 *         schema:
 *           type: string
 *           example: bodega
 *     responses:
 *       200:
 *         description: Proyectos que coinciden con la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/buscar",
    [
        query("nombre")
            .isString()
            .withMessage("El nombre del proyecto debe ser un texto")
            .trim()
            .notEmpty()
            .withMessage("Debes ingresar el nombre del proyecto")
    ],
    buscarProyecto
);


/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Registrar un nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProyectoEntrada'
 *     responses:
 *       201:
 *         description: Proyecto registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Proyecto registrado correctamente
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/", validacionesProyecto, crearProyecto);


/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProyectoEntrada'
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Proyecto actualizado correctamente
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
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
router.put(
    "/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo"),
        ...validacionesProyecto
    ],
    actualizarProyecto
);

router.delete(
    "/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo")
    ],
    eliminarProyecto
);
export default router;
