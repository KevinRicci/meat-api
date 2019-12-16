"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const server = new server_1.Server();
server.bootstrap().then(server => {
    console.log(`Server's okay.`);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
