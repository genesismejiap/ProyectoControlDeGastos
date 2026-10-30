
/**
 * Rutas de categorías.
 * Prefijo: /api/categorias
 */

import { Router } from "express";
import { body, param } from "express-validator";

import { crearCategoria, consultarCategorias, eliminarCategoria, actualizarCategoria } from "../controladores/categoriasModelo.js";

const router = Router();

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Consultar todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Categoria'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", consultarCategorias);

/**
 * @swagger
 * /api/categorias/guardar:
 *   post:
 *     summary: Registrar una nueva categoría
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaEntrada'
 *     responses:
 *       201:
 *         description: Categoría registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Categoría registrada correctamente
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       409:
 *         description: Ya existe una categoría con ese nombre
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
        body("nombre")
            .trim()
            .notEmpty()
            .withMessage("El nombre de la categoría es obligatorio")
            .isLength({ max: 100 })
            .withMessage("El nombre no debe superar los 100 caracteres"),

        body("descripcion")
            .optional({ nullable: true })
            .isString()
            .withMessage("La descripción debe ser un texto")
    ],
    crearCategoria
);

/**
 * @swagger
 * /api/categorias/eliminar/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
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
            .withMessage("El ID de la categoría debe ser un número entero positivo")
    ],
    eliminarCategoria
);

/**
 * @swagger
 * /api/categorias/actualizar/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaEntrada'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Categoría actualizada correctamente
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         description: Ya existe otra categoría con ese nombre
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
            .withMessage("El ID de la categoría debe ser válido"),

        body("nombre")
            .trim()
            .notEmpty()
            .withMessage("El nombre de la categoría es obligatorio")
            .isLength({ max: 100 })
            .withMessage("El nombre no debe superar los 100 caracteres"),

        body("descripcion")
            .optional({ nullable: true })
            .isString()
            .withMessage("La descripción debe ser un texto")
    ],
    actualizarCategoria
);

export default router;
