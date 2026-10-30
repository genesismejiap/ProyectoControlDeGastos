
/**
 * Controladores de proyectos (CRUD y búsqueda por nombre).
 */

import { Request, Response } from "express";
import { Op } from "sequelize";
import { validationResult } from "express-validator";
import { Proyecto } from "../modelos/proyectoModelo.js";


/**
 * Devuelve todos los proyectos.
 *
 * Respuestas: 200 { proyectos } · 500 error
 */
export const consultarProyectos = async (
    req: Request,
    res: Response
) => {
    try {
        const proyectos = await Proyecto.findAll();

        res.status(200).json({ proyectos });

    } catch (error) {
        console.error("Error al consultar proyectos:", error);

        res.status(500).json({
            mensaje: "Error al consultar los proyectos"
        });
    }
};


/**
 * Busca proyectos cuyo nombre contenga el texto indicado (LIKE %nombre%).
 *
 * Query: nombre
 * Respuestas: 200 arreglo de proyectos · 400 nombre vacío · 404 sin coincidencias · 500 error
 */
export const buscarProyecto = async (
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

        const { nombre } = req.query;

        if (typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({
                mensaje: "Debes ingresar el nombre del proyecto"
            });
        }

        const proyectos = await Proyecto.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${nombre.trim()}%`
                }
            }
        });

        if (proyectos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron proyectos con ese nombre"
            });
        }

        res.status(200).json(proyectos);

    } catch (error) {
        console.error("Error al buscar proyectos:", error);

        res.status(500).json({
            mensaje: "Error al buscar los proyectos"
        });
    }
};


/**
 * Actualiza todos los datos de un proyecto.
 * Los campos opcionales que no se envíen quedan en null.
 *
 * Params: id · Body: { nombre, presupuesto, descripcion?, ubicacion?, fecha_inicio?, fecha_fin? }
 * Respuestas: 200 { mensaje, id } · 400 validación · 404 no existe · 500 error
 */
export const actualizarProyecto = async (
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

        const { id } = req.params;
        const proyectoId = Number(id);

        if (!Number.isInteger(proyectoId) || proyectoId <= 0) {
            return res.status(400).json({
                mensaje: "El ID del proyecto es inválido"
            });
        }

        const {
            nombre,
            descripcion,
            ubicacion,
            presupuesto,
            fecha_inicio,
            fecha_fin
        } = req.body;

        const presupuestoValidado = Number(presupuesto);

        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            !Number.isFinite(presupuestoValidado) ||
            presupuestoValidado < 0
        ) {
            return res.status(400).json({
                mensaje: "El nombre y el presupuesto son obligatorios y deben ser válidos"
            });
        }

        const proyecto = await Proyecto.findByPk(proyectoId);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "Proyecto no encontrado"
            });
        }

        await proyecto.update({
            nombre: nombre.trim(),
            descripcion: descripcion ?? null,
            ubicacion: ubicacion ?? null,
            presupuesto: presupuestoValidado,
            fecha_inicio: fecha_inicio ?? null,
            fecha_fin: fecha_fin ?? null
        });

        res.status(200).json({
            mensaje: "Proyecto actualizado correctamente",
            id: proyectoId
        });

    } catch (error) {
        console.error("Error al actualizar proyecto:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el proyecto"
        });
    }
};


/**
 * Registra un nuevo proyecto.
 *
 * Body: { nombre, presupuesto, descripcion?, ubicacion?, fecha_inicio?, fecha_fin? }
 * Respuestas: 201 { mensaje, id } · 400 validación · 500 error
 */
export const crearProyecto = async (
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

        const {
            nombre,
            descripcion,
            ubicacion,
            presupuesto,
            fecha_inicio,
            fecha_fin
        } = req.body;

        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            typeof presupuesto !== "number" ||
            !Number.isFinite(presupuesto) ||
            presupuesto < 0
        ) {
            return res.status(400).json({
                mensaje: "El nombre y el presupuesto son obligatorios y deben ser válidos"
            });
        }

        const proyecto = await Proyecto.create({
            nombre: nombre.trim(),
            descripcion: descripcion ?? null,
            ubicacion: ubicacion ?? null,
            presupuesto,
            fecha_inicio: fecha_inicio ?? null,
            fecha_fin: fecha_fin ?? null
        });

        res.status(201).json({
            mensaje: "Proyecto registrado correctamente",
            id: proyecto.get("id")
        });

    } catch (error) {
        console.error("Error al registrar proyecto:", error);

        res.status(500).json({
            mensaje: "Error al registrar el proyecto"
        });
    }
};


/**
 * Elimina un proyecto por su ID.
 *
 * Params: id
 * Respuestas: 200 eliminado · 400 ID inválido · 404 no existe · 500 error
 */
export const eliminarProyecto = async (
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

        const { id } = req.params;
        const proyectoId = Number(id);

        if (!Number.isInteger(proyectoId) || proyectoId <= 0) {
            return res.status(400).json({
                mensaje: "El ID del proyecto es inválido"
            });
        }

        const proyecto = await Proyecto.findByPk(proyectoId);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "Proyecto no encontrado"
            });
        }

        await proyecto.destroy();

        res.status(200).json({
            mensaje: "Proyecto eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar proyecto:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el proyecto"
        });
    }
};
