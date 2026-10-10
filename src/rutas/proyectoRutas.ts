
import { Router } from "express";
import {
	consultarProyectos,
	buscarProyecto,
	crearProyecto
} from "../controladores/proyectosModelos.js";

const router = Router();

// Consultar todos los proyectos
router.get("/", consultarProyectos);

//Buscar un proyecto por nombre
router.get("/buscar", buscarProyecto);

// Registrar un proyecto
router.post("/", crearProyecto);

export default router;
