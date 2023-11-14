"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guards_middleware_1 = __importDefault(require("../../shared/middlewares/guards.middleware"));
const user_controller_1 = __importDefault(require("./user.controller"));
const uid_middleware_1 = require("../../shared/middlewares/uid.middleware");
// import requestIp from 'request-ip'; // https://www.npmjs.com/package/request-ip (get user IP and set it on the `req.clientIp`)
const userRouter = (0, express_1.Router)();
// ----------------------------------
// Routes the client side works with
// ----------------------------------
userRouter.post(
// Create / Get one record in `Users` table
'/user', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, user_controller_1.default.authorizeMe()
// requestIp.mw(),
// Guards.saveIpIfNotExists(),
// Guards.isBannedByIpOrUid(),
);
userRouter.patch(
// Update `name`, `profileInfo`, `profileInfoUpdatedAt` in `Users` table
'/user', guards_middleware_1.default.verifyToken, uid_middleware_1.generateUid, user_controller_1.default.updateUserInfo());
// userRouter.patch(
//   // Change `pro` in `Users` table
//   '/user/pro',
//   Guards.verifyToken,
//   generateUid,
//   UserController.updateProRecord()
// );
// userRouter.patch(
//   // Update `role` in `Users` table
//   '/user/role',
//   Guards.verifyToken,
//   generateUid,
//   Guards.isSuperAdmin,
//   UserController.updateUserRole()
// );
// ------------------------------------------
// Routes that can only be used from Postman
// ------------------------------------------
// userRouter.get(
//   // Get one record by `uid` from `Users` table
//   '/user/:uid',
//   Guards.verifyToken,
//   generateUid,
//   Guards.isAdmin,
//   UserController.getUserByUid()
// );
// userRouter.get(
//   // Get all records by `uid` / `name` / `email` / `role` / `pro` / `banId` / `firebaseId` from `Users` table
//   '/user/:column/:value',
//   Guards.verifyToken,
//   generateUid,
//   Guards.isAdmin,
//   UserController.getUsersRecords()
// );
exports.default = userRouter;
