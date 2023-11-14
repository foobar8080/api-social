"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const error_list_1 = require("../exception-handler/error-list");
const firebaseAdmin = __importStar(require("firebase-admin"));
const banned_user_service_1 = __importDefault(require("../../features/banned-user/banned-user.service"));
const ban_message_1 = require("../exception-handler/ban-message");
const user_service_1 = __importDefault(require("../../features/user/user.service"));
const net_1 = __importDefault(require("net"));
const user_ip_service_1 = __importDefault(require("../../features/user-ip/user-ip.service"));
const async_wrapper_middleware_1 = require("../middlewares/async-wrapper.middleware");
const serviceAccount = require('../../../service-account-key.js');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});
class Guards {
    /**
     * Middleware to save user IP to `UserIps` table if it doesn't already exist
     */
    static saveIpIfNotExists() {
        return (0, async_wrapper_middleware_1.asyncWrap)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.body;
            const ip = req.clientIp;
            if (ip) {
                const typeIp = net_1.default.isIP(ip);
                const userIpData = {
                    userUid: uid,
                    ip,
                    typeIp
                };
                yield user_ip_service_1.default.saveIpIfNotExists(userIpData);
            }
            next();
        }));
    }
    /**
     * Determine if the request is being made by a banned user
     */
    static isBannedByIpOrUid() {
        return (0, async_wrapper_middleware_1.asyncWrap)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.body;
            const ip = undefined;
            const user = ip ? { userUid: uid, ip } : { userUid: uid };
            const bannedUser = yield banned_user_service_1.default.isBannedByIpOrUid(user);
            if (bannedUser) {
                const message = (0, ban_message_1.banMessage)(bannedUser.unbanAt, bannedUser.banId);
                return next(error_list_1.ERROR.FORBIDDEN(message));
            }
            next();
        }));
    }
    /**
     * Check user token and extracting authorization data from a token
     */
    static verifyToken(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.header('Authorization');
                const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
                if (!token)
                    return next(error_list_1.ERROR.UNAUTHORIZED('Authentication failed: No token provided.'));
                // Error can occurs when token is invalid or expired
                const decodedToken = yield firebaseAdmin.auth().verifyIdToken(token);
                // Error can occurs if the structure of the `decodedToken` is changed
                if (!((_c = (_b = (_a = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.firebase) === null || _a === void 0 ? void 0 : _a.identities) === null || _b === void 0 ? void 0 : _b['google.com']) === null || _c === void 0 ? void 0 : _c[0]))
                    return next(error_list_1.ERROR.INTERNAL_SERVER_ERROR('An error occurred on the server: Failed to parse auth data due to admin library.'));
                const tokenData = {
                    name: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.name,
                    avatar: (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.picture) || '',
                    email: (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.email) || ((_f = (_e = (_d = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.firebase) === null || _d === void 0 ? void 0 : _d.identities) === null || _e === void 0 ? void 0 : _e.email) === null || _f === void 0 ? void 0 : _f[0]),
                    firebaseId: (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.uid) || (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.user_id) || (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.sub),
                    googleId: (_j = (_h = (_g = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.firebase) === null || _g === void 0 ? void 0 : _g.identities) === null || _h === void 0 ? void 0 : _h['google.com']) === null || _j === void 0 ? void 0 : _j[0]
                };
                req.body.tokenData = tokenData;
                next();
            }
            catch (error) {
                next(error_list_1.ERROR.UNAUTHORIZED('Authentication error: Token validation failed.'));
            }
        });
    }
    /**
     * Verify if the request is made by an admin or superadmin
     */
    static isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req.body;
                const adminCandidate = yield user_service_1.default.getUserByUid(uid);
                if ((adminCandidate === null || adminCandidate === void 0 ? void 0 : adminCandidate.role) === 'admin' || (adminCandidate === null || adminCandidate === void 0 ? void 0 : adminCandidate.role) === 'superadmin')
                    return next();
                next(error_list_1.ERROR.FORBIDDEN('Access to the requested resource is forbidden as the route is exclusively available for administrators only.'));
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Verify if the request is made by a superadmin
     */
    static isSuperAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid } = req.body;
                const adminCandidate = yield user_service_1.default.getUserByUid(uid);
                if ((adminCandidate === null || adminCandidate === void 0 ? void 0 : adminCandidate.role) === 'superadmin')
                    return next();
                next(error_list_1.ERROR.FORBIDDEN('Access to the requested resource is forbidden as the route is exclusively available for superadmin only.'));
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * All API endpoints must be protected by authorization middleware.
     *
     * However, if the API provides access to some endpoints for unauthorized users, we need to ensure that they come from whitelisted domains.
     *
     * `isAllowed` is a middleware that can be used to mount on API endpoints that are accessed by unauthorized users.
     *
     * It allows unauthorized users to access the API endpoints only if their requests originate from whitelisted domains.
     *
     * @param domainsWhitelist An array of domains from which unauthorized user can make a request to the API.
     */
    static isAllowed(domainsWhitelist) {
        return (req, res, next) => {
            const origin = req.headers.origin;
            if (!origin || !(domainsWhitelist === null || domainsWhitelist === void 0 ? void 0 : domainsWhitelist.includes(origin)))
                return next(error_list_1.ERROR.FORBIDDEN());
            next();
        };
    }
}
exports.default = Guards;
