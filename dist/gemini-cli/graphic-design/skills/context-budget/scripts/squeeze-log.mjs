#!/usr/bin/env node
// squeeze-log: shrink a long command/test log before it enters context.
// Usage: node squeeze-log.mjs [file] [--max 100] [--context 3]   (no file → stdin)
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ERR = /error|fail|exception|traceback|panic|fatal|warn|✗|assert/i;
const HEAD = 10;
const TAIL = 20;

const norm = (s) =>
  s
    .replace(/\d{4}-\d\d-\d\d[T ]\d\d:\d\d:\d\d(?:[.,]\d+)?(?:Z|[+-]\d\d:?\d\d)?/g, '#')
    .replace(/\b0x[0-9a-f]+\b|\b[0-9a-f]{8,}\b/gi, '#')
    .replace(/\d+/g, '#');

export function squeeze(text, opts = {}) {
  const max = opts.max ?? 100;
  const context = opts.context ?? 3;
  const lines = text.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === '') lines.pop();

  // collapse runs of lines that are equal after normalising
  const entries = [];
  let errors = 0;
  for (const line of lines) {
    const isErr = ERR.test(line);
    if (isErr) errors++;
    const key = norm(line);
    const last = entries[entries.length - 1];
    if (last && last.key === key) last.n++;
    else entries.push({ line, key, n: 1, err: isErr });
  }

  const build = (ctx, h, t) => {
    const keep = new Set();
    for (let i = 0; i < Math.min(h, entries.length); i++) keep.add(i);
    for (let i = Math.max(0, entries.length - t); i < entries.length; i++) keep.add(i);
    entries.forEach((e, i) => {
      if (!e.err) return;
      for (let j = Math.max(0, i - ctx); j <= Math.min(entries.length - 1, i + ctx); j++) keep.add(j);
    });
    const out = [];
    let gap = 0;
    const flush = () => {
      if (gap) out.push(`… ${gap} lines …`);
      gap = 0;
    };
    entries.forEach((e, i) => {
      if (keep.has(i)) {
        flush();
        out.push(e.n > 1 ? `${e.line} (×${e.n})` : e.line);
      } else gap += e.n;
    });
    flush();
    return out;
  };

  const budget = Math.max(1, max - 1); // 1 line for the header
  let body = build(context, HEAD, TAIL);
  for (let c = context - 1; body.length > budget && c >= 0; c--) body = build(c, HEAD, TAIL);
  for (let k = 1; body.length > budget && k <= TAIL; k++) {
    body = build(0, Math.max(0, HEAD - k), Math.max(0, TAIL - k));
  }
  if (body.length > budget) body = body.slice(0, budget);

  const out = [`squeeze-log: ${lines.length} → ${body.length + 1} lines · errors ${errors}`, ...body];
  return out.join('\n');
}

function main(argv) {
  const opts = {};
  let file;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--max') opts.max = Number(argv[++i]);
    else if (argv[i] === '--context') opts.context = Number(argv[++i]);
    else file = argv[i];
  }
  const text = readFileSync(file ?? 0, 'utf8');
  process.stdout.write(squeeze(text, opts) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
