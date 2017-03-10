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

router.route('/token')
    .get((req, res, next) => {
        console.log('enter the dragon');
        if (!req.cookies.token) {
            console.log(req.cookies);
            console.log('exit the dragon');
            return res.status(200).json(false);
        }
        console.log('has token');
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                //unauthorized
                console.log('error');
                return res.status(200).json(false);
            }
            //the payload is the claim that we sent the client. In this case {userId}
            //if it is present, the user is authorized. Do what you need to with userId
            if (payload.userId) {
                return res.status(200).json(true);
            } else {
                console.log('payload', payload);
                return res.status(200).json(false);
            }
        });
    })
    .post((req, res, next) => {
        knex('users').select('hashed_password').where('email', req.body.email)
            .then((result) => {
                // console.log('hashed_password', result[0].hashed_password);
                let hashed_password = result[0].hashed_password;
                return bcrypt.compare(req.body.password, hashed_password);
            })
            .then((is_match) => {
                if (is_match) {
                    const claim = {
                        userId: user.id
                    }; //this is our 'session'
                    const token = jwt.sign(claim, process.env.JWT_KEY, { //use this environment variable to sign the cookie
                        expiresIn: '7 days' // Adds an exp field to the payload
                    });

                    res.cookie('token', token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
                        secure: router.get('env') === 'production' // Set from the NODE_ENV
                    });
                } else {
                    res.status(200).send('false');
                }
            })
            .catch((err) => {
                next(err);
            });
    })
    .delete((req, res) => {

    });


module.exports = router;
