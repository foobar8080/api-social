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
            const { uid, followUid } = req.body;
            if (uid === followUid)
                return next(error_list_1.ERROR.BAD_FOLLOW_REQUEST('A user cannot follow themselves.'));
            yield follower_service_1.default.follow(uid, followUid);
            const message = `Follow user with uid ${followUid} was successful.`;
            this.sendResponse(res, { message });
        }));
    }
    /**
     * Delete record from the `Followers` table
     */
    unfollow() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uid, unfollowUid } = req.body;
            if (uid === unfollowUid)
                return next(error_list_1.ERROR.BAD_FOLLOW_REQUEST('A user cannot unfollow themselves.'));
            const deleteNumber = yield follower_service_1.default.unfollow(uid, unfollowUid);
            let message;
            if (deleteNumber > 0) {
                message = `Unfollow user with uid ${unfollowUid} was successful.`;
            }
            else {
                message = `Cannot find user with uid ${unfollowUid}.`;
            }
            this.sendResponse(res, { message, deleteNumber });
        }));
    }
}
exports.default = new FollowerController();
