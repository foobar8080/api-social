"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db-connection"));
class Follower extends sequelize_1.Model {
}
Follower.init({
    followerUid: sequelize_1.DataTypes.STRING,
    followingUid: sequelize_1.DataTypes.STRING
}, {
    sequelize: db_connection_1.default,
    tableName: 'Followers',
    // underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['followerUid', 'followingUid'] // Add the fields that should have unique combinations
        }
    ]
});
exports.default = Follower;
