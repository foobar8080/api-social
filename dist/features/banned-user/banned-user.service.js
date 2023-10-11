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
const banned_user_1 = __importDefault(require("../../database/models/banned_user"));
const date_helper_1 = __importDefault(require("../../shared/helpers/date.helper"));
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
const user_service_1 = __importDefault(require("../user/user.service"));
const banned_user_helper_1 = require("./banned-user.helper");
class BannedUserService extends base_service_1.default {
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
    /**
     * - Update `Users` table
     * - Create new records in `BannedUsers` table
     */
    banUser(uidToBan, banId) {
        const _super = Object.create(null, {
            createBulkTransaction: { get: () => super.createBulkTransaction },
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const banTermInDays = banned_user_helper_1.banInfo[banId].term;
            const unbanAt = date_helper_1.default.calculateDate(banTermInDays, 'future');
            const banUpdate = {
                banId,
                unbanAt: new Date(unbanAt)
            };
            // Update `Users` table
            const updatedUser = (yield user_service_1.default.updateUsers(banUpdate, { uid: uidToBan }));
            const userIps = (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.ips) || [];
            const newBannedUsersRecords = userIps.map((ip) => (Object.assign(Object.assign({}, banUpdate), { userUid: uidToBan, ip })));
            // Create new records in `BannedUsers` table
            if (newBannedUsersRecords.length > 1) {
                yield _super.createBulkTransaction.call(this, newBannedUsersRecords);
            }
            else if (newBannedUsersRecords.length === 1) {
                yield _super.create.call(this, newBannedUsersRecords[0]);
            }
            return true;
        });
    }
    /**
     * - Update `Users` table
     * - Update `BannedUsers` table
     */
    unbanUser(uidToUnban) {
        const _super = Object.create(null, {
            deleteBulkTransaction: { get: () => super.deleteBulkTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const unbanUpdate = {
                banId: 0,
                unbanAt: null
            };
            // Update `Users` table
            const updatedUser = (yield user_service_1.default.updateUsers(unbanUpdate, { uid: uidToUnban }));
            const userIps = (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.ips) || [];
            // Update `BannedUsers` table
            if (userIps.length > 0) {
                const where = { ip: userIps };
                const deletedRowCount = yield _super.deleteBulkTransaction.call(this, where);
                return deletedRowCount > 1;
            }
            return true;
        });
    }
}
exports.default = new BannedUserService(banned_user_1.default);
