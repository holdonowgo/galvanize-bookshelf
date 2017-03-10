/*jshint esversion: 6 */
'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex.js');
const humps = require('humps');

// YOUR CODE HERE
router.post('/users', (req, res, next) => {
    bcrypt.hash(req.body.password, 12)
        .then((hashed_password) => {
            var user = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                hashed_password: hashed_password // youreawizard
            };

            knex('users')
                .insert(user, '*')
                .then((insertedUser) => {
                    delete insertedUser[0]['hashed_password'];
                    res.status(200).json(humps.camelizeKeys(insertedUser[0]));
                })
                .catch((err) => {
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
