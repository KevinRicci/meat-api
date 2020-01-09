"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const restify_errors_1 = require("restify-errors");
const mongoose = require("mongoose");
class ModelRouter extends router_1.Router {
    constructor(specificRouter) {
        super();
        this.specificRouter = specificRouter;
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.BadRequestError('id not valid.'));
            }
            else {
                next();
            }
        };
        this.findAll = (req, resp, next) => {
            this.specificRouter.find().then(this.renderAll(resp, next)).catch(next);
        };
        this.findById = (req, resp, next) => {
            this.specificRouter.findById(req.params.id).then(this.render(resp, next)).catch(next);
        };
        this.save = (req, resp, next) => {
            const document = new this.specificRouter(req.body);
            document.save().then(this.render(resp, next)).catch(next);
        };
        this.replace = (req, resp, next) => {
            const options = { overwrite: true };
            this.specificRouter.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    return this.specificRouter.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError(`${this.specificRouter.collection.collectionName} not found.`);
                }
            }).then(this.render(resp, next).catch(next));
        };
        this.update = (req, resp, next) => {
            const options = { new: true };
            this.specificRouter.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next);
        };
        this.delete = (req, resp, next) => {
            this.specificRouter.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                    return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError(`${this.specificRouter.collection.collectionName} not found.`);
                }
            }).catch(next);
        };
    }
}
exports.ModelRouter = ModelRouter;
