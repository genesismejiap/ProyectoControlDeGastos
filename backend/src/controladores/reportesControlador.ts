
/**
 * Controladores de reportes y estadísticas.
 *
 * Todas las consultas se escriben en SQL con `db.query` y `replacements`
 * (nunca concatenando valores del usuario) y agregan en subconsultas separadas:
 * si se unieran `gastos` y `detalle_presupuesto` en un mismo JOIN, cada gasto se
 * multiplicaría por cada entregable y los totales saldrían inflados.
 *
 * Criterios acordados:
 *  - presupuesto_estimado  = proyectos.presupuesto
 *  - presupuesto_aprobado  = SUM(cantidad * precio_unitario) de los detalles
 *                            cuyo presupuesto está en estado "Aprobado"
 *  - total_gastado         = SUM(gastos.monto)
 *  - saldo_*               = presupuesto_* - total_gastado
 *
 * MySQL devuelve los DECIMAL y los SUM() como texto, y como NULL cuando no hay
 * filas. Por eso las consultas usan COALESCE y las respuestas se convierten a
 * número antes de enviarse, para que React reciba valores con los que pueda operar.
 */

import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { validationResult } from "express-validator";

import { db } from "../configuraciones/db.js";
import { Proyecto } from "../modelos/proyectoModelo.js";

/** Filtros opcionales que aceptan la mayoría de los reportes. */
interface Filtros {
    desde: string | null;
    hasta: string | null;
    proyectoId: number | null;
    categoriaId: number | null;
}

/** Fila cruda de los reportes por proyecto, tal como la devuelve MySQL. */
interface FilaProyecto {
    proyecto_id: number;
    nombre: string;
    presupuesto_estimado: string | null;
    presupuesto_aprobado: string | null;
    total_gastado: string | null;
    cantidad_gastos: number | null;
}

/** Fila cruda de los reportes por categoría. */
interface FilaCategoria {
    categoria_id: number;
    nombre: string;
    presupuestado: string | null;
    gastado: string | null;
    cantidad_gastos: number | null;
}

/** Fila cruda del reporte mensual. */
interface FilaMensual {
    anio: number;
    mes: number;
    total: string | null;
    cantidad: number | null;
}

/**
 * Convierte a número un valor que MySQL pudo entregar como texto o NULL.
 * Devuelve 0 si el valor no es un número válido.
 */
const aNumero = (valor: unknown): number => {
    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : 0;
};

/** Redondea a dos decimales para evitar colas de coma flotante en los montos. */
const aMonto = (valor: unknown): number =>
    Math.round(aNumero(valor) * 100) / 100;

/**
 * Lee una fecha de la query string.
 * Devuelve null si no se envió o si llegó vacía, para que el SQL la ignore.
 */
const leerFecha = (valor: unknown): string | null =>
    typeof valor === "string" && valor.trim() !== "" ? valor.trim() : null;

/**
 * Lee un ID opcional de la query string.
 * Devuelve null si no se envió o si no es un entero positivo.
 */
const leerId = (valor: unknown): number | null => {
    if (typeof valor !== "string" || valor.trim() === "") {
        return null;
    }

    const numero = Number(valor);

    return Number.isInteger(numero) && numero > 0 ? numero : null;
};

/** Arma los filtros opcionales a partir de la query string de la petición. */
const leerFiltros = (req: Request): Filtros => ({
    desde: leerFecha(req.query.desde),
    hasta: leerFecha(req.query.hasta),
    proyectoId: leerId(req.query.proyecto_id),
    categoriaId: leerId(req.query.categoria_id)
});

/**
 * Calcula el porcentaje del presupuesto ya utilizado.
 * Devuelve null cuando el presupuesto es 0, porque el porcentaje no tendría sentido.
 */
const calcularPorcentaje = (
    gastado: number,
    presupuesto: number
): number | null => {
    if (presupuesto <= 0) {
        return null;
    }

    return Math.round((gastado / presupuesto) * 10000) / 100;
};

/**
 * Convierte una fila cruda de proyecto en la respuesta final,
 * agregando los saldos y los porcentajes ya calculados.
 */
const armarResumenProyecto = (fila: FilaProyecto) => {
    const presupuestoEstimado = aMonto(fila.presupuesto_estimado);
    const presupuestoAprobado = aMonto(fila.presupuesto_aprobado);
    const totalGastado = aMonto(fila.total_gastado);

    return {
        proyecto_id: fila.proyecto_id,
        nombre: fila.nombre,
        presupuesto_estimado: presupuestoEstimado,
        presupuesto_aprobado: presupuestoAprobado,
        total_gastado: totalGastado,
        saldo_estimado: aMonto(presupuestoEstimado - totalGastado),
        saldo_aprobado: aMonto(presupuestoAprobado - totalGastado),
        porcentaje_utilizado: calcularPorcentaje(totalGastado, presupuestoEstimado),
        porcentaje_utilizado_aprobado: calcularPorcentaje(totalGastado, presupuestoAprobado),
        cantidad_gastos: aNumero(fila.cantidad_gastos)
    };
};

/**
 * SQL compartido por los reportes de proyectos.
 * El filtro `:proyectoId` se deja en NULL para traer todos los proyectos.
 *
 * Se exporta para poder verificarlo de forma aislada contra la base de datos.
 */
export const SQL_PROYECTOS = `
    SELECT
        pr.id                    AS proyecto_id,
        pr.nombre                AS nombre,
        pr.presupuesto           AS presupuesto_estimado,
        COALESCE(ap.total, 0)    AS presupuesto_aprobado,
        COALESCE(ga.total, 0)    AS total_gastado,
        COALESCE(ga.cantidad, 0) AS cantidad_gastos
    FROM proyectos pr
    LEFT JOIN (
        SELECT p.proyecto_id, SUM(d.cantidad * d.precio_unitario) AS total
        FROM detalle_presupuesto d
        JOIN presupuestos p ON p.id = d.presupuesto_id
        WHERE p.estado = 'Aprobado'
        GROUP BY p.proyecto_id
    ) ap ON ap.proyecto_id = pr.id
    LEFT JOIN (
        SELECT proyecto_id, SUM(monto) AS total, COUNT(*) AS cantidad
        FROM gastos
        WHERE (:desde IS NULL OR fecha >= :desde)
          AND (:hasta IS NULL OR fecha <= :hasta)
        GROUP BY proyecto_id
    ) ga ON ga.proyecto_id = pr.id
    WHERE (:proyectoId IS NULL OR pr.id = :proyectoId)
    ORDER BY pr.nombre
`;

/**
 * SQL compartido por los reportes de categorías.
 * Compara lo presupuestado contra lo gastado en cada categoría y descarta
 * las categorías que no tienen ni presupuesto ni gastos en el rango consultado.
 *
 * Se exporta para poder verificarlo de forma aislada contra la base de datos.
 */
export const SQL_CATEGORIAS = `
    SELECT
        c.id                      AS categoria_id,
        c.nombre                  AS nombre,
        COALESCE(pre.total, 0)    AS presupuestado,
        COALESCE(gas.total, 0)    AS gastado,
        COALESCE(gas.cantidad, 0) AS cantidad_gastos
    FROM categorias c
    LEFT JOIN (
        SELECT d.categoria_id, SUM(d.cantidad * d.precio_unitario) AS total
        FROM detalle_presupuesto d
        JOIN presupuestos p ON p.id = d.presupuesto_id
        WHERE p.estado = 'Aprobado'
          AND (:proyectoId IS NULL OR p.proyecto_id = :proyectoId)
        GROUP BY d.categoria_id
    ) pre ON pre.categoria_id = c.id
    LEFT JOIN (
        SELECT categoria_id, SUM(monto) AS total, COUNT(*) AS cantidad
        FROM gastos
        WHERE (:proyectoId IS NULL OR proyecto_id = :proyectoId)
          AND (:desde IS NULL OR fecha >= :desde)
          AND (:hasta IS NULL OR fecha <= :hasta)
        GROUP BY categoria_id
    ) gas ON gas.categoria_id = c.id
    WHERE pre.total IS NOT NULL OR gas.total IS NOT NULL
    ORDER BY gastado DESC, c.nombre
`;

/**
 * Ejecuta el reporte por categorías y arma la respuesta ya convertida a números.
 * Lo usan tanto el reporte global como el de un proyecto concreto.
 */
const consultarTotalesPorCategoria = async (filtros: Filtros) => {
    const filas = await db.query<FilaCategoria>(SQL_CATEGORIAS, {
        type: QueryTypes.SELECT,
        replacements: {
            proyectoId: filtros.proyectoId,
            desde: filtros.desde,
            hasta: filtros.hasta
        }
    });

    return filas.map((fila) => {
        const presupuestado = aMonto(fila.presupuestado);
        const gastado = aMonto(fila.gastado);

        return {
            categoria_id: fila.categoria_id,
            nombre: fila.nombre,
            presupuestado,
            gastado,
            diferencia: aMonto(presupuestado - gastado),
            porcentaje_utilizado: calcularPorcentaje(gastado, presupuestado),
            cantidad_gastos: aNumero(fila.cantidad_gastos)
        };
    });
};

/**
 * Resumen general de toda la aplicación: presupuestos, gastos y saldos acumulados.
 *
 * Query: desde?, hasta? (filtran únicamente los gastos; los presupuestos son el total vigente)
 * Respuestas: 200 { resumen } · 400 validación · 500 error
 */
export const consultarResumenGeneral = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const filtros = leerFiltros(req);

        // Cada total se calcula en su propia subconsulta para no multiplicar filas
        const filas = await db.query<{
            total_proyectos: number;
            total_categorias: number;
            presupuesto_estimado: string | null;
            presupuesto_aprobado: string | null;
            total_gastado: string | null;
            cantidad_gastos: number;
        }>(
            `
            SELECT
                (SELECT COUNT(*) FROM proyectos)  AS total_proyectos,
                (SELECT COUNT(*) FROM categorias) AS total_categorias,

                (SELECT COALESCE(SUM(presupuesto), 0)
                   FROM proyectos) AS presupuesto_estimado,

                (SELECT COALESCE(SUM(d.cantidad * d.precio_unitario), 0)
                   FROM detalle_presupuesto d
                   JOIN presupuestos p ON p.id = d.presupuesto_id
                  WHERE p.estado = 'Aprobado') AS presupuesto_aprobado,

                (SELECT COALESCE(SUM(monto), 0)
                   FROM gastos
                  WHERE (:desde IS NULL OR fecha >= :desde)
                    AND (:hasta IS NULL OR fecha <= :hasta)) AS total_gastado,

                (SELECT COUNT(*)
                   FROM gastos
                  WHERE (:desde IS NULL OR fecha >= :desde)
                    AND (:hasta IS NULL OR fecha <= :hasta)) AS cantidad_gastos
            `,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    desde: filtros.desde,
                    hasta: filtros.hasta
                }
            }
        );

        const fila = filas[0];

        const presupuestoEstimado = aMonto(fila?.presupuesto_estimado);
        const presupuestoAprobado = aMonto(fila?.presupuesto_aprobado);
        const totalGastado = aMonto(fila?.total_gastado);

        return res.status(200).json({
            resumen: {
                total_proyectos: aNumero(fila?.total_proyectos),
                total_categorias: aNumero(fila?.total_categorias),
                presupuesto_estimado: presupuestoEstimado,
                presupuesto_aprobado: presupuestoAprobado,
                total_gastado: totalGastado,
                saldo_estimado: aMonto(presupuestoEstimado - totalGastado),
                saldo_aprobado: aMonto(presupuestoAprobado - totalGastado),
                porcentaje_utilizado: calcularPorcentaje(totalGastado, presupuestoEstimado),
                porcentaje_utilizado_aprobado: calcularPorcentaje(totalGastado, presupuestoAprobado),
                cantidad_gastos: aNumero(fila?.cantidad_gastos),
                desde: filtros.desde,
                hasta: filtros.hasta
            }
        });

    } catch (error) {
        console.error("Error al consultar el resumen general:", error);

        return res.status(500).json({
            mensaje: "Error al consultar el resumen general"
        });
    }
};

/**
 * Totales de presupuesto, gasto y saldo de cada proyecto.
 * Los proyectos sin gastos aparecen con totales en 0, no se omiten.
 *
 * Query: desde?, hasta?
 * Respuestas: 200 { proyectos } · 400 validación · 500 error
 */
export const consultarTotalesPorProyecto = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const filtros = leerFiltros(req);

        const filas = await db.query<FilaProyecto>(SQL_PROYECTOS, {
            type: QueryTypes.SELECT,
            replacements: {
                proyectoId: null,
                desde: filtros.desde,
                hasta: filtros.hasta
            }
        });

        return res.status(200).json({
            proyectos: filas.map(armarResumenProyecto)
        });

    } catch (error) {
        console.error("Error al consultar los totales por proyecto:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los totales por proyecto"
        });
    }
};

/**
 * Totales de presupuesto, gasto y saldo de un proyecto concreto.
 *
 * Params: id · Query: desde?, hasta?
 * Respuestas: 200 { resumen } · 400 validación · 404 proyecto inexistente · 500 error
 */
export const consultarResumenProyecto = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del proyecto debe ser un número entero positivo"
            });
        }

        const filtros = leerFiltros(req);

        const filas = await db.query<FilaProyecto>(SQL_PROYECTOS, {
            type: QueryTypes.SELECT,
            replacements: {
                proyectoId: id,
                desde: filtros.desde,
                hasta: filtros.hasta
            }
        });

        const fila = filas[0];

        if (!fila) {
            return res.status(404).json({
                mensaje: "El proyecto no existe"
            });
        }

        return res.status(200).json({
            resumen: armarResumenProyecto(fila)
        });

    } catch (error) {
        console.error("Error al consultar el resumen del proyecto:", error);

        return res.status(500).json({
            mensaje: "Error al consultar el resumen del proyecto"
        });
    }
};

/**
 * Comparativo de presupuestado contra gastado por categoría, en todos los
 * proyectos o en uno solo si se envía `proyecto_id`.
 *
 * Query: proyecto_id?, desde?, hasta?
 * Respuestas: 200 { categorias } · 400 validación · 500 error
 */
export const consultarGastosPorCategoria = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const filtros = leerFiltros(req);

        return res.status(200).json({
            categorias: await consultarTotalesPorCategoria(filtros)
        });

    } catch (error) {
        console.error("Error al consultar los gastos por categoría:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los gastos por categoría"
        });
    }
};

/**
 * Comparativo de presupuestado contra gastado por categoría dentro de un proyecto.
 *
 * Params: id · Query: desde?, hasta?
 * Respuestas: 200 { proyecto_id, categorias } · 400 validación · 404 proyecto inexistente · 500 error
 */
export const consultarCategoriasDeProyecto = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del proyecto debe ser un número entero positivo"
            });
        }

        // Si el proyecto no existe, la consulta devolvería una lista vacía
        // en vez de avisar del error, así que se comprueba antes
        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({
                mensaje: "El proyecto no existe"
            });
        }

        const filtros = leerFiltros(req);

        return res.status(200).json({
            proyecto_id: id,
            categorias: await consultarTotalesPorCategoria({
                ...filtros,
                proyectoId: id
            })
        });

    } catch (error) {
        console.error("Error al consultar las categorías del proyecto:", error);

        return res.status(500).json({
            mensaje: "Error al consultar las categorías del proyecto"
        });
    }
};

/**
 * Evolución mensual de los gastos, pensada para gráficos de línea.
 * Devuelve una fila por mes con registros, con la etiqueta "AAAA-MM" ya armada.
 *
 * Query: proyecto_id?, categoria_id?, desde?, hasta?
 * Respuestas: 200 { meses } · 400 validación · 500 error
 */
export const consultarGastosMensuales = async (
    req: Request,
    res: Response
) => {
    try {
        // Revisar las validaciones de la ruta
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const filtros = leerFiltros(req);

        const filas = await db.query<FilaMensual>(
            `
            SELECT
                YEAR(fecha)  AS anio,
                MONTH(fecha) AS mes,
                SUM(monto)   AS total,
                COUNT(*)     AS cantidad
            FROM gastos
            WHERE (:proyectoId  IS NULL OR proyecto_id  = :proyectoId)
              AND (:categoriaId IS NULL OR categoria_id = :categoriaId)
              AND (:desde       IS NULL OR fecha >= :desde)
              AND (:hasta       IS NULL OR fecha <= :hasta)
            GROUP BY YEAR(fecha), MONTH(fecha)
            ORDER BY anio, mes
            `,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    proyectoId: filtros.proyectoId,
                    categoriaId: filtros.categoriaId,
                    desde: filtros.desde,
                    hasta: filtros.hasta
                }
            }
        );

        const meses = filas.map((fila) => {
            const anio = aNumero(fila.anio);
            const mes = aNumero(fila.mes);

            return {
                anio,
                mes,
                etiqueta: `${anio}-${String(mes).padStart(2, "0")}`,
                total: aMonto(fila.total),
                cantidad_gastos: aNumero(fila.cantidad)
            };
        });

        return res.status(200).json({ meses });

    } catch (error) {
        console.error("Error al consultar los gastos mensuales:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los gastos mensuales"
        });
    }
};
