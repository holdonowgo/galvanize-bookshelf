'user strict'

const joi = require("joi");

module.exports.post = {
    body: {
        userId: joi.number()
            .label('user id')
            .required(),
        bookId: joi.number()
            .label('book id')
            .required()
    }
};
