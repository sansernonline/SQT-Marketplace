#!/usr/bin/env node
// วัดว่า LLM judge ตัดสินตรงกับป้ายของคนแค่ไหน: TPR · TNR · accuracy แยก split พร้อมตารางข้อที่ไม่ตรง
// ไม่เรียก model · อ่านป้ายและคำตัดสินที่เก็บไว้แล้ว (แนวจาก outputai output-eval-validate-judge และ langfuse judge-calibration ดู 2026-11-10)
//   node scripts/evals/judge/calibrate.mjs labels.csv|labels.json [--bar 0.85] [--min-per-class 20] [--json]
//   node scripts/evals/judge/calibrate.mjs labels.csv --assign-splits   (แจกแถวละ split แบบกำหนดซ้ำได้ แล้วพิมพ์ JSON)
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const HELP = `ใช้: node scripts/evals/judge/calibrate.mjs <labels.csv|labels.json> [ตัวเลือก]

ไฟล์ป้าย: แถวละ 1 ข้อ ช่อง id · human (pass|fail ป้ายของคน) · judge (pass|fail คำตัดสินของ judge)
ช่องเสริม: split (train|dev|test) · category (ไว้ดูแยกหมวด) · note
ผ่าน = ค่าบวก: TPR = judge ว่าผ่านในข้อที่คนว่าผ่าน · TNR = judge ว่าไม่ผ่านในข้อที่คนว่าไม่ผ่าน

ตัวเลือก
  --bar <0-1>            เกณฑ์ accuracy ที่ถือว่าเท่าคน (ค่าเริ่ม 0.85)
  --min-per-class <n>    จำนวนป้ายผ่านและไม่ผ่านขั้นต่ำอย่างละกี่ข้อ (ค่าเริ่ม 20)
  --assign-splits        ไม่คำนวณ · แจก split ให้ทุกแถว (train 40% · dev 30% · test 30% ตามแฮชของ id) แล้วพิมพ์ JSON
  --json                 พิมพ์ผลเป็น JSON
  -h, --help             ข้อความนี้

วิธีใช้: few-shot ใน judge เอาจาก train · ปรับ prompt ด้วย dev · รัน test ครั้งเดียวตอนท้าย
ถ้าไม่ถึงเกณฑ์ เสนอ prompt ใหม่ให้ผู้ใช้อนุมัติก่อนแก้ ห้ามปรับเกณฑ์หรือป้ายให้ตัวเลขผ่าน

exit: 0 ถึงเกณฑ์ · 1 ไฟล์ผิดรูปแบบ · 2 ป้ายไม่พอ หรือไม่ถึงเกณฑ์`;

// CSV แบบง่าย: คั่นด้วย , · รองรับค่าในเครื่องหมายคำพูดที่มี , หรือ "" ข้างใน
export function parseCsv(text) {
  const rows = []; let row = [], cur = "", q = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((x) => x !== "")) rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.some((x) => x !== "")) rows.push(row);
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const norm = (v) => String(v ?? "").trim().toLowerCase();
export function loadLabels(text, isJson) {
  const rows = isJson ? JSON.parse(text) : parseCsv(text);
  if (!Array.isArray(rows) || !rows.length) throw new Error("ไม่มีแถวป้าย");
  return rows.map((r, i) => {
    const human = norm(r.human), judge = norm(r.judge);
    if (!["pass", "fail"].includes(human)) throw new Error(`แถว ${i + 1} (${r.id ?? "?"}): human ต้องเป็น pass หรือ fail ได้ "${r.human}"`);
    if (judge && !["pass", "fail"].includes(judge)) throw new Error(`แถว ${i + 1} (${r.id ?? "?"}): judge ต้องเป็น pass หรือ fail ได้ "${r.judge}"`);
    return { id: String(r.id ?? i + 1), human, judge, split: norm(r.split) || "all", category: r.category || "", note: r.note || "" };
  });
}

// split ที่แจกตามแฮชของ id: ได้ผลเดิมทุกครั้ง ไม่ต้องเก็บสถานะ
export function assignSplit(id) {
  const n = parseInt(createHash("sha1").update(String(id)).digest("hex").slice(0, 8), 16) % 100;
  return n < 40 ? "train" : n < 70 ? "dev" : "test";
}

export function metrics(rows) {
  const c = { tp: 0, fn: 0, tn: 0, fp: 0 };
  for (const r of rows) {
    if (r.human === "pass") r.judge === "pass" ? c.tp++ : c.fn++;
    else r.judge === "fail" ? c.tn++ : c.fp++;
  }
  const div = (a, b) => (b ? a / b : NaN);
  return { n: rows.length, ...c, tpr: div(c.tp, c.tp + c.fn), tnr: div(c.tn, c.tn + c.fp), accuracy: div(c.tp + c.tn, rows.length),
    humanPass: c.tp + c.fn, humanFail: c.tn + c.fp };
}

export function calibrate(rows, { bar = 0.85, minPerClass = 20 } = {}) {
  const missing = rows.filter((r) => !r.judge).map((r) => r.id);
  if (missing.length) throw new Error(`ยังไม่มีคำตัดสินของ judge ในแถว: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " ..." : ""}`);
  const all = metrics(rows);
  const bySplit = {}, byCategory = {};
  for (const s of new Set(rows.map((r) => r.split))) bySplit[s] = metrics(rows.filter((r) => r.split === s));
  for (const k of new Set(rows.map((r) => r.category).filter(Boolean))) byCategory[k] = metrics(rows.filter((r) => r.category === k));
  const mismatches = rows.filter((r) => r.human !== r.judge).map((r) => ({ id: r.id, split: r.split, category: r.category, human: r.human, judge: r.judge, kind: r.human === "pass" ? "judge เข้มเกิน (FN)" : "judge หลวมเกิน (FP)", note: r.note }));
  const problems = [];
  if (all.humanPass < minPerClass) problems.push(`ป้ายผ่านมี ${all.humanPass} ข้อ ต้อง ${minPerClass} ขึ้นไป`);
  if (all.humanFail < minPerClass) problems.push(`ป้ายไม่ผ่านมี ${all.humanFail} ข้อ ต้อง ${minPerClass} ขึ้นไป`);
  const gate = bySplit.test ?? all;   // มี test แยกก็ใช้ test ตัดสิน ไม่มีก็ใช้ทั้งหมด (และบอกว่าไม่ได้แยก)
  if (!bySplit.test) problems.push("ไม่มี split test แยก: ตัวเลขนี้ปรับกับข้อมูลเดียวกัน อาจสูงเกินจริง");
  const enough = all.humanPass >= minPerClass && all.humanFail >= minPerClass;
  const reached = enough && gate.accuracy >= bar && gate.tpr >= bar && gate.tnr >= bar;
  return { all, bySplit, byCategory, mismatches, problems, bar, gateOn: bySplit.test ? "test" : "all", reached, enough };
}

const pct = (x) => (Number.isNaN(x) ? "-" : `${(x * 100).toFixed(1)}%`);
const row = (name, m) => `| ${name} | ${m.n} | ${pct(m.tpr)} | ${pct(m.tnr)} | ${pct(m.accuracy)} |`;

export function report(r) {
  const out = ["| กลุ่ม | ข้อ | TPR | TNR | accuracy |", "|---|---|---|---|---|", row("ทั้งหมด", r.all),
    ...Object.entries(r.bySplit).filter(([k]) => k !== "all").map(([k, m]) => row(`split ${k}`, m)),
    ...Object.entries(r.byCategory).map(([k, m]) => row(`หมวด ${k}`, m))];
  const lines = [out.join("\n"), ""];
  lines.push(r.reached ? `ถึงเกณฑ์ ${pct(r.bar)} (ตัดสินจาก ${r.gateOn}) · judge เชื่อได้เท่าที่ป้ายชุดนี้ครอบคลุม`
    : `ยังไม่ถึงเกณฑ์ ${pct(r.bar)} (ตัดสินจาก ${r.gateOn}) · อย่าเชื่อคะแนนจาก judge นี้ · เสนอ prompt ใหม่ให้ผู้ใช้อนุมัติก่อนแก้ แล้วรันซ้ำ (ห้ามปรับเกณฑ์หรือป้ายให้ผ่าน)`);
  for (const p of r.problems) lines.push(`- ${p}`);
  if (r.mismatches.length) {
    lines.push("", "ข้อที่ judge ไม่ตรงคน", "", "| id | split | หมวด | คน | judge | ชนิด |", "|---|---|---|---|---|---|",
      ...r.mismatches.map((m) => `| ${m.id} | ${m.split} | ${m.category || "-"} | ${m.human} | ${m.judge} | ${m.kind} |`));
  }
  return lines.join("\n");
}

function main(argv) {
  if (argv.includes("-h") || argv.includes("--help") || !argv.length) { console.log(HELP); return 0; }
  const opt = (f, d) => { const i = argv.indexOf(f); return i < 0 ? d : argv[i + 1]; };
  const file = argv.find((a) => !a.startsWith("--") && a !== opt("--bar") && a !== opt("--min-per-class"));
  let rows;
  try { rows = loadLabels(readFileSync(file, "utf8"), file.toLowerCase().endsWith(".json")); }
  catch (e) { console.error(`อ่านป้ายไม่ได้: ${e.message}`); return 1; }
  if (argv.includes("--assign-splits")) {
    console.log(JSON.stringify(rows.map((r) => ({ ...r, split: assignSplit(r.id) })), null, 2));
    return 0;
  }
  let result;
  try { result = calibrate(rows, { bar: Number(opt("--bar", 0.85)), minPerClass: Number(opt("--min-per-class", 20)) }); }
  catch (e) { console.error(e.message); return 1; }
  console.log(argv.includes("--json") ? JSON.stringify(result, null, 2) : report(result));
  return result.reached ? 0 : 2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
