
import { DataTypes } from "sequelize";
import { db } from "../configuraciones/db.js";

export const Proyecto = db.define("Proyecto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    ubicacion: {
        type: DataTypes.STRING(150),
        allowNull: true
    },

    presupuesto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },

    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }

}, {
    tableName: "proyectos",
    timestamps: false
});
