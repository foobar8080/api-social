"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const umzug_1 = require("umzug");
const db_connection_1 = __importDefault(require("../db-connection"));
const migrationEngine = new umzug_1.Umzug({
    migrations: {
        glob: ['migration-files/*.{js,ts}', { cwd: __dirname }]
    },
    context: db_connection_1.default,
    storage: new umzug_1.SequelizeStorage({ sequelize: db_connection_1.default }),
    logger: console
});
exports.default = migrationEngine;
