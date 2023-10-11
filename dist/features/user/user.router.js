"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guards_middleware_1 = __importDefault(require("../../shared/middlewares/guards.middleware"));
const user_controller_1 = __importDefault(require("./user.controller"));
const uid_middleware_1 = require("../../shared/middlewares/uid.middleware");
const request_ip_1 = __importDefault(require("request-ip")); // https://www.npmjs.com/package/request-ip Get user ip and set it on the `req.clientIp`
const userRouter = (0, express_1.Router)();
userRouter.post(
// Create / Get one record in `Users` table
'/user/initialize', request_ip_1.default.mw(), guards_middleware_1.default.isBannedByIP, guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, user_controller_1.default.authorizeMe());
userRouter.get(
// Get one record by `uid` from `Users` table
'/user/:uid', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, guards_middleware_1.default.isAdmin, user_controller_1.default.getUserByUid());
userRouter.get(
// Get all records by `uid` / `name` / `email` / `role` / `pro` / `banId` / `firebaseId` from `Users` table
'/user/:column/:value', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, guards_middleware_1.default.isAdmin, user_controller_1.default.getUsersRecords());
userRouter.patch(
// Update `name`, `details`, `profileUpdatedAt` in `Users` table
'/user', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, user_controller_1.default.updateUserInfo());
userRouter.patch(
// Change `pro` in `Users` table
'/user/pro', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, user_controller_1.default.updateProRecord());
userRouter.patch(
// Update `role` in `Users` table
'/user/role', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, guards_middleware_1.default.isSuperAdmin, user_controller_1.default.updateUserRole());
exports.default = userRouter;
