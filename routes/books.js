/*jshint esversion: 6 */

'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex.js');
const humps = require('humps');

router.route('/books')
    .get((req, res) => {
        //status code 200
        //select * from drivers
        knex('books')
            .orderBy('title')
            .then((books) => {
                books = humps.camelizeKeys(books);
                res.send(books);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });


router.route('/books/:id')
    .get((req, res) => {
        //status code 200
        //select * from drivers
        knex('books')
            .where('id', req.params.id)
            .then((books) => {
                let book = humps.camelizeKeys(books[0]);
                res.status(200).json(book);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });


module.exports = router;
