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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xssClean = require('xss-clean'); // For `xss-clean` not exists `@types/xss-clean` so use require
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const exception_handler_middleware_1 = require("./shared/exception-handler/exception-handler.middleware");
// import { errorLogger, getLogger, requestLogger } from './shared/middlewares/logger.middleware';
require("./shared/services/env.service");
// import { dbInitializer } from './database/db-initializer';
// import migrationEngine from './database/migrations/migration-engine';
const db_connection_1 = __importDefault(require("./database/db-connection"));
const guards_middleware_1 = __importDefault(require("./shared/middlewares/guards.middleware"));
const user_router_1 = __importDefault(require("./features/user/user.router"));
const banned_user_router_1 = __importDefault(require("./features/banned-user/banned-user.router"));
const follower_router_1 = __importDefault(require("./features/follower/follower.router"));
const health_router_1 = __importDefault(require("./features/health/health.router"));
const reqLimit = {
    // 10 req / 1 min
    windowMs: 1 * 60 * 1000,
    max: 10
};
const ENV = (_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim();
const PORT = process.env.PORT;
const DOMAINS_WHITELIST = (_b = process.env.DOMAINS_WHITELIST) === null || _b === void 0 ? void 0 : _b.split(',');
const app = (0, express_1.default)();
// const logger = getLogger();
// if (ENV === 'development') app.use(requestLogger());
app.use((0, cors_1.default)({ origin: DOMAINS_WHITELIST }));
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
// The heaviest request (user update) has body size about 1000 bytes.
// Increase this value by 2 times (2000 bytes) to avoid problems in the future.
// See api-social\src\features\user\user.controller.ts, updateUserInfo()
app.use(express_1.default.json({ limit: '2000' }));
app.use(xssClean());
app.use('/api/social/v1', (0, express_rate_limit_1.default)(reqLimit), user_router_1.default);
app.use('/api/social/v1', banned_user_router_1.default);
app.use('/api/social/v1', (0, express_rate_limit_1.default)(reqLimit), follower_router_1.default);
app.use('/health', guards_middleware_1.default.isAllowed(DOMAINS_WHITELIST), (0, express_rate_limit_1.default)(reqLimit), health_router_1.default);
app.use(exception_handler_middleware_1.ExceptionHandler.handleNotFound);
// app.use(errorLogger());
app.use(exception_handler_middleware_1.ExceptionHandler.handleError);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await dbInitializer();
        // await migrationEngine.up();
        yield db_connection_1.default.authenticate();
        yield db_connection_1.default.sync();
        app.listen(PORT, () => appCallback());
    }
    catch (error) {
        // logger.error(error);
    }
});
start();
function appCallback() {
    const msg = `Server started on port ${PORT}`;
    const separator = '-'.repeat(43);
    console.log(separator);
    // logger.info(msg);
    console.log(separator);
}
