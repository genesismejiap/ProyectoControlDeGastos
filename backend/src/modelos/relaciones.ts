
/**
 * Asociaciones entre los modelos de Sequelize.
 *
 * Proyecto 1 ── N Presupuesto 1 ── N DetallePresupuesto N ── 1 Categoria
 *
 * Se importa una sola vez desde server.ts para registrar las relaciones.
 */

import { Proyecto } from "./proyectoModelo.js";
import { Presupuesto } from "./presupuestoModelo.js";
import DetallePresupuesto from "./detallePresupuestoModelo.js";
import Categoria from "./categoriaModelo.js";

// Relación entre proyectos y presupuestos
Proyecto.hasMany(Presupuesto, {
    foreignKey: "proyecto_id"
});

Presupuesto.belongsTo(Proyecto, {
    foreignKey: "proyecto_id"
});

// Relación entre presupuestos y detalles
Presupuesto.hasMany(DetallePresupuesto, {
    foreignKey: "presupuesto_id"
});

DetallePresupuesto.belongsTo(Presupuesto, {
    foreignKey: "presupuesto_id"
});

// Relación entre categorías y detalles
Categoria.hasMany(DetallePresupuesto, {
    foreignKey: "categoria_id"
});

DetallePresupuesto.belongsTo(Categoria, {
    foreignKey: "categoria_id"
});
