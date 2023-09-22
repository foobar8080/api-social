"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    static send(res, payload, statusCode = 200) {
        const response = {
            success: true,
            payload
        };
        return res.status(statusCode).json(response);
    }
}
exports.default = ResponseHandler;
