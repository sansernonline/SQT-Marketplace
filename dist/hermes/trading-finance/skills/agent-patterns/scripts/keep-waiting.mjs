#!/usr/bin/env node
// Turn-holder: sleeps shorter than the tool timeout, then prints what to do next, so the lead
// can wait on a background run without polling in chat. Works the same on Windows, macOS, Linux.
// Usage: node keep-waiting.mjs [--seconds N] [--until-file <path>]
//   --seconds N       sleep length per call (default 100, keep it under the Bash timeout of 120)
//   --until-file P    stop as soon as P exists (the background run writes it when done)
// Output: "DONE <path>" (exit 0) when the file exists, else "KEEP WAITING: run this command again" (exit 0).
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function wait({ seconds = 100, untilFile, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), exists = existsSync } = {}) {
  const deadline = Date.now() + seconds * 1000;
  while (Date.now() < deadline) {
    if (untilFile && exists(untilFile)) return { done: true };
    await sleep(Math.min(1000, Math.max(0, deadline - Date.now())));
  }
  return { done: Boolean(untilFile && exists(untilFile)) };
}

async function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) { console.log("Usage: node keep-waiting.mjs [--seconds N] [--until-file <path>]\nSleeps up to N seconds (default 100), prints DONE when the file appears, else KEEP WAITING."); return; }
  const get = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const seconds = Number(get("--seconds") ?? 100);
  if (!Number.isFinite(seconds) || seconds <= 0) { console.error("--seconds must be a positive number"); process.exitCode = 1; return; }
  const untilFile = get("--until-file");
  const r = await wait({ seconds, untilFile });
  console.log(r.done ? `DONE ${untilFile}` : `KEEP WAITING: run this command again (node ${process.argv.slice(1).map((a) => JSON.stringify(a)).join(" ")})`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main(process.argv.slice(2));
