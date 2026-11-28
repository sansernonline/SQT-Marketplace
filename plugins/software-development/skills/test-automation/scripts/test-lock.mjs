#!/usr/bin/env node
// Run a heavy test command only when no other run holds the lock on this machine.
// Usage: node test-lock.mjs [--name <lock>] [--wait <sec, default 1800>] -- <command...>
// Exit: the command's exit code · 2 usage error or wait timeout.
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function lockPath(name = 'default') {
  return path.join(tmpdir(), `sqt-test-lock-${name}.json`);
}

const TAKEOVER_STALE_MS = 10000; // the takeover mutex is held for a few ms; older means its holder died

// Remove a stale lock only while holding `<file>.takeover`, and only if the lock is still the stale one.
// Returns true when this process holds the mutex (the caller retries `wx` either way).
function takeOver(file, staleRaw) {
  const mutex = `${file}.takeover`;
  try {
    writeFileSync(mutex, String(process.pid), { flag: 'wx' });
  } catch {
    try { if (Date.now() - statSync(mutex).mtimeMs > TAKEOVER_STALE_MS) rmSync(mutex, { force: true }); } catch { /* gone */ }
    return false;
  }
  try {
    let now = null;
    try { now = readFileSync(file, 'utf8'); } catch { /* already gone */ }
    if (now === staleRaw) rmSync(file, { force: true });
  } finally {
    rmSync(mutex, { force: true });
  }
  return true;
}

export function isStale(lock, now, isAlive) {
  if (!isAlive(lock.pid)) return true;
  const at = typeof lock.at === 'number' ? lock.at : Date.parse(lock.at);
  return now - at > SIX_HOURS;
}

function pidAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function main(argv) {
  const dd = argv.indexOf('--');
  const opts = dd === -1 ? argv : argv.slice(0, dd);
  const cmd = dd === -1 ? [] : argv.slice(dd + 1);
  let name = 'default';
  let wait = 1800;
  for (let i = 0; i < opts.length; i++) {
    if (opts[i] === '--name') name = opts[++i];
    else if (opts[i] === '--wait') wait = Number(opts[++i]);
  }
  if (cmd.length === 0 || typeof name !== 'string' || !/^[\w.-]+$/.test(name) || Number.isNaN(wait)) {
    console.error('Usage: test-lock.mjs [--name <lock>] [--wait <sec>] -- <command...>');
    return 2;
  }
  const file = lockPath(name);
  const command = cmd.join(' ');
  const deadline = Date.now() + wait * 1000;
  let announced = false;
  for (;;) {
    try {
      writeFileSync(file, JSON.stringify({ pid: process.pid, at: Date.now(), cmd: command }), { flag: 'wx' });
      break;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
    let lock = null;
    let raw = null;
    let stale = false;
    try { raw = readFileSync(file, 'utf8'); lock = JSON.parse(raw); } catch { /* unreadable */ }
    if (lock) stale = isStale(lock, Date.now(), pidAlive);
    else {
      // An unreadable lock may be mid-write: only treat it as stale after 60 s.
      try { stale = Date.now() - statSync(file).mtimeMs > 60000; } catch { /* gone: retry */ }
    }
    if (stale) {
      // Two waiters can both see the same stale lock; without a mutex the slower one would delete the
      // faster one's fresh lock. Only the holder of `<file>.takeover` may remove it, after re-reading.
      if (takeOver(file, raw)) continue;
      await sleep(50);
      continue;
    }
    if (!announced) {
      console.log(`Waiting for test lock "${name}"${lock ? ` held by pid ${lock.pid}` : ''}...`);
      announced = true;
    }
    const left = deadline - Date.now();
    if (left <= 0) {
      console.error(`Gave up after ${wait} s waiting for lock "${name}".`);
      return 2;
    }
    await sleep(Math.min(2000, left));
  }
  // Delete the lock only while it is still ours: a run longer than 6 h may have lost it to another waiter.
  const release = () => {
    let raw = '';
    try { raw = readFileSync(file, 'utf8'); } catch { return; } // already gone
    // Matching the raw text (not JSON.parse) still frees our own lock if the file got cut short.
    if (raw.includes(`"pid":${process.pid},`)) rmSync(file, { force: true });
  };
  let child = null;
  const onSignal = () => {
    if (child && child.exitCode === null) { try { child.kill(); } catch { /* already gone */ } }
    release();
    process.exit(130);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
  try {
    return await new Promise((resolve) => {
      // One argument = a whole command line (as culprit --test passes it) → shell.
      // Windows needs the shell to find .cmd tools (npm, vitest, tsc); quote only the arguments that need it,
      // never the tool name, because cmd.exe breaks npm.cmd's own path when its name is quoted.
      const q = (a) => (/[\s"&|<>^()%!]/.test(a) ? `"${String(a).replace(/"/g, '\\"')}"` : a);
      if (cmd.length === 1) child = spawn(cmd[0], { stdio: 'inherit', shell: true });
      else if (process.platform === 'win32') child = spawn([cmd[0], ...cmd.slice(1).map(q)].join(' '), { stdio: 'inherit', shell: true });
      else child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: false });
      child.on('error', (e) => { console.error(`test-lock: could not start the command: ${e.message}`); resolve(1); });
      child.on('close', (code) => resolve(code ?? 1));
    });
  } finally {
    release();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then((c) => process.exit(c));
}
