"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs = require("bcryptjs");
exports.environment = {
    server: { port: process.env.SERVER_PORT || 3002 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api' },
    security: { salts: process.env.SALTS || bcryptjs.genSaltSync(10) }
};
