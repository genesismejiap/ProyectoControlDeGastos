

//PARTE POST
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { db } from "../configuraciones/db.js";

// Función para registrar un proyecto
export const crearProyecto = async (
    req: Request,
    res: Response
) => {
    try {
        // Recibir los datos enviados desde Postman
        const {
            nombre,
            descripcion,
            ubicacion,
            presupuesto,
            fecha_inicio,
            fecha_fin
        } = req.body;

        // Validar los campos obligatorios
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

        // Insertar el proyecto en MySQL
        const [resultado] = await db.execute<ResultSetHeader>(
            `INSERT INTO proyectos
            (nombre, descripcion, ubicacion, presupuesto, fecha_inicio, fecha_fin)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nombre.trim(),
                descripcion ?? null,
                ubicacion ?? null,
                presupuesto,
                fecha_inicio ?? null,
                fecha_fin ?? null
            ]
        );

        // Respuesta al registrar el proyecto
        res.status(201).json({
            mensaje: "Proyecto registrado correctamente",
            id: resultado.insertId
        });

    } catch (error) {
        console.error("Error al registrar proyecto:", error);

        res.status(500).json({
            mensaje: "Error al registrar el proyecto"
        });
    }
};
