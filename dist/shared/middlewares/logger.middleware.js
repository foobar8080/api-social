"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = exports.getLogger = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const winston_1 = require("winston");
const express_winston_1 = __importDefault(require("express-winston"));
const ENV = (_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim();
const logsFolder = './logs';
const { combine, timestamp, colorize, printf } = winston_1.format;
const formatMessage = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
});
const getLogger = () => {
    return ENV === 'development' ? loggerDev() : loggerProd();
};
exports.getLogger = getLogger;
// -----------------
// Create a loggers
// -----------------
const loggerDev = () => (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp({ format: 'HH:mm:ss' }), colorize(), formatMessage),
    transports: [new winston_1.transports.Console()]
});
const loggerProd = () => (0, winston_1.createLogger)({
    level: 'error',
    format: combine(timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }), formatMessage),
    transports: [new winston_1.transports.File({ filename: `${logsFolder}/errors.log` })]
});
// ----------------------------
// Create a logger middlewares
// ----------------------------
/** Add requestLogger before any other middlewares or routes */
const requestLogger = () => express_winston_1.default.logger({
    winstonInstance: (0, exports.getLogger)(),
    msg: (req, res) => '{{req.method}} {{req.originalUrl}} [{{res.statusCode}}]',
    // msg: (req, res) => '{{req.method}} {{req.originalUrl}} [{{res.statusCode}}]' + getReqBody(req),
    meta: false
});
exports.requestLogger = requestLogger;
/** Add errorLogger after all other middleware and routes, but before the error handler */
// prettier-ignore
const errorLogger = () => express_winston_1.default.errorLogger({
    winstonInstance: (0, exports.getLogger)(),
    msg: (req, res) => "{{req.method}} {{req.originalUrl}} [{{err.statusCode || 500}}] [{{err.name}}] {{err.message}}",
    // "{{req.method}} {{req.originalUrl}} [{{err.statusCode || 500}}]" + getReqBody(req) + " {{err.name}} {{err.message}}",
    meta: false,
});
exports.errorLogger = errorLogger;
// -------------------- //
function getReqBody(req) {
    const reqBody = req.body && Object.keys(req.body).length ? ' ' + JSON.stringify(req.body) : '';
    return reqBody;
}
