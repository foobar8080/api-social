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
/* eslint-disable @typescript-eslint/no-unused-vars */
const base_controller_1 = __importDefault(require("../../shared/controllers/base.controller"));
const user_service_1 = __importDefault(require("./user.service"));
class UserController extends base_controller_1.default {
    /**
     * Create / Get one record in `Users` table
     * @returns IMeReturnToClient
     */
    authorizeMe() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { tokenData, uid } = req.body;
            const meCandidate = Object.assign(Object.assign({}, tokenData), { uid });
            const me = yield user_service_1.default.authorizeMe(meCandidate);
            this.sendResponse(res, me);
        }));
    }
    /**
     * Update `name`, `profileInfo`, `profileInfoUpdatedAt` in `Users` table
     */
    updateUserInfo() {
        return this.asyncWrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // See body size limit: app.use(express.json({ limit: '2000' })) in index.ts
            // To test body size:
            // console.log('Request body size (in bytes):', Buffer.byteLength(JSON.stringify(req.body), 'utf8'));
            const { uid, name, profileInfo } = req.body;
            const update = { profileInfoUpdatedAt: new Date() };
            if (name)
                update.name = name;
            if (profileInfo)
                update.profileInfo = Object.assign({}, profileInfo);
            const success = yield user_service_1.default.updateUserInfo(update, uid);
            this.sendResponse(res, {}, 200, success);
        }));
    }
}
exports.default = new UserController();
