"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbInitializer = void 0;
const sequelize_1 = require("sequelize");
const host = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost';
// Superuser
const superuser = {
    db: (_b = process.env.DB_DATABASE_DEFAULT) !== null && _b !== void 0 ? _b : 'postgres',
    name: (_c = process.env.DB_SUPERUSER) !== null && _c !== void 0 ? _c : 'postgres',
    password: (_d = process.env.DB_SUPERUSER_PASSWORD) !== null && _d !== void 0 ? _d : ''
};
// User for API clients
const apiUser = {
    db: (_e = process.env.DB_DATABASE) !== null && _e !== void 0 ? _e : '',
    name: (_f = process.env.DB_USERNAME) !== null && _f !== void 0 ? _f : '',
    password: (_g = process.env.DB_PASSWORD) !== null && _g !== void 0 ? _g : ''
};
/**
 * Connect to default database as a superuser.
 * Create a new database as superuser if it doesn't exist
 * (all API clients will connect to this database)
 */
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = new sequelize_1.Sequelize(superuser.db, superuser.name, superuser.password, {
            host,
            dialect: 'postgres'
        });
        try {
            const [results] = yield sequelize.query(`
      SELECT 1
      FROM pg_database
      WHERE datname = '${apiUser.db}';
    `);
            if (results.length === 0) {
                yield sequelize.query(`CREATE DATABASE ${apiUser.db};`);
                console.log('=== Database created successfully ===');
            }
            else {
                console.log('=== Database already exists ===');
            }
        }
        catch (error) {
            console.error('=== Error creating database ===', error);
        }
    });
}
/**
 * Connect to a new database as a superuser.
 * Create a regular user by superuser if it doesn't exist
 * (this user will be used by API clients)
 */
function createUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = new sequelize_1.Sequelize(apiUser.db, superuser.name, superuser.password, {
            host,
            dialect: 'postgres'
        });
        try {
            const [results] = yield sequelize.query(`
      SELECT 1
      FROM pg_user
      WHERE usename = '${apiUser.name}';
    `);
            if (results.length === 0) {
                yield sequelize.query(`CREATE USER ${apiUser.name} WITH PASSWORD '${apiUser.password}';`);
                console.log('=== User created successfully ===');
                yield sequelize.query(`GRANT CONNECT ON DATABASE ${apiUser.db} TO ${apiUser.name};`);
                console.log('=== Login privileges granted successfully ===');
                yield sequelize.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${apiUser.name};`);
                console.log('=== CRUD privileges granted successfully ===');
            }
            else {
                console.log('=== User already exists ===');
            }
        }
        catch (error) {
            console.error('=== Error creating User ===', error);
        }
    });
}
/**
 * Create a new Database and a new User with a CRUD privileges for the API clients
 */
function dbInitializer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createDatabase();
        yield createUser();
        console.log('=== Database and User initialization completed ===');
    });
}
exports.dbInitializer = dbInitializer;
