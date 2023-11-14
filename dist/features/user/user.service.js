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
/* eslint-disable @typescript-eslint/no-unused-vars */
const sequelize_1 = require("sequelize");
const models_1 = require("../../database/models");
const date_helper_1 = __importDefault(require("../../shared/helpers/date.helper"));
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
const findOrCreateAttributes = [
    'uid',
    'name',
    'email',
    'avatar',
    'role',
    'profileInfo',
    'profileInfoUpdatedAt',
    'inShadow',
    'pro',
    'createdAt'
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
const PROFILE_UPDATE_INTERVAL_IN_DAYS = process.env.PROFILE_UPDATE_INTERVAL_IN_DAYS;
const profileUpdateIntervalInDays = parseInt(PROFILE_UPDATE_INTERVAL_IN_DAYS, 10);
class UserService extends base_service_1.default {
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
     * - Create / Get me from `Users` table
     * - Return me
     */
    authorizeMe(candidate) {
        const _super = Object.create(null, {
            findOrCreate: { get: () => super.findOrCreate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = candidate;
            // For the first `findOrCreate` call, only `defaults` option works, `attributes` and `include` are ignored.
            // As result `userRecord` can contain different columns:
            // - for 1st call - all columns from db (`IMeNewDbRecord` interface)
            // - for rest calls - only columns listed in `attributes` and `include` (`IMeExistedDbRecord` interface)
            // The function `modifyUserToDesiredStructure` will modify user data to desired structure
            const [userRecord, isUserCreated] = yield _super.findOrCreate.call(this, { uid }, { attributes: findOrCreateAttributes, include: findOrCreateInclude, defaults: Object.assign({}, candidate) });
            const user = this.modifyUserToDesiredStructure(userRecord, isUserCreated);
            return user;
        });
    }
    modifyUserToDesiredStructure(userRecord, isUserCreated) {
        var _a, _b;
        const userFromDb = userRecord.get({ plain: true });
        let user;
        if (isUserCreated) {
            // Here `userFromDb` have `IMeNewDbRecord` interface
            // Exclude googleId, firebaseId, updatedAt, reports, reportsUpdatedAt, inShadowEnd
            const _c = userFromDb, { googleId, firebaseId, updatedAt, reports, reportsUpdatedAt, inShadowEnd } = _c, userFromDbUpdated = __rest(_c, ["googleId", "firebaseId", "updatedAt", "reports", "reportsUpdatedAt", "inShadowEnd"]);
            user = Object.assign(Object.assign({}, userFromDbUpdated), { followers: [], following: [], friends: [], followersCount: 0, followingCount: 0, friendsCount: 0 });
        }
        else {
            // Here `userFromDb` have `IMeExistedDbRecord` interface
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
        // Remove `followers` property from the user object
        if (user.pro === 0) {
            const { followers } = user, updatedUser = __rest(user, ["followers"]);
            user = updatedUser;
        }
        return user;
    }
    /**
     * Update `name`, `profileInfo`, `profileInfoUpdatedAt` in `Users` table
     */
    updateUserInfo(update, uid) {
        const _super = Object.create(null, {
            updateBulk: { get: () => super.updateBulk }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const dateXDaysAgo = date_helper_1.default.calculateDate(profileUpdateIntervalInDays, 'past');
            const where = {
                uid,
                // [Op.or] logical OR condition to match records that satisfy at least one of the conditions inside the array:
                [sequelize_1.Op.or]: [
                    {
                        profileInfoUpdatedAt: {
                            [sequelize_1.Op.lte]: dateXDaysAgo // profileInfoUpdatedAt <= dateXDaysAgo
                        }
                    },
                    {
                        profileInfoUpdatedAt: {
                            [sequelize_1.Op.is]: null // profileInfoUpdatedAt === null
                        }
                    },
                    {
                        pro: {
                            [sequelize_1.Op.gt]: 0 // pro > 0
                        }
                    },
                    {
                        role: {
                            [sequelize_1.Op.or]: ['superadmin', 'admin', 'superuser'] // role === 'superadmin' || role === 'admin' || role === 'superuser'
                        }
                    }
                ]
            };
            const [rowsCount] = (yield _super.updateBulk.call(this, update, Object.assign({}, where), false));
            if (rowsCount === 0)
                return false;
            return true;
        });
    }
}
exports.default = new UserService(models_1.User);
