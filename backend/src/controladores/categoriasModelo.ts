
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Categoria } from "../modelos/categoriaModelo.js";

// Registrar una nueva categoría
export const crearCategoria = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        // Obtener los datos enviados desde Postman
        const { nombre, descripcion } = req.body;

        // Verificar si la categoría ya existe
        const categoriaExistente = await Categoria.findOne({
            where: { nombre }
        });

        if (categoriaExistente) {
            return res.status(409).json({
                mensaje: "Ya existe una categoría con ese nombre"
            });
        }

        // Registrar la categoría
        const categoria = await Categoria.create({
            nombre,
            descripcion: descripcion ?? null
        });

        return res.status(201).json({
            mensaje: "Categoría registrada correctamente",
            categoria
        });

    } catch (error) {
        console.error("Error al registrar categoría:", error);

        return res.status(500).json({
            mensaje: "Error al registrar la categoría"
        });
    }
};


// Consultar todas las categorías registradas
export const consultarCategorias = async (
    req: Request,
    res: Response
) => {
    try {
        // Consultar las categorías en MySQL
        const categorias = await Categoria.findAll();

        return res.status(200).json({
            categorias
        });

    } catch (error) {
        console.error("Error al consultar categorías:", error);

        return res.status(500).json({
            mensaje: "Error al consultar las categorías"
        });
    }
};


// Eliminar una categoría por su ID
export const eliminarCategoria = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        // Obtener el ID de la categoría
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID de la categoría debe ser válido"
            });
        }

        // Buscar la categoría
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "La categoría no existe"
            });
        }

        // Eliminar la categoría
        await categoria.destroy();

        return res.status(200).json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar categoría:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
};

// Actualizar una categoría existente
export const actualizarCategoria = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        // Obtener el ID de la categoría
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID de la categoría debe ser válido"
            });
        }

        // Obtener los datos enviados desde Postman
        const { nombre, descripcion } = req.body;

        // Buscar la categoría que queremos actualizar
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "La categoría no existe"
            });
        }

        // Verificar si el nuevo nombre ya pertenece a otra categoría
        const categoriaExistente = await Categoria.findOne({
            where: { nombre }
        });

        if (categoriaExistente && categoriaExistente.id !== id) {
            return res.status(409).json({
                mensaje: "Ya existe otra categoría con ese nombre"
            });
        }

        // Actualizar la categoría
        await categoria.update({
            nombre,
            descripcion: descripcion ?? null
        });

        return res.status(200).json({
            mensaje: "Categoría actualizada correctamente",
            categoria
        });

    } catch (error) {
        console.error("Error al actualizar categoría:", error);

        return res.status(500).json({
            mensaje: "Error al actualizar la categoría"
        });
    }
};



