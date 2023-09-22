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
const async_wrapper_middleware_1 = require("../middlewares/async-wrapper.middleware");
const express_1 = require("express");
const checkHealth = () => __awaiter(void 0, void 0, void 0, function* () {
    const health = {
        uptime: `${process.uptime() / 3600} hours`,
        message: 'OK',
        timestamp: new Date().toLocaleString()
        // db: {
        //   connected: true, // replace with actual status of database connection
        //   message: "OK",
        // },
        // redis: {
        //   connected: true, // replace with actual status of Redis connection
        //   message: "OK",
        // },
    };
    return health;
});
const healthController = (0, express_1.Router)();
healthController.get('/health', (0, async_wrapper_middleware_1.asyncWrap)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const health = yield checkHealth();
    return res.send(health);
})));
exports.default = healthController;
