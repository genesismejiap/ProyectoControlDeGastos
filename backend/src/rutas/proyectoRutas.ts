
import { Router } from "express";
import { body, param, query } from "express-validator";
import {
	consultarProyectos,
	buscarProyecto,
	crearProyecto,
	actualizarProyecto,
	eliminarProyecto
} from "../controladores/proyectosModelos.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

// Validaciones compartidas para registrar y actualizar un proyecto
const validacionesProyecto = [
    body("nombre")
        .isString()
        .withMessage("El nombre del proyecto debe ser un texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("El nombre del proyecto es obligatorio")
        .isLength({ max: 150 })
        .withMessage("El nombre no debe superar los 150 caracteres"),

    body("descripcion")
        .optional({ nullable: true })
        .isString()
        .withMessage("La descripción debe ser un texto"),

    body("ubicacion")
        .optional({ nullable: true })
        .isString()
        .withMessage("La ubicación debe ser un texto")
        .isLength({ max: 150 })
        .withMessage("La ubicación no debe superar los 150 caracteres"),

    body("presupuesto")
        .notEmpty()
        .withMessage("El presupuesto es obligatorio")
        .isFloat({ min: 0, max: 9999999999.99 })
        .withMessage("El presupuesto debe estar entre 0 y 9999999999.99")
        .toFloat(),

    body("fecha_inicio")
        .optional({ nullable: true })
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("La fecha de inicio debe tener el formato AAAA-MM-DD")
        .bail()
        .isISO8601({ strict: true })
        .withMessage("La fecha de inicio debe ser válida"),

    body("fecha_fin")
        .optional({ nullable: true })
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("La fecha de fin debe tener el formato AAAA-MM-DD")
        .bail()
        .isISO8601({ strict: true })
        .withMessage("La fecha de fin debe ser válida")
        .custom((fechaFin, { req }) => {
            const fechaInicio = req.body.fecha_inicio;

            if (fechaInicio && new Date(fechaFin) < new Date(fechaInicio)) {
                throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
            }

            return true;
        })
];


router.get("/", consultarProyectos);


router.get(
    "/buscar",
    [
        query("nombre")
            .isString()
            .withMessage("El nombre del proyecto debe ser un texto")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("Debes ingresar el nombre del proyecto")
    ],
    validarCampos,
    buscarProyecto
);


router.post("/", validacionesProyecto, validarCampos, crearProyecto);


router.put(
    "/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo")
            .toInt(),
        ...validacionesProyecto
    ],
    validarCampos,
    actualizarProyecto
);

router.delete(
    "/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo")
            .toInt()
    ],
    validarCampos,
    eliminarProyecto
);
export default router;
