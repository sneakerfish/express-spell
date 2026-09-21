'use strict';

// Break a word into its three-letter substrings (trigrams), with '*'
// marking the start and end of the word: "cat" -> ["*ca", "cat", "at*"].
function getNgrams(word) {
  const padded = '*' + word + '*';
  const ngrams = [];
  for (let i = 0; i < padded.length - 2; i++) {
    ngrams.push(padded.substring(i, i + 3));
  }
  return ngrams;
}

module.exports = { getNgrams };
