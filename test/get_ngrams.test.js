const test = require('node:test');
const assert = require('node:assert');
const { getNgrams } = require('../get_ngrams');

test('splits a word into padded trigrams', () => {
  assert.deepStrictEqual(getNgrams('cat'), ['*ca', 'cat', 'at*']);
});

test('a one-letter word still gets one trigram', () => {
  assert.deepStrictEqual(getNgrams('a'), ['*a*']);
});
