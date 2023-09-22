"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrap = void 0;
/**
Used to wrap an async route handler function to catch any errors that occur during the asynchronous operation and pass them to the next() function, which can handle it appropriately.

How to use:

- before asyncWrap
app.get('/path', async (req, res) => await asyncOperationFail() );

- after asyncWrap
app.get('/path', asyncWrapper( async (req, res) => await asyncOperationFail() ));
*/
const asyncWrap = (handler) => {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
};
exports.asyncWrap = asyncWrap;
