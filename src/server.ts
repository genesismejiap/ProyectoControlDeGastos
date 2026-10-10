
import express from "express";
import { db } from "./configuraciones/db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Ruta para comprobar que funciona la API
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Control de Gastos funcionando"
    });
});

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
