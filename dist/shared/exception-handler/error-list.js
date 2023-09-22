"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_1 = require("./http-status");
/**
  Using ERROR in a route handler:

  app.get("/route", (req, res, next) => {
    if (someCondition) {
      return next(ERROR.BAD_REQUEST());
    }
  });
 */
exports.ERROR = {
    BAD_REQUEST: (details) => createHttpError(http_status_1.HTTP_STATUS.BAD_REQUEST, details),
    BAD_FOLLOW_REQUEST: (details) => createHttpError(http_status_1.HTTP_STATUS.BAD_FOLLOW_REQUEST, details),
    UNAUTHORIZED: (details) => createHttpError(http_status_1.HTTP_STATUS.UNAUTHORIZED, details),
    NO_TOKEN: (details) => createHttpError(http_status_1.HTTP_STATUS.NO_TOKEN, details),
    TOKEN_ERROR: (details) => createHttpError(http_status_1.HTTP_STATUS.TOKEN_ERROR, details),
    FORBIDDEN: (details) => createHttpError(http_status_1.HTTP_STATUS.FORBIDDEN, details),
    BANNED: (details) => createHttpError(http_status_1.HTTP_STATUS.BANNED, details),
    ADMIN_ONLY: (details) => createHttpError(http_status_1.HTTP_STATUS.ADMIN_ONLY, details),
    SUPER_ADMIN_ONLY: (details) => createHttpError(http_status_1.HTTP_STATUS.SUPER_ADMIN_ONLY, details),
    NOT_FOUND: (details) => createHttpError(http_status_1.HTTP_STATUS.NOT_FOUND, details),
    INTERNAL_SERVER_ERROR: (details) => createHttpError(http_status_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, details),
    AUTH_PARSE_ERROR: (details) => createHttpError(http_status_1.HTTP_STATUS.AUTH_PARSE_ERROR, details),
    NOT_IMPLEMENTED: (details) => createHttpError(http_status_1.HTTP_STATUS.NOT_IMPLEMENTED, details)
};
function createHttpError(httpStatus, details) {
    // See handleError() in api-social\src\shared\exception-handler\exception-handler.middleware.ts
    const addCode = httpStatus.code ? ' # ' + httpStatus.code : '';
    const addDetails = details ? ' # ' + details : '';
    return (0, http_errors_1.default)(httpStatus.statusCode, httpStatus.message + addCode + addDetails);
}
