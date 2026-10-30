
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { db } from "../configuraciones/db.js";

/**
 * Modelo de la tabla `gastos`.
 * Registra un gasto real realizado en un proyecto.
 *
 * - id: clave primaria autoincremental
 * - proyecto_id: FK a `proyectos.id`
 * - categoria_id: FK a `categorias.id`
 * - descripcion: detalle del gasto (máx. 255 caracteres)
 * - monto: DECIMAL(12,2) mayor o igual a 0
 * - fecha: fecha del gasto (YYYY-MM-DD)
 */
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
