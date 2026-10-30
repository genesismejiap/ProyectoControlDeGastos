
/**
 * Conexión a la base de datos MySQL mediante Sequelize.
 *
 * Variables de entorno (.env): DB_NAME, DB_USER, DB_PASSWORD, DB_HOST (por defecto localhost)
 * y DB_PORT (por defecto 3306).
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/** Instancia compartida de Sequelize usada por todos los modelos. */
export const db = new Sequelize(
    process.env.DB_NAME || "",
    process.env.DB_USER || "",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: false
    }
);
