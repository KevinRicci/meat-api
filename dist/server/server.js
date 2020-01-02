"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
const user_router_1 = require("../user/user.router");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
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
                user_router_1.userRouter.applyRoutes(this.application);
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
