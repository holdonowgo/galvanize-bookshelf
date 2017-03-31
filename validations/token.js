'user strict'

const joi = require("joi");

module.exports.post = {
  body: {
    email: joi.string()
    .label('email')
    .email()
    .required()
    .trim(),
    password: joi.string()
    .label('password')
    .required()
    .trim()
    .min(8)
  }
};
