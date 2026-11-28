#!/usr/bin/env node
// status line (แถบล่างของ Claude Code) ของ superuser
//   บรรทัด 1: model (effort) · โฟลเดอร์ · branch git · บริบทแชต % · โควตา 5 ชม. / สัปดาห์ % + เวลารีเซ็ต
//   บรรทัด 2: งานเบื้องหลังที่ยังไม่ส่งผลกลับ (ชื่องาน · เวลาที่ผ่านไป) — มีเมื่อมีงานค้างเท่านั้น
// และทำ 2 อย่างเบื้องหลัง:
//   - จดโควตาลง ~/.claude/superuser/quota/<บัญชี>.json ให้ด่านโควตาของ hook และ plan.mjs (แทน quota.mjs record)
//   - จด snapshot ลง <ทีม>/log/<วันที่>/statusline.jsonl ไม่เกินนาทีละ 1 บรรทัดต่อแชต ให้ทำ dashboard ได้ (ปิดได้ด้วยโมดูล log)
// ช่องข้อมูลตาม code.claude.com/docs/en/statusline (ตรวจ 2026-11-28) · Claude Code ไม่ส่งข้อมูลงานเบื้องหลังมา จึงอ่าน runs.jsonl ที่ hook จด
// ตั้งใน settings.json: "statusLine": { "type": "command", "command": "node <ตัวเรียก>", "refreshInterval": 60 } · ดู docs/plugins/superuser/statusline.md
// ไม่มีวันล้ม: error ทุกจุดถูกจับ แถบล่างยังแสดงเท่าที่ได้
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { moduleOn, readJson } from "./lib/util.mjs";
import { fromStatusLine, QUOTA_DIR } from "../skills/handoff/parts/parallel-split-and-merge/scripts/quota.mjs";

export const LOG_FILE = "statusline.jsonl";
export const LOG_EVERY_MS = 60000;           // จด log ไม่ถี่กว่านี้ต่อแชต
export const RUNNING_WINDOW_H = 6;           // ค่าเดียวกับ hook: งานที่เริ่มเกิน 6 ชม. แล้วไม่ส่งกลับ ถือว่าหลุด ไม่นับ
const TEAM_DIRS = [join(".claude", "superuser"), ".superuser"];

const pad = (n) => String(n).padStart(2, "0");
export const localDay = (t) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const hhmm = (sec) => { const d = new Date(sec * 1000); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
export const fmtMin = (ms) => { const m = Math.max(0, Math.round(ms / 60000)); return m < 60 ? `${m} นาที` : `${Math.floor(m / 60)} ชม. ${m % 60} นาที`; };
// สีตามระดับ: < 70 ปกติ · 70–89 เหลือง · ≥ 90 แดง
const tint = (pct, s) => (pct >= 90 ? `\x1b[31m${s}\x1b[0m` : pct >= 70 ? `\x1b[33m${s}\x1b[0m` : s);
const num = (x) => (x == null || Number.isNaN(Number(x)) ? null : Number(x));

// โฟลเดอร์ทีมของโปรเจกต์ (.claude/superuser) · ไม่มี → โฟลเดอร์กลาง ~/.claude/superuser (ที่เดียวกับ hook)
export function teamDirFor(project, home = homedir()) {
  if (project && resolve(project) !== resolve(home)) {
    const rel = TEAM_DIRS.find((r) => existsSync(join(project, r)));
    if (rel) return join(project, rel);
  }
  return join(home, ".claude", "superuser");
}

// งานเบื้องหลังของแชตนี้ที่ยังไม่ส่งผลกลับ · runs = บรรทัดจาก runs.jsonl (event run / result)
export function runningWorkers(runs, session, now) {
  const done = new Set(runs.filter((r) => r.event === "result").flatMap((r) => [r.tool_use_id, r.spawned_id]).filter(Boolean));
  const seen = new Set();
  return runs.filter((r) => r.event === "run" && r.async && (!session || r.session === session)
    && now - Date.parse(r.ts) <= RUNNING_WINDOW_H * 3600000
    && !done.has(r.tool_use_id) && !done.has(r.spawned_id)
    && (!r.tool_use_id || (!seen.has(r.tool_use_id) && seen.add(r.tool_use_id))))
    .map((r) => ({ name: r.description || r.role || "งาน", role: r.role ?? null, model: r.resolved_model ?? r.model ?? null, minutes: Math.round((now - Date.parse(r.ts)) / 60000) }));
}

function readRuns(teamDir, now) {
  const out = [];
  for (const d of new Set([localDay(now - 86400000), localDay(now)])) {
    const f = join(teamDir, "log", d, "runs.jsonl");
    if (!existsSync(f)) continue;
    for (const l of readFileSync(f, "utf8").split("\n")) { try { if (l) out.push(JSON.parse(l)); } catch { /* บรรทัดเสีย ข้าม */ } }
  }
  return out;
}

// repo ที่เปิดอาจไม่น่าไว้ใจ: ปิด fsmonitor (ค่าใน .git/config สั่งรันโปรแกรมได้) และไม่จับ lock ของ index
const GIT_SAFE = ["-c", "core.fsmonitor=false", "-c", "core.untrackedCache=false"];
const GIT_OPTS = { encoding: "utf8", timeout: 1000, windowsHide: true, env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } };
function gitBranch(cwd) {
  if (!cwd) return null;
  const b = spawnSync("git", [...GIT_SAFE, "-C", cwd, "branch", "--show-current"], GIT_OPTS);
  const name = b.status === 0 ? b.stdout.trim() : "";
  if (!name) return null;
  const s = spawnSync("git", [...GIT_SAFE, "-C", cwd, "status", "--porcelain", "-uno"], GIT_OPTS);
  return { name, dirty: s.status === 0 && s.stdout.trim() !== "" };
}

// ข้อความ 1–2 บรรทัดของแถบล่าง
export function render(input, { now = Date.now(), workers = [], branch = null } = {}) {
  const parts = [];
  const model = input.model?.display_name;
  if (model) parts.push(input.effort?.level ? `${model} (${input.effort.level})` : model);
  const dir = String(input.workspace?.current_dir ?? input.cwd ?? "").split(/[\\/]/).filter(Boolean).at(-1);
  if (dir) parts.push(dir);
  if (branch) parts.push(`${branch.name}${branch.dirty ? "*" : ""}`);
  const ctx = num(input.context_window?.used_percentage);
  if (ctx != null) parts.push(tint(ctx, `บริบท ${Math.round(ctx)}%`));
  for (const [label, w] of [["5 ชม.", input.rate_limits?.five_hour], ["สัปดาห์", input.rate_limits?.seven_day]]) {
    const used = num(w?.used_percentage);
    if (used == null) continue;
    const reset = w.resets_at && w.resets_at * 1000 > now ? ` รีเซ็ต ${hhmm(w.resets_at)}` : "";
    parts.push(tint(used, `${label} ${Math.round(used)}%${reset}`));
  }
  const lines = [parts.join(" · ")];
  if (workers.length) {
    const shown = workers.slice(0, 3).map((w) => `${w.name} (${fmtMin(w.minutes * 60000)})`).join(" · ");
    lines.push(`เบื้องหลัง ${workers.length} งาน: ${shown}${workers.length > 3 ? ` +${workers.length - 3}` : ""}`);
  }
  return lines.filter(Boolean).join("\n");
}

// 1 บรรทัดของ statusline.jsonl · ชื่อช่องคงที่ ให้ dashboard อ่านได้ · ค่าที่ Claude Code ไม่ส่งมาเป็น null
export function snapshot(input, { now = Date.now(), workers = [], branch = null } = {}) {
  const win = (w) => (w && num(w.used_percentage) != null ? { used: num(w.used_percentage), reset: w.resets_at ? new Date(w.resets_at * 1000).toISOString() : null } : null);
  return {
    ts: new Date(now).toISOString(),
    session: String(input.session_id ?? "").slice(0, 8) || null,
    // ชื่อโฟลเดอร์อย่างเดียว ไม่เก็บ path เต็มที่มีชื่อผู้ใช้ของเครื่อง
    project: String(input.workspace?.project_dir ?? input.workspace?.current_dir ?? input.cwd ?? "").split(/[\\/]/).filter(Boolean).at(-1) ?? null,
    branch: branch?.name ?? null,
    model: input.model?.id ?? null,
    effort: input.effort?.level ?? null,
    context_pct: num(input.context_window?.used_percentage),
    five_hour: win(input.rate_limits?.five_hour),
    week: win(input.rate_limits?.seven_day),
    cost_usd: num(input.cost?.total_cost_usd),            // ราคาตามรายการที่ Claude Code คิดเอง ไม่ใช่ยอดเรียกเก็บของแผนรายเดือน
    duration_min: input.cost?.total_duration_ms != null ? Math.round(input.cost.total_duration_ms / 60000) : null,
    lines_added: num(input.cost?.total_lines_added),
    lines_removed: num(input.cost?.total_lines_removed),
    workers,
  };
}

// จด log เมื่อห่างจากครั้งก่อนของแชตนี้ ≥ LOG_EVERY_MS · คืน true เมื่อจด
export function writeLog(teamDir, snap, now = Date.now()) {
  if (!moduleOn(teamDir, "log")) return false;
  const dir = join(teamDir, "log", localDay(now));
  const stateFile = join(dir, ".statusline-last.json");
  const state = readJson(stateFile, {});
  const key = snap.session ?? "none";
  if (state[key] && now - state[key] < LOG_EVERY_MS) return false;
  mkdirSync(dir, { recursive: true });
  appendFileSync(join(dir, LOG_FILE), JSON.stringify(snap) + "\n");
  writeFileSync(stateFile, JSON.stringify({ ...state, [key]: now }));
  return true;
}

// ตัวเรียกใน ~/.claude/superuser/statusline.mjs อ่าน stdin เองแล้วส่ง text มา · รันไฟล์นี้ตรง ๆ จะอ่าน stdin ที่นี่
export async function main(text) {
  if (text == null) { text = ""; for await (const chunk of process.stdin) text += chunk; }
  let input = {};
  try { input = JSON.parse(text) ?? {}; } catch { /* ข้อมูลเสีย แสดงเท่าที่ได้ */ }
  const now = Date.now();
  const cwd = input.workspace?.current_dir ?? input.cwd ?? null;
  const teamDir = teamDirFor(input.workspace?.project_dir ?? cwd);
  let workers = [], branch = null;
  try { workers = runningWorkers(readRuns(teamDir, now), String(input.session_id ?? "").slice(0, 8), now); } catch { /* อ่าน log ไม่ได้ */ }
  try { branch = gitBranch(cwd); } catch { /* ไม่มี git */ }
  try {
    const q = fromStatusLine(input);
    if (q) {
      // เขียนไฟล์ชั่วคราวแล้ว rename: หลายแชตเขียนพร้อมกัน ผู้อ่านจะไม่เจอ JSON ครึ่งไฟล์
      mkdirSync(QUOTA_DIR, { recursive: true });
      const file = join(QUOTA_DIR, `${q.account.replace(/[^\w.-]/g, "_")}.json`), tmp = `${file}.${process.pid}.tmp`;
      writeFileSync(tmp, JSON.stringify(q));
      renameSync(tmp, file);
    }
  } catch { /* จดโควตาไม่ได้ ไม่กระทบแถบล่าง */ }
  try { writeLog(teamDir, snapshot(input, { now, workers, branch }), now); } catch { /* จด log ไม่ได้ */ }
  let out = "";
  try { out = render(input, { now, workers, branch }); } catch { /* แสดงว่างดีกว่าล้ม */ }
  console.log(out);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("hooks/statusline.mjs")) main().catch(() => console.log(""));
