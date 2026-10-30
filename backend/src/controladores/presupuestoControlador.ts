
/**
 * Controladores de presupuestos (CRUD).
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Presupuesto } from "../modelos/presupuestoModelo.js";
import { Proyecto } from "../modelos/proyectoModelo.js";

/**
 * Registra un presupuesto para un proyecto. Si no se envía estado, queda como "Borrador".
 *
 * Body: { proyecto_id, fecha, estado? }
 * Respuestas: 201 creado · 400 validación · 404 proyecto inexistente · 500 error
 */
export const crearPresupuesto = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        // Obtener los datos enviados desde Postman
        const { proyecto_id, fecha, estado } = req.body;

        // Verificar que el proyecto exista
        const proyecto = await Proyecto.findByPk(proyecto_id);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "El proyecto no existe"
            });
        }

        // Registrar el presupuesto con Sequelize
        const presupuesto = await Presupuesto.create({
            proyecto_id,
            fecha,
            estado: estado ?? "Borrador"
        });

        return res.status(201).json({
            mensaje: "Presupuesto registrado correctamente",
            presupuesto
        });

    } catch (error) {
        console.error("Error al registrar presupuesto:", error);

        return res.status(500).json({
            mensaje: "Error al registrar el presupuesto"
        });
    }
};


/**
 * Devuelve todos los presupuestos.
 *
 * Respuestas: 200 { presupuestos } · 500 error
 */
export const consultarPresupuestos = async (
    req: Request,
    res: Response
) => {
    try {
        const presupuestos = await Presupuesto.findAll();

        return res.status(200).json({
            presupuestos
        });

    } catch (error) {
        console.error("Error al consultar presupuestos:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los presupuestos"
        });
    }
};



/**
 * Actualiza un presupuesto existente.
 *
 * Params: id · Body: { proyecto_id, fecha, estado }
 * Respuestas: 200 actualizado · 400 validación · 404 presupuesto o proyecto inexistente · 500 error
 */
export const actualizarPresupuesto = async (
    req: Request,
    res: Response
) => {
    try {
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const id = Number(req.params.id);

        // Validar que el ID sea un número entero positivo
if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        mensaje: "El ID del presupuesto debe ser un número entero positivo"
    });
}

        const { proyecto_id, fecha, estado } = req.body;

        // Buscar el presupuesto
        const presupuesto = await Presupuesto.findByPk(id);

        if (!presupuesto) {
            return res.status(404).json({
                mensaje: "El presupuesto no existe"
            });
        }

        // Verificar que el proyecto exista
        const proyecto = await Proyecto.findByPk(proyecto_id);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "El proyecto no existe"
            });
        }

        // Actualizar los datos
        await presupuesto.update({
            proyecto_id,
            fecha,
            estado
        });

        return res.status(200).json({
            mensaje: "Presupuesto actualizado correctamente",
            presupuesto
        });

    } catch (error) {
        console.error("Error al actualizar presupuesto:", error);

        return res.status(500).json({
            mensaje: "Error al actualizar el presupuesto"
        });
    }
};



/**
 * Elimina un presupuesto por su ID.
 *
 * Params: id
 * Respuestas: 200 eliminado · 400 ID inválido · 404 no existe · 500 error
 */
export const eliminarPresupuesto = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        // Obtener el ID del presupuesto
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del presupuesto debe ser válido"
            });
        }

        // Buscar el presupuesto
        const presupuesto = await Presupuesto.findByPk(id);

        if (!presupuesto) {
            return res.status(404).json({
                mensaje: "El presupuesto no existe"
            });
        }

        // Eliminar el presupuesto
        await presupuesto.destroy();

        return res.status(200).json({
            mensaje: "Presupuesto eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar presupuesto:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar el presupuesto"
        });
    }
};

