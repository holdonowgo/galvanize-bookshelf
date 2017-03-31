'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const ev = require('express-validation');
const validations = require("../validations/favorites");

// YOUR CODE HERE
router.route('/favorites')
    .get((req, res) => {
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                res.set('Content-Type', 'text/plain');
                return res.status(401).send('Unauthorized');
            } else {
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
                        return res.status(200).send(humps.camelizeKeys(favorites));
                    })
                    .catch((err) => {
                        return res.sendStatus(500);
                    });
            }
        });
    })
    .post((req, res) => {
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                res.set('Content-Type', 'text/plain');
                return res.status(401).send('Unauthorized');
            } else {
                let favorite = {
                    book_id: req.body.bookId,
                    user_id: payload.userId
                }
                knex('books').first()
                    .where('id', req.body.bookId)
                    .then((book) => {
                        if (book === undefined) {
                            res.set("Content-Type", "text/plain");
                            return res.status(404).send('Book not found');
                        } else {
                            knex('favorites').insert(favorite).returning('*')
                                .then((book) => {
                                    res.status(200);
                                    res.send(humps.camelizeKeys(book[0]));
                                })
                                .catch((err) => {
                                    console.error(err);
                                })
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            }
        });
    })
    .delete((req, res) => {
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                res.set('Content-Type', 'text/plain');
                return res.status(401).send('Unauthorized');
            } else {
                var favorite;

                knex('favorites')
                    .where('book_id', req.body.bookId)
                    .andWhere('user_id', 1)
                    .then((favorites) => {
                        if (!favorites[0]) {
                            return res.sendStatus(404);
                        }
                        favorite = humps.camelizeKeys(favorites[0]);
                    })
                    .catch((err) => {
                        return res.sendStatus(500);
                    });

                knex('favorites')
                    .where('id', req.body.bookId)
                    .del()
                    .then(() => {
                        delete favorite.id;
                        res.set('Content-Type', 'application/json');
                        return res.status(200).json(favorite);
                    })
                    .catch((err) => {
                        return res.sendStatus(500);
                    });
            }
        });
    });
router.route('/favorites/check')
    .get((req, res) => {
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                res.set('Content-Type', 'text/plain');
                return res.status(401).send('Unauthorized');
            } else {
                knex('favorites')
                    .where('book_id', req.query.bookId)
                    .then((favorites) => {
                        if (favorites.length > 0) {
                            res.set('Content-Type', 'application/json');
                            return res.status(200).json(true);
                        } else {
                            res.set('Content-Type', 'application/json');
                            return res.status(200).json(false);
                        }
                    })
            }
        });
    })

module.exports = router;
