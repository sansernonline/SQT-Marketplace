import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, parseReddit, parseHn, parseYoutube, filterAndSort, formatMarkdown } from './pulse.mjs';

const reddit = { data: { children: [
  { data: { created_utc: 1700000000, score: 50, num_comments: 7, title: 'A', permalink: '/r/x/comments/1/a/' } },
  { data: { created_utc: 1700086400, score: 90, num_comments: 2, title: 'B', permalink: '/r/x/comments/2/b/' } },
] } };
const hn = { hits: [{ created_at_i: 1700000000, points: 12, num_comments: 3, title: 'H', objectID: '42' }] };
const yt = '20231114\t1500\tVideo one\thttps://youtu.be/a\n20231115\tNA\tVideo two\thttps://youtu.be/b\n';

test('parseArgs', () => {
  const o = parseArgs(['claude', 'code', '--days', '7', '--sources', 'reddit,hn', '--limit', '3', '--json']);
  assert.deepEqual(o, { topic: 'claude code', days: 7, sources: ['reddit', 'hn'], limit: 3, json: true });
  assert.equal(parseArgs(['x']).days, 30);
});
test('parseReddit', () => {
  const r = parseReddit(reddit);
  assert.equal(r.length, 2);
  assert.deepEqual(r[0], { source: 'reddit', date: '2023-11-14', score: 50, comments: 7, title: 'A', url: 'https://www.reddit.com/r/x/comments/1/a/' });
});
test('parseHn', () => {
  assert.deepEqual(parseHn(hn)[0], { source: 'hn', date: '2023-11-14', score: 12, comments: 3, title: 'H', url: 'https://news.ycombinator.com/item?id=42' });
});
test('parseYoutube', () => {
  const r = parseYoutube(yt);
  assert.equal(r.length, 2);
  assert.equal(r[0].date, '2023-11-14');
  assert.equal(r[0].score, 1500);
  assert.equal(r[1].score, 0);
});
test('filterAndSort drops old and sorts by score', () => {
  const items = parseReddit(reddit);
  const now = Date.parse('2023-11-16T00:00:00Z');
  assert.deepEqual(filterAndSort(items, 30, now).map((i) => i.title), ['B', 'A']);
  assert.deepEqual(filterAndSort(items, 1, now).map((i) => i.title), ['B']);
});
test('formatMarkdown', () => {
  const md = formatMarkdown('hn', parseHn(hn));
  assert.match(md, /^## hn/);
  assert.match(md, /2023-11-14 · 12 points · 3 comments · H · https:\/\/news\.ycombinator\.com\/item\?id=42/);
});
