
import { Router } from "express";
import {
	consultarProyectos,
	buscarProyecto,
	crearProyecto,
	actualizarProyecto
} from "../controladores/proyectosModelos.js";

const router = Router();

// Consultar todos los proyectos
router.get("/", consultarProyectos);

//Buscar un proyecto por nombre
router.get("/buscar", buscarProyecto);

// Registrar un proyecto
router.post("/", crearProyecto);

// Actualizar un proyecto por ID
router.put("/:id", actualizarProyecto);

export default router;
