#!/usr/bin/env node
/**
 * sensitivity.mjs — เกณฑ์ที่ตั้งเองของ bench (dims.mjs: คำสั่งล้ม ≤ 10% · วนซ้ำ 3 ครั้ง · ความกว้าง 0.8–1.2) เปลี่ยนแล้วผลสรุปเปลี่ยนไหม · ไม่เรียก claude
 *
 *   node scripts/evals/speed/sensitivity.mjs [--old none]     # อ่าน _to_delete/bench/runs/*.json ของรอบล่าสุด
 *   node scripts/evals/speed/sensitivity.mjs --self-test
 *
 * คิด กระบวนการ และ รวม ใหม่จากค่าดิบที่เก็บไว้ต่อรอบ (errorRate · maxRepeat · ตรวจหลังแก้) ไม่ต้องรันซ้ำ
 * ต่อขนาดงาน: คำตัดสินของ "รวม" (ช่วง bootstrap ของ 2 แขนไม่ทับ = ต่างจริง) และอัตราส่งลูกทีมตรงความกว้าง ของทุกชุดเกณฑ์
 * ทนทาน = ทุกชุดได้คำตัดสินเดียวกับค่าเดิม · ไม่ทนทาน = มีชุดที่คำตัดสินเปลี่ยน → ตัวเลขนั้นขึ้นกับเกณฑ์ที่ตั้งเอง ห้ามสรุปจากชุดเดียว
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { meanCI } from "./stats.mjs";
import { MAX_ERROR_RATE, LOOP_REPEAT } from "./dims.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
export const GRID = [
  { name: "ค่าเดิม", maxErrorRate: MAX_ERROR_RATE, loopRepeat: LOOP_REPEAT, tol: 0.2 },
  { name: "ล้มได้ 5%", maxErrorRate: 0.05, loopRepeat: LOOP_REPEAT, tol: 0.2 },
  { name: "ล้มได้ 20%", maxErrorRate: 0.2, loopRepeat: LOOP_REPEAT, tol: 0.2 },
  { name: "วน = ซ้ำ 2", maxErrorRate: MAX_ERROR_RATE, loopRepeat: 2, tol: 0.2 },
  { name: "วน = ซ้ำ 5", maxErrorRate: MAX_ERROR_RATE, loopRepeat: 5, tol: 0.2 },
  { name: "ความกว้าง ±10%", maxErrorRate: MAX_ERROR_RATE, loopRepeat: LOOP_REPEAT, tol: 0.1 },
  { name: "ความกว้าง ±30%", maxErrorRate: MAX_ERROR_RATE, loopRepeat: LOOP_REPEAT, tol: 0.3 },
];

/** คิด 1 รอบใหม่ด้วยเกณฑ์ g · ไม่มีค่าดิบ = null */
export function rescore(r, g) {
  if (r.errorRate == null || r.processChecks == null) return { ...r, process: null, combined: null, widthOk: null };
  const proc = (r.processChecks.verified + (r.errorRate <= g.maxErrorRate ? 1 : 0) + ((r.maxRepeat ?? 0) >= g.loopRepeat ? 0 : 1)) / 3;
  const combined = r.step == null || r.security == null ? null : r.step * proc * r.security;
  const widthOk = r.workers == null || r.width == null ? null : r.width >= 2 ? Math.abs(r.workers / r.width - 1) <= g.tol + 1e-9 && r.workers <= 8 : r.workers <= 1;
  return { ...r, process: proc, combined, widthOk };
}
const verdict = (a, b) => (!a || !b ? "ไม่มีข้อมูล" : a.lo > b.hi ? "new สูงกว่า" : a.hi < b.lo ? "new ต่ำกว่า" : "แยกไม่ออก");
export function analyse(rows, old) {
  const sizes = [...new Set(rows.map((r) => r.size))];
  const out = GRID.map((g) => {
    const rs = rows.map((r) => rescore(r, g));
    const per = Object.fromEntries([...sizes, "ทุกงาน"].map((sz) => {
      const pick = (label) => rs.filter((r) => r.label === label && (sz === "ทุกงาน" || r.size === sz));
      const wv = pick("new").filter((r) => r.widthOk != null);
      return [sz, { verdict: verdict(meanCI(pick("new").map((r) => r.combined)), meanCI(pick(old).map((r) => r.combined))), width: wv.length ? wv.filter((r) => r.widthOk).length / wv.length : null }];
    }));
    return { g, per };
  });
  const base = out[0].per, flips = out.slice(1).flatMap(({ g, per }) => Object.keys(per).filter((sz) => per[sz].verdict !== base[sz].verdict).map((sz) => `${g.name} · ${sz}: ${base[sz].verdict} → ${per[sz].verdict}`));
  return { out, flips, robust: !flips.length };
}

function main() {
  const a = process.argv.slice(2), oi = a.indexOf("--old");
  const dir = join(ROOT, "_to_delete", "bench", "runs");
  if (!existsSync(dir)) { console.error("ยังไม่มีผลรายรอบ · รัน run-bench.mjs ก่อน"); process.exit(2); }
  const rows = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
  const old = oi >= 0 ? a[oi + 1] : rows.some((r) => r.label === "none") ? "none" : "old";
  if (!rows.some((r) => r.errorRate != null)) { console.error("ผลรายรอบไม่มีค่าดิบ (errorRate) · รันด้วย run-bench รุ่นที่มี dims.mjs ก่อน"); process.exit(2); }
  const { out, flips, robust } = analyse(rows, old);
  const sizes = Object.keys(out[0].per);
  const pct = (x) => (x == null ? "–" : `${Math.round(x * 100)}%`);
  console.log(`| ชุดเกณฑ์ | ${sizes.map((s) => `${s}: รวม · ตรงความกว้าง`).join(" | ")} |\n|---|${sizes.map(() => "---").join("|")}|`);
  for (const { g, per } of out) console.log(`| ${g.name} | ${sizes.map((s) => `${per[s].verdict} · ${pct(per[s].width)}`).join(" | ")} |`);
  console.log(`\n${robust ? "**ทนทาน** คำตัดสินของ \"รวม\" ไม่เปลี่ยนในทุกชุดเกณฑ์" : `**ไม่ทนทาน** คำตัดสินเปลี่ยน ${flips.length} จุด:\n${flips.map((f) => `- ${f}`).join("\n")}`}`);
}

function selfTest() {
  const r = (label, size, errorRate, maxRepeat, workers = 1, width = 1) => ({ label, size, step: 1, security: 1, errorRate, maxRepeat, workers, width, processChecks: { verified: 1 } });
  const rows = [...Array(6)].flatMap(() => [r("new", "เล็ก", 0.08, 0), r("none", "เล็ก", 0.5, 4)]);
  const res = analyse(rows, "none");
  // new ล้ม 8% · none ล้ม 15%: ที่ 10% new ชนะ · ที่ 20% ผ่านทั้งคู่ → คำตัดสินเปลี่ยน
  const edge = analyse([...Array(6)].flatMap(() => [r("new", "เล็ก", 0.08, 0), r("none", "เล็ก", 0.15, 0)]), "none");
  const cases = [
    ["คิดใหม่ด้วยเกณฑ์ 5%: 8% ล้มข้อคำสั่งล้ม", rescore(r("new", "เล็ก", 0.08, 0), GRID[1]).process === 2 / 3],
    ["ความกว้าง 3/4: ±20% ไม่ตรง ±30% ตรง", rescore(r("new", "กลาง", 0, 0, 3, 4), GRID[0]).widthOk === false && rescore(r("new", "กลาง", 0, 0, 3, 4), GRID[6]).widthOk === true],
    ["ไม่มีค่าดิบ = null", rescore({ label: "new" }, GRID[0]).combined === null],
    ["ต่างกันชัด ทนทาน", res.robust],
    ["ต่างกันที่ขอบเกณฑ์ ไม่ทนทาน", !edge.robust],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) (process.argv.includes("--self-test") ? selfTest : main)();
