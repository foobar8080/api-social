"use strict";
// import 'dotenv/config';
// import { Dialect, Sequelize } from 'sequelize';
Object.defineProperty(exports, "__esModule", { value: true });
// const dbName = process.env.DB_DATABASE as string;
// const dbUsername = process.env.DB_USERNAME as string;
// const dbPassword = process.env.DB_PASSWORD;
// const dbHost = process.env.DB_HOST;
// const dbPort = process.env.DB_PORT as unknown as number;
// const sequelizeConnection = new Sequelize(dbName, dbUsername, dbPassword, {
//   dialect: 'postgres' as Dialect,
//   host: dbHost,
//   port: dbPort,
//   logging: false
// });
// export default sequelizeConnection;
require("dotenv/config");
const sequelize_1 = require("sequelize");
const db = process.env.DB;
const sequelizeConnection = new sequelize_1.Sequelize(db, {
    dialect: 'postgres'
});
exports.default = sequelizeConnection;
