
import { Router } from "express";
import { crearProyecto } from "../controladores/proyectosModelos.js";

const router = Router();

// Registrar un proyecto
router.post("/", crearProyecto);

export default router;
