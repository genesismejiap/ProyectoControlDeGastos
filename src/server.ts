
import express from "express";
import { db } from "./configuraciones/db.js";
import proyectoRutas from "./rutas/proyectoRutas.js";

import { Presupuesto } from "./modelos/presupuestoModelo.js";
import DetallePresupuesto from "./modelos/detallePresupuestoModelo.js";
import "./modelos/relaciones.js";

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

app.use("/api/proyectos", proyectoRutas);

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
