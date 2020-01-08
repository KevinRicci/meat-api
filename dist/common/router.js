"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    render(response, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(document);
                return next();
            }
            else {
                response.send(404);
                return next();
            }
        };
    }
    renderAll(response, next) {
        return (documents) => {
            if (documents) {
                documents.forEach(doc => {
                    this.emit('beforeRender', doc);
                });
                response.json(documents);
                return next();
            }
            else {
                response.json([]);
                return next();
            }
        };
    }
}
exports.Router = Router;
