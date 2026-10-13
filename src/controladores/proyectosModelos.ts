

//PARTE POST
import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../configuraciones/db.js";

// Función get para consultar todos los proyectos
export const consultarProyectos = async (
    req: Request,
    res: Response
) => {
    try {
        const [proyectos] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM proyectos"
        );

        res.status(200).json({ proyectos });

    } catch (error) {
        console.error("Error al consultar proyectos:", error);

        res.status(500).json({
            mensaje: "Error al consultar los proyectos"
        });
    }
};


//Funcion para buscar un proyecto por nombre
export const buscarProyecto = async (
    req: Request,
    res: Response
) => {
    try {
        // Obtener el nombre enviado desde Postman
        const { nombre } = req.query;

        // Validar que se haya enviado un nombre
        if (typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({
                mensaje: "Debes ingresar el nombre del proyecto"
            });
        }

        // Buscar proyectos en MySQL
        const [proyectos] = await db.query(
            "SELECT * FROM proyectos WHERE nombre LIKE ?",
            [`%${nombre.trim()}%`]
        );

        // Verificar si se encontraron proyectos
        const resultados = proyectos as import("mysql2").RowDataPacket[];

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron proyectos con ese nombre"
            });
        }

        // Mostrar los proyectos encontrados
        res.status(200).json(resultados);

    } catch (error) {
        console.error("Error al buscar proyectos:", error);

        res.status(500).json({
            mensaje: "Error al buscar los proyectos"
        });
    }
};

// Función para actualizar un proyecto por su ID
export const actualizarProyecto = async (
    req: Request,
    res: Response
) => {
    try {
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

        const [resultado] = await db.execute<ResultSetHeader>(
            `UPDATE proyectos
            SET nombre = ?, descripcion = ?, ubicacion = ?, presupuesto = ?, fecha_inicio = ?, fecha_fin = ?
            WHERE id = ?`,
            [
                nombre.trim(),
                descripcion ?? null,
                ubicacion ?? null,
                presupuestoValidado,
                fecha_inicio ?? null,
                fecha_fin ?? null,
                proyectoId
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Proyecto no encontrado"
            });
        }

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
