"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guards_middleware_1 = __importDefault(require("../../shared/middlewares/guards.middleware"));
const uid_middleware_1 = require("../../shared/middlewares/uid.middleware");
const follower_controller_1 = __importDefault(require("./follower.controller"));
const followerRouter = (0, express_1.Router)();
followerRouter.post(
// Add record to the `Followers` table
'/relation/follow', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, follower_controller_1.default.follow());
followerRouter.delete(
// Delete record from the `Followers` table
'/relation/unfollow', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, follower_controller_1.default.unfollow());
exports.default = followerRouter;
