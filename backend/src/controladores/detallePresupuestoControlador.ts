
/**
 * Controladores de detalles de presupuesto (CRUD).
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { DetallePresupuesto } from "../modelos/detallePresupuestoModelo.js";
import { Presupuesto } from "../modelos/presupuestoModelo.js";
import { Categoria } from "../modelos/categoriaModelo.js";

/**
 * Registra un detalle (entregable) dentro de un presupuesto.
 * La categoría se recibe por nombre y se convierte a su ID.
 *
 * Body: { presupuesto_id, categoria, entregable, cantidad, precio_unitario }
 * Respuestas: 201 creado · 400 validación · 404 presupuesto o categoría inexistente · 500 error
 */
export const crearDetallePresupuesto = async (
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
        const {
            presupuesto_id,
            categoria,
            entregable,
            cantidad,
            precio_unitario
        } = req.body;

        // Verificar que el presupuesto exista
        const presupuesto = await Presupuesto.findByPk(presupuesto_id);

        if (!presupuesto) {
            return res.status(404).json({
                mensaje: "El presupuesto no existe"
            });
        }

      
// Buscar la categoría por su nombre
const categoriaEncontrada = await Categoria.findOne({
    where: {
        nombre: categoria
    }
});

if (!categoriaEncontrada) {
    return res.status(404).json({
        mensaje: "La categoría no existe"
    });
}


        // Registrar el detalle con Sequelize
       
const detalle = await DetallePresupuesto.create({
    presupuesto_id,
    categoria_id: categoriaEncontrada.id,
    entregable,
    cantidad,
    precio_unitario
});


        return res.status(201).json({
            mensaje: "Detalle de presupuesto registrado correctamente",
            detalle
        });

    } catch (error) {
        console.error("Error al registrar detalle:", error);

        return res.status(500).json({
            mensaje: "Error al registrar el detalle de presupuesto"
        });
    }
};

/**
 * Devuelve todos los detalles de presupuestos.
 *
 * Respuestas: 200 { detalles } · 500 error
 */
export const consultarDetallesPresupuesto = async (
    req: Request,
    res: Response
) => {
    try {
        const detalles = await DetallePresupuesto.findAll();

        return res.status(200).json({
            detalles
        });

    } catch (error) {
        console.error("Error al consultar detalles:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los detalles de presupuestos"
        });
    }
};

/**
 * Actualiza un detalle de presupuesto existente.
 *
 * Params: id · Body: { presupuesto_id, categoria, entregable, cantidad, precio_unitario }
 * Respuestas: 200 actualizado · 400 validación · 404 detalle, presupuesto o categoría inexistente · 500 error
 */
export const actualizarDetallePresupuesto = async (
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

        // Obtener el ID del detalle
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del detalle debe ser válido"
            });
        }

        const {
            presupuesto_id,
            categoria,
            entregable,
            cantidad,
            precio_unitario
        } = req.body;

        // Buscar el detalle que queremos actualizar
        const detalle = await DetallePresupuesto.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: "El detalle de presupuesto no existe"
            });
        }

        // Verificar que el presupuesto exista
        const presupuesto = await Presupuesto.findByPk(presupuesto_id);

        if (!presupuesto) {
            return res.status(404).json({
                mensaje: "El presupuesto no existe"
            });
        }

        // Buscar la categoría por su nombre
        const categoriaEncontrada = await Categoria.findOne({
            where: {
                nombre: categoria
            }
        });

        if (!categoriaEncontrada) {
            return res.status(404).json({
                mensaje: "La categoría no existe"
            });
        }

        // Actualizar el detalle
        await detalle.update({
            presupuesto_id,
            categoria_id: categoriaEncontrada.id,
            entregable,
            cantidad,
            precio_unitario
        });

        return res.status(200).json({
            mensaje: "Detalle de presupuesto actualizado correctamente",
            detalle
        });

    } catch (error) {
        console.error("Error al actualizar detalle:", error);

        return res.status(500).json({
            mensaje: "Error al actualizar el detalle de presupuesto"
        });
    }
};

/**
 * Elimina un detalle de presupuesto por su ID.
 *
 * Params: id
 * Respuestas: 200 eliminado · 400 ID inválido · 404 no existe · 500 error
 */
export const eliminarDetallePresupuesto = async (
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

        // Obtener el ID del detalle
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del detalle debe ser válido"
            });
        }

        // Buscar el detalle en la base de datos
        const detalle = await DetallePresupuesto.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: "El detalle de presupuesto no existe"
            });
        }

        // Eliminar el detalle
        await detalle.destroy();

        return res.status(200).json({
            mensaje: "Detalle de presupuesto eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar detalle:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar el detalle de presupuesto"
        });
    }
};

