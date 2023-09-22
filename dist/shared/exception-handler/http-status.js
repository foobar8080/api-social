"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = void 0;
// See api-social\_docs\custom error codes.md
exports.HTTP_STATUS = {
    // ----
    // 400
    // ----
    BAD_REQUEST: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'The request is invalid or could not be understood by the server.'
    },
    BAD_FOLLOW_REQUEST: {
        code: 'E400.01',
        statusCode: 400,
        name: 'BadRequest',
        message: 'The request is invalid or could not be understood by the server.'
    },
    // ----
    // 401
    // ----
    UNAUTHORIZED: {
        statusCode: 401,
        name: 'Unauthorized',
        message: 'Authentication failed or user does not have permissions for the requested operation.'
    },
    NO_TOKEN: {
        code: 'E401.01',
        statusCode: 401,
        name: 'Unauthorized',
        message: 'Authentication failed: No token provided.'
    },
    TOKEN_ERROR: {
        code: 'E401.02',
        statusCode: 401,
        name: 'Unauthorized',
        message: 'Authentication error: Token validation failed.'
    },
    // ----
    // 403
    // ----
    FORBIDDEN: {
        statusCode: 403,
        name: 'Forbidden',
        message: 'Access to the requested resource is forbidden.'
    },
    BANNED: {
        code: 'E403.01',
        statusCode: 403,
        name: 'Forbidden',
        message: 'Access to the requested resource is forbidden due to a suspension of your interactions on our platform.'
    },
    ADMIN_ONLY: {
        code: 'E403.02',
        statusCode: 403,
        name: 'Forbidden',
        message: 'Access to the requested resource is forbidden as the route is exclusively available for administrators only.'
    },
    SUPER_ADMIN_ONLY: {
        code: 'E403.03',
        statusCode: 403,
        name: 'Forbidden',
        message: 'Access to the requested resource is forbidden as the route is exclusively available for superadmin only.'
    },
    // ----
    // 404
    // ----
    NOT_FOUND: {
        statusCode: 404,
        name: 'NotFound',
        message: 'The requested resource could not be found.'
    },
    // ----
    // 500
    // ----
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        name: 'InternalServerError',
        message: 'An error occurred on the server and the request could not be completed.'
    },
    AUTH_PARSE_ERROR: {
        code: 'E500.01',
        statusCode: 500,
        name: 'InternalServerError',
        message: 'An error occurred on the server: Failed to parse auth data due to admin library.'
    },
    // ----
    // 501
    // ----
    NOT_IMPLEMENTED: {
        statusCode: 501,
        name: 'NotImplemented',
        message: 'The server does not support the requested feature or operation.'
    }
};
