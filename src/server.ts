
import express from "express";
import { db } from "./configuraciones/db.js";

// Importar las rutas de proyectos
import proyectoRutas from "./rutas/proyectoRutas.js";
// Importar las rutas de las páginas (Inicio, Servicios, Nosotros, Contacto)
import paginasRutas, { paginaNoEncontrada } from "./rutas/paginasRutas.js";

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

// Registrar las rutas de las páginas: /, /servicios, /nosotros y /contacto
app.use("/", paginasRutas);

// Registrar las rutas de proyectos
app.use("/api/proyectos", proyectoRutas);

// Rutas inexistentes (debe ir después de todas las demás rutas)
app.use(paginaNoEncontrada);

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

