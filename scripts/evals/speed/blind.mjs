#!/usr/bin/env node
/**
 * blind.mjs — ให้คนตัดสินงานเขียนแบบปิดป้าย: คู่ (แขน new · แขนเทียบ) ของงานเดียวกัน สลับ A/B แบบกำหนดซ้ำได้ · ไม่เรียก model ไม่เสียเงิน
 *
 *   node scripts/evals/speed/blind.mjs --make [--tasks t6,t13] [--old none]   # ใช้รอบใน _to_delete/bench/runs · เขียนชุดคู่ลง _to_delete/blind/<เวลา>/
 *   (คนอ่าน pairs.md แล้วกรอก votes.csv: pair,choice · choice = A | B | tie · ห้ามเปิด key.json ก่อนกรอกเสร็จ)
 *   node scripts/evals/speed/blind.mjs --score _to_delete/blind/<เวลา>     # เปิดป้ายแล้วสรุป
 *   node scripts/evals/speed/blind.mjs --self-test
 *
 * งานที่ใช้ได้ = task.json มี "blind": [ไฟล์หรือโฟลเดอร์ผลงาน] · จับคู่รอบที่ n ของ 2 แขน (ทุกคู่เป็นงานเดียวกัน แต่ไม่ได้บอกว่ารอบไหนดีกว่า)
 * สูตร: อัตราชนะ = ชนะ new ÷ (ชนะ new + ชนะเทียบ) พร้อมช่วง Wilson · เสมอรายงานแยก ไม่นับในตัวหาร
 *        sign test สองข้าง: p = 2 · min(P(X ≤ k), P(X ≥ k)) เมื่อ X ~ Binomial(m, 0.5) · m = คู่ที่ไม่เสมอ · k = ชนะ new
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { wilson } from "./stats.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const RUNS = join(ROOT, "_to_delete", "bench", "runs");

/** สลับ A/B ด้วยแฮชของ (seed, คู่) · new เป็น A เมื่อบิตแรกเป็น 0 · ได้ผลเดิมทุกครั้ง ไม่ต้องเก็บ random */
export const newIsA = (seed, pairId) => (parseInt(createHash("sha1").update(`${seed}|${pairId}`).digest("hex").slice(0, 2), 16) & 1) === 0;

const choose = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; };
/** sign test สองข้างแบบตรง */
export function signTest(k, m) {
  if (!m) return null;
  const pmf = (i) => choose(m, i) / 2 ** m;
  let lo = 0, hi = 0;
  for (let i = 0; i <= k; i++) lo += pmf(i);
  for (let i = k; i <= m; i++) hi += pmf(i);
  return Math.min(1, 2 * Math.min(lo, hi));
}

/** votes = [{ pair, choice }] · key = { pair: "A"|"B" (ตัวที่เป็น new) } */
export function tally(votes, key) {
  let win = 0, lose = 0, tie = 0, unknown = 0;
  for (const v of votes) {
    const c = String(v.choice ?? "").trim().toUpperCase();
    if (!(v.pair in key)) { unknown++; continue; }
    if (c === "TIE" || c === "เสมอ") tie++;
    else if (c === key[v.pair]) win++;
    else if (c === "A" || c === "B") lose++;
    else unknown++;
  }
  const m = win + lose;
  return { win, lose, tie, unknown, rate: m ? wilson(win, m) : null, p: signTest(win, m) };
}

function readOutput(work, items) {
  const out = [];
  for (const it of items) {
    const p = join(work, it);
    if (!existsSync(p)) { out.push(`### ${it}\n\n(ไม่มีไฟล์)`); continue; }
    const files = statSync(p).isDirectory() ? readdirSync(p).sort().map((f) => join(it, f)) : [it];
    for (const f of files) out.push(`### ${f}\n\n${readFileSync(join(work, f), "utf8")}`);
  }
  return out.join("\n\n");
}

function make(opts) {
  if (!existsSync(RUNS)) { console.error(`ไม่มี ${RUNS} · รัน run-bench.mjs ก่อน`); process.exit(2); }
  const rows = readdirSync(RUNS).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(RUNS, f), "utf8")));
  const old = opts.old ?? (rows.some((r) => r.label === "none") ? "none" : "old");
  const want = opts.tasks ? new Set(opts.tasks.split(",")) : null;
  const seed = new Date().toISOString();
  const dir = join(ROOT, "_to_delete", "blind", seed.slice(0, 16).replace(/[:T]/g, "-"));
  mkdirSync(dir, { recursive: true });
  const pairs = [], key = {};
  for (const r of rows.filter((x) => x.label === "new")) {
    const unit = r.unit ?? r.task, base = r.base ?? unit;
    if (want && !want.has(base) && !want.has(unit)) continue;
    let meta = {}; try { meta = JSON.parse(readFileSync(join(HERE, "tasks", base, "task.json"), "utf8")); } catch { continue; }
    if (!meta.blind?.length) continue;
    const other = rows.find((x) => x.label === old && (x.unit ?? x.task) === unit && x.n === r.n);
    if (!other) continue;
    const id = `${unit}#${r.n}`, a = newIsA(seed, id);
    const N = readOutput(join(RUNS, r.id), meta.blind), O = readOutput(join(RUNS, other.id), meta.blind);
    key[id] = a ? "A" : "B";
    pairs.push(`## คู่ ${id}\n\nโจทย์: \`tasks/${base}/TASK.md\`\n\n<details open><summary>A</summary>\n\n${a ? N : O}\n\n</details>\n\n<details open><summary>B</summary>\n\n${a ? O : N}\n\n</details>\n`);
  }
  if (!pairs.length) { console.error("ไม่มีคู่ให้ตัดสิน · งานต้องมี blind ใน task.json และมีรอบของทั้ง 2 แขน"); process.exit(2); }
  writeFileSync(join(dir, "pairs.md"), `# ตัดสินแบบปิดป้าย · ${pairs.length} คู่\n\nเลือกฉบับที่ใช้งานได้ดีกว่า (ถูกต้อง · ครบ · อ่านง่าย · ใช้ได้เลย) ตั้งเกณฑ์ก่อนอ่าน · กรอก votes.csv\n\n${pairs.join("\n")}`);
  writeFileSync(join(dir, "votes.csv"), "pair,choice\n" + Object.keys(key).map((k) => `${k},`).join("\n") + "\n");
  writeFileSync(join(dir, "key.json"), JSON.stringify({ seed, old, key }, null, 2));
  console.log(`เขียน ${pairs.length} คู่ที่ ${dir.replace(ROOT, ".")} · ส่ง pairs.md กับ votes.csv ให้ผู้ตัดสิน · อย่าส่ง key.json`);
}

function score(dir) {
  const { key, old } = JSON.parse(readFileSync(join(dir, "key.json"), "utf8"));
  const votes = readFileSync(join(dir, "votes.csv"), "utf8").trim().split(/\r?\n/).slice(1).map((l) => { const [pair, choice] = l.split(","); return { pair, choice }; }).filter((v) => v.choice?.trim());
  const t = tally(votes, key);
  const pct = (x) => `${Math.round(x * 100)}%`;
  console.log(`ชนะ new ${t.win} · ชนะ ${old} ${t.lose} · เสมอ ${t.tie} · กรอกผิด ${t.unknown} · ยังไม่กรอก ${Object.keys(key).length - votes.length}`);
  console.log(t.rate ? `อัตราชนะของ new ${pct(t.rate.p)} (ช่วง 95% ${pct(t.rate.lo)}–${pct(t.rate.hi)}) · sign test p = ${t.p.toFixed(3)}${t.rate.lo > 0.5 ? " · **new ดีกว่าจริง**" : t.rate.hi < 0.5 ? " · **new แย่กว่าจริง**" : " · แยกไม่ออก"}` : "ไม่มีคู่ที่ไม่เสมอ");
}

function selfTest() {
  const key = { "t6#1": "A", "t6#2": "B", "t6#3": "A", "t6#4": "B" };
  const t = tally([{ pair: "t6#1", choice: "A" }, { pair: "t6#2", choice: "B" }, { pair: "t6#3", choice: "B" }, { pair: "t6#4", choice: "tie" }, { pair: "x", choice: "A" }], key);
  const cases = [
    ["สลับ A/B กำหนดซ้ำได้", newIsA("s", "t6#1") === newIsA("s", "t6#1")],
    ["สลับ A/B ไม่ได้ให้ new เป็น A ทุกคู่", new Set(Array.from({ length: 20 }, (_, i) => newIsA("s", `p${i}`))).size === 2],
    ["นับชนะ 2 แพ้ 1 เสมอ 1 ไม่รู้จัก 1", t.win === 2 && t.lose === 1 && t.tie === 1 && t.unknown === 1],
    ["อัตราชนะไม่นับเสมอ", Math.abs(t.rate.p - 2 / 3) < 1e-9],
    ["sign test 10/10 สองข้าง ≈ 0.002", Math.abs(signTest(10, 10) - 2 / 1024) < 1e-9],
    ["sign test 5/10 = 1", signTest(5, 10) === 1],
    ["sign test ไม่มีคู่ = null", signTest(0, 0) === null],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const a = process.argv.slice(2), opt = (f) => { const i = a.indexOf(f); return i < 0 ? null : a[i + 1]; };
  if (a.includes("--self-test")) selfTest();
  else if (a.includes("--make")) make({ tasks: opt("--tasks"), old: opt("--old") });
  else if (opt("--score")) score(resolve(opt("--score")));
  else { console.error("ใช้: --make [--tasks t6,t13] · --score <โฟลเดอร์> · --self-test"); process.exit(2); }
}
