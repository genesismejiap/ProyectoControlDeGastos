
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { db } from "../configuraciones/db.js";
import type { TipoArchivo } from "../configuraciones/multerConfig.js";

/**
 * modelo de la tabla `archivos`.
 * registra cada imagen o documento subido y el usuario dueño del archivo,
 * además del proyecto al que pertenece cuando se especifica.
 *
 * - id: clave primaria autoincremental
 * - usuario_id: fk a `usuarios.id` (dueño del archivo)
 * - proyecto_id: fk opcional a `proyectos.id`
 * - tipo: "imagen" o "documento"
 * - nombre: nombre único con el que se guardó en `uploads` (máx. 255 caracteres)
 * - nombre_original: nombre del archivo en el equipo del usuario (máx. 255 caracteres)
 * - mimetype: tipo mime del archivo (máx. 100 caracteres)
 * - tamano_bytes: tamaño del archivo en bytes
 *
 * incluye las columnas automáticas createdAt (fecha de subida) y updatedAt.
 */
export class Archivo extends Model<
    InferAttributes<Archivo>,
    InferCreationAttributes<Archivo>
> {
    declare id: CreationOptional<number>;
    declare usuario_id: number;
    declare proyecto_id: number | null;
    declare tipo: TipoArchivo;
    declare nombre: string;
    declare nombre_original: string;
    declare mimetype: string;
    declare tamano_bytes: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Archivo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "usuarios",
                key: "id"
            }
        },

        proyecto_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "proyectos",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        },

        tipo: {
            type: DataTypes.ENUM("imagen", "documento"),
            allowNull: false
        },

        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },

        nombre_original: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        mimetype: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        tamano_bytes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize: db,
        tableName: "archivos",
        timestamps: true
    }
);

export default Archivo;
