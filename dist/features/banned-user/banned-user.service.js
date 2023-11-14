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
const sequelize_1 = require("sequelize");
const banned_user_1 = __importDefault(require("../../database/models/banned_user"));
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
class BannedUserService extends base_service_1.default {
    /**
     * Get records by `uid` / `ip` / `banId` from `BannedUsers` table
     */
    isBannedByIpOrUid(user) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { userUid, ip } = user;
            const where = ip ? { [sequelize_1.Op.or]: [{ userUid }, { ip }] } : { userUid };
            const record = yield _super.findOne.call(this, Object.assign({}, where));
            if (record) {
                const bannedUser = record.toJSON();
                console.log(777, bannedUser);
                return bannedUser;
            }
            return null;
        });
    }
    /**
     * Get records by `uid` / `ip` / `banId` from `BannedUsers` table
     */
    getBannedRecords(column, value) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const where = { [column]: value };
            const records = yield _super.findAll.call(this, where);
            const bannedUsers = records.map((record) => record.toJSON());
            return bannedUsers;
        });
    }
}
exports.default = new BannedUserService(banned_user_1.default);
