var models  = require('../models');
var express = require('express');
var router  = express.Router();

function get_ngrams(word) {
    data = [];
    const newword = '*' + word + '*';
    for (i=0;i<newword.length-2;i++) {
        data.push(newword.substring(i,i+3));
    }
    return data;
}


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
    res.send(JSON.stringify(get_ngrams(req.query["word"])));
});

module.exports = router;
