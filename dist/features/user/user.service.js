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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
const error_list_1 = require("../../shared/exception-handler/error-list");
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
const findOrCreateAttributes = [
    'uid',
    'name',
    'email',
    'avatar',
    'role',
    'details',
    'ips',
    'createdAt',
    'profileUpdatedAt',
    'pro',
    'proEnd' // To rename `pro_end` to `proEnd` use ['pro_end', 'proEnd']
];
const findOrCreateInclude = [
    {
        association: 'followers',
        attributes: ['followerUid'] // To rename `followerUid` to `uid` use [['followerUid', 'uid']]
    },
    {
        association: 'following',
        attributes: ['followingUid']
    }
];
class UserService extends base_service_1.default {
    /**
     * - Create / Get me from `Users` table
     * - Update `ips` column in `Users` table if needed
     * - Return me
     */
    getMe(candidate) {
        const _super = Object.create(null, {
            findOrCreate: { get: () => super.findOrCreate },
            updateBulk: { get: () => super.updateBulk }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, ips } = candidate;
            const ip = ips[0];
            // For the first `findOrCreate` call, only `defaults` option works; `attributes` and `include` are ignored.
            // As result `userRecord` can contain different columns:
            // - for 1st call - all columns from db (`IMeFromDbNewRecord` interface)
            // - for rest calls - only columns listed in `attributes` and `include` (`IMeFromDb` interface)
            // Later, the function `modifyUserToDesiredStructure`, will modify user data to desired structure
            const [userRecord, isUserCreated] = yield _super.findOrCreate.call(this, { uid }, { attributes: findOrCreateAttributes, include: findOrCreateInclude, defaults: Object.assign({}, candidate) });
            const user = this.modifyUserToDesiredStructure(userRecord, isUserCreated);
            // If user just created or IP is missing or IP already in user's IPs -> return me
            if (isUserCreated || !ip || user.ips.includes(ip))
                return user;
            // Update the user's IPs and return the updated user
            const updatedIPs = [...user.ips, ip];
            yield _super.updateBulk.call(this, { ips: updatedIPs }, { uid });
            return user;
        });
    }
    modifyUserToDesiredStructure(userRecord, isUserCreated) {
        var _a, _b;
        const userFromDb = userRecord.get({ plain: true });
        let user;
        if (isUserCreated) {
            // Here `userFromDb` have `IMeFromDbNewRecord` interface
            // Exclude googleId, firebaseId, proEnd, updatedAt
            const _c = userFromDb, { googleId, firebaseId, proEnd, updatedAt } = _c, userFromDbUpdated = __rest(_c, ["googleId", "firebaseId", "proEnd", "updatedAt"]);
            user = Object.assign(Object.assign({}, userFromDbUpdated), { followers: [], following: [], friends: [], followersCount: 0, followingCount: 0, friendsCount: 0 });
        }
        else {
            // Here `userFromDb` have `IMeFromDb` interface
            const followers = (_a = userFromDb.followers) === null || _a === void 0 ? void 0 : _a.map((item) => item.followerUid);
            const following = (_b = userFromDb.following) === null || _b === void 0 ? void 0 : _b.map((item) => item.followingUid);
            const followersCount = followers.length;
            const followingCount = following.length;
            /* =============================================
              Initial data:
                const followers = [10, 20, 50, 80, 90];
                const following = [30, 40, 50, 80];
      
              Result:
                const followers = [10, 20, 50, 80, 90];
                const updatedFollowing = [30, 40];
                const friends = [50, 80];
      
              On a client side to do `following = following + friends`
            */
            const friends = following.filter((uid) => followers.includes(uid));
            const friendsCount = friends.length;
            const updatedFollowing = following.filter((uid) => !friends.includes(uid));
            // =============================================
            user = Object.assign(Object.assign({}, userFromDb), { followers, following: updatedFollowing, friends,
                followingCount,
                followersCount,
                friendsCount });
        }
        // Remove `proEnd` and `followers` property from the user object
        if (user.pro === 0) {
            const { proEnd, followers } = user, updatedUser = __rest(user, ["proEnd", "followers"]);
            user = updatedUser;
        }
        return user;
    }
    /**
     * Get one record by `uid` from `Users` table
     */
    getUserByUid(uid) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const userRecord = yield _super.findOne.call(this, { uid });
            if (!userRecord)
                return null;
            const user = userRecord.toJSON();
            return user;
        });
    }
    /**
     * Update any columns in `Users` table
     */
    updateUsers(update, where, transactionType, transaction) {
        const _super = Object.create(null, {
            updateBulkTransaction: { get: () => super.updateBulkTransaction },
            updateBulkTransactionExternal: { get: () => super.updateBulkTransactionExternal },
            updateBulk: { get: () => super.updateBulk }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let affectedRowsCount;
            let updatedRows;
            if (transaction) {
                if (transactionType === 'internal') {
                    [affectedRowsCount, updatedRows] = (yield _super.updateBulkTransaction.call(this, update, where, true));
                }
                else {
                    [affectedRowsCount, updatedRows] = (yield _super.updateBulkTransactionExternal.call(this, update, where, true, transaction));
                }
            }
            else {
                [affectedRowsCount, updatedRows] = (yield _super.updateBulk.call(this, update, where, true));
            }
            if (affectedRowsCount === 0 && updatedRows.length === 0)
                throw error_list_1.ERROR.NOT_FOUND();
            const users = updatedRows.map((user) => user.toJSON());
            return users.length > 1 ? users : users[0];
        });
    }
    /**
     * Get all records by `uid` / `name` / `email` / `role` / `pro` / `banId` / `firebaseId` from `Users` table
     */
    getUsersRecords(column, value) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const where = { [column]: value };
            const records = yield _super.findAll.call(this, where);
            const users = records.map((record) => record.toJSON());
            return users;
        });
    }
}
exports.default = new UserService(models_1.User);