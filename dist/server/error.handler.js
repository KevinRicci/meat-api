"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (req, resp, err, done) => {
    console.log(err.name);
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case 'MongoError':
            if (err.code === '11000') {
                err.statusCode = 400;
            }
            break;
        case 'ValidationError':
            err.statusCode = 400;
            let messages = [];
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }
            err.toJSON = () => {
                return {
                    errors: messages
                };
            };
            break;
        case 'CastError':
            err.statusCode = 400;
            break;
    }
    done();
};
