"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    static send(res, payload, statusCode = 200, success = true) {
        const response = {
            success,
            payload
        };
        return res.status(statusCode).json(response);
    }
}
exports.default = ResponseHandler;
