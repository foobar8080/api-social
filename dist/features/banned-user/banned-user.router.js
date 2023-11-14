"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannedUserRouter = (0, express_1.Router)();
// bannedUserRouter.get(
//   // Get records by `uid` / `ip` / `banId` from `BannedUsers` table
//   '/ban/:column/:value',
//   Guards.verifyToken,
//   generateUid,
//   Guards.isAdmin,
//   bannedUserController.getBannedRecords()
// );
// bannedUserRouter.patch(
//   // Ban user by `uid`
//   '/ban',
//   Guards.verifyToken,
//   generateUid,
//   Guards.isAdmin,
//   bannedUserController.banUser()
// );
// bannedUserRouter.patch(
//   // Unban user by `uid`
//   '/unban',
//   Guards.verifyToken,
//   generateUid,
//   Guards.isAdmin,
//   bannedUserController.unbanUser()
// );
exports.default = bannedUserRouter;
