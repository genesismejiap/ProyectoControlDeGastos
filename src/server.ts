
import express from "express";
import { db } from "./configuraciones/db.js";

// Importar las rutas de proyectos
import proyectoRutas from "./rutas/proyectoRutas.js";

const app = express();
const PORT = 3000;

app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../public")));

// Ruta para comprobar que funciona la API
app.get("/api", (req, res) => {
    res.json({
        mensaje: "API de Control de Gastos funcionando"
    });
});

// Ruta para ver la página de servicios de Taruma Arquitectos
app.get("/servicios", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/servicios.html"));
});

// Registrar las rutas de proyectos
app.use("/api/proyectos", proyectoRutas);

// Comprobar la conexión con MySQL
async function iniciarServidor() {
    try {
        const conexion = await db.getConnection();

        console.log("Conexión con MySQL exitosa");

        conexion.release();

        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar con MySQL:", error);
    }
}

iniciarServidor();

