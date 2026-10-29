
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../modelos/usuarioModelo.js";

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
