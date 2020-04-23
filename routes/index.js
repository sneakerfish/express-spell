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
    res.send(JSON.stringify(get_ngrams.data(req.query["word"])));
});
router.get('/check', function(req, res) {
    word = req.query["word"];
    models.ngram.findWord(word).then(function(result) {
        res.send(JSON.stringify(result));
    });
});
router.get('/levenshtein', function(req, res) {
    worda = req.query["worda"];
    wordb = req.query["wordb"];
    models.ngram.findLev(worda, wordb).then(function(result) {
        res.send(JSON.stringify(result));
    });
})


module.exports = router;
