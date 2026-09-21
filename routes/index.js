const express = require('express');
const createError = require('http-errors');
const models = require('../models');
const { getNgrams } = require('../get_ngrams');

const router = express.Router();

// Read a required query-string parameter, or respond 400 if it is missing.
function requireParam(req, name) {
  const value = req.query[name];
  if (typeof value !== 'string' || value === '') {
    throw createError(400, `Missing query parameter: ${name}`);
  }
  return value;
}

// A sample of dictionary words, to show the database is loaded.
router.get('/', async (req, res) => {
  const ngrams = await models.ngram.findAll({
    limit: 50,
    include: [models.word],
  });
  res.json(ngrams.map((ngram) => ngram.word.spelling));
});

router.get('/ngrams', (req, res) => {
  res.json(getNgrams(requireParam(req, 'word')));
});

router.get('/check', async (req, res) => {
  res.json(await models.ngram.findWord(requireParam(req, 'word')));
});

router.get('/levenshtein', async (req, res) => {
  const worda = requireParam(req, 'worda');
  const wordb = requireParam(req, 'wordb');
  res.json(await models.ngram.findLev(worda, wordb));
});

module.exports = router;
