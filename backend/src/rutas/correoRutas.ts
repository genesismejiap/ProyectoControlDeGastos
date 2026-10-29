
import { Router } from "express";
import { enviarCorreo } from "../controladores/correoControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";

const router = Router();

// Enviar correos solo si el usuario inició sesión
router.post("/enviar", verificarToken, enviarCorreo);

export default router;
