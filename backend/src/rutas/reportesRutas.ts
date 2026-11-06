
/**
 * Rutas de reportes y estadísticas.
 * Prefijo: /api/reportes
 *
 * Devuelven totales ya calculados (presupuestos, gastos y saldos) para
 * alimentar las tarjetas, tablas y gráficos del frontend en React.
 */

import { Router } from "express";
import { query, param } from "express-validator";

import {
    consultarResumenGeneral,
    consultarTotalesPorProyecto,
    consultarResumenProyecto,
    consultarGastosPorCategoria,
    consultarCategoriasDeProyecto,
    consultarGastosMensuales
} from "../controladores/reportesControlador.js";
import { verificarToken } from "../seguridad/verificarToken.js";

const router = Router();
router.use(verificarToken);

/**
 * Validaciones del rango de fechas.
 * Ambas son opcionales; si se envían deben ser fechas válidas y `hasta`
 * no puede ser anterior a `desde`.
 */
const validarFechas = [
    query("desde")
        .optional({ values: "falsy" })
        .isISO8601({ strict: true })
        .withMessage("La fecha inicial debe tener el formato AAAA-MM-DD"),

    query("hasta")
        .optional({ values: "falsy" })
        .isISO8601({ strict: true })
        .withMessage("La fecha final debe tener el formato AAAA-MM-DD")
        .custom((valor, { req }) => {
            const desde = req.query?.desde;

            if (desde && valor < desde) {
                throw new Error("La fecha final no puede ser anterior a la inicial");
            }

            return true;
        })
];

/** Validación del filtro opcional por proyecto. */
const validarProyectoOpcional = query("proyecto_id")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("El ID del proyecto debe ser un número entero positivo");

/** Validación del filtro opcional por categoría. */
const validarCategoriaOpcional = query("categoria_id")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("El ID de la categoría debe ser un número entero positivo");

/**
 * @swagger
 * /api/reportes/resumen:
 *   get:
 *     summary: Resumen general de presupuestos, gastos y saldos
 *     description: >
 *       Totales acumulados de toda la aplicación. Las fechas filtran únicamente
 *       los gastos; los presupuestos siempre son el total vigente.
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *     responses:
 *       200:
 *         description: Resumen general calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumen:
 *                   $ref: '#/components/schemas/ResumenGeneral'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/resumen", validarFechas, consultarResumenGeneral);

/**
 * @swagger
 * /api/reportes/proyectos:
 *   get:
 *     summary: Totales de presupuesto, gasto y saldo de cada proyecto
 *     description: >
 *       Devuelve una fila por proyecto. Los proyectos sin gastos aparecen con
 *       los totales en cero, no se omiten de la lista.
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *     responses:
 *       200:
 *         description: Lista de proyectos con sus totales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proyectos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ResumenProyecto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/proyectos", validarFechas, consultarTotalesPorProyecto);

/**
 * @swagger
 * /api/reportes/proyectos/{id}:
 *   get:
 *     summary: Presupuesto utilizado y saldo disponible de un proyecto
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *     responses:
 *       200:
 *         description: Totales del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumen:
 *                   $ref: '#/components/schemas/ResumenProyecto'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El proyecto no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/proyectos/:id",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo"),
        ...validarFechas
    ],
    consultarResumenProyecto
);

/**
 * @swagger
 * /api/reportes/proyectos/{id}/categorias:
 *   get:
 *     summary: Presupuestado contra gastado por categoría dentro de un proyecto
 *     description: >
 *       Solo aparecen las categorías que tienen presupuesto aprobado o gastos
 *       registrados en el rango consultado.
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdRuta'
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *     responses:
 *       200:
 *         description: Totales por categoría del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proyecto_id:
 *                   type: integer
 *                   example: 1
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TotalPorCategoria'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       404:
 *         description: El proyecto no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/proyectos/:id/categorias",
    [
        param("id")
            .isInt({ min: 1 })
            .withMessage("El ID del proyecto debe ser un número entero positivo"),
        ...validarFechas
    ],
    consultarCategoriasDeProyecto
);

/**
 * @swagger
 * /api/reportes/categorias:
 *   get:
 *     summary: Presupuestado contra gastado por categoría
 *     description: >
 *       Totales de todas las categorías, o de un solo proyecto si se envía
 *       `proyecto_id`. Pensado para el gráfico de distribución del gasto.
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ProyectoIdQuery'
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *     responses:
 *       200:
 *         description: Totales por categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TotalPorCategoria'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/categorias",
    [validarProyectoOpcional, ...validarFechas],
    consultarGastosPorCategoria
);

/**
 * @swagger
 * /api/reportes/gastos/mensual:
 *   get:
 *     summary: Evolución mensual de los gastos
 *     description: >
 *       Una fila por mes con registros, con la etiqueta "AAAA-MM" ya armada
 *       para usarla como eje X en los gráficos de línea.
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ProyectoIdQuery'
 *       - $ref: '#/components/parameters/CategoriaIdQuery'
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *     responses:
 *       200:
 *         description: Totales mensuales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TotalMensual'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get(
    "/gastos/mensual",
    [validarProyectoOpcional, validarCategoriaOpcional, ...validarFechas],
    consultarGastosMensuales
);

export default router;
