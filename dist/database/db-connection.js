"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sequelize_1 = require("sequelize");
const db = process.env.DB;
const sequelizeConnection = new sequelize_1.Sequelize(db, {
    dialect: 'postgres'
});
exports.default = sequelizeConnection;
