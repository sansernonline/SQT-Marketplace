import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseTable, openRows, draftCard, closeRow } from './friction.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'friction.mjs');

const HEAD = '| วันที่ | plugin | ชนิด · ที่ไหน | เรื่อง | ใครเจอ | ครั้ง | ที่มา | ควรรวมไหม | รวมแล้ว | คาดว่า · ตรวจวันที่ | ผลหลังรวม |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
const row = (title, n, should, done) => `| 2026-10-07 | career | แก้ skill | ${title} | หัวหน้าทีม | ${n} | src | ${should} | ${done} | — | — |\n`;
const QUEUE = '# queue\n\nintro\n\n' + HEAD
  + row('A', 3, 'ใหม่', 'ยัง')
  + row('B', 1, 'ใหม่', 'ยัง')
  + row('C', 5, 'ไม่รวม (x)', 'ยัง')
  + row('D', 4, 'ควรรวม', 'แล้ว 2026-10-08 (T-1)')
  + row('E', 2, 'ควรรวม', 'ยัง')
  + '\n<!-- note -->\n';

test('parseTable finds columns by header name', () => {
  const rows = parseTable(QUEUE);
  assert.equal(rows.length, 5);
  assert.equal(rows[0]['เรื่อง'], 'A');
  assert.equal(rows[2]['ควรรวมไหม'], 'ไม่รวม (x)');
});

test('parseTable works when columns are reordered', () => {
  const t = '| เรื่อง | รวมแล้ว | ครั้ง | ควรรวมไหม |\n|---|---|---|---|\n| Z | ยัง | 2 | ใหม่ |\n';
  const rows = openRows(parseTable(t));
  assert.equal(rows.length, 1);
  assert.equal(rows[0]['เรื่อง'], 'Z');
});

test('openRows keeps only ยัง rows that are not ไม่รวม', () => {
  assert.deepEqual(openRows(parseTable(QUEUE)).map((r) => r['เรื่อง']), ['A', 'B', 'E']);
});

test('draftCard follows the card format', () => {
  const r = openRows(parseTable(QUEUE))[0];
  const d = draftCard(r, 1);
  assert.match(d, /^---\nid: F-1\ntitle: A\nsize: S\ntouch: \[\]\ndone_when:\n {2}- echo "TODO: write the check that proves this is fixed" && exit 1\n---\n/);
  assert.match(d, /> เรื่อง: A/);
});

test('closeRow carded changes only the target row, only the รวมแล้ว cell', () => {
  const out = closeRow(QUEUE, 5, 'carded', 'F-3', '2026-11-28');
  const a = QUEUE.split('\n');
  const b = out.split('\n');
  assert.equal(a.length, b.length);
  const diff = a.map((l, i) => i).filter((i) => a[i] !== b[i]);
  assert.equal(diff.length, 1);
  assert.equal(a[diff[0]].includes('| E |'), true);
  assert.equal(b[diff[0]], a[diff[0]].replace('| ยัง |', '| แล้ว 2026-11-28 (F-3) |'));
  // bytes before and after the target line are identical
  const idx = a.slice(0, diff[0]).join('\n').length;
  assert.equal(out.slice(0, idx), QUEUE.slice(0, idx));
  const tail = a.slice(diff[0] + 1).join('\n');
  assert.equal(out.endsWith(tail), true);
});

test('closeRow dropped sets ควรรวมไหม and keeps CRLF', () => {
  const crlf = QUEUE.replace(/\n/g, '\r\n');
  const out = closeRow(crlf, 1, 'dropped', 'not worth it', '2026-11-28');
  assert.equal(out.replace('| ไม่รวม (not worth it) |', '| ใหม่ |'), crlf);
  assert.equal(openRows(parseTable(out)).length, 2);
});

test('closeRow rejects a missing row', () => {
  assert.throws(() => closeRow(QUEUE, 9, 'carded', 'F-9', '2026-11-28'));
});

test('CLI list, draft (skip existing) and close', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'friction-'));
  try {
    const file = path.join(dir, 'Q.md');
    const out = path.join(dir, 'cards');
    fs.writeFileSync(file, QUEUE);
    const run = (...a) => spawnSync(process.execPath, [script, ...a, '--file', file, '--root', dir], { encoding: 'utf8' });

    const l = run('list');
    assert.equal(l.status, 0);
    assert.match(l.stdout, /1\. \[ครั้ง 3\] A/);
    assert.match(l.stdout, /5\. \[ครั้ง 2\] E/);

    const d1 = run('draft', '--out', out);
    assert.equal(d1.status, 0);
    assert.deepEqual(fs.readdirSync(out).sort(), ['F-1.md', 'F-5.md']);
    fs.writeFileSync(path.join(out, 'F-1.md'), 'mine');
    const d2 = run('draft', '--out', out);
    assert.match(d2.stdout, /skip F-1\.md/);
    assert.equal(fs.readFileSync(path.join(out, 'F-1.md'), 'utf8'), 'mine');

    const c = run('close', '2', 'dropped', 'no', 'longer', 'needed');
    assert.equal(c.status, 0);
    assert.match(fs.readFileSync(file, 'utf8'), /ไม่รวม \(no longer needed\)/);
    assert.equal(run('close', '9', 'carded', 'F-9').status, 2);
    const again = run('close', '2', 'dropped', 'x');
    assert.equal(again.status, 1);
    assert.match(again.stderr, /already closed/);
    assert.equal(run('nope').status, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('closing a row does not shift the numbers of the others (reviewer repro)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'friction-'));
  try {
    const file = path.join(dir, 'Q.md');
    const out = path.join(dir, 'cards');
    fs.writeFileSync(file, '# q\n\n' + HEAD + row('AAA', 2, 'ใหม่', 'ยัง') + row('BBB', 2, 'ใหม่', 'ยัง') + row('CCC', 2, 'ใหม่', 'ยัง'));
    const run = (...a) => spawnSync(process.execPath, [script, ...a, '--file', file, '--root', dir], { encoding: 'utf8' });
    run('draft', '--out', out);
    assert.deepEqual(fs.readdirSync(out).sort(), ['F-1.md', 'F-2.md', 'F-3.md']);
    assert.equal(run('close', '1', 'carded', 'F-1').status, 0);
    assert.equal(run('close', '2', 'carded', 'F-2').status, 0);
    const rows = parseTable(fs.readFileSync(file, 'utf8'));
    assert.deepEqual(rows.map((r) => r['รวมแล้ว'] === 'ยัง'), [false, false, true]);
    assert.match(rows[1]['รวมแล้ว'], /\(F-2\)/);
    assert.match(run('list').stdout, /^3\. \[ครั้ง 2\] CCC/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('draft after a close still writes the right F-n', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'friction-'));
  try {
    const file = path.join(dir, 'Q.md');
    const out = path.join(dir, 'cards');
    fs.writeFileSync(file, '# q\n\n' + HEAD + row('AAA', 2, 'ใหม่', 'ยัง') + row('BBB', 2, 'ใหม่', 'ยัง') + row('CCC', 2, 'ใหม่', 'ยัง'));
    const run = (...a) => spawnSync(process.execPath, [script, ...a, '--file', file, '--root', dir], { encoding: 'utf8' });
    assert.equal(run('close', '1', 'carded', 'F-1').status, 0);
    run('draft', '--out', out);
    assert.deepEqual(fs.readdirSync(out).sort(), ['F-2.md', 'F-3.md']);
    assert.match(fs.readFileSync(path.join(out, 'F-3.md'), 'utf8'), /title: CCC/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
