// วนจนเสร็จตามคำสัญญา (R4 · แนวเดียวกับ ralph-loop ของ Anthropic แต่ใช้ stopGate เดิม) — โมดูล completion_loop
// เริ่มเมื่อผู้ใช้พิมพ์บรรทัด `วนจนเสร็จ: <คำสัญญา> · สูงสุด N รอบ` (หรือ `loop-until: …  max=N`) · สถานะอยู่ในไฟล์ต่อ session_id ใน tmpdir
// ตอน Stop: คำตอบสุดท้ายมี <promise>คำสัญญา</promise> ตรงตัว → จบ · ยังไม่มี → ไม่ให้จบ ส่งกลับไปทำต่อ · ครบรอบสูงสุด → ปล่อยจบพร้อมแจ้ง
// ผู้ใช้หยุดเองด้วยบรรทัด `หยุดวน` · ไม่เกี่ยวกับ stop_hook_active (วนต่อเนื่องคือหน้าที่) แต่ถูกจำกัดด้วยรอบสูงสุด จึงไม่วนไม่สิ้นสุด
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync, openSync, readSync, closeSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { TMP_USER, readJson } from "./util.mjs";

export const LOOP_MAX_DEFAULT = 10;
export const LOOP_MAX_CAP = 50;
const DIR = join(tmpdir(), `sqt-superuser-loop-${TMP_USER}`);
const file = (dir, sid) => join(dir, `${String(sid ?? "none").replace(/[^\w-]/g, "_")}.json`);
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const START = /^[ \t]*(?:loop-until|วนจนเสร็จ|วนจนกว่า)[ \t]*[:：][ \t]*(.+?)[ \t]*$/im;
const MAXRE = /[ \t]*[·|,;(]?[ \t]*(?:max|สูงสุด)[ \t]*=?[ \t]*(\d{1,3})[ \t]*(?:รอบ|iterations?)?[ \t)]*$/i;
export function parseLoopRequest(prompt) {
  const m = START.exec(String(prompt ?? ""));
  if (!m) return null;
  let line = m[1], max = LOOP_MAX_DEFAULT;
  const mm = MAXRE.exec(line);
  if (mm) { max = Math.min(Math.max(parseInt(mm[1], 10) || LOOP_MAX_DEFAULT, 1), LOOP_MAX_CAP); line = line.slice(0, mm.index); }
  const promise = norm(line.replace(/[·|,;]+$/, "").replace(/^["'“”‘’]|["'“”‘’]$/g, ""));
  return promise ? { promise: promise.slice(0, 200), max } : null;
}
export const loopCancelRequested = (prompt) => /^[ \t]*(?:หยุดวน|cancel-loop)[ \t]*$/im.test(String(prompt ?? ""));

export function loopStart(sid, req, dir = DIR, now = Date.now()) {
  try {
    mkdirSync(dir, { recursive: true });
    for (const n of readdirSync(dir)) { try { if (now - statSync(join(dir, n)).mtimeMs > 86400000) unlinkSync(join(dir, n)); } catch { /* ตัวอื่นลบแล้ว */ } }
    writeFileSync(file(dir, sid), JSON.stringify({ promise: req.promise, max: req.max, iter: 0, started: new Date(now).toISOString() }));
    return true;
  } catch { return false; }
}
export function loopCancel(sid, dir = DIR) { try { unlinkSync(file(dir, sid)); return true; } catch { return false; } }
export const loopActive = (sid, dir = DIR) => readJson(file(dir, sid), null);

export const loopStartNotice = (req) => `วนจนเสร็จ: เริ่มแล้ว · คำสัญญา "${req.promise}" · สูงสุด ${req.max} รอบ · ทำงานต่อเนื่องและตรวจผลจริงทุกรอบ · เมื่อคำสัญญาเป็นจริงแล้วเท่านั้น เขียน <promise>${req.promise}</promise> เป็นบรรทัดสุดท้ายของคำตอบ · ผู้ใช้หยุดเองด้วยการพิมพ์ \`หยุดวน\``;

/** ตัดสินรอบนี้ · state = สถานะที่บันทึกไว้ · คืน { action, reason, done, state } */
export function loopStep(state, lastText) {
  const want = norm(state.promise);
  const promised = [...String(lastText ?? "").matchAll(/<promise>([\s\S]*?)<\/promise>/g)].some((m) => norm(m[1]) === want);
  if (promised) return { action: "allow", done: "promise", reason: `วนจนเสร็จ: สำเร็จหลัง ${state.iter + 1} รอบ (คำสัญญา "${state.promise}")` };
  const iter = (state.iter ?? 0) + 1;
  if (iter >= state.max) return { action: "allow", done: "max", reason: `วนจนเสร็จ: ครบ ${state.max} รอบแล้วคำสัญญา "${state.promise}" ยังไม่ถูกยืนยัน — หยุดวน · สรุปให้ผู้ใช้ว่าทำถึงไหน ติดอะไร` };
  return {
    action: "block", done: null, state: { ...state, iter },
    reason: `วนจนเสร็จ รอบ ${iter}/${state.max}: คำสัญญา "${state.promise}" ยังไม่ถูกยืนยัน — ตรวจผลจริง (รัน test หรือคำสั่งตรวจ) แล้วทำส่วนที่เหลือ · เมื่อเป็นจริงทั้งหมดแล้วเท่านั้น เขียน <promise>${state.promise}</promise> เป็นบรรทัดสุดท้าย · ห้ามเขียนแท็กนี้ทั้งที่ยังไม่จริง · ผู้ใช้หยุดเองด้วยการพิมพ์ \`หยุดวน\``,
  };
}

/** ข้อความผู้ช่วยล่าสุดจากท้าย transcript (อ่านท้ายไฟล์ 256 KB ไม่อ่านทั้งไฟล์) */
export function lastAssistantText(transcript) {
  let fd;
  try {
    fd = openSync(transcript, "r");
    const size = statSync(transcript).size, len = Math.min(size, 262144), buf = Buffer.alloc(len);
    readSync(fd, buf, 0, len, size - len);
    const lines = buf.toString("utf8").split("\n").reverse();
    for (const l of lines) {
      if (!l.includes('"assistant"')) continue;
      let m; try { m = JSON.parse(l); } catch { continue; }
      if (m.isSidechain || m.message?.role !== "assistant" || !Array.isArray(m.message.content)) continue;
      const t = m.message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text).join("\n");
      if (t) return t;
    }
  } catch { /* อ่านไม่ได้ = ไม่มีคำสัญญา วนต่อจนครบรอบ */ } finally { if (fd !== undefined) try { closeSync(fd); } catch { /* ปิดไม่ได้ก็ปล่อย */ } }
  return "";
}

/** Stop · คืน { block: reason } | { say: ข้อความแจ้ง } | null */
export function loopStopGate(input, { dir = DIR, lastText } = {}) {
  const state = loopActive(input.session_id, dir);
  if (!state) return null;
  const step = loopStep(state, lastText ?? lastAssistantText(input.transcript_path));
  if (step.action === "block") { try { writeFileSync(file(dir, input.session_id), JSON.stringify(step.state)); } catch { /* เขียนไม่ได้ = รอบหน้านับซ้ำ ยังถูกจำกัดโดยเวลา 1 วัน */ } return { block: step.reason }; }
  loopCancel(input.session_id, dir);
  return { say: step.reason };
}
