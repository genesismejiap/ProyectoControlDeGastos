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
            allowNull: false,
            unique: true
        },

        fecha_expiracion: {
            type: DataTypes.DATE,
            allowNull: false
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