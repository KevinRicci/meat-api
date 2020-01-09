"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model.router");
const restaurants_model_1 = require("./restaurants.model");
class RestaurantRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(rest => {
                if (!rest) {
                    next(new restify_errors_1.NotFoundError('restaurant not found.'));
                }
                else {
                    this.renderAll(resp, next)(rest.menu);
                    return next();
                }
            });
        };
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(rest => {
                if (!rest) {
                    next(new restify_errors_1.NotFoundError('restaurant not found.'));
                }
                else {
                    rest.menu = req.body;
                    rest.save().then(rest => {
                        this.renderAll(resp, next)(rest.menu);
                    }).catch(next);
                    return next();
                }
            });
        };
    }
    applyRoutes(application) {
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('/restaurants:/id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.delete]);
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantRouter();
