"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUid = void 0;
const crypto_1 = __importDefault(require("crypto"));
const error_list_1 = require("../exception-handler/error-list");
/**
 * Generate a unique identifier (UID) for a user based on their Google ID
 */
const generateUid = (req, res, next) => {
    try {
        const { googleId } = req.body.tokenData;
        const hash = crypto_1.default.createHash('md5').update(googleId).digest('hex');
        const shortHash = hash.substring(0, 12); // Take the first 12 characters of the hash
        req.body.uid = shortHash;
        next();
    }
    catch (error) {
        return next(error_list_1.ERROR.INTERNAL_SERVER_ERROR());
    }
};
exports.generateUid = generateUid;
