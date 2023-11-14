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
const user_ip_1 = __importDefault(require("../../database/models/user-ip"));
const base_service_1 = __importDefault(require("../../shared/services/base.service"));
class UserIpService extends base_service_1.default {
    saveIpIfNotExists(userIpData) {
        const _super = Object.create(null, {
            findOrCreate: { get: () => super.findOrCreate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { userUid, ip } = userIpData;
            yield _super.findOrCreate.call(this, { userUid, ip }, // Search criteria
            { defaults: Object.assign({}, userIpData) } // Data to insert if not found
            );
        });
    }
}
exports.default = new UserIpService(user_ip_1.default);
