"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db-connection"));
class BannedUser extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userUid' });
    }
}
BannedUser.init({
    userUid: sequelize_1.DataTypes.STRING,
    ip: sequelize_1.DataTypes.STRING,
    banId: sequelize_1.DataTypes.INTEGER,
    unbanAt: sequelize_1.DataTypes.DATE
}, {
    sequelize: db_connection_1.default,
    tableName: 'BannedUsers'
    // underscored: true
});
exports.default = BannedUser;
