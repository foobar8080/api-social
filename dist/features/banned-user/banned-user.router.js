"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guards_middleware_1 = __importDefault(require("../../shared/middlewares/guards.middleware"));
const uid_middleware_1 = require("../../shared/middlewares/uid.middleware");
const banned_user_controller_1 = __importDefault(require("./banned-user.controller"));
const bannedUserRouter = (0, express_1.Router)();
bannedUserRouter.get(
// Get records by `uid` / `ip` / `banId` from `BannedUsers` table
'/ban/:column/:value', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, guards_middleware_1.default.isAdmin, banned_user_controller_1.default.getBannedRecords());
bannedUserRouter.patch(
// Ban user by `uid`
'/ban', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, guards_middleware_1.default.isAdmin, banned_user_controller_1.default.banUser());
bannedUserRouter.patch(
// Unban user by `uid`
'/unban', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, guards_middleware_1.default.isAdmin, banned_user_controller_1.default.unbanUser());
exports.default = bannedUserRouter;
