
import { Router } from "express";
import {
	consultarProyectos,
	crearProyecto
} from "../controladores/proyectosModelos.js";

const router = Router();

// Consultar todos los proyectos
router.get("/", consultarProyectos);

// Registrar un proyecto
router.post("/", crearProyecto);

export default router;
