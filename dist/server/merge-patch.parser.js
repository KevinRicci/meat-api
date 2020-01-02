"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const mpContentType = 'application/merge-patch+json';
exports.mergePatchJsonParser = (req, resp, next) => {
    if (req.contentType() == mpContentType && req.method == 'PATCH') {
        try {
            const rawBody = req.body;
            req.body = JSON.parse(req.body);
            return next();
        }
        catch (e) {
            return next(new restify_errors_1.BadRequestError(e.message));
        }
    }
    else {
        return next();
    }
};
