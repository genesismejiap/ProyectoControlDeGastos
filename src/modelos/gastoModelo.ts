
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { db } from "../configuraciones/db.js";

export class Gasto extends Model<
    InferAttributes<Gasto>,
    InferCreationAttributes<Gasto>
> {
    declare id: CreationOptional<number>;
    declare proyecto_id: number;
    declare categoria_id: number;
    declare descripcion: string;
    declare monto: number;
    declare fecha: string;
}

Gasto.init(
    {
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

        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categorias",
                key: "id"
            }
        },

        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        monto: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: "gastos",
        timestamps: false
    }
);

export default Gasto;
