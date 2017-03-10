/*jshint esversion: 6 */

'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex.js');
const humps = require('humps');

router.route('/token')
    .get((req, res) => {

    })
    .post((req, res) => {
        let credentials = {
            email: req.body.email,
            password: req.body.password
        }
    })
    .delete((req, res) => {

    });


module.exports = router;
