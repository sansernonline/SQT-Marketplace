#!/usr/bin/env node
/**
 * sample.mjs — สุ่มข้อให้คนติดป้าย เพื่อวัดตัววัดที่ "จับด้วยคำ" ว่าแม่นแค่ไหน · ผลใช้กับ calibrate.mjs ตัวเดียวกับที่วัด LLM judge · ไม่เรียก model
 *
 *   node scripts/evals/judge/sample.mjs --overclaim [--n 50]     # คำตอบสุดท้ายของรอบ bench: อ้างว่าเสร็จ/ผ่านไหม (ตัวจับ CLAIM ใน speed/dims.mjs)
 *   node scripts/evals/judge/sample.mjs --corrections [--n 50]   # ข้อความผู้ใช้ใน log: เป็นการสั่งแก้ไหม (isCorrection ของ hook)
 *   → _to_delete/labels/<ชนิด>-<เวลา>.csv ช่อง id · split · judge (ที่ตัวจับทาย) · human (ว่าง ให้คนกรอก pass|fail) · text
 *   คนกรอก human โดยไม่ดูช่อง judge (ซ่อนคอลัมน์ไว้) แล้วรัน: node scripts/evals/judge/calibrate.mjs <ไฟล์ csv>
 *   node scripts/evals/judge/sample.mjs --self-test
 *
 * pass = ใช่ (อ้างว่าเสร็จ · เป็นการสั่งแก้) · สุ่มแบบแบ่งชั้น: ครึ่งหนึ่งจากข้อที่ตัวจับว่าใช่ อีกครึ่งจากข้อที่ว่าไม่ใช่ ให้ได้ทั้ง 2 กลุ่มพอคิด TPR และ TNR (calibrate ต้องกลุ่มละ ≥ 20)
 * สุ่มด้วยแฮชของ id (กำหนดซ้ำได้) · split แจกด้วย assignSplit ของ calibrate.mjs
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assignSplit } from "./calibrate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const h = (s) => createHash("sha1").update(String(s)).digest("hex");

/** items = [{ id, text, pred: boolean }] → n ข้อ ครึ่งจาก pred จริง ครึ่งจาก pred เท็จ (ไม่พอฝั่งไหนเติมจากอีกฝั่ง) เรียงตามแฮช */
export function stratified(items, n) {
  const byHash = (xs) => [...xs].sort((a, b) => h(a.id).localeCompare(h(b.id)));
  const pos = byHash(items.filter((x) => x.pred)), neg = byHash(items.filter((x) => !x.pred));
  let p = Math.min(pos.length, Math.ceil(n / 2)), q = Math.min(neg.length, n - p);
  p = Math.min(pos.length, n - q);
  return byHash([...pos.slice(0, p), ...neg.slice(0, q)]);
}
const cell = (s) => `"${String(s).replace(/"/g, '""').replace(/\r?\n/g, " ⏎ ")}"`;
export const toCsv = (rows) => "id,split,judge,human,text\n" + rows.map((r) => [cell(r.id), assignSplit(r.id), r.pred ? "pass" : "fail", "", cell(r.text)].join(",")).join("\n") + "\n";

async function overclaim() {
  const { CLAIM } = await import("../speed/dims.mjs");
  const dir = join(ROOT, "_to_delete", "bench", "runs");
  if (!existsSync(dir)) { console.error("ไม่มีผลรายรอบของ bench"); process.exit(2); }
  return readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
    .filter((r) => r.result).map((r) => ({ id: r.id, text: String(r.result).slice(0, 1500), pred: CLAIM.test(String(r.result)) }));
}
async function corrections() {
  const { isCorrection } = await import("../../../plugins/superuser/hooks/superuser-hook.mjs");
  const log = join(ROOT, ".claude", "superuser", "log");
  if (!existsSync(log)) { console.error("ไม่มี log"); process.exit(2); }
  const out = [];
  for (const d of readdirSync(log).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x))) {
    const f = join(log, d, "main.jsonl");
    if (!existsSync(f)) continue;
    readFileSync(f, "utf8").split("\n").forEach((l, i) => { try { const e = JSON.parse(l); // ข้อความที่ระบบส่งเข้ามาแทนผู้ใช้ (รายงานลูกทีม · แจ้งเตือนงาน) ไม่ใช่คำของผู้ใช้ ไม่สุ่ม
        if (e.event === "UserPromptSubmit" && e.prompt && !/^\s*<(agent-message|task-notification|system-reminder|command-)/.test(e.prompt)) out.push({ id: `${d}#${i}`, text: e.prompt.slice(0, 600), pred: isCorrection(e.prompt) }); } catch { /* บรรทัดเสีย */ } });
  }
  return out;
}

function selfTest() {
  const items = Array.from({ length: 30 }, (_, i) => ({ id: `x${i}`, text: `t${i}`, pred: i < 5 }));
  const s = stratified(items, 10), again = stratified(items, 10);
  const cases = [
    ["ได้ 10 ข้อ", s.length === 10],
    ["ฝั่งใช่มีแค่ 5 ใช้ครบ 5 แล้วเติมฝั่งไม่ใช่", s.filter((x) => x.pred).length === 5],
    ["กำหนดซ้ำได้", JSON.stringify(s) === JSON.stringify(again)],
    ["CSV escape คำพูดและขึ้นบรรทัด", toCsv([{ id: "a", text: 'บอกว่า "เสร็จ"\nแล้ว', pred: true }]).includes('"บอกว่า ""เสร็จ"" ⏎ แล้ว"')],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const a = process.argv.slice(2), n = Number(a[a.indexOf("--n") + 1]) || 50;
  if (a.includes("--self-test")) selfTest();
  const kind = a.includes("--overclaim") ? "overclaim" : a.includes("--corrections") ? "corrections" : null;
  if (!kind) { console.error("ใส่ --overclaim หรือ --corrections"); process.exit(2); }
  const items = await (kind === "overclaim" ? overclaim() : corrections());
  const rows = stratified(items, n);
  const dir = join(ROOT, "_to_delete", "labels"); mkdirSync(dir, { recursive: true });
  const f = join(dir, `${kind}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.csv`);
  writeFileSync(f, toCsv(rows));
  console.log(`สุ่ม ${rows.length} จาก ${items.length} ข้อ (ตัวจับว่าใช่ ${rows.filter((r) => r.pred).length}) → ${f.replace(ROOT, ".")} · กรอกช่อง human (pass = ใช่) โดยซ่อนช่อง judge แล้วรัน calibrate.mjs`);
}
