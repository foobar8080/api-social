"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = __importDefault(require("./health.controller"));
const healthRouter = (0, express_1.Router)();
healthRouter.get(
//
'/', health_controller_1.default.checkHealth());
exports.default = healthRouter;
