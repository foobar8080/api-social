"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db-connection"));
class User extends sequelize_1.Model {
}
User.init({
    uid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    name: sequelize_1.DataTypes.STRING,
    avatar: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    role: sequelize_1.DataTypes.STRING,
    pro: sequelize_1.DataTypes.INTEGER,
    proEnd: sequelize_1.DataTypes.DATE,
    ips: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    details: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    banId: sequelize_1.DataTypes.INTEGER,
    unbanAt: sequelize_1.DataTypes.DATE,
    googleId: sequelize_1.DataTypes.STRING,
    firebaseId: sequelize_1.DataTypes.STRING,
    profileUpdatedAt: sequelize_1.DataTypes.DATE
}, {
    sequelize: db_connection_1.default,
    tableName: 'Users'
    // underscored: true
});
exports.default = User;
