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
const user_service_1 = __importDefault(require("../user/user.service"));
class FollowerService extends base_service_1.default {
    /**
     * Add record to the `Followers` table
     */
    follow(followerUid, followingUid, pro) {
        return __awaiter(this, void 0, void 0, function* () {
            const followerUidCount = yield this.countRecords(followerUid);
            if (followerUidCount < 50)
                return this.createFollowersRecord(followerUid, followingUid);
            if (followerUidCount >= 50 && !pro)
                return false;
            const isPro = yield this.checkProStatus(followerUid);
            if (isPro)
                return this.createFollowersRecord(followerUid, followingUid);
            return false;
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
            return res > 0;
        });
    }
    // -------------------------------
    // Private methods
    // -------------------------------
    countRecords(followerUid) {
        const _super = Object.create(null, {
            count: { get: () => super.count }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield _super.count.call(this, { followerUid });
            return count;
        });
    }
    checkProStatus(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.default.getUserByUid(uid);
            return user ? user.pro.level > 0 : false;
        });
    }
    createFollowersRecord(followerUid, followingUid) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followersRecord = yield _super.create.call(this, { followerUid, followingUid });
                return !!followersRecord;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = new FollowerService(models_1.Follower);
