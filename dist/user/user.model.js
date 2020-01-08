"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const cpf_check_1 = require("cpf-check");
const bcryptjs = require("bcryptjs");
const environment_1 = require("../common/environment");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: cpf_check_1.default.validate,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    else {
        const hash = bcryptjs.hashSync(user.password.toString(), environment_1.environment.security.salts);
        user.password = hash;
        return next();
    }
});
exports.User = mongoose.model('User', UserSchema, 'users');
