#!/usr/bin/env node
// Read test result files and print one verdict line, so the agent never types pass counts itself.
// Usage: node test-verdict.mjs <result-file>... [--expect N]
// Accepts node:test / TAP output (`# pass 3`, `# fail 0`, `# skipped 1`) and JUnit XML (<testsuite tests= failures= errors= skipped=>).
import { readFileSync } from 'node:fs';

export function countTap(text) {
  const num = key => Number((text.match(new RegExp(`^# ${key} (\\d+)`, 'm')) || [])[1] || 0);
  const pass = num('pass'), fail = num('fail'), skip = num('skipped') + num('todo');
  return { tests: pass + fail + skip, fail, skip };
}

export function countJunit(text) {
  const out = { tests: 0, fail: 0, skip: 0 };
  // Count only leaf <testsuite> totals; a wrapping <testsuites> repeats them.
  for (const m of text.matchAll(/<testsuite\b([^>]*)>/g)) {
    const attr = k => Number((m[1].match(new RegExp(`\\b${k}="(\\d+)"`)) || [])[1] || 0);
    out.tests += attr('tests');
    out.fail += attr('failures') + attr('errors');
    out.skip += attr('skipped');
  }
  return out;
}

export function count(text) {
  return /<testsuite\b/.test(text) ? countJunit(text) : countTap(text);
}

export function verdict({ tests, fail, skip }, expect = 0) {
  if (tests === 0) return { word: 'NOT PROVEN', why: 'no tests ran' };
  if (fail > 0) return { word: 'NOT PROVEN', why: `${fail} failed` };
  if (skip > 0) return { word: 'PARTLY', why: `${skip} skipped` };
  if (expect && tests < expect) return { word: 'PARTLY', why: `ran ${tests} of expected ${expect}` };
  return { word: 'PROVEN', why: `${tests} passed` };
}

function main(argv) {
  if (!argv.length || argv.includes('--help')) {
    console.log('Usage: node test-verdict.mjs <result-file>... [--expect N]\nPrints PROVEN / PARTLY / NOT PROVEN from TAP or JUnit XML files. Exit 0 only for PROVEN.');
    return 0;
  }
  const i = argv.indexOf('--expect');
  const expect = i >= 0 ? Number(argv[i + 1]) : 0;
  const files = i >= 0 ? argv.toSpliced(i, 2) : argv;
  const total = { tests: 0, fail: 0, skip: 0 };
  for (const f of files) {
    const c = count(readFileSync(f, 'utf8'));
    for (const k of Object.keys(total)) total[k] += c[k];
  }
  const v = verdict(total, expect);
  console.log(`${v.word} · tests ${total.tests} · fail ${total.fail} · skip ${total.skip} · ${v.why}`);
  return v.word === 'PROVEN' ? 0 : 1;
}

if (process.argv[1]?.endsWith('test-verdict.mjs')) {
  process.exitCode = main(process.argv.slice(2));
}
