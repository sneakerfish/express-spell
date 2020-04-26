#!/usr/bin/env node

/**
 * Module dependencies.
 */

var models = require('../models');
var get_ngrams = require("../get_ngrams");
const readline = require("readline");
const fs = require("fs");

var words = [];
var ngrams = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('../python-spell/words_alpha.txt'),
    output: process.stdout,
    console: false
});
readInterface.on('line', function(line) {
    words.push({"spelling": line});
});

models.sequelize.sync().then(function() {
    models.word.bulkCreate(words, { fields: ['spelling'] }).then(function() {
        models.word.findAll().then(function(results) {
            for (i=0;i<results.length; i++) {
                var word_ngrams = get_ngrams.data(results[i].dataValues.spelling);
                var word_id = results[i].dataValues.id;
                for (j=0;j<word_ngrams.length;j++) {
                    ngrams.push({word_id: word_id, ngram: word_ngrams[j]});
                }
            }
            models.ngram.bulkCreate(ngrams, { fields: ['word_id', 'ngram'] }).then(function() {
                console.log("done");
            });
        });
    });
});
