"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const env = (_b = (_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : 'development';
dotenv_1.default.config({ path: env === 'production' ? '.env' : '.env.development' });
