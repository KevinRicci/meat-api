"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String
    },
    stars: {
        type: Number
    }
});
exports.Restaurant = mongoose.model('Restaurant', RestaurantSchema, 'restaurants');
