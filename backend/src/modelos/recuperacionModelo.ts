import { DataTypes } from "sequelize";
import { db } from "../configuraciones/db.js";
import { Usuario } from "./usuarioModelo.js";

export const RecuperacionContrasena = db.define(
    "RecuperacionContrasena",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        token_hash: {
            type: DataTypes.CHAR(64),
            allowNull: true,
            unique: true
        },

        codigo_hash: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        fecha_expiracion: {
            type: DataTypes.DATE,
            allowNull: false
        },

        intentos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        verificado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        utilizado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "recuperacion_contrasenas",
        timestamps: true
    }
);

RecuperacionContrasena.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    onDelete: "CASCADE"
});