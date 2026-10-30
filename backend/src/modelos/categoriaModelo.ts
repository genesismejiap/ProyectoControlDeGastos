
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { db } from "../configuraciones/db.js";

/**
 * Modelo de la tabla `categorias`.
 * Agrupa gastos y entregables de presupuesto (ej.: Materiales, Mano de obra).
 *
 * - id: clave primaria autoincremental
 * - nombre: nombre de la categoría (máx. 100 caracteres, obligatorio)
 * - descripcion: texto opcional
 */
export class Categoria extends Model<
    InferAttributes<Categoria>,
    InferCreationAttributes<Categoria>
> {
    declare id: CreationOptional<number>;
    declare nombre: string;
    declare descripcion: string | null;
}

Categoria.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize: db,
        tableName: "categorias",
        timestamps: false
    }
);

export default Categoria;
