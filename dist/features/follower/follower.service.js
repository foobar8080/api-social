"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
class FollowerService extends base_service_1.default {
}
exports.default = new FollowerService(models_1.Follower);
