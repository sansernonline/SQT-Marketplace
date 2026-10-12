#!/usr/bin/env node
// SuperUser hook — เขียน log ทุกการทำ แยกไฟล์ต่อ agent (.claude/superuser/log/<วันที่>/<agent>.jsonl) · ติดธงข้อความที่ผู้ใช้แก้งาน · แจ้งข้อความใหม่ใน inbox
// ไฟล์นี้เหมือนกันทุก plugin ใน SQT-Marketplace · ติดตั้งหลาย plugin พร้อมกัน → ตัวแรกที่รับเหตุการณ์ทำงาน ตัวอื่นออกเลย (ไม่จดซ้ำ)
// ทำงานเฉพาะโปรเจกต์ที่มี .claude/superuser/ (หรือ .superuser/ แบบเก่า) · ไม่สร้างโฟลเดอร์ทีมเอง · ไม่มีวันทำให้งานหลักล้ม (จับทุก error แล้วออกด้วย 0)
import { readFileSync, appendFileSync, existsSync, mkdirSync, readdirSync, writeFileSync, renameSync, openSync, closeSync, statSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, resolve, relative } from "node:path";
import { homedir } from "node:os";

// ความยาวสูงสุดที่เก็บ · ข้อความผู้ใช้ยาวกว่าเป้าหมายของเครื่องมือ
const MAX_TARGET = 2000;
const MAX_PROMPT = 4000;

const SECRET_PATTERNS = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----|$)/g, "[ตัดคีย์ลับ]"],
  [/\b(Bearer|Basic)\s+[A-Za-z0-9._~+\/=-]{8,}/gi, "$1 [ตัด]"],
  [/\b(sk|pk|rk)-[A-Za-z0-9_-]{16,}/g, "[ตัด]"],
  [/\b(ghp|gho|ghs|ghu|github_pat|xox[abpr]|glpat)[-_][A-Za-z0-9_-]{10,}/g, "[ตัด]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "[ตัด]"],
  [/\beyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]{8,}/g, "[ตัด JWT]"],
  [/\bAIza[0-9A-Za-z_-]{35}\b/g, "[ตัด]"],
  [/(--?(?:password|passwd|token|secret|api-key|apikey))(=|\s+)\S+/gi, "$1$2[ตัด]"],
  [/(\b(?:mysql|mysqldump|mariadb)\b[^\n]*?\s-p)(?!\s)\S+/g, "$1[ตัด]"],
  [/([A-Za-z0-9_-]*(?:password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key)["']?\s*[=:]\s*)("[^"]*"|'[^']*'|[^\s;&|'"]+)/gi, "$1[ตัด]"],
  [/:\/\/([^:\/\s@]+):([^@\s]+)@/g, "://$1:[ตัด]@"],
];

export function redact(text, max = MAX_TARGET) {
  let out = String(text ?? "");
  for (const [pattern, replacement] of SECRET_PATTERNS) out = out.replace(pattern, replacement);
  return out.length > max ? out.slice(0, max) + "…" : out;
}

// ข้อความที่ผู้ใช้กำลังแก้งานของทีม → learning-reviewer อ่านบรรทัดที่มี correction: true ตอนจบงาน
const CORRECTION = /(ไม่ใช่|ผิด|อย่า|บอกแล้ว|บอกไปแล้ว|แก้ใหม่|ทำใหม่|ไม่ได้สั่ง|ไม่ได้ขอ|ไม่ต้อง|เลิก|ย้อนกลับ|ไม่เอา|\bwrong\b|\bdon'?t\b|\bnot what\b|\bi said\b|\balready told\b|\bstop\b|\brevert\b|\bundo\b|\binstead\b)/i;

export function isCorrection(prompt) {
  return CORRECTION.test(String(prompt ?? ""));
}

// .claude/superuser/ คือที่ใหม่ · .superuser/ คือที่เดิมของโปรเจกต์ที่สร้างไว้ก่อน
export const TEAM_DIRS = [join(".claude", "superuser"), ".superuser"];

// ~/.claude/superuser/ คือคิวกลางของเครื่อง ไม่ใช่โปรเจกต์ จึงข้ามโฟลเดอร์ home
export function teamDirOf(root, home = homedir()) {
  if (resolve(root) === resolve(home)) return null;
  const found = TEAM_DIRS.find((rel) => existsSync(join(root, rel)));
  return found ? join(root, found) : null;
}

export function findProjectRoot(start) {
  let dir = start;
  for (let i = 0; i < 25 && dir; i++) {
    if (teamDirOf(dir)) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}

function pickTarget(input = {}) {
  return input.file_path ?? input.notebook_path ?? input.command ?? input.url ?? input.pattern
    ?? input.query ?? input.description ?? input.skill ?? input.prompt ?? "";
}

function pickOk(response) {
  if (response == null) return null;
  if (typeof response !== "object") return true;
  if (response.is_error === true || response.isError === true || response.interrupted === true) return false;
  const code = response.exit_code ?? response.exitCode ?? response.returnCode;
  if (typeof code === "number") return code === 0;
  return true;
}

function findModel(input) {
  for (const [key, value] of Object.entries(input)) {
    if (/model/i.test(key) && value) return typeof value === "string" ? value : JSON.stringify(value);
  }
  return null;
}

function localStamp(now) {
  const offsetMin = -now.getTimezoneOffset();
  const local = new Date(now.getTime() + offsetMin * 60000).toISOString().slice(0, 19);
  const sign = offsetMin >= 0 ? "+" : "-";
  const hh = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, "0");
  const mm = String(Math.abs(offsetMin) % 60).padStart(2, "0");
  return `${local}${sign}${hh}:${mm}`;
}

function readJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

// agent id ย่อ 8 ตัว · แยก subagent ชนิดเดียวกันที่ถูกเรียกหลายรอบ (เช่น reviewer รอบ 1–5) ซึ่งเขียนลงไฟล์เดียวกัน
export function shortId(id) {
  return id ? String(id).slice(0, 8) : null;
}

// หัวหน้าทีมส่งงานให้ subagent (เครื่องมือ Agent หรือ Task) → จดบทบาท · โมเดล · id ของตัวที่ถูกเรียก
export function spawnFields(input) {
  if (!["Agent", "Task"].includes(input.tool_name) || !input.tool_input) return {};
  const res = input.tool_response;
  const spawned = res && typeof res === "object" ? (res.agentId ?? res.agent_id ?? null) : null;
  return {
    role: input.tool_input.subagent_type ?? "general-purpose",
    role_model: input.tool_input.model ?? null,
    ...(spawned ? { spawned_id: shortId(spawned) } : {}),
  };
}

export function buildEntry(input, state, now = new Date()) {
  const event = input.hook_event_name ?? "unknown";
  const actor = input.agent_id ? `agent:${input.agent_id}` : `main:${input.session_id ?? "-"}`;
  const model = findModel(input);
  if (model) state.models[actor] = model;
  return {
    ts: localStamp(now),
    session: (input.session_id ?? "").slice(0, 8),
    event,
    agent: input.agent_type ?? input.agent_id ?? "main",
    id: shortId(input.agent_id),
    model: state.models[actor] ?? null,
    tool: input.tool_name ?? null,
    target: redact(pickTarget(input.tool_input)),
    ok: event === "PostToolUseFailure" ? false : pickOk(input.tool_response),
    ...spawnFields(input),
    ...(event === "UserPromptSubmit" ? { prompt: redact(input.prompt, MAX_PROMPT), ...(isCorrection(input.prompt) ? { correction: true } : {}) } : {}),
    ...(event === "SessionStart" ? { source: input.source ?? null } : {}),
  };
}

// 1 ไฟล์ต่อ agent · main = หัวหน้าทีมและข้อความผู้ใช้ · ชื่อแปลก ๆ ถูกทำให้ปลอดภัยเป็นชื่อไฟล์
export function logFileName(agent) {
  return String(agent || "main").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[-.]+|[-.]+$/g, "").slice(0, 60) || "main";
}

export function pendingMessages(teamDir) {
  const inbox = join(teamDir, "inbox");
  if (!existsSync(inbox)) return [];
  return readdirSync(inbox).filter((name) => name.endsWith(".md")).sort();
}

export function inboxNotice(teamDir, event, state, rel = ".claude/superuser") {
  const pending = pendingMessages(teamDir);
  const seen = new Set(state.seen ?? []);
  const fresh = pending.filter((name) => !seen.has(name));
  state.seen = pending;
  const lines = [];
  if (event === "SessionStart") {
    // แบบเก่า (.superuser/) วาง CONTEXT.md ไว้ที่ราก
    const context = rel === ".superuser" ? "CONTEXT.md" : `${rel}/CONTEXT.md`;
    lines.push(`โปรเจกต์นี้ใช้ SuperUser — อ่าน ${context} หัวข้อ "รับงานต่อ" ก่อนเริ่ม`);
  }
  // เปิด session บอกทุกครั้ง · เหตุการณ์อื่นบอกเฉพาะเมื่อมีฉบับใหม่ ไม่พูดซ้ำทุกข้อความ
  if (pending.length && (event === "SessionStart" || fresh.length)) {
    lines.push(`มีข้อความรอใน ${rel}/inbox/ ${pending.length} ฉบับ${fresh.length ? ` (ใหม่ ${fresh.length}: ${fresh.join(", ")})` : ""} — หัวหน้าทีมอ่าน จัดการ แล้วย้ายไป ${rel}/inbox/done/`);
  }
  return lines.join("\n");
}

// plugin หลายตัวได้ข้อมูลเหตุการณ์เดียวกันในเสี้ยววินาที → ใครสร้างไฟล์ล็อกได้ก่อนคนนั้นทำ · ล็อกเก่ากว่า 2 นาทีลบทิ้ง
// ชื่อล็อกมีช่วงเวลาด้วย ผู้ใช้พิมพ์ข้อความเดิมซ้ำ (เช่น "ต่อ") ห่างกันเกิน 2 ช่วงจึงยังถูกจด · ล็อกอยู่ใน _to_delete/ ที่รากโปรเจกต์
const DUPLICATE_WINDOW_MS = 3000;

export function claimEvent(root, raw, now = Date.now()) {
  const lockDir = join(root, "_to_delete", "superuser-lock");
  mkdirSync(lockDir, { recursive: true });
  for (const name of readdirSync(lockDir)) {
    try { if (now - statSync(join(lockDir, name)).mtimeMs > 120000) unlinkSync(join(lockDir, name)); } catch { /* อีกตัวลบไปแล้ว */ }
  }
  const id = createHash("sha1").update(raw).digest("hex").slice(0, 16);
  const bucket = Math.floor(now / DUPLICATE_WINDOW_MS);
  // hook อีกตัวของเหตุการณ์เดียวกันอาจตกช่วงก่อนหน้า
  if (existsSync(join(lockDir, `${id}-${bucket - 1}`))) return false;
  try { closeSync(openSync(join(lockDir, `${id}-${bucket}`), "wx")); return true; } catch { return false; }
}

function main() {
  let raw = "";
  try { raw = readFileSync(0, "utf8"); } catch { return; }
  const input = JSON.parse(raw || "{}");
  const root = findProjectRoot(input.cwd ?? process.cwd());
  if (!root) return;

  const teamDir = teamDirOf(root);
  if (!claimEvent(root, raw)) return;
  const statePath = join(teamDir, "state.json");
  const state = readJson(statePath, { models: {}, seen: [] });
  state.models ??= {};

  const now = new Date();
  const entry = buildEntry(input, state, now);
  const logDir = join(teamDir, "log", entry.ts.slice(0, 10));
  mkdirSync(logDir, { recursive: true });
  appendFileSync(join(logDir, `${logFileName(entry.agent)}.jsonl`), JSON.stringify(entry) + "\n");

  const event = entry.event;
  let notice = "";
  const isLead = !input.agent_id;
  if (isLead && ["SessionStart", "UserPromptSubmit", "PostToolUse", "PostToolUseFailure"].includes(event)) {
    notice = inboxNotice(teamDir, event, state, relative(root, teamDir).replace(/\\/g, "/"));
  }
  const keys = Object.keys(state.models);
  if (keys.length > 40) for (const key of keys.slice(0, keys.length - 40)) delete state.models[key];
  const temp = `${statePath}.${process.pid}.tmp`;
  writeFileSync(temp, JSON.stringify(state));
  renameSync(temp, statePath);

  if (notice) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: notice } }));
  }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/superuser-hook.mjs")) {
  try { main(); } catch { /* log ล้มต้องไม่ทำให้งานหลักล้ม */ }
  process.exit(0);
}
