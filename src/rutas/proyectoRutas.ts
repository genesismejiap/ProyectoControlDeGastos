
import { Router } from "express";
import {
	consultarProyectos,
	buscarProyecto,
	crearProyecto,
	actualizarProyecto,
	eliminarProyecto
} from "../controladores/proyectosModelos.js";

const router = Router();


router.get("/", consultarProyectos);


router.get("/buscar", buscarProyecto);


router.post("/", crearProyecto);


router.put("/:id", actualizarProyecto);

router.delete("/:id", eliminarProyecto);
export default router;
