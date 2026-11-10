// ของใช้ร่วมของ hook superuser — อ่าน JSON · สวิตช์โมดูลใน config · ความจำต่อ session ใน tmpdir · ตัวเทียบรุ่น และระยะแก้คำ
// ไม่พึ่งไฟล์ superuser-hook.mjs (กันวงกลม) · ทุกฟังก์ชันจับ error เอง hook ต้องเปิดทางเสมอ (fail-open)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, userInfo } from "node:os";

export const TMP_USER = (() => { try { return userInfo().username.replace(/[^\w.-]/g, "_"); } catch { return "user"; } })();

export function readJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

// config ของโฟลเดอร์งาน (.claude/superuser/config.json) · ไม่มีไฟล์หรือ key = ค่าเริ่ม def · ดู references/modules.md
export function moduleOn(teamDir, key, def = true) {
  if (!teamDir) return def;
  const v = readJson(join(teamDir, "config.json"), null)?.modules?.[key];
  return v === undefined ? def : v !== false;
}

// ค่าเริ่มของโมดูลที่เพิ่ม(โมดูลเดิมใช้ค่าเริ่มของตัวเอง) · ปิดทีละตัวได้ใน config.json "modules"
export const MODULE_DEFAULT = {
  hook: true, guard: false, rules: true, secret_scan: true, post_hints: true, prompt_rules: true, stop_rules: true,
  route_by_tool: true, suggest: true, completion_loop: true, version_notice: true, digest: true, listeners: false, commit_check: true, push_check: true, lint_post: true,
};
export const modOn = (teamDir, key) => moduleOn(teamDir, key, MODULE_DEFAULT[key] ?? true);

// ── ความจำต่อ session (tmpdir แยกต่อผู้ใช้ · ไฟล์เก่าเกิน 1 วันลบทิ้ง) ──────────────────
const SESS_DIR = join(tmpdir(), `sqt-superuser-sess-${TMP_USER}`);
const DAY_MS = 86400000;
const sessFile = (dir, sid) => join(dir, `${String(sid ?? "none").replace(/[^\w-]/g, "_")}.json`);

function sessRead(sid, dir) { return readJson(sessFile(dir, sid), { keys: [], flags: [] }); }
function sessWrite(sid, dir, data, now) {
  try {
    mkdirSync(dir, { recursive: true });
    for (const name of readdirSync(dir)) { try { if (now - statSync(join(dir, name)).mtimeMs > DAY_MS) unlinkSync(join(dir, name)); } catch { /* ตัวอื่นลบแล้ว */ } }
    writeFileSync(sessFile(dir, sid), JSON.stringify({ keys: data.keys.slice(-200), flags: data.flags.slice(-20) }));
  } catch { /* เขียนไม่ได้ = ไม่จำ (ข้อความอาจซ้ำ ดีกว่าหาย) */ }
}

/** true เมื่อ key นี้ยังไม่เคยเกิดใน session นี้ (แล้วจดไว้) · ใช้ทำ "บอกครั้งเดียวต่อ session" */
export function sessionOnce(sid, key, dir = SESS_DIR, now = Date.now()) {
  const d = sessRead(sid, dir);
  if (d.keys.includes(key)) return false;
  sessWrite(sid, dir, { ...d, keys: [...d.keys, key] }, now);
  return true;
}
export function sessionSeen(sid, key, dir = SESS_DIR) { return sessRead(sid, dir).keys.includes(key); }
/** ข้อความผู้ใช้ตั้งธง → เครื่องมือแรกหลังข้อความนั้นหยิบไปแจ้งครั้งเดียว */
export function setFlags(sid, flags, dir = SESS_DIR, now = Date.now()) { sessWrite(sid, dir, { ...sessRead(sid, dir), flags }, now); }
export function takeFlags(sid, dir = SESS_DIR, now = Date.now()) {
  const d = sessRead(sid, dir);
  if (!d.flags.length) return [];
  sessWrite(sid, dir, { ...d, flags: [] }, now);
  return d.flags;
}

// รุ่นแบบ x.y.z · a ใหม่กว่า b
export function semverGt(a, b) {
  const p = (v) => String(v ?? "").split("-")[0].split(".").map((n) => parseInt(n, 10) || 0);
  const [x, y] = [p(a), p(b)];
  for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  return false;
}

export function editDistance(a, b) {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
