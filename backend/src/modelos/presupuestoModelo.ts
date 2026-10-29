
import { DataTypes } from "sequelize";
import { db } from "../configuraciones/db.js";

export const Presupuesto = db.define("Presupuesto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    proyecto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "proyectos",
            key: "id"
        }
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "Borrador"
    }

}, {
    tableName: "presupuestos",
    timestamps: false
});
