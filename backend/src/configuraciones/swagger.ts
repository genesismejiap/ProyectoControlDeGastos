
/**
 * Configuración de Swagger (OpenAPI 3.0) para documentar la API.
 *
 * La especificación se genera a partir de:
 *  - La definición base de este archivo (información general, esquemas y seguridad).
 *  - Los comentarios JSDoc con la etiqueta `@swagger` que están en la carpeta `rutas`.
 *
 * La documentación interactiva queda disponible en `/swagger`
 * y la especificación en formato JSON en `/swagger.json`.
 */

import path from "path";
import { fileURLToPath } from "url";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convierte una ruta relativa a esta carpeta en un patrón glob válido
// (glob exige "/" como separador, también en Windows)
const patron = (relativa: string): string =>
    path.join(__dirname, relativa).replace(/\\/g, "/");

const opciones: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "API de Control de Gastos",
            version: "1.0.0",
            description:
                "API REST para administrar proyectos, presupuestos, detalles de presupuesto, " +
                "categorías, gastos, usuarios y envío de correos electrónicos."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],
        tags: [
            { name: "General", description: "Estado de la API" },
            { name: "Usuarios", description: "Registro e inicio de sesión" },
            { name: "Proyectos", description: "Administración de proyectos" },
            { name: "Presupuestos", description: "Administración de presupuestos" },
            { name: "Detalle de presupuestos", description: "Entregables de cada presupuesto" },
            { name: "Categorías", description: "Categorías de gastos y entregables" },
            { name: "Gastos", description: "Registro de gastos por proyecto" },
            { name: "Correos", description: "Envío de correos electrónicos (requiere token)" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Token obtenido en POST /api/usuarios/login"
                }
            },
            parameters: {
                IdRuta: {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del registro (entero positivo)",
                    schema: { type: "integer", minimum: 1, example: 1 }
                }
            },
            schemas: {
                // ---------- Respuestas genéricas ----------
                Mensaje: {
                    type: "object",
                    properties: {
                        mensaje: { type: "string", example: "Operación realizada correctamente" }
                    }
                },
                ErrorValidacion: {
                    type: "object",
                    properties: {
                        mensaje: { type: "string", example: "Datos inválidos" },
                        errores: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string", example: "field" },
                                    value: { example: "" },
                                    msg: { type: "string", example: "El campo es obligatorio" },
                                    path: { type: "string", example: "nombre" },
                                    location: { type: "string", example: "body" }
                                }
                            }
                        }
                    }
                },

                // ---------- Proyectos ----------
                Proyecto: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nombre: { type: "string", maxLength: 150, example: "Construcción bodega" },
                        descripcion: { type: "string", nullable: true, example: "Bodega de 200 m2" },
                        ubicacion: { type: "string", maxLength: 150, nullable: true, example: "Bogotá" },
                        presupuesto: { type: "string", description: "DECIMAL(12,2)", example: "150000000.00" },
                        fecha_inicio: { type: "string", format: "date", nullable: true, example: "2026-01-15" },
                        fecha_fin: { type: "string", format: "date", nullable: true, example: "2026-06-30" }
                    }
                },
                ProyectoEntrada: {
                    type: "object",
                    required: ["nombre", "presupuesto"],
                    properties: {
                        nombre: { type: "string", maxLength: 150, example: "Construcción bodega" },
                        descripcion: { type: "string", nullable: true, example: "Bodega de 200 m2" },
                        ubicacion: { type: "string", maxLength: 150, nullable: true, example: "Bogotá" },
                        presupuesto: { type: "number", minimum: 0, example: 150000000 },
                        fecha_inicio: { type: "string", format: "date", nullable: true, example: "2026-01-15" },
                        fecha_fin: {
                            type: "string",
                            format: "date",
                            nullable: true,
                            description: "No puede ser anterior a fecha_inicio",
                            example: "2026-06-30"
                        }
                    }
                },

                // ---------- Presupuestos ----------
                Presupuesto: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        proyecto_id: { type: "integer", example: 1 },
                        fecha: { type: "string", format: "date", example: "2026-02-01" },
                        estado: { type: "string", enum: ["Borrador", "Aprobado"], example: "Borrador" }
                    }
                },
                PresupuestoEntrada: {
                    type: "object",
                    required: ["proyecto_id", "fecha"],
                    properties: {
                        proyecto_id: { type: "integer", minimum: 1, example: 1 },
                        fecha: { type: "string", format: "date", example: "2026-02-01" },
                        estado: {
                            type: "string",
                            enum: ["Borrador", "Aprobado"],
                            default: "Borrador",
                            example: "Borrador"
                        }
                    }
                },

                // ---------- Detalle de presupuesto ----------
                DetallePresupuesto: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        presupuesto_id: { type: "integer", example: 1 },
                        categoria_id: { type: "integer", example: 2 },
                        entregable: { type: "string", maxLength: 150, example: "Cemento gris 50 kg" },
                        cantidad: { type: "integer", minimum: 1, example: 40 },
                        precio_unitario: { type: "string", description: "DECIMAL(12,2)", example: "32000.00" }
                    }
                },
                DetallePresupuestoEntrada: {
                    type: "object",
                    required: ["presupuesto_id", "categoria", "entregable", "cantidad", "precio_unitario"],
                    properties: {
                        presupuesto_id: { type: "integer", minimum: 1, example: 1 },
                        categoria: {
                            type: "string",
                            maxLength: 100,
                            description: "Nombre de una categoría existente",
                            example: "Materiales"
                        },
                        entregable: { type: "string", maxLength: 150, example: "Cemento gris 50 kg" },
                        cantidad: { type: "integer", minimum: 1, example: 40 },
                        precio_unitario: { type: "number", minimum: 0, example: 32000 }
                    }
                },

                // ---------- Categorías ----------
                Categoria: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nombre: { type: "string", maxLength: 100, example: "Materiales" },
                        descripcion: { type: "string", nullable: true, example: "Insumos de construcción" }
                    }
                },
                CategoriaEntrada: {
                    type: "object",
                    required: ["nombre"],
                    properties: {
                        nombre: { type: "string", maxLength: 100, example: "Materiales" },
                        descripcion: { type: "string", nullable: true, example: "Insumos de construcción" }
                    }
                },

                // ---------- Gastos ----------
                Gasto: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        proyecto_id: { type: "integer", example: 1 },
                        categoria_id: { type: "integer", example: 1 },
                        descripcion: { type: "string", maxLength: 255, example: "Compra de cemento" },
                        monto: { type: "string", description: "DECIMAL(12,2)", example: "1280000.00" },
                        fecha: { type: "string", format: "date", example: "2026-02-10" }
                    }
                },
                GastoEntrada: {
                    type: "object",
                    required: ["proyecto_id", "categoria", "descripcion", "monto", "fecha"],
                    properties: {
                        proyecto_id: { type: "integer", minimum: 1, example: 1 },
                        categoria: {
                            type: "string",
                            maxLength: 100,
                            description: "Nombre de una categoría existente",
                            example: "Materiales"
                        },
                        descripcion: { type: "string", maxLength: 255, example: "Compra de cemento" },
                        monto: { type: "number", minimum: 0, example: 1280000 },
                        fecha: { type: "string", format: "date", example: "2026-02-10" }
                    }
                },

                // ---------- Usuarios ----------
                UsuarioPublico: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nombre: { type: "string", example: "Ana Pérez" },
                        correo: { type: "string", format: "email", example: "ana@correo.com" }
                    }
                },
                RegistroEntrada: {
                    type: "object",
                    required: ["nombre", "correo", "contrasena"],
                    properties: {
                        nombre: { type: "string", example: "Ana Pérez" },
                        correo: { type: "string", format: "email", example: "ana@correo.com" },
                        contrasena: { type: "string", format: "password", minLength: 8, example: "secreta123" }
                    }
                },
                LoginEntrada: {
                    type: "object",
                    required: ["correo", "contrasena"],
                    properties: {
                        correo: { type: "string", format: "email", example: "ana@correo.com" },
                        contrasena: { type: "string", format: "password", example: "secreta123" }
                    }
                },

                // ---------- Correos ----------
                CorreoEntrada: {
                    type: "object",
                    required: ["destinatario", "asunto", "mensaje"],
                    properties: {
                        destinatario: { type: "string", format: "email", example: "cliente@correo.com" },
                        asunto: { type: "string", example: "Reporte de gastos" },
                        mensaje: { type: "string", example: "Adjunto el resumen del mes." }
                    }
                }
            },
            responses: {
                ErrorValidacion: {
                    description: "Los datos enviados no son válidos",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorValidacion" }
                        }
                    }
                },
                NoEncontrado: {
                    description: "El recurso solicitado no existe",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Mensaje" }
                        }
                    }
                },
                ErrorServidor: {
                    description: "Error interno del servidor",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Mensaje" }
                        }
                    }
                }
            }
        }
    },

    // Archivos donde se buscan los comentarios @swagger
    // (.ts en desarrollo con tsx, .js si se ejecuta la versión compilada)
    apis: [
        patron("../rutas/*.ts"),
        patron("../rutas/*.js"),
        patron("../server.ts"),
        patron("../server.js")
    ]
};

// Especificación OpenAPI generada
export const especificacionSwagger = swaggerJSDoc(opciones);
