var models  = require('../models');
var express = require('express');
var router  = express.Router();
var get_ngrams = require('../get_ngrams');

router.get('/', function(req, res) {
    models.ngram.findAll({
        limit: 50,
        include: [ models.word ]
    }).then(function(ngram) {
        res.setHeader('Content-Type', 'application/json');
        var data = [];
        for (const n in ngram) {
            data.push(ngram[n]["word"]["spelling"]);
        }
        res.send(JSON.stringify(data));
    });
});
router.get('/ngrams', function(req, res) {
    console.log(req.query);
    res.send(JSON.stringify(get_ngrams.data(req.query["word"])));
});
router.get('/check', function(req, res) {
    word = req.query["word"]
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(models.ngram.findWord(word)));
})

module.exports = router;
