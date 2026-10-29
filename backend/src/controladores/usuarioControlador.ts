
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../modelos/usuarioModelo.js";
import jwt from "jsonwebtoken";

// Registrar un usuario
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

        // Responder sin mostrar la contraseña
        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario.get("id"),
                nombre: nuevoUsuario.get("nombre"),
                correo: nuevoUsuario.get("correo")
            }
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });
    }
};


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

        // Responder con los datos del usuario y el token
        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.get("id"),
                nombre: usuario.get("nombre"),
                correo: usuario.get("correo")
            }
        });

    } catch (error) {
    console.error("Error al iniciar sesión:", error);

    res.status(500).json({
        mensaje: "Error al iniciar sesión"
    });
}
};


