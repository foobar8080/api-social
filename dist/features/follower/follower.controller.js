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
const base_controller_1 = __importDefault(require("../../shared/controllers/base.controller"));
const follower_service_1 = __importDefault(require("./follower.service"));
const error_list_1 = require("../../shared/exception-handler/error-list");
class FollowerController extends base_controller_1.default {
    /**
     * Add record to the `Followers` table
     */
    follow() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uid, followingUid, pro } = req.body;
            if (!this.isUidCorrect(followingUid, uid))
                return next(error_list_1.ERROR.BAD_REQUEST('Follow failed.'));
            const isFollowSuccess = yield follower_service_1.default.follow(uid, followingUid, pro);
            if (!isFollowSuccess)
                return next(error_list_1.ERROR.BAD_REQUEST('Follow failed.'));
            this.sendResponse(res, null);
        }));
    }
    /**
     * Delete record from the `Followers` table
     */
    unfollow() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uid, unfollowingUid } = req.body;
            if (!this.isUidCorrect(unfollowingUid, uid))
                return next(error_list_1.ERROR.BAD_REQUEST('Unfollow failed.'));
            const isUnfollowSuccess = yield follower_service_1.default.unfollow(uid, unfollowingUid);
            if (!isUnfollowSuccess)
                return next(error_list_1.ERROR.BAD_REQUEST('Unfollow failed.'));
            this.sendResponse(res, null);
        }));
    }
    // -------------------------------
    // Private methods
    // -------------------------------
    isUidCorrect(followingUid, myUid) {
        const isFollowingUidValid = typeof followingUid === 'string' && followingUid.length === 12;
        const isDifferentFromMyUid = followingUid !== myUid;
        return isFollowingUidValid && isDifferentFromMyUid;
    }
}
exports.default = new FollowerController();
