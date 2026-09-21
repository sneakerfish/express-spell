// HTTP tests for the routes that do not need a database.
const test = require('node:test');
const assert = require('node:assert');
const app = require('../app');

test('HTTP API', async (t) => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  t.after(() => server.close());

  await t.test('GET /ngrams returns the trigrams as JSON', async () => {
    const res = await fetch(`${base}/ngrams?word=spell`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.deepStrictEqual(await res.json(), ['*sp', 'spe', 'pel', 'ell', 'll*']);
  });

  await t.test('GET /ngrams without a word is a 400', async () => {
    const res = await fetch(`${base}/ngrams`);
    assert.strictEqual(res.status, 400);
    assert.deepStrictEqual(await res.json(), { error: 'Missing query parameter: word' });
  });

  await t.test('unknown routes are a JSON 404', async () => {
    const res = await fetch(`${base}/nope`);
    assert.strictEqual(res.status, 404);
    assert.deepStrictEqual(await res.json(), { error: 'Not Found' });
  });
});
