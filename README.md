# express-spell

A serverless web app to check spelling and suggest alternate words.

Spell checking is based on two algorithms, n-gram Decomposition and
Levenshtein Distance.  N-gram decomposition is the process of breaking
apart a string into each proper n-letter substring (with two extra
ones added for the beginning and ending of the word). Levenshtein
distance is the measurement of the distance in edits between two
strings.

The database can be seeded using the program `seed_database.py`.  You
will need a file where the words are listed one-per-line like in the
sample dictionary provided in this repo.  I usually use the one at
https://github.com/dwyl/english-words.

## API
  * /check?word=MISSPELLEDWORD
  * /ngrams?word=WORD
  * /levenshtein?a=WORD1&b=WORD2

## Code:
