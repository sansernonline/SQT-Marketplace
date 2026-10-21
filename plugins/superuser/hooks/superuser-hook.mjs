#!/usr/bin/env node
// SuperUser hook — กฎประจำตัวตอนเริ่ม session (SessionStart) · บอก skill ที่ต้องเปิดตามคำขอ (UserPromptSubmit) · ด่านรีวิวก่อนจบ (Stop) · ด่านแตกงาน (PreToolUse) · เขียน log ทุกการทำ แยกไฟล์ต่อ agent (.claude/superuser/log/<วันที่>/<agent>.jsonl) · สรุป log ให้คนอ่าน (log/SUMMARY.md ทุกครั้งที่หัวหน้าทีมจบรอบ) · ติดธงข้อความที่ผู้ใช้แก้งาน · แจ้งข้อความใหม่ใน inbox
// อยู่ใน plugin superuser ที่เดียว · plugin อื่นได้ hook นี้ทาง dependencies · plugin รุ่นเก่าที่ยังมีสำเนา → ตัวแรกที่รับเหตุการณ์ทำงาน ตัวอื่นออกเลย (ไม่จดซ้ำ)
// กฎประจำตัวและตัวบอก skill ทำงานทุก session · log · inbox · ด่านต่าง ๆ ทำงานเฉพาะโปรเจกต์ที่มี .claude/superuser/ (หรือ .superuser/ แบบเก่า)
// ไม่สร้างโฟลเดอร์ทีมเอง · ไม่มีวันทำให้งานหลักล้ม (จับทุก error แล้วออกด้วย 0)
import { readFileSync, writeSync, appendFileSync, existsSync, mkdirSync, readdirSync, writeFileSync, renameSync, openSync, closeSync, statSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, resolve, relative } from "node:path";
import { homedir, tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

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

// เลขส่วนตัวในข้อความผู้ใช้ (log เก็บข้อความผู้ใช้ด้วย) · ตัดเลขบัตรประชาชนก่อน แล้วเลขบัตรจ่ายเงิน แล้วเลขบัญชีหรือเบอร์โทร
export function luhn(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

const PERSONAL_PATTERNS = [
  // เลขประจำตัวประชาชน 13 หลัก มีหรือไม่มีขีด (1-2345-67890-12-3)
  [/(?<!\d)\d-?\d{4}-?\d{5}-?\d{2}-?\d(?!\d)/g, "[ตัดเลขประจำตัว]"],
  // เลขบัตรเครดิตหรือเดบิต 13–19 หลัก คั่นด้วยเว้นวรรคหรือขีดได้ · ตัดเฉพาะที่ผ่าน Luhn จะได้ไม่ตัดตัวเลขทั่วไป
  [/(?<!\d)\d(?:[ -]?\d){12,18}(?!\d)/g, (m) => (luhn(m.replace(/\D/g, "")) ? "[ตัดเลขบัตร]" : m)],
  // เลขบัญชีธนาคาร 10 หลักแบบ xxx-x-xxxxx-x และตัวเลขติดกัน 10–12 หลัก (เลขบัญชี เบอร์โทร)
  [/(?<!\d)\d{3}-\d-\d{5}-\d(?!\d)/g, "[ตัดเลขบัญชี]"],
  [/(?<![\d-])\d{10,12}(?![\d-])/g, "[ตัดเลขบัญชี]"],
];

export function redact(text, max = MAX_TARGET) {
  let out = String(text ?? "");
  // แต่ละแบบพังได้โดยไม่ทำให้ทั้งบรรทัดหาย
  for (const [pattern, replacement] of [...SECRET_PATTERNS, ...PERSONAL_PATTERNS]) {
    try { out = out.replace(pattern, replacement); } catch { /* ข้ามแบบนี้ */ }
  }
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

// ── กฎประจำตัว และตัวบอก skill ─────────────────────────────────────────
// รายการ skill ตอนเริ่ม session เกินงบเมื่อติดตั้งหลาย plugin → คำอธิบายถูกตัด โมเดลจึงไม่รู้ว่าต้องเปิด skill ไหน
// แก้ 2 ชั้น: (1) SessionStart ส่งกฎประจำตัว (core-rules.md = สำเนาของ scripts/install/CLAUDE.global.md) ซึ่งมีตาราง "งาน → skill"
// (2) UserPromptSubmit จับคำในข้อความผู้ใช้ตาม skill-router.json แล้วบอกชื่อ skill ที่ต้องเปิด · ชี้ชื่อตรง ๆ ได้ผลกว่าเตือนกว้าง ๆ
// ติดตั้ง CLAUDE.global.md เป็น ~/.claude/CLAUDE.md แล้ว (มี CORE_MARK) → ไม่ส่งซ้ำ · ส่งได้ไม่เกิน 10,000 ตัวอักษรต่อครั้ง
export const CORE_MARK = "<!-- sqt-core-rules -->";
export const CONTEXT_MAX = 9500;
const ROUTE_HEAD = "## เปิด skill ก่อนลงมือ";

export function coreRules({ configDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), dir = HERE, routeOnly = false } = {}) {
  try { if (readFileSync(join(configDir, "CLAUDE.md"), "utf8").includes(CORE_MARK)) return ""; } catch { /* ยังไม่ได้ติดตั้ง */ }
  let text = "";
  try { text = readFileSync(join(dir, "core-rules.md"), "utf8").replace(/\r\n/g, "\n"); } catch { return ""; }
  if (routeOnly) {
    const at = text.indexOf(ROUTE_HEAD);
    if (at < 0) return "";
    const next = text.indexOf("\n## ", at + ROUTE_HEAD.length);
    text = text.slice(at, next < 0 ? undefined : next).trim();
  }
  return text.slice(0, CONTEXT_MAX);
}

export function routeSkills(prompt, router) {
  const text = String(prompt ?? "").trim();
  if (!text || text.startsWith("/")) return [];   // คำสั่ง slash เปิด skill ของมันเองอยู่แล้ว
  const out = [];
  for (const rule of router?.rules ?? []) {
    let re; try { re = new RegExp(rule.pattern, "i"); } catch { continue; }
    if (re.test(text)) for (const s of rule.skills ?? []) if (!out.includes(s)) out.push(s);
  }
  return out;
}

export function routerNotice(skills) {
  return skills.length
    ? `skill ที่ต้องเปิดก่อนเริ่ม (ตามตาราง "เปิด skill ก่อนลงมือ"): ${skills.map((s) => `\`${s}\``).join(" · ")} — เรียกเครื่องมือ Skill ทีละตัวก่อนลงมือ · ตัวที่ไม่มีในเครื่องข้ามไป`
    : "";
}

// zip ของ claude.ai มีสำเนา hook ในทุก plugin (ไม่มี dependencies) → ทุกสำเนาได้เหตุการณ์เดียวกัน · ให้ตัวแรกที่จองได้ส่งข้อความ ตัวอื่นเงียบ
// จองด้วยไฟล์ใน tmp ต่อ session · เหตุการณ์ · ข้อความ · agent · ช่วงเวลา · ไฟล์เก่ากว่า 10 นาทีลบทิ้ง
export function claimContext(input, dir = join(tmpdir(), "sqt-superuser-context"), now = Date.now()) {
  try {
    mkdirSync(dir, { recursive: true });
    for (const name of readdirSync(dir)) {
      try { if (now - statSync(join(dir, name)).mtimeMs > 600000) unlinkSync(join(dir, name)); } catch { /* อีกตัวลบไปแล้ว */ }
    }
    // ช่วงละ 2 วินาที: สำเนาทุกตัวได้เหตุการณ์ในเสี้ยววินาที · ผู้ใช้พิมพ์ข้อความเดิมซ้ำ (เช่น "ต่อ") ทีหลังยังได้ข้อความตามปกติ
    const key = [input.session_id, input.hook_event_name, input.agent_id ?? "", input.prompt ?? "", input.source ?? ""].join("|");
    const id = createHash("sha1").update(key).digest("hex").slice(0, 20);
    const bucket = Math.floor(now / 2000);
    if (existsSync(join(dir, `${id}-${bucket - 1}`))) return false;
    closeSync(openSync(join(dir, `${id}-${bucket}`), "wx"));
    return true;
  } catch (e) { return e?.code !== "EEXIST"; }   // จองไม่ได้เพราะมีตัวอื่นจองแล้ว → เงียบ · tmp ใช้ไม่ได้ → พูดเอง (ซ้ำดีกว่าหาย)
}

function leadContext(input) {
  if (input.agent_id) return "";
  if (input.hook_event_name === "SessionStart") return coreRules();
  if (input.hook_event_name === "UserPromptSubmit") return routerNotice(routeSkills(input.prompt, readJson(join(HERE, "skill-router.json"), { rules: [] })));
  return "";
}

// ── ด่านรีวิวก่อนจบ (Stop) ───────────────────────────────────────────────
// หัวหน้าทีมใช้ skill superuser แล้วแก้ไฟล์งาน ≥ 3 ไฟล์ แต่หลังการแก้ครั้งสุดท้ายไม่มีผู้ตรวจตัวใหม่ → ไม่ให้จบ ส่งกลับไปตรวจก่อน 1 ครั้ง
// ข้ามได้เมื่อคำตอบสุดท้ายมีบรรทัด `ข้ามรีวิว: <เหตุผล>` (เช่น งานเล็กตามกฎข้อ 2) · กันวน: บล็อกได้ครั้งเดียวต่อการหยุด (stop_hook_active)
export const REVIEW_MIN_FILES = 3;
const CHECKER = /(^|:)(reviewer|design-critic|design-review|qa-tester|security-engineer|adversarial-review-panel)$/;
const EDIT_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);
const SKIP_PATH = /(^|[\\/])(_to_delete|\.claude|node_modules)([\\/]|$)/;

export function reviewGate(lines) {
  let usedSuperuser = false, lastEdit = -1, lastCheck = -1, lastText = "";
  const files = new Set();
  lines.forEach((line, i) => {
    let m; try { m = JSON.parse(line); } catch { return; }
    if (m.isSidechain) return;
    const msg = m.message;
    if (!msg || msg.role !== "assistant" || !Array.isArray(msg.content)) return;
    for (const b of msg.content) {
      if (b.type === "text" && b.text) lastText = b.text;
      if (b.type !== "tool_use") continue;
      const inp = b.input ?? {};
      if (b.name === "Skill" && /(^|:)superuser$/.test(inp.skill ?? "")) usedSuperuser = true;
      if (EDIT_TOOLS.has(b.name)) {
        const p = String(inp.file_path ?? inp.notebook_path ?? "");
        if (p && !SKIP_PATH.test(p)) { files.add(p); lastEdit = i; }
      }
      if (["Agent", "Task"].includes(b.name) && CHECKER.test(inp.subagent_type ?? "")) lastCheck = i;
    }
  });
  if (!usedSuperuser || files.size < REVIEW_MIN_FILES || lastCheck > lastEdit) return null;
  if (/ข้ามรีวิว\s*:\s*\S/.test(lastText)) return null;
  return `ด่านรีวิว (SuperUser): แก้ไฟล์งานไป ${files.size} ไฟล์ แต่หลังการแก้ครั้งสุดท้ายยังไม่มีผู้ตรวจตัวใหม่ — ส่ง \`reviewer\` ตัวใหม่ตามกฎข้อ 2 (ชิ้นงาน · คำขอของผู้ใช้ · เสร็จเมื่อ) แล้วแก้ข้อสูงและกลางก่อนจบ · ถ้าเป็นงานเล็กที่หัวหน้าทีมตรวจเองได้จริง ให้ใส่บรรทัด \`ข้ามรีวิว: <เหตุผล>\` ในคำตอบสุดท้าย`;
}

function stopGate(input) {
  if (input.stop_hook_active || !input.transcript_path || !existsSync(input.transcript_path)) return;
  const reason = reviewGate(readFileSync(input.transcript_path, "utf8").split("\n"));
  if (reason) process.stdout.write(JSON.stringify({ decision: "block", reason }));
}

// ── ด่านแตกงาน (PreToolUse ของหัวหน้าทีม) ───────────────────────────────
// หัวหน้าทีมใช้ superuser · ยังไม่ได้ส่งลูกทีมลงมือสักตัว · ชิ้นที่เขียนเองไปแล้วมีชิ้นใหญ่ (≥ 40 บรรทัด) แล้วจะเขียนไฟล์โค้ดไฟล์ใหม่อีก → ไม่ให้เขียน ให้แตกชิ้นที่เหลือให้ลูกทีมพร้อมกัน
// ใช้ชิ้นที่เขียนไปแล้วเป็นตัววัดขนาด: ชิ้นสั้นหมด = งานชิ้นเล็ก หัวหน้าทีมทำเองต่อได้ · ไฟล์ใน scripts/ (สคริปต์ช่วยงาน) ไม่นับ
// นับเป็น "เขียนโค้ด" = Write หรือ Edit ที่ใส่เกิน 10 บรรทัด · ไฟล์ test ไม่นับ · แก้เล็กไม่โดน · งานชิ้นเดียวไม่โดน · ส่งลูกทีมลงมือแล้ว 1 ตัวขึ้นไป → ปล่อย
// คำสั่งอื่นในข้อความเดียวกันนับด้วย (เขียน 5 ไฟล์รวดเดียว = 5 ชิ้น) แต่ไม่นับคำสั่งที่กำลังตรวจ
const WORKER_SKIP = /(^|:)(reviewer|learning-reviewer|brainstormer|design-critic|design-review|Explore|Plan)$/;
const TEST_FILE = /(^|[\\/])(tests?|__tests__|spec)[\\/]|[._-](test|spec)\.[^\\/]+$|(^|[\\/])test_[^\\/]*$/i;
export const SMALL_EDIT_LINES = 10;
export const BIG_PIECE_LINES = 40;
const TOOL_PATH = /(^|[\\/])scripts[\\/]/;
const CODE_EXT = "js|mjs|cjs|ts|tsx|jsx|py|cs|java|go|rb|php|sql|dart|kt|swift|rs|c|cc|cpp|h|vue|svelte|html|css|scss";
const BASH_TARGETS = [new RegExp(`>>?\\s*['"]?([^\\s'";&|<>]+\\.(?:${CODE_EXT}))['"]?`, "g"),
  new RegExp(`(?:write_text|writeFileSync|open)\\(\\s*['"]([^'"]+\\.(?:${CODE_EXT}))['"]`, "g")];
// Bash ที่เขียนโค้ดเกิน 10 บรรทัดลงไฟล์ (cat > ไฟล์ <<EOF · python write_text) นับเป็นการเขียนโค้ดเหมือน Write
export function bashWrites(cmd) {
  const c = String(cmd ?? "");
  if (c.split("\n").length <= SMALL_EDIT_LINES) return [];
  return [...new Set(BASH_TARGETS.flatMap((re) => [...c.matchAll(re)].map((m) => m[1])))];
}
const targetsOf = (name, inp) => name === "Bash" ? bashWrites(inp.command)
  : (name === "Write" || (name === "Edit" && String(inp.new_string ?? "").split("\n").length > SMALL_EDIT_LINES)) ? [String(inp.file_path ?? "")] : [];
// จำนวนบรรทัดที่คำสั่งนี้เขียนต่อไฟล์ (Bash หลายไฟล์ → หารเท่ากัน)
const linesOf = (name, inp) => {
  const text = name === "Bash" ? inp.command : name === "Edit" ? inp.new_string : inp.content;
  const n = String(text ?? "").split("\n").length;
  return name === "Bash" ? Math.floor(n / Math.max(1, bashWrites(inp.command).length)) : n;
};
const countable = (p) => !SKIP_PATH.test(p) && !TEST_FILE.test(p) && !TOOL_PATH.test(p);
export function splitGate(lines, target, currentId = null, current = { name: "Write", input: {} }, cwd = "/") {
  const t = resolve(cwd, String(target ?? ""));
  if (!target || !countable(t) || !targetsOf(current.name, current.input ?? {}).length) return "";
  let usedSuperuser = false, workers = 0;
  const files = new Map(); // path → บรรทัดมากสุดที่หัวหน้าทีมเขียน
  const add = (p0, n) => { const p = resolve(cwd, p0); if (p0 && countable(p)) files.set(p, Math.max(files.get(p) ?? 0, n)); };
  // คำสั่งเดียวเขียนหลายไฟล์ (เช่น Bash ที่มี cat > หลายไฟล์) → ไฟล์อื่นในคำสั่งเดียวกันนับเป็นชิ้นอื่นด้วย
  for (const p0 of targetsOf(current.name, current.input ?? {})) if (resolve(cwd, p0) !== t) add(p0, linesOf(current.name, current.input ?? {}));
  for (const line of lines) {
    let m; try { m = JSON.parse(line); } catch { continue; }
    if (m.isSidechain) continue;
    const c = m.message?.role === "assistant" && Array.isArray(m.message.content) ? m.message.content : [];
    for (const b of c) {
      if (b.type !== "tool_use") continue;
      const inp = b.input ?? {};
      if (b.name === "Skill" && /(^|:)superuser$/.test(inp.skill ?? "")) usedSuperuser = true;
      if (["Agent", "Task"].includes(b.name) && !WORKER_SKIP.test(inp.subagent_type ?? "")) workers++;
      if (b.id !== currentId) for (const p0 of targetsOf(b.name, inp)) add(p0, linesOf(b.name, inp));
    }
  }
  const biggest = Math.max(0, ...files.values());
  if (!usedSuperuser || workers > 0 || biggest < BIG_PIECE_LINES || files.has(t)) return "";
  return `ด่านแตกงาน (SuperUser): หัวหน้าทีมเขียนโค้ดเองไปแล้ว ${files.size} ไฟล์ (ชิ้นใหญ่สุด ${biggest} บรรทัด) และยังไม่ได้ส่งลูกทีมลงมือ — ชิ้นขนาดนี้ต้องแตกให้ทำพร้อมกัน: เขียนตาราง \`ชิ้น | ไฟล์ที่แตะ | ขนาด | ต้องรอชิ้นไหน | ลูกทีม · ระดับ\` แล้วส่งชิ้นที่เหลือที่ไม่แตะไฟล์ร่วมกันให้ลูกทีมตัวใหม่ (เช่น \`developer\`) **พร้อมกันในข้อความเดียว** · ใบสั่งงานส่ง path ไม่ส่งเนื้อหา · หัวหน้าทีมรวมผลและตรวจ · แก้เล็กในไฟล์เดิมใช้ Edit ได้ตามปกติ`;
}

function preWriteGate(input) {
  if (input.hook_event_name !== "PreToolUse" || input.agent_id || !["Write", "Edit", "Bash"].includes(input.tool_name)) return;
  if (!input.transcript_path || !existsSync(input.transcript_path)) return;
  const current = { name: input.tool_name, input: input.tool_input ?? {} };
  const lines = readFileSync(input.transcript_path, "utf8").split("\n");
  const reason = targetsOf(current.name, current.input).map((t) => splitGate(lines, t, input.tool_use_id ?? null, current, input.cwd ?? process.cwd())).find(Boolean);
  if (reason) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }));
}

// ── สรุป log ให้คนอ่าน (Stop ของหัวหน้าทีม) ─────────────────────────────
// อ่าน log/<วันที่>/*.jsonl แล้วเขียน log/SUMMARY.md: ราย agent สะสม · งานที่ส่งออกวันนี้ · รายวัน 30 วัน
// วันที่ผ่านไปแล้วเก็บผลนับไว้ใน log/<วันที่>/day.json จะได้ไม่อ่านซ้ำทุกครั้ง · วันนี้นับใหม่ทุกครั้ง
// "จบปกติ" = ลูกทีมทำงานจนจบโดยเครื่องมือไม่ error · ไม่ใช่ผลตรวจงาน (ผลตรวจอยู่ใน docs/BUILD-PLAN.md หรือ CONTEXT.md)
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const LEAD = "main";

function readLines(file) {
  try { return readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); } catch { return []; }
}

export function countDay(dayDir) {
  const day = { prompts: 0, corrections: 0, actions: 0, failed: 0, spawns: [], agents: {} };
  for (const name of readdirSync(dayDir).filter((n) => n.endsWith(".jsonl"))) {
    const entries = readLines(join(dayDir, name));
    for (const e of entries) {
      const agent = e.agent || LEAD;
      const a = (day.agents[agent] ??= { actions: 0, failed: 0, ms: 0, last: "" });
      if (e.event === "UserPromptSubmit") { day.prompts++; if (e.correction) day.corrections++; continue; }
      if (!e.tool) continue;
      a.actions++; day.actions++;
      if (e.ok === false) { a.failed++; day.failed++; }
      if (e.ts > a.last) a.last = e.ts;
      if (e.role) day.spawns.push({ ts: e.ts, role: e.role, task: String(e.target ?? "").slice(0, 80), ok: e.ok !== false });
    }
    // เวลาทำงาน = ช่วงจากการทำแรกถึงสุดท้ายของแต่ละตัว (id) รวมกัน · หัวหน้าทีมไม่นับ เพราะรอผู้ใช้ด้วย
    const spans = {};
    for (const e of entries) {
      if (!e.tool || !e.id) continue;
      const t = Date.parse(e.ts), s = (spans[`${e.agent}|${e.id}`] ??= { agent: e.agent, from: t, to: t });
      s.from = Math.min(s.from, t); s.to = Math.max(s.to, t);
    }
    for (const s of Object.values(spans)) if (day.agents[s.agent]) day.agents[s.agent].ms += s.to - s.from;
  }
  day.spawns.sort((x, y) => (x.ts < y.ts ? -1 : 1));
  return day;
}

const fmtMin = (ms) => (ms < 60000 ? `${Math.round(ms / 1000)} วินาที` : `${Math.round(ms / 60000)} นาที`);
const cell = (s) => String(s).replace(/\|/g, "/").replace(/\n/g, " ");

export function summaryMarkdown(days, now = new Date()) {
  const names = Object.keys(days).sort();
  const today = names[names.length - 1];
  const roles = {};
  for (const d of names) {
    for (const [agent, a] of Object.entries(days[d].agents)) {
      const r = (roles[agent] ??= { got: 0, done: 0, broke: 0, actions: 0, failed: 0, ms: 0, last: "" });
      r.actions += a.actions; r.failed += a.failed; r.ms += a.ms; if (a.last > r.last) r.last = a.last;
    }
    for (const s of days[d].spawns) {
      const r = (roles[s.role] ??= { got: 0, done: 0, broke: 0, actions: 0, failed: 0, ms: 0, last: "" });
      r.got++; s.ok ? r.done++ : r.broke++;
    }
  }
  const order = Object.keys(roles).sort((a, b) => (a === LEAD ? -1 : b === LEAD ? 1 : roles[b].got - roles[a].got || a.localeCompare(b)));
  const out = [
    "# สรุป log",
    "",
    `> hook เขียนไฟล์นี้เองทุกครั้งที่หัวหน้าทีมจบรอบ ห้ามแก้มือ · อัปเดต ${localStamp(now).slice(0, 16).replace("T", " ")} · log ละเอียดอยู่ใน \`<วันที่>/<agent>.jsonl\``,
    "> \"จบปกติ\" = ลูกทีมทำจนจบโดยไม่ error ไม่ใช่ผลตรวจงาน · ผลตรวจ ผ่าน/ไม่ผ่าน ดูที่ `docs/BUILD-PLAN.md` หรือ `CONTEXT.md`",
    "",
    `## ราย agent — สะสม ${names.length} วัน`,
    "",
    "| agent | ได้รับงาน | จบปกติ | ล้ม | การทำ | การทำที่ล้ม | เวลาทำงานรวม | ล่าสุด |",
    "|---|---|---|---|---|---|---|---|",
    ...order.map((k) => {
      const r = roles[k];
      return `| ${k === LEAD ? "หัวหน้าทีม" : `\`${cell(k)}\``} | ${k === LEAD ? "—" : r.got} | ${k === LEAD ? "—" : r.done} | ${k === LEAD ? "—" : r.broke} | ${r.actions} | ${r.failed} | ${k === LEAD ? "—" : fmtMin(r.ms)} | ${r.last ? r.last.slice(0, 16).replace("T", " ") : "—"} |`;
    }),
    "",
    `## งานที่ส่งให้ลูกทีม — ${today ?? "วันนี้"}`,
    "",
  ];
  const spawns = today ? days[today].spawns : [];
  if (spawns.length) {
    out.push("| เวลา | agent | งาน | ผล |", "|---|---|---|---|",
      ...spawns.map((s) => `| ${s.ts.slice(11, 16)} | \`${cell(s.role)}\` | ${cell(s.task) || "—"} | ${s.ok ? "จบปกติ" : "ล้ม"} |`));
  } else out.push("ยังไม่ได้ส่งงานให้ลูกทีม");
  out.push("", "## รายวัน — 30 วันล่าสุด", "",
    "| วันที่ | ข้อความผู้ใช้ | ผู้ใช้แก้งาน | ส่งงานลูกทีม | การทำ | การทำที่ล้ม |", "|---|---|---|---|---|---|",
    ...names.slice(-30).reverse().map((d) => { const x = days[d]; return `| ${d} | ${x.prompts} | ${x.corrections} | ${x.spawns.length} | ${x.actions} | ${x.failed} |`; }), "");
  return out.join("\n");
}

export function writeSummary(teamDir, now = new Date()) {
  const logDir = join(teamDir, "log");
  if (!existsSync(logDir)) return null;
  const today = localStamp(now).slice(0, 10);
  const days = {};
  for (const d of readdirSync(logDir).filter((n) => DAY.test(n)).sort()) {
    const cache = join(logDir, d, "day.json");
    if (d < today && existsSync(cache)) { const c = readJson(cache, null); if (c) { days[d] = c; continue; } }
    days[d] = countDay(join(logDir, d));
    if (d < today) writeFileSync(cache, JSON.stringify(days[d]));
  }
  if (!Object.keys(days).length) return null;
  const file = join(logDir, "SUMMARY.md");
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, summaryMarkdown(days, now));
  renameSync(temp, file);
  return file;
}

function stopSummary(input) {
  if (input.agent_id) return;
  const root = findProjectRoot(input.cwd ?? process.cwd());
  if (root) writeSummary(teamDirOf(root));
}

function main() {
  let raw = "";
  try { raw = readFileSync(0, "utf8"); } catch { return; }
  const input = JSON.parse(raw || "{}");
  if (input.hook_event_name === "Stop") { stopGate(input); try { stopSummary(input); } catch { /* สรุปพังต้องไม่บล็อกการจบ */ } return; }
  if (input.hook_event_name === "PreToolUse") { preWriteGate(input); return; }
  const event = input.hook_event_name;
  // writeSync: process.exit ทันทีหลังเขียน · write แบบ async อาจถูกตัดเมื่อข้อความยาว (กฎประจำตัวราว 20 KB)
  const say = (text) => { if (text) writeSync(1, JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: text.slice(0, CONTEXT_MAX) } })); };
  const speaks = ["SessionStart", "UserPromptSubmit", "SubagentStart"].includes(event) ? claimContext(input) : true;
  if (!speaks) return;   // สำเนา hook อีกตัวส่งข้อความของเหตุการณ์นี้แล้ว (log ก็จดแล้วเช่นกัน)
  // subagent เริ่มใหม่ไม่เห็นกฎของหัวหน้าทีม → ส่งเฉพาะตาราง "งาน → skill" ให้สั้น
  if (event === "SubagentStart") { say(coreRules({ routeOnly: true })); return; }
  let lead = "";
  try { lead = leadContext(input); } catch { /* กฎส่งไม่ได้ต้องไม่ทำให้ log ล้ม */ }
  const root = findProjectRoot(input.cwd ?? process.cwd());
  if (!root) { say(lead); return; }

  const teamDir = teamDirOf(root);
  let notice = "";
  try { notice = logAndNotice(input, raw, root, teamDir, event); } catch { /* log ล้มต้องไม่ทำให้กฎหาย */ }
  say([notice, lead].filter(Boolean).join("\n\n"));   // ข้อความ inbox สั้นและสำคัญ วางก่อนกฎ จะได้ไม่ถูกตัดท้าย
}

// เขียน log 1 บรรทัด · คืนข้อความแจ้ง inbox ของหัวหน้าทีม · สำเนา hook อีกตัวจด log ไปแล้ว → ไม่จดซ้ำ คืนค่าว่าง
function logAndNotice(input, raw, root, teamDir, event) {
  if (!claimEvent(root, raw)) return "";
  const statePath = join(teamDir, "state.json");
  const state = readJson(statePath, { models: {}, seen: [] });
  state.models ??= {};

  const now = new Date();
  const entry = buildEntry(input, state, now);
  const logDir = join(teamDir, "log", entry.ts.slice(0, 10));
  mkdirSync(logDir, { recursive: true });
  appendFileSync(join(logDir, `${logFileName(entry.agent)}.jsonl`), JSON.stringify(entry) + "\n");

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
  return notice;
}

// node superuser-hook.mjs --self-test → พิสูจน์ว่าการตัดข้อมูลยังจับได้จริง และไม่ตัดตัวเลขทั่วไป
function selfTest() {
  const cases = [
    ["เลขบัตร ปชช. มีขีด", "บัตร 1-1037-02345-67-8 ครับ", "[ตัดเลขประจำตัว]"],
    ["เลขบัตร ปชช. ติดกัน", "id 1103702345678", "[ตัดเลขประจำตัว]"],
    ["บัตรเครดิต", "card 4111 1111 1111 1111 exp", "[ตัดเลขบัตร]"],
    ["เลขบัญชีมีขีด", "โอนเข้า 123-4-56789-0", "[ตัดเลขบัญชี]"],
    ["เลขบัญชีติดกัน", "บัญชี 1234567890", "[ตัดเลขบัญชี]"],
    ["token", "token=abcdef123456", "[ตัด]"],
    ["วันที่ไม่ถูกตัด", "นัด 2026-10-14 เวลา 10:30 ห้อง 1203", null],
  ];
  const T = (...blocks) => JSON.stringify({ message: { role: "assistant", content: blocks } });
  const skill = T({ type: "tool_use", name: "Skill", input: { skill: "software-company:superuser" } });
  const edit = (f, n = 50) => T({ type: "tool_use", name: "Write", input: { file_path: `/p/${f}`, content: "x\n".repeat(n) } });
  const rev = T({ type: "tool_use", name: "Agent", input: { subagent_type: "software-company:reviewer" } });
  const say = (s) => T({ type: "text", text: s });
  const gates = [
    ["ด่านรีวิว: แก้ 3 ไฟล์ ไม่มี reviewer → บล็อก", [skill, edit("a"), edit("b"), edit("c")], true],
    ["ด่านรีวิว: มี reviewer หลังแก้ → ผ่าน", [skill, edit("a"), edit("b"), edit("c"), rev], false],
    ["ด่านรีวิว: แก้ต่อหลัง reviewer → บล็อก", [skill, edit("a"), edit("b"), rev, edit("c")], true],
    ["ด่านรีวิว: แก้ 2 ไฟล์ → ผ่าน", [skill, edit("a"), edit("b")], false],
    ["ด่านรีวิว: ใส่ ข้ามรีวิว: → ผ่าน", [skill, edit("a"), edit("b"), edit("c"), say("ข้ามรีวิว: งานเล็ก แก้ข้อความ 3 ไฟล์")], false],
    ["ด่านรีวิว: ไม่ได้ใช้ superuser → ผ่าน", [edit("a"), edit("b"), edit("c")], false],
    ["ด่านรีวิว: ไฟล์ใน _to_delete ไม่นับ", [skill, edit("a"), edit("b"), edit("_to_delete/x")], false],
  ];
  const dev = T({ type: "tool_use", name: "Agent", input: { subagent_type: "software-company:developer" } });
  gates.push(
    ["ด่านแตกงาน: เขียนไฟล์ที่ 2 ยังไม่ส่งลูกทีม → บล็อก", [skill, edit("a.js")], true, (l) => splitGate(l, "/p/b.js")],
    ["ด่านแตกงาน: ไฟล์แรก → ผ่าน", [skill], false, (l) => splitGate(l, "/p/a.js")],
    ["ด่านแตกงาน: เขียนไฟล์เดิมซ้ำ → ผ่าน", [skill, edit("a.js")], false, (l) => splitGate(l, "/p/a.js")],
    ["ด่านแตกงาน: ไฟล์ test → ผ่าน", [skill, edit("a.js")], false, (l) => splitGate(l, "/p/a.test.js")],
    ["ด่านแตกงาน: ส่ง developer แล้ว → ผ่าน", [skill, dev, edit("a.js")], false, (l) => splitGate(l, "/p/b.js")],
    ["ด่านแตกงาน: มีแค่ reviewer → บล็อก", [skill, rev, edit("a.js")], true, (l) => splitGate(l, "/p/b.js")],
    ["ด่านแตกงาน: เขียน 2 ไฟล์ในข้อความเดียว → บล็อก", [skill, T({ type: "tool_use", id: "w1", name: "Write", input: { file_path: "/p/a.js", content: "x\n".repeat(50) } }, { type: "tool_use", id: "w2", name: "Write", input: { file_path: "/p/b.js", content: "x\n".repeat(50) } })], true, (l) => splitGate(l, "/p/a.js", "w1")],
    ["ด่านแตกงาน: Edit ใหญ่ไฟล์ที่ 2 → บล็อก", [skill, edit("a.js")], true, (l) => splitGate(l, "/p/b.js", null, { name: "Edit", input: { new_string: "x\n".repeat(20) } })],
    ["ด่านแตกงาน: Bash cat > ไฟล์โค้ดที่ 2 → บล็อก", [skill, edit("a.js")], true, (l) => splitGate(l, "b.js", null, { name: "Bash", input: { command: "cat > b.js <<'EOF'\n" + "x\n".repeat(20) + "EOF" } }, "/p")],
    ["ด่านแตกงาน: ชิ้นแรกสั้น (15 บรรทัด) → ผ่าน", [skill, edit("a.js", 15)], false, (l) => splitGate(l, "/p/b.js")],
    ["ด่านแตกงาน: ไฟล์ใน scripts/ → ไม่นับ", [skill, edit("scripts/gen.mjs")], false, (l) => splitGate(l, "/p/b.js")],
    ["ด่านแตกงาน: Bash เขียน 2 ไฟล์ใหญ่ → บล็อก", [skill], true, (l) => splitGate(l, "a.js", null, { name: "Bash", input: { command: "cat > a.js <<'EOF'\n" + "x\n".repeat(50) + "EOF\ncat > b.js <<'EOF'\n" + "y\n".repeat(50) + "EOF" } }, "/p")],
    ["ด่านแตกงาน: Bash เขียน 2 ไฟล์เล็ก → ผ่าน", [skill], false, (l) => splitGate(l, "a.js", null, { name: "Bash", input: { command: "cat > a.js <<'EOF'\n" + "x\n".repeat(8) + "EOF\ncat > b.js <<'EOF'\n" + "y\n".repeat(8) + "EOF" } }, "/p")],
    ["ด่านแตกงาน: Bash สั้น → ผ่าน", [skill, edit("a.js")], false, (l) => splitGate(l, "b.js", null, { name: "Bash", input: { command: "echo x > b.js" } }, "/p")],
    ["ด่านแตกงาน: Edit เล็ก → ผ่าน", [skill, edit("a.js")], false, (l) => splitGate(l, "/p/b.js", null, { name: "Edit", input: { new_string: "x\ny" } })],
  );
  // สรุป log: 1 วัน · หัวหน้าทีมส่ง developer 2 งาน (ล้ม 1) · developer ทำ 3 อย่าง (ล้ม 1) · ผู้ใช้แก้ 1 ครั้ง
  const day = { prompts: 2, corrections: 1, actions: 5, failed: 1,
    spawns: [{ ts: "2026-10-21T10:00:00+07:00", role: "software-company:developer", task: "แก้ฟอร์ม", ok: true },
      { ts: "2026-10-21T10:05:00+07:00", role: "software-company:developer", task: "เขียน test", ok: false }],
    agents: { main: { actions: 2, failed: 0, ms: 0, last: "2026-10-21T10:06:00+07:00" }, "software-company:developer": { actions: 3, failed: 1, ms: 120000, last: "2026-10-21T10:04:00+07:00" } } };
  const md = summaryMarkdown({ "2026-10-21": day }, new Date("2026-10-21T04:00:00Z"));
  gates.push(["สรุป log: นับงานราย agent", [], true, () => md.includes("| `software-company:developer` | 2 | 1 | 1 | 3 | 1 | 2 นาที |") && md.includes("| 2026-10-21 | 2 | 1 | 2 | 5 | 1 |")]);
  // กฎประจำตัวและตัวบอก skill
  const router = readJson(join(HERE, "skill-router.json"), { rules: [] });
  const routes = (s) => routeSkills(s, router);
  gates.push(
    ["ตัวบอก skill: แก้ไฟล์ .docx → human-writing + docx", [], true, () => routes("แก้ไฟล์ report.docx ให้หัวข้อเป็นทางการ").includes("docx") && routes("แก้ไฟล์ report.docx ให้หัวข้อเป็นทางการ").includes("human-writing")],
    ["ตัวบอก skill: เขียนอีเมล → human-writing", [], true, () => routes("Write a short email to the client").includes("human-writing")],
    ["ตัวบอก skill: เทียบ → answer-shape", [], true, () => routes("เปรียบเทียบ PostgreSQL กับ SQL Server").includes("answer-shape")],
    ["ตัวบอก skill: โค้ด python → simplify + stack-python", [], true, () => ["superuser:simplify", "stack-python"].every((s) => routes("เขียนสคริปต์ Python อ่าน csv").includes(s))],
    ["ตัวบอก skill: คำสั่ง slash → ไม่บอก", [], true, () => routes("/superuser:superuser เขียนรายงาน").length === 0],
    ["ตัวบอก skill: ทักทาย → ไม่บอก", [], true, () => routes("สวัสดีครับ").length === 0],
    ["กฎประจำตัว: ส่งได้ไม่เกินเพดาน", [], true, () => { const c = coreRules({ configDir: "/nonexistent" }); return c.includes(CORE_MARK) && c.length <= CONTEXT_MAX; }],
    ["กฎประจำตัว: subagent ได้แค่ตาราง skill", [], true, () => { const c = coreRules({ configDir: "/nonexistent", routeOnly: true }); return c.startsWith(ROUTE_HEAD) && !c.includes("## ทำให้จบ"); }],
  );
  const tmp = join(tmpdir(), `sqt-claim-test-${process.pid}`);
  const ev = { session_id: "s1", hook_event_name: "SessionStart", source: "startup" };
  gates.push(["สำเนา hook หลายตัว: ส่งกฎครั้งเดียวต่อเหตุการณ์", [], true, () => claimContext(ev, tmp, 1e9) === true && claimContext(ev, tmp, 1e9 + 100) === false && claimContext({ ...ev, session_id: "s2" }, tmp, 1e9) === true && claimContext(ev, tmp, 1e9 + 60000) === true]);
  let gateOk = 0;
  for (const [label, lines, expect, fn = reviewGate] of gates) {
    const hit = Boolean(fn(lines)) === expect;
    console.log(`  ${hit ? "✅" : "❌"} ${label}`);
    if (hit) gateOk++;
  }
  let ok = 0;
  for (const [label, input, expect] of cases) {
    const out = redact(input);
    const hit = expect ? out.includes(expect) : out === input;
    console.log(`  ${hit ? "✅" : "❌"} ${label} → ${out}`);
    if (hit) ok++;
  }
  console.log(`\nself-test ${ok + gateOk}/${cases.length + gates.length} ผ่าน`);
  process.exit(ok === cases.length && gateOk === gates.length ? 0 : 1);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/superuser-hook.mjs")) {
  if (process.argv.includes("--self-test")) selfTest();
  try { main(); } catch { /* log ล้มต้องไม่ทำให้งานหลักล้ม */ }
  process.exit(0);
}
