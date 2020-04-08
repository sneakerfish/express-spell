var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    models.ngram.findAll({
        limit: 50,
        include: [ models.word ]
    }).then(function(ngram) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(ngram));
    });
});

module.exports = router;
