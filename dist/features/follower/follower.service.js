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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
class FollowerService extends base_service_1.default {
    /**
     * Add record to the `Followers` table
     */
    follow(followerUid, followingUid) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                followerUid,
                followingUid
            };
            // If user we try to follow not exists in db -> error happens that will be catched by error handler
            yield _super.create.call(this, data);
            // If no error occurred, the follow operation was successful
            return true;
        });
    }
    /**
     * Delete record from the `Followers` table
     */
    unfollow(followerUid, unfollowingUid) {
        const _super = Object.create(null, {
            deleteBulk: { get: () => super.deleteBulk }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                followerUid,
                followingUid: unfollowingUid
            };
            const res = yield _super.deleteBulk.call(this, data);
            return res;
        });
    }
}
exports.default = new FollowerService(models_1.Follower);
