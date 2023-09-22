"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandler = void 0;
const http_errors_1 = require("http-errors");
const error_list_1 = require("./error-list");
const http_status_1 = require("./http-status");
class ExceptionHandler {
}
exports.ExceptionHandler = ExceptionHandler;
/**
 * Not found page handler:
 * - handles requests that do not match any of the defined routes;
 * - should be added after all other routes and middleware functions, but before:
 *   - the error logger middleware
 *   - the error handler middleware
 */
ExceptionHandler.handleNotFound = (req, res, next) => {
    next(error_list_1.ERROR.NOT_FOUND());
};
/**
 * Global error handler:
 * - transform any error object into a standardized error format;
 * - returns a JSON response containing the standardized error object with the appropriate HTTP status code.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ExceptionHandler.handleError = (err, req, res, next) => {
    console.log(err);
    const internalServerError = http_status_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const [message, code, details] = err.message.split(' # '); // see api-social\src\shared\exception-handler\error.ts
    const error = {
        success: false,
        statusCode: err instanceof http_errors_1.HttpError ? err.statusCode : internalServerError.statusCode,
        name: err.name || internalServerError.name,
        message: message || internalServerError.message,
        service: 'api-social'
    };
    if (code)
        error.code = code;
    if (details)
        error.details = details;
    return res.status(error.statusCode).json(error);
};
/*

  ErrorRequestHandler: https://stackoverflow.com/a/50218984/19284212

  ErrorRequestHandler type takes care of the type declarations for err, req, res, and next.
  
  ErrorRequestHandler<Error | HttpError> takes one type parameter, which specifies types for the err parameter.

  - So this code ->

  static handleError(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response<IAppError> {}

  - Equivalent to this code ->

  static handleError: ErrorRequestHandler<Error | HttpError> = (
    err,
    req,
    res,
    next
  ): Response<IAppError> => {}

*/
