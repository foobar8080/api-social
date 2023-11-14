"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
const os = __importStar(require("os"));
const process = __importStar(require("process"));
const api = (_a = process.env.API) === null || _a === void 0 ? void 0 : _a.trim();
const bytesToGB = (bytes) => {
    return bytes / (1024 * 1024 * 1024);
};
class HealthService extends base_service_1.default {
    checkHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            const uptimeInSeconds = process.uptime();
            const days = Math.floor(uptimeInSeconds / (60 * 60 * 24));
            const hours = Math.floor((uptimeInSeconds % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
            const uptime = `${days} days / ${hours} hours / ${minutes} minutes`;
            const totalMemory = bytesToGB(os.totalmem());
            const freeMemory = bytesToGB(os.freemem());
            const usedMemory = totalMemory - freeMemory;
            const health = {
                api,
                version: '1.6',
                timestamp: new Date().toLocaleString(),
                uptime,
                RAM: `Total: ${totalMemory.toFixed(2)} GB / Free: ${freeMemory.toFixed(2)} GB / Used: ${usedMemory.toFixed(2)} GB`,
                platform: os.platform(),
                arch: os.arch(),
                type: os.type(),
                release: os.release(),
                hostname: os.hostname(),
                cpus: os.cpus()
            };
            return health;
        });
    }
}
exports.default = new HealthService(models_1.User);
