"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = void 0;
exports.HTTP_STATUS = {
    BAD_REQUEST: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'The request is invalid or could not be understood by the server.'
    },
    UNAUTHORIZED: {
        statusCode: 401,
        name: 'Unauthorized',
        message: 'Authentication failed or user does not have permissions for the requested operation.'
    },
    FORBIDDEN: {
        statusCode: 403,
        name: 'Forbidden',
        message: 'Access to the requested resource is forbidden.'
    },
    NOT_FOUND: {
        statusCode: 404,
        name: 'NotFound',
        message: 'The requested resource could not be found.'
    },
    TOO_MANY_REQUESTS: {
        statusCode: 429,
        name: 'Too Many Requests',
        message: 'Too many requests. Please try again later.'
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        name: 'InternalServerError',
        message: 'An error occurred on the server and the request could not be completed.'
    },
    NOT_IMPLEMENTED: {
        statusCode: 501,
        name: 'NotImplemented',
        message: 'The server does not support the requested feature or operation.'
    }
};
