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
    yield sequelize.getQueryInterface().createTable('Users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            type: sequelize_1.DataTypes.INTEGER
        },
        // ------------------------
        // Primary key
        // ------------------------
        uid: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.STRING
        },
        name: {
            type: sequelize_1.DataTypes.STRING
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING
        },
        email: {
            type: sequelize_1.DataTypes.STRING
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'user'
        },
        pro: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        proEnd: {
            type: sequelize_1.DataTypes.DATE
        },
        ips: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: []
        },
        details: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        banId: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        unbanAt: {
            type: sequelize_1.DataTypes.DATE
        },
        googleId: {
            type: sequelize_1.DataTypes.STRING
        },
        firebaseId: {
            type: sequelize_1.DataTypes.STRING
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
    yield sequelize.getQueryInterface().dropTable('Users');
});
exports.down = down;