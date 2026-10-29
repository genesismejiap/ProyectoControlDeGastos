
import { DataTypes } from "sequelize";
import { db } from "../configuraciones/db.js";

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
