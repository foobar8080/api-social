"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_helper_1 = __importDefault(require("../helpers/response.helper"));
const async_wrapper_middleware_1 = require("../middlewares/async-wrapper.middleware");
class BaseController {
    constructor() {
        this.asyncWrap = async_wrapper_middleware_1.asyncWrap;
        this.sendResponse = response_helper_1.default.send;
    }
}
exports.default = BaseController;
