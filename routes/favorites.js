'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');

// YOUR CODE HERE
router.route('/favorites')
    .get((req, res) => {
        //status code 200
        //select * from drivers
        knex('favorites')
            .join('users', 'users.id', '=', 'favorites.user_id')
            .join('books', 'books.id', '=', 'favorites.book_id')
            .then((favorites) => {
                for (let favorite of favorites) {
                    delete favorite.first_name;
                    delete favorite.last_name;
                    delete favorite.email;
                    delete favorite.hashed_password;
                }
                res.set('Content-Type', 'application/json');
                res.status(200).send(humps.camelizeKeys(favorites));
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    })
router.route('/favorites/check?bookId={id}')
    .get((req, res) => {
        knex('favorites')
            .where('book_id', req.query.params.id)
            .then((favorites) => {
                if (favorites.length > 0) {
                    res.set('Content-Type', 'application/json');
                    res.status(200).json(true);
                } else {
                    res.set('Content-Type', 'application/json');
                    res.status(200).json(false);
                }
            })
    })

module.exports = router;
