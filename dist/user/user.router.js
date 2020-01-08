"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
class GenericRouter extends router_1.Router {
    constructor(genericRouter) {
        super();
        this.genericRouter = genericRouter;
        this.on('beforeRender', (document) => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get(`/${this.genericRouter.collection.collectionName}`, (req, resp, next) => {
            this.genericRouter.find().then(this.render(resp, next)).catch(next);
        });
        application.get(`/${this.genericRouter.collection.collectionName}/:id`, (req, resp, next) => {
            this.genericRouter.findById(req.params.id).then(this.render(resp, next)).catch(next);
        });
        application.post(`/${this.genericRouter.collection.collectionName}`, (req, resp, next) => {
            const document = new this.genericRouter(req.body);
            document.save().then(this.render(resp, next)).catch(next);
        });
        application.put(`/${this.genericRouter.collection.collectionName}/:id`, (req, resp, next) => {
            const options = { overwrite: true };
            this.genericRouter.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    return this.genericRouter.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Usuário não encontrado');
                }
            }).then(doc => {
                resp.json(doc);
                return next();
            }).catch(next);
        });
        application.patch(`/${this.genericRouter.collection.collectionName}/:id`, (req, resp, next) => {
            const options = { new: true };
            this.genericRouter.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next);
        });
        application.del(`/${this.genericRouter.collection.collectionName}/:id`, (req, resp, next) => {
            this.genericRouter.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                    return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Usuário não encontrado');
                }
            }).catch(next);
        });
    }
}
exports.genericRouter = GenericRouter;
