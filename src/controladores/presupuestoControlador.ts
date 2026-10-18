
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { Presupuesto } from "../modelos/presupuestoModelo.js";
import { Proyecto } from "../modelos/proyectoModelo.js";

// Registrar un nuevo presupuesto
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
