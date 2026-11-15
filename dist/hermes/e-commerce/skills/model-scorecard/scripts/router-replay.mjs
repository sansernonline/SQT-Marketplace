#!/usr/bin/env node
// Replay real prompts from past sessions through hooks/skill-router.json and compare with the skills the model really opened.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { events, listTranscripts, parseArgs, bareSkill, routeSkills, oneLine, HOOKS_DIR } from "./lib/transcripts.mjs";

const HELP = `router-replay.mjs [options]
For each real prompt in this project's past sessions: which skills the router names (hooks/skill-router.json) vs which the model opened with the Skill tool in that turn.
  --project <folder|slug>   project (default: current folder)   --all  every project
  --router <file>           router rules (default: this plugin's hooks/skill-router.json)
  --since <date>            files changed on/after (YYYY-MM-DD)  --limit <n>  rows per table (default 10)
  --installed               also compare the router with copies in ~/.claude/plugins/cache (installed vs dev)
  --json  --root <dir>      machine-readable output / projects folder (testing)
Tables: MISSED = opened but not routed (gap in rules) · IGNORED = routed but never opened · prompts with neither are only counted.
Matching uses bare skill names (superuser:simplify = simplify). Prompt text is redacted and cut to 80 chars.`;
const SPEC = { project: "v", all: "flag", router: "v", since: "v", limit: "v", installed: "flag", json: "flag", root: "v", help: "flag" };

export async function replay(o = {}) {
  const routerFile = o.router ?? join(HOOKS_DIR, "skill-router.json");
  const router = JSON.parse(readFileSync(routerFile, "utf8"));
  const turns = [];
  for (const f of listTranscripts({ root: o.root, project: o.project, all: o.all, since: o.since })) {
    let cur = null;
    for await (const e of events(f.file)) {
      if (e.kind === "prompt") { cur = { prompt: e.text, opened: new Set() }; turns.push(cur); }
      else if (e.kind === "assistant" && cur) for (const t of e.tools) if (t.name === "Skill" && t.input.skill) cur.opened.add(bareSkill(t.input.skill));
    }
  }
  const missed = new Map(), ignored = new Map();
  let agree = 0, silent = 0;
  const add = (m, skill, prompt) => { const r = m.get(skill) ?? { skill, n: 0, example: oneLine(prompt, 80) }; r.n++; m.set(skill, r); };
  for (const t of turns) {
    const routed = new Set(routeSkills(t.prompt, router).map(bareSkill));
    if (!routed.size && !t.opened.size) { silent++; continue; }
    let clean = true;
    for (const s of t.opened) if (!routed.has(s)) { add(missed, s, t.prompt); clean = false; }
    for (const s of routed) if (!t.opened.has(s)) { add(ignored, s, t.prompt); clean = false; }
    if (clean) agree++;
  }
  const rank = (m) => [...m.values()].sort((a, b) => b.n - a.n);
  return { prompts: turns.length, agree, silent, missed: rank(missed), ignored: rank(ignored), routerFile };
}

// installed copies vs the dev router (same bytes = in sync)
export function installedDiff(devFile, cacheRoot = join(homedir(), ".claude", "plugins", "cache")) {
  const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 12);
  const dev = sha(devFile), copies = [];
  const walk = (d, depth) => {
    if (depth > 7 || !existsSync(d)) return;
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (n === "skill-router.json") copies.push({ file: p, sha: sha(p), same: sha(p) === dev });
      else if (statSync(p).isDirectory()) walk(p, depth + 1);
    }
  };
  walk(cacheRoot, 0);
  return { dev, copies };
}

async function main() {
  const a = parseArgs(process.argv.slice(2), SPEC);
  if (a.help) { console.log(HELP); return; }
  const lim = Number(a.limit ?? 10);
  const r = await replay(a);
  const inst = a.installed ? installedDiff(a.router ?? join(HOOKS_DIR, "skill-router.json")) : null;
  if (a.json) { console.log(JSON.stringify({ ...r, missed: r.missed.slice(0, lim), ignored: r.ignored.slice(0, lim), installed: inst }, null, 2)); return; }
  console.log(`prompts ${r.prompts} · router and model agree ${r.agree} · neither used a skill ${r.silent}`);
  const table = (title, rows) => { console.log(`\n${title}`); for (const x of rows.slice(0, lim)) console.log(`${String(x.n).padStart(4)}  ${x.skill.padEnd(28)} e.g. ${x.example}`); if (!rows.length) console.log("   (none)"); };
  table("MISSED (opened, router did not name it) -> add or widen a rule", r.missed);
  table("IGNORED (router named it, never opened) -> rule too broad or wording too weak", r.ignored);
  if (inst) { console.log(`\ninstalled router copies (dev sha ${inst.dev}):`); const odd = inst.copies.filter((c) => !c.same); console.log(`  ${inst.copies.length - odd.length} same · ${odd.length} different (newest 5 shown)`); for (const c of odd.slice(-5)) console.log(`  ${c.same ? "same     " : "DIFFERENT"} ${c.sha} ${c.file}`); if (!inst.copies.length) console.log("  none found"); }
}
if (process.argv[1]?.replace(/\\/g, "/").endsWith("/router-replay.mjs")) main().catch((e) => { console.error(e.message); process.exit(1); });
