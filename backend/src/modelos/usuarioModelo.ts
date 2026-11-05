
import { DataTypes } from "sequelize";
import { db } from "../configuraciones/db.js";

/** Roles válidos de un usuario. */
export const ROLES = ["usuario", "administrador"] as const;
export type Rol = typeof ROLES[number];

/**
 * Campos que se pueden devolver de un usuario. Excluye `contrasena`.
 * Úsalo en el `attributes` de cada consulta que responda al cliente.
 */
export const ATRIBUTOS_PUBLICOS = [
    "id",
    "nombre",
    "correo",
    "rol",
    "createdAt",
    "updatedAt"
];

/**
 * Modelo de la tabla `usuarios`.
 *
 * - id: clave primaria autoincremental
 * - nombre: nombre del usuario (máx. 100 caracteres)
 * - correo: correo único (máx. 150 caracteres)
 * - contrasena: hash bcrypt de la contraseña (nunca se guarda en texto plano)
 * - rol: "usuario" (por defecto) o "administrador". Solo un administrador
 *   puede listar y eliminar usuarios o cambiar el rol de alguien.
 *
 * Incluye las columnas automáticas createdAt y updatedAt (timestamps).
 */
export const Usuario = db.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },

    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    rol: {
        type: DataTypes.ENUM(...ROLES),
        allowNull: false,
        defaultValue: "usuario"
    }

}, {
    tableName: "usuarios",
    timestamps: true
});
