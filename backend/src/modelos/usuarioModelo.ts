
import { DataTypes } from "sequelize";
import { db } from "../configuraciones/db.js";

/**
 * Modelo de la tabla `usuarios`.
 *
 * - id: clave primaria autoincremental
 * - nombre: nombre del usuario (máx. 100 caracteres)
 * - correo: correo único (máx. 150 caracteres)
 * - contrasena: hash bcrypt de la contraseña (nunca se guarda en texto plano)
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
    }

}, {
    tableName: "usuarios",
    timestamps: true
});
