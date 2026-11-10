import test from 'node:test';
import assert from 'node:assert/strict';
import { count, verdict } from './test-verdict.mjs';

const tap = (p, f, s = 0) => `TAP version 13\n# tests ${p + f + s}\n# pass ${p}\n# fail ${f}\n# skipped ${s}\n`;

test('all passing TAP is PROVEN', () => {
  assert.equal(verdict(count(tap(5, 0))).word, 'PROVEN');
});

test('one failure is NOT PROVEN', () => {
  assert.equal(verdict(count(tap(4, 1))).word, 'NOT PROVEN');
});

test('zero tests is NOT PROVEN, not PROVEN', () => {
  assert.equal(verdict(count('no summary here')).word, 'NOT PROVEN');
});

test('skips make it PARTLY', () => {
  assert.equal(verdict(count(tap(3, 0, 1))).word, 'PARTLY');
});

test('fewer tests than expected is PARTLY', () => {
  assert.equal(verdict(count(tap(3, 0)), 5).word, 'PARTLY');
});

test('JUnit XML counts failures and errors', () => {
  const xml = '<testsuites><testsuite tests="4" failures="0" errors="1" skipped="0"></testsuite></testsuites>';
  assert.deepEqual(count(xml), { tests: 4, fail: 1, skip: 0 });
  assert.equal(verdict(count(xml)).word, 'NOT PROVEN');
});

test('JUnit XML all green is PROVEN', () => {
  const xml = '<testsuite tests="2" failures="0" errors="0" skipped="0"/>';
  assert.equal(verdict(count(xml)).word, 'PROVEN');
});
