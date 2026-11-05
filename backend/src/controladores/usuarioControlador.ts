
/**
 * Controladores de usuarios: registro, inicio de sesión, y consulta,
 * actualización y eliminación de usuarios.
 *
 * Ninguna respuesta incluye la contraseña (ni su hash): todo usuario que sale
 * de la API pasa por `formatearUsuario` y las consultas usan ATRIBUTOS_PUBLICOS.
 */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import { Usuario, ATRIBUTOS_PUBLICOS } from "../modelos/usuarioModelo.js";
import { Archivo } from "../modelos/archivoModelo.js";
import jwt from "jsonwebtoken";

import { db } from "../configuraciones/db.js";
import { transporter } from "../configuraciones/correoConfig.js";
import { rutaArchivo } from "../configuraciones/multerConfig.js";
import { borrarDelDisco } from "./archivoControlador.js";
import { UsuarioToken } from "../seguridad/verificarToken.js";

/**
 * Convierte un usuario de Sequelize en su respuesta pública.
 * Usa una lista blanca de campos: la contraseña nunca se incluye.
 */
export const formatearUsuario = (usuario: InstanceType<typeof Usuario>) => ({
    id: usuario.get("id"),
    nombre: usuario.get("nombre"),
    correo: usuario.get("correo"),
    rol: usuario.get("rol"),
    creado: usuario.get("createdAt"),
    actualizado: usuario.get("updatedAt")
});

/**
 * Registra un usuario nuevo guardando la contraseña cifrada con bcrypt
 * y envía, en segundo plano, un correo de bienvenida.
 *
 * Body: { nombre, correo, contrasena }
 * Respuestas: 201 { mensaje, usuario } · 400 campos faltantes · 409 correo duplicado · 500 error
 */
export const registrarUsuario = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { nombre, correo, contrasena } = req.body;

        // Verificar que los campos estén completos
        if (!nombre || !correo || !contrasena) {
            res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
            return;
        }

        // Comprobar si el correo ya existe
        const usuarioExistente = await Usuario.findOne({
            where: { correo }
        });

        if (usuarioExistente) {
            res.status(409).json({
                mensaje: "El correo ya está registrado"
            });
            return;
        }

        // Proteger la contraseña
        const contrasenaProtegida = await bcrypt.hash(contrasena, 10);

        // Registrar el usuario en MySQL
        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            contrasena: contrasenaProtegida
        });

        // Enviar correo de bienvenida al usuario recién registrado
        // No interrumpe el registro si falla el envío
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: nuevoUsuario.get("correo") as string,
            subject: "Bienvenido - Control de Gastos",
            text: `Hola ${nuevoUsuario.get("nombre")},

¡Bienvenido al Sistema de Control de Gastos!

Tu cuenta fue creada correctamente. Ya puedes iniciar
sesión y comenzar a administrar tus proyectos,
presupuestos y gastos.

Si no creaste esta cuenta, ignora este mensaje.`
        }).then(() => {
            console.log("Correo de bienvenida enviado");
        }).catch((error) => {
            console.error("No se pudo enviar el correo de bienvenida:", error);
        });

        // Responder sin mostrar la contraseña
        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: formatearUsuario(nuevoUsuario)
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });
    }
};


/**
 * Inicia sesión validando correo y contraseña.
 * Genera un token JWT (expira en 1 hora) firmado con JWT_SECRET y envía,
 * en segundo plano, un correo de notificación al usuario.
 *
 * Body: { correo, contrasena }
 * Respuestas: 200 { mensaje, token, usuario } · 400 campos faltantes · 401 credenciales incorrectas · 500 error
 */
export const iniciarSesion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo, contrasena } = req.body;

        // Verificar que se ingresaron los datos
        if (!correo || !contrasena) {
            res.status(400).json({
                mensaje: "El correo y la contraseña son obligatorios"
            });
            return;
        }

        // Buscar el usuario por su correo
        const usuario = await Usuario.findOne({
            where: { correo }
        });

        // Verificar si existe el usuario
        if (!usuario) {
            res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
            return;
        }

        // Comparar la contraseña con la guardada en MySQL
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.get("contrasena") as string
        );

        if (!contrasenaCorrecta) {
            res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
            return;
        }

        // Obtener la clave secreta del archivo .env
        const claveSecreta = process.env.JWT_SECRET;

        if (!claveSecreta) {
            throw new Error("JWT_SECRET no está configurada");
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuario.get("id"),
                correo: usuario.get("correo")
            },
            claveSecreta,
            { expiresIn: "1h" }
        );


        // Enviar una notificación al correo del usuario
        // No interrumpe el inicio de sesión si falla el envío
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.get("correo") as string,
            subject: "Inicio de sesión - Control de Gastos",
            text: `Hola ${usuario.get("nombre")},

Se ha iniciado sesión correctamente en tu cuenta
del Sistema de Control de Gastos.

Si no reconoces esta actividad, te recomendamos
cambiar tu contraseña.`
        }).then(() => {
            console.log("Correo de notificación enviado");
        }).catch((error) => {
            console.error("No se pudo enviar el correo:", error);
        });



        // Responder con los datos del usuario y el token
        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: formatearUsuario(usuario)
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};


/**
 * Lista los usuarios con paginación. Solo administradores.
 *
 * Query: pagina (por defecto 1), limite (por defecto 10, máximo 100)
 * Respuestas: 200 { total, pagina, limite, total_paginas, usuarios } · 400 query inválida
 *             · 401 sin token · 403 no es administrador · 500 error
 */
export const listarUsuarios = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const pagina = Number(req.query.pagina ?? 1);
        const limite = Number(req.query.limite ?? 10);

        const { count, rows } = await Usuario.findAndCountAll({
            attributes: ATRIBUTOS_PUBLICOS,
            order: [["id", "ASC"]],
            limit: limite,
            offset: (pagina - 1) * limite
        });

        res.status(200).json({
            total: count,
            pagina,
            limite,
            total_paginas: Math.ceil(count / limite),
            usuarios: rows.map(formatearUsuario)
        });

    } catch (error) {
        console.error("Error al listar usuarios:", error);

        res.status(500).json({
            mensaje: "Error al listar los usuarios"
        });
    }
};


/**
 * Consulta un usuario por su id. Un administrador puede consultar a cualquiera;
 * un usuario normal solo a sí mismo (lo controla administradorOPropietario).
 *
 * Params: id
 * Respuestas: 200 { usuario } · 400 id inválido · 401 sin token · 403 sin permiso
 *             · 404 no existe · 500 error
 */
export const consultarUsuario = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuario = await Usuario.findByPk(Number(req.params.id), {
            attributes: ATRIBUTOS_PUBLICOS
        });

        if (!usuario) {
            res.status(404).json({
                mensaje: "El usuario no existe"
            });
            return;
        }

        res.status(200).json({
            usuario: formatearUsuario(usuario)
        });

    } catch (error) {
        console.error("Error al consultar el usuario:", error);

        res.status(500).json({
            mensaje: "Error al consultar el usuario"
        });
    }
};


/**
 * Actualiza nombre, correo, contraseña y/o rol de un usuario.
 * Un administrador puede actualizar a cualquiera; un usuario normal solo a sí mismo.
 *
 * Reglas de seguridad:
 *  - solo un administrador puede cambiar el `rol`, y nadie puede cambiar el suyo
 *    (así no se puede quedar el sistema sin administradores);
 *  - quien cambia SU PROPIA contraseña debe enviar `contrasena_actual`
 *    (un administrador que restablece la de otro usuario no la necesita);
 *  - la nueva contraseña se guarda cifrada con bcrypt.
 *
 * Params: id
 * Body: { nombre?, correo?, contrasena?, contrasena_actual?, rol? } (al menos un campo)
 * Respuestas: 200 { mensaje, usuario } · 400 datos inválidos · 401 sin token
 *             · 403 sin permiso / contraseña actual incorrecta · 404 no existe
 *             · 409 correo duplicado · 500 error
 */
export const actualizarUsuario = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const actor = res.locals.usuario as UsuarioToken;
        const esAdministrador = res.locals.esAdministrador as boolean;
        const esPropio = id === actor.id;

        const { nombre, correo, contrasena, contrasena_actual, rol } = req.body;

        // aquí sí se necesita el hash (para verificar la contraseña actual),
        // por eso no se limitan los attributes; nunca se devuelve tal cual
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            res.status(404).json({
                mensaje: "El usuario no existe"
            });
            return;
        }

        // el rol solo lo cambia un administrador y nunca el propio
        if (rol !== undefined && rol !== usuario.get("rol")) {
            if (!esAdministrador) {
                res.status(403).json({
                    mensaje: "Solo un administrador puede cambiar el rol"
                });
                return;
            }

            if (esPropio) {
                res.status(403).json({
                    mensaje: "No puedes cambiar tu propio rol"
                });
                return;
            }
        }

        // el correo no puede pertenecer a otro usuario
        if (correo !== undefined && correo !== usuario.get("correo")) {
            const correoEnUso = await Usuario.findOne({ where: { correo } });

            if (correoEnUso) {
                res.status(409).json({
                    mensaje: "El correo ya está registrado"
                });
                return;
            }
        }

        const cambios: Record<string, unknown> = {};

        if (nombre !== undefined) cambios.nombre = nombre;
        if (correo !== undefined) cambios.correo = correo;
        if (rol !== undefined) cambios.rol = rol;

        if (contrasena !== undefined) {
            // para cambiar la propia contraseña hay que demostrar que se conoce la actual
            if (esPropio) {
                const actualCorrecta =
                    typeof contrasena_actual === "string" &&
                    await bcrypt.compare(
                        contrasena_actual,
                        usuario.get("contrasena") as string
                    );

                if (!actualCorrecta) {
                    res.status(403).json({
                        mensaje: "La contraseña actual es incorrecta"
                    });
                    return;
                }
            }

            cambios.contrasena = await bcrypt.hash(contrasena, 10);
        }

        await usuario.update(cambios);

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            usuario: formatearUsuario(usuario)
        });

    } catch (error) {
        // dos peticiones simultáneas con el mismo correo: lo detecta MySQL
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                mensaje: "El correo ya está registrado"
            });
            return;
        }

        console.error("Error al actualizar el usuario:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el usuario"
        });
    }
};


/**
 * Elimina un usuario y todos sus archivos (registros en MySQL y archivos del
 * disco). Solo administradores, y un administrador no puede eliminarse a sí mismo.
 *
 * Los registros se borran en una transacción (todo o nada) y después se borran
 * los archivos físicos; si alguno no se puede borrar solo se deja registrado en
 * consola, porque el usuario ya fue eliminado.
 *
 * Params: id
 * Respuestas: 200 { mensaje, archivos_eliminados } · 400 id inválido · 401 sin token
 *             · 403 no es administrador / intenta eliminarse a sí mismo
 *             · 404 no existe · 500 error
 */
export const eliminarUsuario = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const actor = res.locals.usuario as UsuarioToken;

        if (id === actor.id) {
            res.status(403).json({
                mensaje: "No puedes eliminar tu propia cuenta"
            });
            return;
        }

        const usuario = await Usuario.findByPk(id, { attributes: ["id"] });

        if (!usuario) {
            res.status(404).json({
                mensaje: "El usuario no existe"
            });
            return;
        }

        // archivos del usuario: la fk de `archivos` impide borrar al usuario sin ellos
        const archivos = await Archivo.findAll({ where: { usuario_id: id } });

        await db.transaction(async (transaccion) => {
            await Archivo.destroy({
                where: { usuario_id: id },
                transaction: transaccion
            });

            await usuario.destroy({ transaction: transaccion });
        });

        // limpiar el disco ya con la base de datos confirmada
        await Promise.all(
            archivos.map((archivo) =>
                borrarDelDisco(rutaArchivo(archivo.tipo, archivo.nombre))
                    .catch((error) => {
                        console.error(
                            `No se pudo borrar del disco ${archivo.nombre}:`,
                            error
                        );
                    })
            )
        );

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente",
            archivos_eliminados: archivos.length
        });

    } catch (error) {
        console.error("Error al eliminar el usuario:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el usuario"
        });
    }
};
