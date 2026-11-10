#!/usr/bin/env node
// Claim ledger: every claim is PROVED, REFUTED or OPEN; the script prints the next action.
// Usage:
//   node ledger.mjs add   <file> <id> "<claim text>"
//   node ledger.mjs mark  <file> <id> PROVED|REFUTED|OPEN --evidence "<file:line / test result>"
//   node ledger.mjs close <file> <id>          (a REFUTED claim has been removed from the conclusions)
//   node ledger.mjs next  <file> [--min-rounds N] [--max-rounds N]
// One `mark` = one independent check. PROVED needs >= min-rounds checks (default 2) so
// the first prover alone never closes a claim. Exit code: 0 ok, 1 usage, 2 bad file.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const STATUSES = ["PROVED", "REFUTED", "OPEN"];
export const DEFAULTS = { minRounds: 2, maxRounds: 4 };

export function validate(ledger) {
  if (!ledger || !Array.isArray(ledger.claims)) throw new Error("ledger must have a claims array");
  const seen = new Set();
  for (const c of ledger.claims) {
    if (!c.id || seen.has(c.id)) throw new Error(`missing or duplicate id: ${c.id}`);
    seen.add(c.id);
    if (!STATUSES.includes(c.status)) throw new Error(`${c.id}: status must be one of ${STATUSES.join("/")}`);
  }
  return ledger;
}

export function add(ledger, id, text) {
  if (ledger.claims.some((c) => c.id === id)) throw new Error(`claim ${id} already exists`);
  ledger.claims.push({ id, text, status: "OPEN", rounds: 0, evidence: [], closed: false });
  return ledger;
}

export function mark(ledger, id, status, evidence) {
  const c = ledger.claims.find((x) => x.id === id);
  if (!c) throw new Error(`no claim ${id}`);
  if (!STATUSES.includes(status)) throw new Error(`status must be one of ${STATUSES.join("/")}`);
  if (status !== "OPEN" && !evidence) throw new Error("PROVED and REFUTED need --evidence");
  c.status = status;
  c.rounds += 1;
  c.closed = false;
  if (evidence) c.evidence.push(evidence);
  return ledger;
}

export function close(ledger, id) {
  const c = ledger.claims.find((x) => x.id === id);
  if (!c) throw new Error(`no claim ${id}`);
  if (c.status !== "REFUTED") throw new Error(`${id} is ${c.status}; only a REFUTED claim is closed`);
  c.closed = true;
  return ledger;
}

// Returns { done, action, counts }. Unfinished claims first, fewest checks first.
export function next(ledger, opts = {}) {
  const { minRounds, maxRounds } = { ...DEFAULTS, ...opts };
  const cs = ledger.claims;
  const counts = Object.fromEntries(STATUSES.map((s) => [s, cs.filter((c) => c.status === s).length]));
  if (!cs.length) return { done: false, action: "add claims first: list every claim the conclusion depends on", counts };

  const open = cs.filter((c) => c.status === "OPEN").sort((a, b) => a.rounds - b.rounds);
  const stuck = open.filter((c) => c.rounds >= maxRounds);
  const workable = open.filter((c) => c.rounds < maxRounds);
  if (workable.length) {
    const c = workable[0];
    return { done: false, action: `check ${c.id} with a fresh verifier (checks so far ${c.rounds}): ${c.text}`, counts };
  }
  const thin = cs.filter((c) => c.status === "PROVED" && c.rounds < minRounds).sort((a, b) => a.rounds - b.rounds);
  if (thin.length) {
    const c = thin[0];
    return { done: false, action: `${c.id} is PROVED by ${c.rounds} check(s), minimum is ${minRounds}: send a fresh verifier to try to refute it`, counts };
  }
  const unhandled = cs.filter((c) => c.status === "REFUTED" && !c.closed);
  if (unhandled.length) {
    const c = unhandled[0];
    return { done: false, action: `${c.id} is REFUTED: remove it from the conclusions, then run: close <file> ${c.id}`, counts };
  }
  if (stuck.length) {
    return { done: true, stuck: true, action: `stop: ${stuck.map((c) => c.id).join(", ")} still OPEN after ${maxRounds} checks; report them as unproven with what is missing`, counts };
  }
  return { done: true, action: `done: ${counts.PROVED} PROVED, ${counts.REFUTED} REFUTED and removed`, counts };
}

function load(file) {
  if (!existsSync(file)) return { claims: [] };
  try { return validate(JSON.parse(readFileSync(file, "utf8"))); }
  catch (e) { console.error(`bad ledger ${file}: ${e.message}`); process.exit(2); }
}
const flag = (args, name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

function main(argv) {
  const [cmd, file, ...rest] = argv;
  if (cmd === "--help" || cmd === "-h") { console.log("usage: ledger.mjs add|mark|close|next <file> ..."); return; }
  if (!cmd || !file) { console.error("usage: ledger.mjs add|mark|close|next <file> ..."); process.exit(1); }
  const ledger = load(file);
  try {
    if (cmd === "add") add(ledger, rest[0], rest[1] ?? rest[0]);
    else if (cmd === "mark") mark(ledger, rest[0], rest[1], flag(rest, "--evidence"));
    else if (cmd === "close") close(ledger, rest[0]);
    else if (cmd !== "next") { console.error(`unknown command ${cmd}`); process.exit(1); }
    if (cmd !== "next") writeFileSync(file, JSON.stringify(ledger, null, 2) + "\n");
  } catch (e) { console.error(e.message); process.exit(1); }
  const opts = {};
  if (flag(rest, "--min-rounds")) opts.minRounds = Number(flag(rest, "--min-rounds"));
  if (flag(rest, "--max-rounds")) opts.maxRounds = Number(flag(rest, "--max-rounds"));
  const r = next(ledger, opts);
  console.log(`PROVED ${r.counts.PROVED} · REFUTED ${r.counts.REFUTED} · OPEN ${r.counts.OPEN}`);
  console.log(`next: ${r.action}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv.slice(2));
