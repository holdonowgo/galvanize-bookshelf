'user strict'

const joi = require("joi");

module.exports.post = {
    body: {
        userId: joi.string()
            .label('user id')
            .required()
            .trim(),
        bookId: joi.string()
            .label('book id')
            .required()
            .trim()
    }
};
