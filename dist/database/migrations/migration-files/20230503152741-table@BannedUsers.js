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
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const up = ({ context: sequelize }) => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.getQueryInterface().createTable('BannedUsers', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER
        },
        // ------------------------
        // Foreign key
        // ------------------------
        userUid: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING,
            references: {
                model: 'Users',
                key: 'uid' // references to the uid column in the Users table
            }
        },
        ip: {
            type: sequelize_1.DataTypes.STRING
        },
        banId: {
            type: sequelize_1.DataTypes.INTEGER
        },
        unbanAt: {
            type: sequelize_1.DataTypes.DATE
        },
        createdAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    });
});
exports.up = up;
const down = ({ context: sequelize }) => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.getQueryInterface().dropTable('BannedUsers');
});
exports.down = down;
