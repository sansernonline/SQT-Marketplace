#!/usr/bin/env node
// A-Team hook — เขียน log ทุกการทำ และแจ้งข้อความใหม่ใน inbox
// ทำงานเฉพาะโปรเจกต์ที่มีโฟลเดอร์ .a-team/ เท่านั้น · ไม่มีวันทำให้งานหลักล้ม (จับทุก error แล้วออกด้วย 0)
import { readFileSync, appendFileSync, existsSync, mkdirSync, readdirSync, writeFileSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";

const MAX = 300;

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

export function redact(text) {
  let out = String(text ?? "");
  for (const [pattern, replacement] of SECRET_PATTERNS) out = out.replace(pattern, replacement);
  return out.length > MAX ? out.slice(0, MAX) + "…" : out;
}

export function findProjectRoot(start) {
  let dir = start;
  for (let i = 0; i < 25 && dir; i++) {
    if (existsSync(join(dir, ".a-team"))) return dir;
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
    model: state.models[actor] ?? null,
    tool: input.tool_name ?? null,
    target: redact(pickTarget(input.tool_input)),
    ok: event === "PostToolUseFailure" ? false : pickOk(input.tool_response),
    ...(event === "UserPromptSubmit" ? { prompt: redact(input.prompt) } : {}),
    ...(event === "SessionStart" ? { source: input.source ?? null } : {}),
  };
}

export function pendingMessages(root) {
  const inbox = join(root, ".a-team", "inbox");
  if (!existsSync(inbox)) return [];
  return readdirSync(inbox).filter((name) => name.endsWith(".md")).sort();
}

export function inboxNotice(root, event, state) {
  const pending = pendingMessages(root);
  const seen = new Set(state.seen ?? []);
  const fresh = pending.filter((name) => !seen.has(name));
  state.seen = pending;
  const alwaysTell = event === "SessionStart" || event === "UserPromptSubmit";
  const lines = [];
  if (event === "SessionStart") {
    lines.push("โปรเจกต์นี้ใช้ A-Team — อ่าน CONTEXT.md หัวข้อ \"รับงานต่อ\" ก่อนเริ่ม");
  }
  if (pending.length && (alwaysTell || fresh.length)) {
    lines.push(`มีข้อความรอใน .a-team/inbox/ ${pending.length} ฉบับ${fresh.length ? ` (ใหม่ ${fresh.length}: ${fresh.join(", ")})` : ""} — หัวหน้าทีมอ่านและจัดการตามหัวข้อ inbox ใน work-session-context`);
  }
  return lines.join("\n");
}

function main() {
  let raw = "";
  try { raw = readFileSync(0, "utf8"); } catch { return; }
  const input = JSON.parse(raw || "{}");
  const root = findProjectRoot(input.cwd ?? process.cwd());
  if (!root) return;

  const teamDir = join(root, ".a-team");
  const statePath = join(teamDir, "state.json");
  const state = readJson(statePath, { models: {}, seen: [] });
  state.models ??= {};

  const now = new Date();
  const entry = buildEntry(input, state, now);
  const logDir = join(teamDir, "log");
  mkdirSync(logDir, { recursive: true });
  appendFileSync(join(logDir, `${entry.ts.slice(0, 10)}.jsonl`), JSON.stringify(entry) + "\n");

  const event = entry.event;
  let notice = "";
  const isLead = !input.agent_id;
  if (isLead && ["SessionStart", "UserPromptSubmit", "PostToolUse", "PostToolUseFailure"].includes(event)) {
    notice = inboxNotice(root, event, state);
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

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/a-team-hook.mjs")) {
  try { main(); } catch { /* log ล้มต้องไม่ทำให้งานหลักล้ม */ }
  process.exit(0);
}
