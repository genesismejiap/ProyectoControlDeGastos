
/**
 * Punto de entrada del backend.
 *
 * - Configura Express (JSON, archivos estáticos del frontend y documentación Swagger).
 * - Registra las rutas de la API bajo el prefijo `/api`.
 * - Conecta con MySQL mediante Sequelize, sincroniza las tablas y levanta el servidor.
 */

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { db } from "./configuraciones/db.js";
import { especificacionSwagger } from "./configuraciones/swagger.js";
import proyectoRutas from "./rutas/proyectoRutas.js";

import { Presupuesto } from "./modelos/presupuestoModelo.js";
import DetallePresupuesto from "./modelos/detallePresupuestoModelo.js";
import "./modelos/relaciones.js";

import categoriaRutas from "./rutas/categoriaRutas.js";

import presupuestoRutas from "./rutas/presupuestoRutas.js";

import detallePresupuestoRutas from "./rutas/detallePresupuestoRutas.js";

import gastosRutas from "./rutas/gastosRutas.js";
import { Usuario } from "./modelos/usuarioModelo.js";

import path from "path";
import { fileURLToPath } from "url";

import usuarioRutas from "./rutas/usuarioRutas.js";

import correoRutas from "./rutas/correoRutas.js";
import imagenRutas from "./rutas/imagenRutas.js";
import documentoRutas from "./rutas/documentoRutas.js";
import archivoRutas from "./rutas/archivoRutas.js";
import { Archivo } from "./modelos/archivoModelo.js";

import reportesRutas from "./rutas/reportesRutas.js";

const app = express();
const PORT = 3000;

// Permitir que el frontend de React (que corre en otro puerto) consuma la API
app.use(cors());

// Permitir recibir datos en formato JSON
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir los archivos de la carpeta frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// la carpeta uploads no se publica como estática: los archivos se descargan
// por /api/archivos, que verifica que pertenezcan al usuario del token

// Documentación interactiva de la API (Swagger UI)
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(especificacionSwagger));

// Especificación OpenAPI en formato JSON (útil para importarla en Postman)
app.get("/swagger.json", (req, res) => {
    res.json(especificacionSwagger);
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Verificar que la API está funcionando
 *     tags: [General]
 *     responses:
 *       200:
 *         description: La API responde correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *             example:
 *               mensaje: API de Control de Gastos funcionando
 */
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
app.use("/api/usuarios", usuarioRutas);
//Rutas para enviar correo electronicos
app.use("/api/correos", correoRutas);

// Rutas para subir y validar imágenes con Multer
app.use("/api/imagenes", imagenRutas);

// rutas para subir y validar documentos con multer
app.use("/api/documentos", documentoRutas);

// rutas para consultar, descargar y eliminar imágenes y documentos
app.use("/api/archivos", archivoRutas);

// rutas de reportes y estadísticas (totales de gastos, presupuestos y saldos)
app.use("/api/reportes", reportesRutas);

/**
 * Conecta con la base de datos, sincroniza las tablas necesarias
 * y pone el servidor a escuchar en el puerto configurado.
 */
async function iniciarServidor() {
    try {
        await db.authenticate();

        console.log("Conexión con MySQL mediante Sequelize exitosa");

        // Verificar o crear la tabla presupuestos
        await Presupuesto.sync();

        // Crear la tabla detalle_presupuesto si no existe
        await DetallePresupuesto.sync();

        // Crear la tabla usuarios si no existe
        await Usuario.sync();

        // crear la tabla archivos si no existe (después de usuarios por la fk)
        await Archivo.sync();

        console.log("Tablas de presupuestos sincronizadas correctamente");

        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
            console.log(`Swagger en http://localhost:${PORT}/swagger`);
        });

    } catch (error) {
        console.error("Error al conectar o sincronizar MySQL:", error);
    }
}

iniciarServidor();
