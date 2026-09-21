#!/usr/bin/env node

/**
 * Load a word list (one word per line) into the database and index each
 * word by its n-grams.
 *
 * Usage: node bin/seed_database.js [path/to/words.txt]
 * Defaults to the small sample dictionary in data/sample_words.txt.
 * Re-running replaces whatever words were loaded before.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const models = require('../models');
const { getNgrams } = require('../get_ngrams');

const BATCH_SIZE = 5000;
const wordsFile = process.argv[2] || path.join(__dirname, '..', 'data', 'sample_words.txt');

async function readWords(file) {
  const lines = readline.createInterface({ input: fs.createReadStream(file) });
  const words = [];
  for await (const line of lines) {
    const word = line.trim().toLowerCase();
    if (word) {
      words.push(word);
    }
  }
  return words;
}

async function seed() {
  const words = await readWords(wordsFile);
  console.log(`Read ${words.length} words from ${wordsFile}`);

  await models.word.truncate({ cascade: true, restartIdentity: true });

  let ngramCount = 0;
  for (let start = 0; start < words.length; start += BATCH_SIZE) {
    const batch = words.slice(start, start + BATCH_SIZE).map((spelling) => ({ spelling }));
    // Postgres returns the new ids, which the n-gram rows point back to.
    const created = await models.word.bulkCreate(batch);
    const ngrams = created.flatMap((word) =>
      getNgrams(word.spelling).map((ngram) => ({ ngram, word_id: word.id })));
    await models.ngram.bulkCreate(ngrams);
    ngramCount += ngrams.length;
  }

  console.log(`Loaded ${words.length} words and ${ngramCount} n-grams`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => models.sequelize.close());
