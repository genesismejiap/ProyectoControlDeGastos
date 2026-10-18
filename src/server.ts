
import express from "express";
import { db } from "./configuraciones/db.js";
import proyectoRutas from "./rutas/proyectoRutas.js";

import { Presupuesto } from "./modelos/presupuestoModelo.js";
import DetallePresupuesto from "./modelos/detallePresupuestoModelo.js";
import "./modelos/relaciones.js";

import categoriaRutas from "./rutas/categoriaRutas.js";

import presupuestoRutas from "./rutas/presupuestoRutas.js";

import detallePresupuestoRutas from "./rutas/detallePresupuestoRutas.js";

import gastosRutas from "./rutas/gastosRutas.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/api", (req, res) => {
    res.json({
        mensaje: "API de Control de Gastos funcionando"
    });
});

// Rutas de proyectos
app.use("/api/proyectos", proyectoRutas);

// Rutas de presupuestos
app.use("/api/presupuestos", presupuestoRutas);
app.use("/api/detalle-presupuestos", detallePresupuestoRutas);

//rutas de categoria
app.use("/api/categorias", categoriaRutas);

//rutas de gastos
app.use("/api/gastos", gastosRutas);

async function iniciarServidor() {
    try {
        await db.authenticate();

        console.log("Conexión con MySQL mediante Sequelize exitosa");

        // Verificar o crear la tabla presupuestos
        await Presupuesto.sync();

        // Crear la tabla detalle_presupuesto si no existe
        await DetallePresupuesto.sync();

        console.log("Tablas de presupuestos sincronizadas correctamente");

        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar o sincronizar MySQL:", error);
    }
}

iniciarServidor();
