"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const followerRouter = (0, express_1.Router)();
// followerRouter.post(
//   // Add record to the `Followers` table
//   '/relation/follow',
//   Guards.verifyToken,
//   generateUid,
//   followerController.follow()
// );
// followerRouter.delete(
//   // Delete record from the `Followers` table
//   '/relation/unfollow',
//   Guards.verifyToken,
//   generateUid,
//   followerController.unfollow()
// );
exports.default = followerRouter;
