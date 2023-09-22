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
const banned_user_service_1 = __importDefault(require("./banned-user.service"));
const error_list_1 = require("../../shared/exception-handler/error-list");
class BannedUserController extends base_controller_1.default {
    /**
     * Get records by `uid` / `ip` / `banId` from `BannedUsers` table
     */
    getBannedRecords() {
        return this.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const column = req.params.column;
            const value = req.params.value;
            let convertedValue = value;
            if (column === 'banId')
                convertedValue = parseInt(value);
            const bannedUser = yield banned_user_service_1.default.getBannedRecords(column, convertedValue);
            this.sendResponse(res, bannedUser);
        }));
    }
    /**
     * Ban user by `uid`
     */
    banUser() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uidToBan, banId } = req.body;
            const isBanSuccessful = yield banned_user_service_1.default.banUser(uidToBan, banId);
            if (!isBanSuccessful)
                return next(error_list_1.ERROR.NOT_FOUND());
            const message = `User with uid ${uidToBan} has been successfully banned.`;
            this.sendResponse(res, { message });
        }));
    }
    /**
     * Unban user by `uid`
     */
    unbanUser() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uidToUnban } = req.body;
            const isUnbanSuccessful = yield banned_user_service_1.default.unbanUser(uidToUnban);
            if (!isUnbanSuccessful)
                return next(error_list_1.ERROR.NOT_FOUND());
            const message = `User with uid ${uidToUnban} has been successfully unbanned.`;
            this.sendResponse(res, { message });
        }));
    }
}
exports.default = new BannedUserController();
