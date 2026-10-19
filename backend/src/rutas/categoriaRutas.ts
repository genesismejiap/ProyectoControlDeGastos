
import { Router } from "express";
import { body, param } from "express-validator";

import { crearCategoria, consultarCategorias, eliminarCategoria, actualizarCategoria } from "../controladores/categoriasModelo.js";

const router = Router();

// Ruta para consultar todas las categorías
router.get("/", consultarCategorias);

// Ruta para registrar una nueva categoría
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

// Ruta para eliminar una categoría
router.delete(
    "/eliminar/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID de la categoría debe ser un número entero positivo")
    ],
    eliminarCategoria
);

// Ruta para actualizar una categoría
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
