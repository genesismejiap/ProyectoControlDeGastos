
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { db } from "../configuraciones/db.js";

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
