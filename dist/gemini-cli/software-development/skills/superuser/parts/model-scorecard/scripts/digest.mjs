#!/usr/bin/env node
// Compress the superuser logs and CONTEXT.md progress into one short digest.md (today + last 7 days).
// Anything marked blocked or waiting is kept at any age (a row is cut only past 400 chars). Writes only the --out file.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { readLines, parseArgs, oneLine } from "./lib/transcripts.mjs";

const HELP = `digest.mjs [options]
Write .claude/superuser/digest.md: what is waiting, what happened today, one line per day for the last 7 days.
  --log <dir>        superuser log folder with <date>/ subfolders (default .claude/superuser/log)
  --progress <file>  CONTEXT.md to read progress from (default .claude/superuser/CONTEXT.md)
  --out <file>       output (default .claude/superuser/digest.md)   --stdout  print instead of writing
  --today <YYYY-MM-DD>  override today (testing)   --days <n>  history length (default 7)   --keep <n>  non-blocked progress rows to keep (default 5)
Blocked or waiting = a progress row with blocked / waiting / รอผู้ใช้ / (รอยืนยัน) / รออนุมัติ / ติดที่, every row under "## รอผู้ใช้", and review verdicts fail or conditional. These are never dropped.
Prompt text is redacted with the superuser hook patterns and cut short.`;
const SPEC = { log: "v", progress: "v", out: "v", stdout: "flag", today: "v", days: "v", keep: "v", help: "flag" };

// "รอ" must be followed by a space or end so words like รอบ do not match
export const BLOCKED = /\bblocked\b|\bwaiting\b|รอผู้ใช้|รออนุมัติ|รอคำตอบ|รอตัดสิน|\(รอยืนยัน\)|(?<![ก-๙])รอ(?=\s|$)|ติดที่|ติดอยู่/i;

async function jsonl(file) {
  const out = [];
  if (!existsSync(file)) return out;
  for await (const r of readLines(file)) if (r.line) { try { out.push(JSON.parse(r.line)); } catch { /* skip bad line */ } }
  return out;
}

export async function summariseDay(logDir, date) {
  const dir = join(logDir, date);
  if (!existsSync(dir)) return null;
  const main = await jsonl(join(dir, "main.jsonl"));
  const runs = await jsonl(join(dir, "runs.jsonl"));
  const prompts = main.filter((e) => e.event === "UserPromptSubmit" && e.prompt && !/^\s*<(agent-message|task-notification)/i.test(e.prompt));
  const results = runs.filter((e) => e.event === "result");
  const verdict = (v) => results.filter((r) => r.verdict === v).length;
  let tokens = 0;
  try { for (const t of Object.values(JSON.parse(readFileSync(join(dir, "tokens.json"), "utf8")))) tokens += (t.input ?? 0) + (t.output ?? 0) + (t.cacheRead ?? 0) + (t.cacheCreate ?? 0); } catch { /* no token file */ }
  return {
    date, prompts: prompts.length, corrections: prompts.filter((p) => p.correction).length,
    runs: runs.filter((e) => e.event === "run").length, pass: verdict("pass"), fail: verdict("fail"), conditional: verdict("conditional"),
    rejected: runs.filter((e) => e.event === "feedback" && e.user_feedback === "reject").length, tokens,
    lastPrompts: prompts.slice(-3).map((p) => oneLine(p.prompt, 80)),
    flagged: results.filter((r) => r.verdict === "fail" || r.verdict === "conditional").map((r) => `${r.role ?? r.agent ?? "agent"} ${r.verdict}${r.round ? " round " + r.round : ""}`),
  };
}

export function sections(md) {
  const out = {}; let cur = null;
  for (const line of md.split(/\r?\n/)) {
    const h = /^##\s+(.*)$/.exec(line);
    if (h) { cur = h[1].trim(); out[cur] = []; } else if (cur) out[cur].push(line);
  }
  return out;
}

const SEP = /^\s*\|[\s:|-]+\|\s*$/;
// table rows and list items; a table header row (the one right above the --- line) is not an entry
const rowsOf = (lines) => lines.filter((l, k) => /^\s*(\||-\s|\d+\.\s)/.test(l) && !SEP.test(l) && !SEP.test(lines[k + 1] ?? ""));

export function progressParts(md, keep = 5) {
  const s = sections(md);
  const progress = rowsOf(s["ความคืบหน้า"] ?? []).filter((r) => !/^\s*\|\s*(ที่|งาน|วันที่)\s*\|/.test(r));
  const blockedRows = progress.filter((r) => BLOCKED.test(r));
  const recent = progress.filter((r) => !BLOCKED.test(r)).slice(0, keep).map((r) => oneLine(r, 180));
  const waiting = rowsOf(s["รอผู้ใช้"] ?? []);
  return { blocked: [...waiting, ...blockedRows.filter((r) => !waiting.includes(r))].map((r) => oneLine(r, 400)), recent };
}

const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(n));
const addDays = (date, n) => new Date(Date.parse(date + "T00:00:00Z") + n * 864e5).toISOString().slice(0, 10);
const localDate = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };

export async function buildDigest({ logDir, progressFile, today = localDate(), days = 7, keep = 5 }) {
  const lines = [`# digest · ${today}`, "", "> สร้างจาก log ของ superuser และหัวข้อความคืบหน้าใน CONTEXT.md · เขียนโดย `digest.mjs` ห้ามแก้มือ · รายการที่ติดหรือรออยู่ไม่ถูกตัดทิ้ง", ""];
  let parts = { blocked: [], recent: [] };
  if (progressFile && existsSync(progressFile)) parts = progressParts(readFileSync(progressFile, "utf8"), keep);
  const todayInfo = await summariseDay(logDir, today);
  const hist = [];
  for (let i = 1; i <= days; i++) { const d = await summariseDay(logDir, addDays(today, -i)); if (d) hist.push(d); }
  const flagged = [todayInfo].filter((d) => d?.flagged.length).map((d) => `${d.date} (${d.flagged.length} รายการ): ${[...new Set(d.flagged)].slice(0, 6).join(", ")}`);

  lines.push("## ติดหรือรออยู่");
  if (parts.blocked.length || flagged.length) {
    for (const b of parts.blocked) lines.push(b.startsWith("|") || b.startsWith("-") ? b : `- ${b}`);
    for (const f of flagged) lines.push(`- ผลตรวจไม่ผ่านหรือมีเงื่อนไข ${f}`);
  } else lines.push("- ไม่มี");
  lines.push("", "## วันนี้");
  if (todayInfo) {
    lines.push(`- ข้อความผู้ใช้ ${todayInfo.prompts} (แก้งาน ${todayInfo.corrections}) · ลูกทีม ${todayInfo.runs} · ผ่าน ${todayInfo.pass} · ไม่ผ่าน ${todayInfo.fail} · มีเงื่อนไข ${todayInfo.conditional} · token ${fmt(todayInfo.tokens)}`);
    for (const p of todayInfo.lastPrompts) lines.push(`- ล่าสุด: ${p}`);
  } else lines.push("- ยังไม่มี log ของวันนี้");
  lines.push("", `## ${days} วันก่อนหน้า`);
  if (!hist.length) lines.push("- ไม่มี log");
  for (const d of hist) lines.push(`- ${d.date} · ข้อความ ${d.prompts} · ลูกทีม ${d.runs} · ผ่าน ${d.pass} ไม่ผ่าน ${d.fail} เงื่อนไข ${d.conditional} · ผู้ใช้ปฏิเสธ ${d.rejected} · token ${fmt(d.tokens)}`);
  if (parts.recent.length) { lines.push("", "## ความคืบหน้าล่าสุด"); lines.push(...parts.recent); }
  return lines.join("\n") + "\n";
}

async function main() {
  const a = parseArgs(process.argv.slice(2), SPEC);
  if (a.help) { console.log(HELP); return; }
  const base = join(process.cwd(), ".claude", "superuser");
  const md = await buildDigest({ logDir: a.log ?? join(base, "log"), progressFile: a.progress ?? join(base, "CONTEXT.md"), today: a.today, days: Number(a.days ?? 7), keep: Number(a.keep ?? 5) });
  if (a.stdout) { process.stdout.write(md); return; }
  const out = a.out ?? join(base, "digest.md");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, md);
  console.log(`wrote ${out} (${md.split("\n").length} lines)`);
}
if (process.argv[1]?.replace(/\\/g, "/").endsWith("/digest.mjs")) main().catch((e) => { console.error(e.message); process.exit(1); });
