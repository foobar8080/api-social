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
const base_controller_1 = __importDefault(require("../../shared/controllers/base.controller"));
const user_service_1 = __importDefault(require("./user.service"));
const ban_message_1 = require("../../shared/exception-handler/ban-message");
const error_list_1 = require("../../shared/exception-handler/error-list");
class UserController extends base_controller_1.default {
    /**
     * Create / Get one record in `Users` table
     */
    authorizeMe() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { tokenData, uid } = req.body;
            const currentIp = req.clientIp ? [req.clientIp] : [];
            const meCandidate = Object.assign(Object.assign({}, tokenData), { uid, ips: currentIp });
            const me = yield user_service_1.default.getMe(meCandidate);

            throw new Error();
            
            if (me.banId > 0) {
                const message = (0, ban_message_1.banMessage)(me.unbanAt, me.banId);
                return next(error_list_1.ERROR.BANNED(message));
            }
            // Exclude `banId`, `unbanAt`, `ips`
            const { banId, unbanAt, ips } = me, meResult = __rest(me, ["banId", "unbanAt", "ips"]);
            this.sendResponse(res, meResult);
        }));
    }
    /**
     * Get one record by `uid` from `Users` table
     */
    getUserByUid() {
        return this.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            const user = yield user_service_1.default.getUserByUid(uid);
            this.sendResponse(res, user);
        }));
    }
    /**
     * Get all records by `uid` / `name` / `email` / `role` / `pro` / `banId` / `firebaseId` from `Users` table
     */
    getUsersRecords() {
        return this.asyncWrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const column = req.params.column;
            const value = req.params.value;
            let convertedValue = value;
            if (column === 'id' || column === 'pro' || column === 'banId')
                convertedValue = parseInt(value);
            const usersRecords = yield user_service_1.default.getUsersRecords(column, convertedValue);
            this.sendResponse(res, usersRecords);
        }));
    }
    /**
     * Update `name`, `details` in `Users` table
     */
    updateUserInfo() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // See app.use(express.json({ limit: '2000' })); in index.ts
            // console.log('Request body size (in bytes):', Buffer.byteLength(JSON.stringify(req.body), 'utf8'));
            const { uid, name, details } = req.body;
            const update = {
                profileUpdatedAt: new Date()
            };
            if (name)
                update.name = name;
            if (details)
                update.details = Object.assign({}, details);
            const updatedUser = (yield user_service_1.default.updateUsers(update, { uid }));
            if (!updatedUser)
                return next(error_list_1.ERROR.NOT_FOUND());
            this.sendResponse(res, {});
        }));
    }
    /**
     * Update `role` in `Users` table
     */
    updateUserRole() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { candidateUid, role } = req.body;
            const updatedUser = (yield user_service_1.default.updateUsers({ role }, { uid: candidateUid }));
            if (!updatedUser)
                return next(error_list_1.ERROR.NOT_FOUND());
            this.sendResponse(res, updatedUser);
        }));
    }
}
exports.default = new UserController();
