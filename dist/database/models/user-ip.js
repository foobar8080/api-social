"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db-connection"));
class UserIp extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userUid' });
    }
}
UserIp.init({
    userUid: sequelize_1.DataTypes.STRING,
    ip: sequelize_1.DataTypes.STRING,
    typeIp: sequelize_1.DataTypes.INTEGER
}, {
    sequelize: db_connection_1.default,
    tableName: 'UserIps'
    // underscored: true
});
exports.default = UserIp;
