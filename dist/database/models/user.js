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
    roleEnd: sequelize_1.DataTypes.DATE,
    pro: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    proEnd: sequelize_1.DataTypes.DATE,
    reports: sequelize_1.DataTypes.JSONB,
    reportsUpdatedAt: sequelize_1.DataTypes.DATE,
    inShadow: sequelize_1.DataTypes.BOOLEAN,
    inShadowEnd: sequelize_1.DataTypes.DATE,
    profileInfo: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    profileInfoUpdatedAt: sequelize_1.DataTypes.DATE,
    googleId: sequelize_1.DataTypes.STRING,
    firebaseId: sequelize_1.DataTypes.STRING
}, {
    sequelize: db_connection_1.default,
    tableName: 'Users'
    // underscored: true
});
exports.default = User;
