
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Gasto } from "../modelos/gastoModelo.js";
import { Proyecto } from "../modelos/proyectoModelo.js";
import { Categoria } from "../modelos/categoriaModelo.js";

// Registrar un nuevo gasto
export const crearGasto = async (
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
        const {
            proyecto_id,
            categoria,
            descripcion,
            monto,
            fecha
        } = req.body;

        // Verificar que el proyecto exista
        const proyecto = await Proyecto.findByPk(proyecto_id);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "El proyecto no existe"
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

        // Registrar el gasto utilizando Sequelize
        const gasto = await Gasto.create({
            proyecto_id,
            categoria_id: categoriaEncontrada.id,
            descripcion,
            monto,
            fecha
        });

        return res.status(201).json({
            mensaje: "Gasto registrado correctamente",
            gasto
        });

    } catch (error) {
        console.error("Error al registrar gasto:", error);

        return res.status(500).json({
            mensaje: "Error al registrar el gasto"
        });
    }
};

// Consultar todos los gastos registrados
export const consultarGastos = async (
    req: Request,
    res: Response
) => {
    try {
        // Consultar todos los gastos en MySQL
        const gastos = await Gasto.findAll();

        return res.status(200).json({
            gastos
        });

    } catch (error) {
        console.error("Error al consultar gastos:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los gastos"
        });
    }
};

// Actualizar un gasto existente
export const actualizarGasto = async (
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

        // Obtener el ID del gasto
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del gasto debe ser válido"
            });
        }

        // Obtener los datos enviados desde Postman
        const {
            proyecto_id,
            categoria,
            descripcion,
            monto,
            fecha
        } = req.body;

        // Buscar el gasto
        const gasto = await Gasto.findByPk(id);

        if (!gasto) {
            return res.status(404).json({
                mensaje: "El gasto no existe"
            });
        }

        // Verificar que el proyecto exista
        const proyecto = await Proyecto.findByPk(proyecto_id);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "El proyecto no existe"
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

        // Actualizar el gasto
        await gasto.update({
            proyecto_id,
            categoria_id: categoriaEncontrada.id,
            descripcion,
            monto,
            fecha
        });

        return res.status(200).json({
            mensaje: "Gasto actualizado correctamente",
            gasto
        });

    } catch (error) {
        console.error("Error al actualizar gasto:", error);

        return res.status(500).json({
            mensaje: "Error al actualizar el gasto"
        });
    }
};

// Eliminar un gasto por su ID
export const eliminarGasto = async (
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

        // Obtener el ID del gasto
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del gasto debe ser un número entero positivo"
            });
        }

        // Buscar el gasto en MySQL
        const gasto = await Gasto.findByPk(id);

        if (!gasto) {
            return res.status(404).json({
                mensaje: "El gasto no existe"
            });
        }

        // Eliminar el gasto
        await gasto.destroy();

        return res.status(200).json({
            mensaje: "Gasto eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar gasto:", error);

        return res.status(500).json({
            mensaje: "Error al eliminar el gasto"
        });
    }
};


