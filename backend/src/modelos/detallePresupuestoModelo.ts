
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { db } from "../configuraciones/db.js";

/**
 * Modelo de la tabla `detalle_presupuesto`.
 * Cada registro es un entregable (ítem) dentro de un presupuesto.
 *
 * - id: clave primaria autoincremental
 * - presupuesto_id: FK a `presupuestos.id`
 * - categoria_id: FK a `categorias.id`
 * - entregable: descripción del ítem (máx. 150 caracteres)
 * - cantidad: entero mayor o igual a 1
 * - precio_unitario: DECIMAL(12,2) mayor o igual a 0
 */
export class DetallePresupuesto extends Model<
    InferAttributes<DetallePresupuesto>,
    InferCreationAttributes<DetallePresupuesto>
> {
    declare id: CreationOptional<number>;
    declare presupuesto_id: number;
    declare categoria_id: number;
    declare entregable: string;
    declare cantidad: number;
    declare precio_unitario: number;
}

DetallePresupuesto.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        presupuesto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "presupuestos",
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

        entregable: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },

        precio_unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        }
    },
    {
        sequelize: db,
        tableName: "detalle_presupuesto",
        timestamps: false
    }
);

export default DetallePresupuesto;
