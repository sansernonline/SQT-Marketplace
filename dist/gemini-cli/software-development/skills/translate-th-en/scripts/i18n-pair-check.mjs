#!/usr/bin/env node
// เทียบไฟล์ข้อความหน้าจอ 2 ภาษา (เช่น th.json กับ en.json) ตาม ../SKILL.md หัวข้อ 4
// คีย์ซ้ำในไฟล์เดียว · คีย์ขาด · คีย์เกิน · ตัวแทนค่าในแต่ละคีย์ต้องชื่อเดียวกันและจำนวนเท่ากัน · ผิดแล้ว exit 1
//   node i18n-pair-check.mjs th.json en.json
//   node i18n-pair-check.mjs --self-test
// object ซ้อนกันแบนเป็น a.b.c · array เป็น a.0 · ตัวแทนค่าที่รู้จัก: {name} {{name}} %s %d %1$s :name
import { readFileSync } from "node:fs";

// ลำดับมีผล: {{name}} ต้องจับก่อน {name} · ICU `{count, plural, ...}` นับเป็น {count} · %d ที่มีตัวอักษรต่อท้าย (50%discount) ไม่นับ
const PLACEHOLDERS = [/\{\{\s*([\w.]+)\s*\}\}/g, /(?<!\{)\{\s*([A-Za-z_][\w.]*)\s*[,}]/g, /%(?:\d+\$)?[sdif@](?![A-Za-z])/g, /(?<![\w:/]):([A-Za-z_]\w*)/g];

export function flatten(value, prefix = "", out = {}) {
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else out[prefix] = value;
  return out;
}

export function placeholders(text) {
  if (typeof text !== "string") return [];
  let rest = text;
  const found = [];
  for (const re of PLACEHOLDERS) {
    rest = rest.replace(re, (m, name) => { found.push(name !== undefined && !m.startsWith("%") ? (m.startsWith(":") ? `:${name}` : `{${name}}`) : m); return " "; });
  }
  return found.sort();
}

// JSON.parse เก็บคีย์ซ้ำตัวท้ายเงียบ ๆ คำแปลตัวแรกจึงหายโดยไม่มีใครเห็น · ไล่ข้อความดิบหาคีย์ซ้ำใน object เดียวกัน คืนเป็น a.b.c
export function duplicateKeys(text) {
  const tokens = text.match(/"(?:[^"\\]|\\.)*"|[{}[\]:,]/g) ?? [];
  const stack = [], dups = [];
  let key = null;
  tokens.forEach((t, i) => {
    const top = stack.at(-1);
    if (t === "{" || t === "[") stack.push({ obj: t === "{", keys: new Set(), index: 0, path: top ? [...top.path, top.obj ? key : top.index] : [] });
    else if (t === "}" || t === "]") stack.pop();
    else if (t === ",") { if (top && !top.obj) top.index++; }
    else if (t !== ":" && top?.obj && tokens[i + 1] === ":") {
      key = JSON.parse(t);
      if (top.keys.has(key)) dups.push([...top.path, key].join("."));
      top.keys.add(key);
    }
  });
  return dups;
}

export function compare(a, b, names = ["ไฟล์ 1", "ไฟล์ 2"]) {
  const fa = flatten(a), fb = flatten(b);
  const problems = [];
  for (const k of Object.keys(fa)) if (!(k in fb)) problems.push(`${k}: มีใน ${names[0]} แต่ขาดใน ${names[1]} · เพิ่มคำแปล`);
  for (const k of Object.keys(fb)) if (!(k in fa)) problems.push(`${k}: มีใน ${names[1]} แต่ขาดใน ${names[0]} · เพิ่มคำแปลหรือลบคีย์ที่เลิกใช้`);
  for (const k of Object.keys(fa)) {
    if (!(k in fb)) continue;
    const pa = placeholders(fa[k]).join(" "), pb = placeholders(fb[k]).join(" ");
    if (pa !== pb) problems.push(`${k}: ตัวแทนค่าไม่ตรง · ${names[0]} [${pa}] · ${names[1]} [${pb}] · ใช้ชื่อเดิมและจำนวนเท่ากัน`);
  }
  return problems;
}

function main(argv) {
  if (argv.includes("--self-test")) return import("./i18n-pair-check.test.mjs").then((t) => t.selfTest());
  const files = argv.filter((a) => !a.startsWith("--"));
  if (files.length !== 2) return fail("ใช้: node i18n-pair-check.mjs <th.json> <en.json> | --self-test");
  let data, texts;
  try { texts = files.map((f) => readFileSync(f, "utf8").replace(/^\uFEFF/, "")); data = texts.map((t) => JSON.parse(t)); } catch (e) { return fail(`อ่าน JSON ไม่ได้: ${e.message} · ตรวจว่าเป็น JSON ถูกรูป`); }
  const problems = [...texts.flatMap((t, i) => duplicateKeys(t).map((k) => `${k}: คีย์ซ้ำใน ${files[i]} · JSON เก็บแค่ตัวท้าย คำแปลตัวแรกหาย ลบตัวที่ไม่ใช้`)), ...compare(data[0], data[1], files)];
  if (!problems.length) return console.log(`ผ่าน · ${Object.keys(flatten(data[0])).length} คีย์ตรงกัน`);
  fail(`ไม่ผ่าน ${problems.length} ข้อ\n${problems.map((p) => `- ${p}`).join("\n")}`);
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("i18n-pair-check.mjs")) main(process.argv.slice(2));
