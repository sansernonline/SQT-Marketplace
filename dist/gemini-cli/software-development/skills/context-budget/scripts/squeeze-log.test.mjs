import { test } from 'node:test';
import assert from 'node:assert/strict';
import { squeeze } from './squeeze-log.mjs';

test('5000-line log with 3 distinct errors fits in 100 lines', () => {
  const lines = [];
  for (let i = 0; i < 5000; i++) lines.push(`step ${i} ok id=${(i * 7919).toString(16).padStart(8, '0')}`);
  lines[500] = 'ERROR: disk full on /a';
  lines[2500] = 'FATAL: cannot connect to db';
  lines[4000] = 'AssertionError: expected 3 got 4';
  const out = squeeze(lines.join('\n'));
  const o = out.split('\n');
  assert.ok(o.length <= 100, `got ${o.length}`);
  for (const e of [lines[500], lines[2500], lines[4000]]) assert.ok(o.includes(e), e);
  assert.match(o[0], /^squeeze-log: 5000 → \d+ lines · errors 3$/);
});

test('collapses equal-after-normalising runs with (×N)', () => {
  const out = squeeze(['a 1', 'a 2', 'a 3', 'b'].join('\n'));
  assert.ok(out.includes('a 1 (×3)'));
});

test('normalises timestamps and hex ids', () => {
  const out = squeeze(
    ['2024-01-02 10:00:01 hit deadbeef01', '2024-01-02 10:00:02 hit cafebabe99'].join('\n'),
  );
  assert.ok(out.includes('(×2)'));
});

test('short log passes through; gaps are marked', () => {
  const lines = Array.from({ length: 200 }, (_, i) => `line-${'x'.repeat(i)}`);
  const o = squeeze(lines.join('\n')).split('\n');
  assert.equal(o.length, 1 + 10 + 1 + 20);
  assert.equal(o[11], '… 170 lines …');
});

test('keeps context around errors', () => {
  const lines = Array.from({ length: 100 }, (_, i) => `l${'y'.repeat(i)}`);
  lines[50] = 'boom failed';
  const o = squeeze(lines.join('\n'), { context: 2 }).split('\n');
  const i = o.indexOf('boom failed');
  assert.equal(o[i - 1], lines[49]);
  assert.equal(o[i + 2], lines[52]);
  assert.equal(o[i + 3], '… 27 lines …');
});

test('respects --max by trimming context then head/tail', () => {
  const lines = Array.from({ length: 1000 }, (_, i) => `l${'z'.repeat(i)}`);
  for (let i = 0; i < 10; i++) lines[50 + i * 90] = `error ${'e'.repeat(i)}`;
  const o = squeeze(lines.join('\n'), { max: 20 }).split('\n');
  assert.ok(o.length <= 20);
  assert.ok(o.includes(lines[50]));
});
