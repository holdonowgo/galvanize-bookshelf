/*jshint esversion: 6 */

'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const ev = require('express-validation');
const validations = require("../validations/token");

router.route('/token')
    .get((req, res, next) => {
        if (!req.cookies.token) {
            return res.status(200).json(false);
        }
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                //unauthorized
                return res.status(200).json(false);
            }
            //the payload is the claim that we sent the client. In this case {userId}
            //if it is present, the user is authorized. Do what you need to with userId
            if (payload.userId) {
                return res.status(200).json(true);
            } else {
                return res.status(200).json(false);
            }
        });
    })
    .post(ev(validations.post), (req, res, next) => {
        knex('users')
            .where('email', req.body.email)
            .first()
            .then((user) => {
                bcrypt.compare(req.body.password, user.hashed_password)
                    .then((result) => {
                        const claim = {
                            userId: user.id
                        };

                        const token = jwt.sign(claim, process.env.JWT_KEY, {
                            expiresIn: '7 days'
                        });

                        res.cookie('token', token, {
                            httpOnly: true,
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                            secure: router.get('env') === 'production'
                        })

                        delete user.hashed_password;
                        res.set('Content-Type', 'application/json');
                        res.status(200).send(humps.camelizeKeys(user));


                    })
                    .catch(bcrypt.MISMATCH_ERROR, () => {
                        res.set('Content-Type', 'text/plain');
                        res.status(400).send('Bad email or password');
                    })
            })
            .catch((err) => {
                res.set('Content-Type', 'match/plain')
                res.status(400).send('Bad email or password');
            });
    })
    .delete((req, res) => {
        res.cookie('token', '', {
            secure: router.get('env') === 'production'
        })
        res.set('Content-Type', 'application/json');
        res.status(200).json(true);
    });


module.exports = router;
