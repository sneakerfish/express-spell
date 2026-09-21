# express-spell

A small Express web app to check spelling and suggest alternate words.

Spell checking is based on two algorithms, n-gram decomposition and
Levenshtein Distance.  N-gram decomposition is the process of breaking
apart a string into each proper n-letter substring (with two extra
ones added for the beginning and ending of the word). Levenshtein
distance is the measurement of the distance in edits between two
strings.

To check a word, the app looks up every dictionary word that shares at
least one trigram with it, then asks Postgres (via the `fuzzystrmatch`
extension's `levenshtein()` function) to rank those candidates by edit
distance.

## Requirements

  * Node.js 18 or newer
  * PostgreSQL (any currently supported version) with the
    `fuzzystrmatch` extension, which ships with Postgres.  The migration
    enables it, so the database user needs permission to create
    extensions.

## Setup

Install dependencies:

    npm install

Tell the app where the database is (this is the default if unset):

    export DATABASE_URL=postgres://localhost:5432/express_spell

If you don't have Postgres installed, you can run one in Docker:

    docker run -d --name express-spell-pg -e POSTGRES_PASSWORD=spell \
      -e POSTGRES_DB=express_spell -p 5432:5432 postgres:17
    export DATABASE_URL=postgres://postgres:spell@localhost:5432/express_spell

Create the tables, then load a dictionary:

    npm run db:migrate
    npm run db:seed

`npm run db:seed` loads the small sample dictionary in
`data/sample_words.txt`.  For real use, load a full word list (one word
per line), such as `words_alpha.txt` from
https://github.com/dwyl/english-words:

    npm run db:seed -- path/to/words_alpha.txt

Seeding replaces any words loaded before.

## Running

    npm start

The server listens on port 3000 (set `PORT` to change it).  Run the
tests with `npm test`.

## API

All endpoints return JSON.

  * `/` - a sample of the words in the dictionary
  * `/check?word=MISSPELLEDWORD` - up to 10 suggestions, closest first,
    e.g. `[{"spelling":"spelling","lev":1}, ...]`
  * `/ngrams?word=WORD` - the trigrams for a word,
    e.g. `["*ca","cat","at*"]`
  * `/levenshtein?worda=WORD1&wordb=WORD2` - the edit distance between
    two words, e.g. `3`

A missing query parameter returns HTTP 400 with `{"error": "..."}`.

## Code

  * `app.js`, `bin/www` - the Express app and server
  * `routes/index.js` - the API endpoints
  * `get_ngrams.js` - splits a word into trigrams
  * `models/` - Sequelize models for `words` and their `ngrams`
  * `migrations/` - the database schema (run by `npm run db:migrate`)
  * `bin/seed_database.js` - loads a word list into the database
  * `config/config.js` - database settings, read from `DATABASE_URL`

`package.json` overrides Sequelize 6's `uuid` dependency to 11.x, which
fixes a security advisory in older `uuid` releases.  Sequelize only uses
`uuid.v1()` and `uuid.v4()`, which work the same in 11.x.
