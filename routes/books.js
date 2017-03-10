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
    })
    .post((req, res) => {
        var book = {
            author: req.body.author,
            cover_url: req.body.coverUrl,
            description: req.body.description,
            genre: req.body.genre,
            title: req.body.title
        };
        knex('books')
            .insert(book, '*')
            .then((insertedBook) => {
                res.status(200).json(humps.camelizeKeys(insertedBook[0]));
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
    })
    .patch((req, res) => {
        knex('books')
            .where('id', req.params.id)
            .update({
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                description: req.body.description,
                cover_url: req.body.cover_url
            })
            .then((book) => {
                res.status(200).json(book);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    })
    .delete((req, res) => {
        let book;

        knex('books')
            .select('name', 'author', 'genre', 'description', 'cover_url')
            .where('id', req.params.id)
            .then((books) => {
                book = humps.camelizeKeys(books[0]);
            })
            .catch((err) => {
                res.sendStatus(500);
            });

        knex('books')
            .where('id', req.params.id)
            .delete()
            .then(() => {
                console.log(book);
                res.status(200).json(book);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });


module.exports = router;
