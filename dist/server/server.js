"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const users_router_1 = require("../user/users.router");
class Server {
    initializeDB() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    initRoutes() {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchJsonParser);
                this.application.on('restifyError', error_handler_1.errorHandler);
                //attaching routes to application
                users_router_1.usersRouter.applyRoutes(this.application);
                this.application.listen(environment_1.environment.server.port, () => {
                    console.log('Server is up on localhost:' + environment_1.environment.server.port);
                    resolve(this.application);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    bootstrap() {
        return this.initializeDB().then(() => {
            return this.initRoutes();
        });
    }
}
exports.Server = Server;
