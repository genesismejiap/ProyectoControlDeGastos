
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
                "categorías, gastos, usuarios, envío de correos electrónicos e imágenes y documentos " +
                "de cada usuario."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],
        tags: [
            { name: "General", description: "Estado de la API" },
            { name: "Usuarios", description: "Registro, inicio de sesión y administración de usuarios (listar y eliminar: solo administradores)" },
            { name: "Proyectos", description: "Administración de proyectos" },
            { name: "Presupuestos", description: "Administración de presupuestos" },
            { name: "Detalle de presupuestos", description: "Entregables de cada presupuesto" },
            { name: "Categorías", description: "Categorías de gastos y entregables" },
            { name: "Gastos", description: "Registro de gastos por proyecto" },
            {
                name: "Reportes",
                description:
                    "Totales de gastos, presupuestos y saldos por proyecto, por categoría y por mes"
            },
            { name: "Correos", description: "Envío de correos electrónicos (requiere token)" },
            { name: "Imágenes", description: "Subida de imágenes JPG y PNG (requiere token)" },
            { name: "Documentos", description: "Subida de documentos PDF, Word y Excel (requiere token)" },
            {
                name: "Archivos",
                description: "Consulta, descarga y eliminación de las imágenes y documentos propios (requiere token)"
            }
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
                },
                Desde: {
                    name: "desde",
                    in: "query",
                    required: false,
                    description: "Fecha inicial del rango de gastos (inclusive)",
                    schema: { type: "string", format: "date", example: "2026-01-01" }
                },
                Hasta: {
                    name: "hasta",
                    in: "query",
                    required: false,
                    description:
                        "Fecha final del rango de gastos (inclusive). No puede ser anterior a `desde`.",
                    schema: { type: "string", format: "date", example: "2026-12-31" }
                },
                ProyectoIdQuery: {
                    name: "proyecto_id",
                    in: "query",
                    required: false,
                    description: "Limitar el reporte a un solo proyecto",
                    schema: { type: "integer", minimum: 1, example: 1 }
                },
                CategoriaIdQuery: {
                    name: "categoria_id",
                    in: "query",
                    required: false,
                    description: "Limitar el reporte a una sola categoría",
                    schema: { type: "integer", minimum: 1, example: 2 }
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

                // ---------- Reportes y estadísticas ----------
                // Todos los montos viajan como number (no como string DECIMAL)
                // para que el frontend pueda operar con ellos directamente.
                ResumenGeneral: {
                    type: "object",
                    properties: {
                        total_proyectos: { type: "integer", example: 4 },
                        total_categorias: { type: "integer", example: 6 },
                        presupuesto_estimado: {
                            type: "number",
                            description: "Suma de proyectos.presupuesto",
                            example: 450000000
                        },
                        presupuesto_aprobado: {
                            type: "number",
                            description:
                                "Suma de cantidad × precio_unitario de los detalles cuyo presupuesto está en estado Aprobado",
                            example: 412300000
                        },
                        total_gastado: { type: "number", example: 128750000 },
                        saldo_estimado: {
                            type: "number",
                            description: "presupuesto_estimado - total_gastado",
                            example: 321250000
                        },
                        saldo_aprobado: {
                            type: "number",
                            description: "presupuesto_aprobado - total_gastado",
                            example: 283550000
                        },
                        porcentaje_utilizado: {
                            type: "number",
                            nullable: true,
                            description: "null cuando el presupuesto es 0",
                            example: 28.61
                        },
                        porcentaje_utilizado_aprobado: {
                            type: "number",
                            nullable: true,
                            example: 31.23
                        },
                        cantidad_gastos: { type: "integer", example: 87 },
                        desde: { type: "string", format: "date", nullable: true, example: "2026-01-01" },
                        hasta: { type: "string", format: "date", nullable: true, example: "2026-12-31" }
                    }
                },
                ResumenProyecto: {
                    type: "object",
                    properties: {
                        proyecto_id: { type: "integer", example: 1 },
                        nombre: { type: "string", example: "Construcción bodega" },
                        presupuesto_estimado: { type: "number", example: 150000000 },
                        presupuesto_aprobado: { type: "number", example: 142300000 },
                        total_gastado: { type: "number", example: 48750000 },
                        saldo_estimado: { type: "number", example: 101250000 },
                        saldo_aprobado: { type: "number", example: 93550000 },
                        porcentaje_utilizado: { type: "number", nullable: true, example: 32.5 },
                        porcentaje_utilizado_aprobado: { type: "number", nullable: true, example: 34.26 },
                        cantidad_gastos: { type: "integer", example: 23 }
                    }
                },
                TotalPorCategoria: {
                    type: "object",
                    properties: {
                        categoria_id: { type: "integer", example: 2 },
                        nombre: { type: "string", example: "Materiales" },
                        presupuestado: { type: "number", example: 80000000 },
                        gastado: { type: "number", example: 31200000 },
                        diferencia: {
                            type: "number",
                            description: "presupuestado - gastado (negativo si hay sobregiro)",
                            example: 48800000
                        },
                        porcentaje_utilizado: { type: "number", nullable: true, example: 39 },
                        cantidad_gastos: { type: "integer", example: 11 }
                    }
                },
                TotalMensual: {
                    type: "object",
                    properties: {
                        anio: { type: "integer", example: 2026 },
                        mes: { type: "integer", minimum: 1, maximum: 12, example: 2 },
                        etiqueta: {
                            type: "string",
                            description: "Listo para usarse como eje X en los gráficos",
                            example: "2026-02"
                        },
                        total: { type: "number", example: 12800000 },
                        cantidad_gastos: { type: "integer", example: 5 }
                    }
                },

                // ---------- Usuarios ----------
                UsuarioPublico: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nombre: { type: "string", example: "Ana Pérez" },
                        correo: { type: "string", format: "email", example: "ana@correo.com" },
                        rol: { type: "string", enum: ["usuario", "administrador"], example: "usuario" },
                        creado: { type: "string", format: "date-time", example: "2026-11-03T22:17:10.000Z" },
                        actualizado: { type: "string", format: "date-time", example: "2026-11-03T22:17:10.000Z" }
                    }
                },
                UsuariosPaginados: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 25 },
                        pagina: { type: "integer", example: 1 },
                        limite: { type: "integer", example: 10 },
                        total_paginas: { type: "integer", example: 3 },
                        usuarios: {
                            type: "array",
                            items: { $ref: "#/components/schemas/UsuarioPublico" }
                        }
                    }
                },
                ActualizarUsuarioEntrada: {
                    type: "object",
                    description: "Todos los campos son opcionales, pero se debe enviar al menos uno",
                    properties: {
                        nombre: { type: "string", example: "Ana María Pérez" },
                        correo: { type: "string", format: "email", example: "ana.nueva@correo.com" },
                        contrasena: {
                            type: "string", format: "password", minLength: 8, maxLength: 72,
                            description: "Nueva contraseña",
                            example: "nuevaClave123"
                        },
                        contrasena_actual: {
                            type: "string", format: "password",
                            description: "Obligatoria al cambiar la propia contraseña",
                            example: "secreta123"
                        },
                        rol: {
                            type: "string", enum: ["usuario", "administrador"],
                            description: "Solo un administrador puede cambiarlo (y nunca el suyo)",
                            example: "administrador"
                        }
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
                },

                // ---------- archivos (imágenes y documentos) ----------
                Archivo: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        tipo: { type: "string", enum: ["imagen", "documento"], example: "documento" },
                        nombre: {
                            type: "string",
                            description: "Nombre único con el que se guardó en el servidor",
                            example: "1762207030000-123456789.pdf"
                        },
                        nombre_original: { type: "string", example: "factura-cemento.pdf" },
                        mimetype: { type: "string", example: "application/pdf" },
                        tamano_bytes: { type: "integer", example: 245760 },
                        fecha_subida: { type: "string", format: "date-time", example: "2026-11-03T22:17:10.000Z" },
                        url_descarga: { type: "string", example: "/api/archivos/1/descargar" }
                    }
                },
                ArchivoSubido: {
                    type: "object",
                    properties: {
                        mensaje: { type: "string", example: "Documento recibido, validado y guardado correctamente" },
                        archivo: { $ref: "#/components/schemas/Archivo" }
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
                NoAutenticado: {
                    description: "No se envió el token o es inválido / expirado",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Mensaje" },
                            example: { mensaje: "Debes iniciar sesión para acceder a este recurso" }
                        }
                    }
                },
                SinPermiso: {
                    description: "No tienes permiso: el recurso pertenece a otro usuario o la operación es solo para administradores",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Mensaje" },
                            example: { mensaje: "No tienes permiso para acceder a este archivo" }
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
