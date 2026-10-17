
import express from "express";
import { db } from "./configuraciones/db.js";
import proyectoRutas from "./rutas/proyectoRutas.js";

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

        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar con MySQL:", error);
    }
}

iniciarServidor();
