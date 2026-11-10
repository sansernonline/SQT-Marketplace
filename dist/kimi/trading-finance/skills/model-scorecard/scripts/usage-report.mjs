#!/usr/bin/env node
// Usage report from session transcripts: token share per skill and per subagent type, cache breaks, costliest prompts.
// Writes one self-contained HTML file (no external CDN). Read-only on transcripts.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { events, listTranscripts, parseArgs, bareSkill, oneLine } from "./lib/transcripts.mjs";

const HELP = `usage-report.mjs [options]
Token share per skill and per subagent type, cache breaks, costliest prompts -> one HTML file.
  --project <folder|slug>  project (default: current folder)   --since <date>  files changed on/after (YYYY-MM-DD)
  --out <file>             HTML output (default: ./usage-report.html)
  --log <dir>              superuser log folder; adds the per-agent totals from <date>/tokens.json
  --findings <file>        3-5 lines (one finding per line) written by the model; shown on top. Fewer than 3 or more than 5 = warning
  --json                   print the numbers instead of writing HTML (read these before writing findings)
  --root <dir>             projects folder (testing)   --top <n>  rows per table (default 8)
Share (%) = cost-weighted tokens (input 1 · output 5 · cache write 1.25 · cache read 0.05, the price ratios in references/prices.json),
because raw cache-read tokens are ~95% of the count but a tiny part of the bill. Raw token totals are shown beside it. A skill owns the assistant turns after it was opened, until the next
skill or the next person-typed prompt (an approximation; skill load size itself is small). Cache break = a turn that writes
>= 20000 cache tokens while reading under half of the turn before. Prompt text is redacted and cut to 80 chars.`;
const SPEC = { project: "v", since: "v", out: "v", log: "v", findings: "v", json: "flag", root: "v", top: "v", help: "flag" };

const sum = (u) => u.input + u.output + u.cacheRead + u.cacheCreate;
// cost weight, price ratios shared by every model in references/prices.json: input 1 · output 5 · cache write 1.25 · cache read 0.05
const weigh = (u) => u.input + 5 * u.output + 1.25 * u.cacheCreate + 0.05 * u.cacheRead;
const zero = () => ({ input: 0, output: 0, cacheRead: 0, cacheCreate: 0, turns: 0 });
const addTo = (m, key, u) => { const t = m.get(key) ?? zero(); for (const k of ["input", "output", "cacheRead", "cacheCreate"]) t[k] += u[k]; t.turns++; m.set(key, t); };
const BREAK_MIN = 20000;

export async function collect(o = {}) {
  const skills = new Map(), agents = new Map(), models = new Map(), prompts = [], breaks = [];
  let total = 0, weighted = 0, skippedLong = 0;
  for (const f of listTranscripts({ root: o.root, project: o.project, subagents: true, since: o.since })) {
    const seen = new Map(); // message id -> index, streamed duplicates keep the last usage
    const turns = [];
    const st = {};
    let activeSkill = null, curPrompt = null;
    for await (const e of events(f.file, { stats: st })) {
      if (e.kind === "prompt" && f.agentType === "main") { activeSkill = null; curPrompt = { text: oneLine(e.text, 80), tokens: 0, date: e.ts.slice(0, 10), session: f.session.slice(0, 8) }; prompts.push(curPrompt); continue; }
      if (e.kind !== "assistant") continue;
      const t = { e, skill: activeSkill, prompt: curPrompt };
      if (seen.has(e.id)) turns[seen.get(e.id)] = { ...t, skill: turns[seen.get(e.id)].skill }; else { seen.set(e.id, turns.length); turns.push(t); }
      for (const tool of e.tools) if (tool.name === "Skill" && tool.input.skill) activeSkill = bareSkill(tool.input.skill);
    }
    skippedLong += st.skippedLong ?? 0;
    let prev = null;
    for (const { e, skill, prompt } of turns) {
      total += sum(e.usage); const n = weigh(e.usage); weighted += n;
      addTo(agents, f.agentType, e.usage);
      if (e.model) addTo(models, e.model, e.usage);
      if (f.agentType === "main") addTo(skills, skill ?? "(no skill)", e.usage);
      if (prompt && f.agentType === "main") prompt.tokens += n;
      if (prev && e.usage.cacheCreate >= BREAK_MIN && e.usage.cacheRead < prev.cacheRead / 2) breaks.push({ date: e.ts.slice(0, 10), session: f.session.slice(0, 8), agent: f.agentType, wrote: e.usage.cacheCreate, readBefore: prev.cacheRead, readNow: e.usage.cacheRead });
      prev = e.usage;
    }
  }
  const share = (m) => [...m.entries()].map(([name, u]) => ({ name, ...u, total: sum(u), cost: weigh(u), pct: weighted ? (100 * weigh(u)) / weighted : 0 })).sort((a, b) => b.cost - a.cost);
  let logTokens = null;
  if (o.log && existsSync(o.log)) {
    logTokens = {};
    for (const d of readdirSync(o.log).filter((n) => /^\d{4}-\d{2}-\d{2}$/.test(n))) {
      try { for (const [a, u] of Object.entries(JSON.parse(readFileSync(join(o.log, d, "tokens.json"), "utf8")))) { const t = (logTokens[a] ??= zero()); for (const k of ["input", "output", "cacheRead", "cacheCreate"]) t[k] += u[k] ?? 0; } } catch { /* day without tokens.json */ }
    }
  }
  return {
    total, sessions: new Set(prompts.map((p) => p.session)).size, skippedLong,
    skills: share(skills), agents: share(agents), models: share(models),
    breaks: breaks.sort((a, b) => b.wrote - a.wrote), prompts: prompts.sort((a, b) => b.tokens - a.tokens),
    logTokens,
  };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(n));

export function parseFindings(text) {
  const lines = String(text ?? "").split(/\r?\n/).map((l) => l.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim()).filter(Boolean);
  return { lines: lines.slice(0, 5), warning: lines.length < 3 || lines.length > 5 ? `findings should be 3-5 lines, got ${lines.length}` : "" };
}

export function renderHtml(r, { findings = [], top = 8, title = "รายงานการใช้ token" } = {}) {
  const bar = (rows) => `<table>${rows.slice(0, top).map((x) => `<tr><td>${esc(x.name)}</td><td class="n">${x.pct.toFixed(1)}%</td><td class="n">${fmt(x.total)}</td><td class="b"><i style="width:${Math.max(1, Math.round(x.pct))}%"></i></td></tr>`).join("")}</table>`;
  const html = [`<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>
:root{--bg:#fafaf7;--fg:#1c1c1a;--mute:#6b6b66;--line:#dcdcd4;--bar:#2f6f6b}
@media (prefers-color-scheme:dark){:root{--bg:#161614;--fg:#ecece6;--mute:#9a9a92;--line:#33332f;--bar:#5fb3ad}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,"Segoe UI",sans-serif}
main{max-width:860px;margin:0 auto;padding:24px 16px}h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:28px 0 8px}
p.s{color:var(--mute);margin:0}table{width:100%;border-collapse:collapse}td{padding:5px 8px 5px 0;border-bottom:1px solid var(--line);vertical-align:top}
td.n{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}td.b{width:35%}td.b i{display:block;height:8px;background:var(--bar);border-radius:2px}
ol{padding-left:20px}li{margin:4px 0}.warn{color:#b35a00}
</style></head><body><main><h1>${esc(title)}</h1><p class="s">${r.sessions} session · ${fmt(r.total)} token ดิบรวม 4 ช่อง · เปอร์เซ็นต์คิดจาก token ถ่วงตามราคา (output 5 เท่า · cache เขียน 1.25 เท่า · cache อ่าน 0.05 เท่าของ input) · ข้ามบรรทัดที่ใหญ่เกินกำหนด ${r.skippedLong} บรรทัด</p>`];
  if (findings.length) html.push(`<h2>ข้อสังเกต</h2><ol>${findings.map((f) => `<li>${esc(f)}</li>`).join("")}</ol>`);
  html.push(`<h2>token ต่อ skill (ประมาณ จากรอบตอบหลังเปิด skill)</h2>${bar(r.skills)}`);
  html.push(`<h2>token ต่อชนิดผู้ทำงาน (main = หัวหน้า · ที่เหลือ = ชนิดลูกทีม)</h2>${bar(r.agents)}`);
  html.push(`<h2>token ต่อ model</h2>${bar(r.models)}`);
  html.push(`<h2>cache หลุด (${r.breaks.length} ครั้ง)</h2>` + (r.breaks.length ? `<table>${r.breaks.slice(0, top).map((b) => `<tr><td>${b.date} ${b.session} ${esc(b.agent)}</td><td class="n">เขียน ${fmt(b.wrote)}</td><td class="n">อ่านก่อนหน้า ${fmt(b.readBefore)} → ${fmt(b.readNow)}</td></tr>`).join("")}</table>` : "<p class='s'>ไม่พบ</p>"));
  html.push(`<h2>ข้อความที่แพงสุด (หน่วย token ถ่วงราคา)</h2><table>${r.prompts.slice(0, top).map((p) => `<tr><td>${p.date} ${p.session}</td><td>${esc(p.text)}</td><td class="n">${fmt(p.tokens)}</td></tr>`).join("")}</table>`);
  if (r.logTokens) html.push(`<h2>รวมจาก token log ของ superuser</h2><table>${Object.entries(r.logTokens).map(([a, u]) => `<tr><td>${esc(a)}</td><td class="n">${fmt(sum(u))}</td></tr>`).join("")}</table>`);
  html.push("</main></body></html>");
  return html.join("");
}

async function main() {
  const a = parseArgs(process.argv.slice(2), SPEC);
  if (a.help) { console.log(HELP); return; }
  const r = await collect(a);
  const top = Number(a.top ?? 8);
  if (a.json) { console.log(JSON.stringify({ ...r, skills: r.skills.slice(0, top), agents: r.agents.slice(0, top), models: r.models.slice(0, top), breaks: r.breaks.slice(0, top), prompts: r.prompts.slice(0, top) }, null, 2)); return; }
  let findings = [];
  if (a.findings) { const f = parseFindings(readFileSync(a.findings, "utf8")); findings = f.lines; if (f.warning) console.error("warning: " + f.warning); }
  const out = a.out ?? join(process.cwd(), "usage-report.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderHtml(r, { findings, top }));
  console.log(`wrote ${out} · ${r.sessions} session(s) · ${fmt(r.total)} tokens`);
}
if (process.argv[1]?.replace(/\\/g, "/").endsWith("/usage-report.mjs")) main().catch((e) => { console.error(e.message); process.exit(1); });
