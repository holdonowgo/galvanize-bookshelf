'user strict'

const joi = require("joi");

module.exports.post = {
    body: {
        title: joi.string()
            .label('title')
            .required()
            .trim(),
        author: joi.string()
            .label('author')
            .required()
            .trim(),
        genre: joi.string()
            .label('genre')
            .required()
            .trim(),
        description: joi.string()
            .label('description')
            .required()
            .trim(),
        coverUrl: joi.string()
            .label('cover url')
            .required()
            .trim()
    }
};
