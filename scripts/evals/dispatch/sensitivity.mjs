#!/usr/bin/env node
/**
 * sensitivity.mjs — น้ำหนักคะแนนรวมของการแจกงาน (score.mjs → WEIGHTS) เป็นค่าตั้งเอง · ลองเปลี่ยนแล้วผลสรุปเปลี่ยนไหม · ไม่เรียก claude
 *
 *   node scripts/evals/dispatch/sensitivity.mjs _to_delete/dispatch/<เวลา>/runs.json
 *   node scripts/evals/dispatch/sensitivity.mjs --self-test
 *
 * ชุดน้ำหนักที่ลอง: ค่าเดิม · เท่ากันทุกข้อ · ทีละข้อ ×0.5 และ ×1.5 (ทุกชุดปรับให้รวมเป็น 10)
 * Δ = คะแนนรวมแขน plugin − แขน none ต่อชุด · ทนทาน = Δ ทุกชุดเครื่องหมายเดียวกับค่าเดิม · ไม่ทนทาน = มีชุดที่กลับข้าง (ผลขึ้นกับน้ำหนักที่ตั้งเอง)
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { WEIGHTS, scoreRun, summarizeArm, tierFromTags } from "./score.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const KEYS = Object.keys(WEIGHTS);
const value = (m, k) => (k === "ratio_ok" ? m.ratio_ok.p : m[k]) ?? 0;
/** คะแนนรวมจากองค์ประกอบของ summarizeArm ด้วยน้ำหนักชุดใดก็ได้ (ปรับให้รวม 10) */
export function totalWith(m, w) { const sum = KEYS.reduce((s, k) => s + w[k], 0); return KEYS.reduce((s, k) => s + (10 * w[k] / sum) * value(m, k), 0); }
export function weightSets() {
  const sets = [["ค่าเดิม", { ...WEIGHTS }], ["เท่ากันทุกข้อ", Object.fromEntries(KEYS.map((k) => [k, 1]))]];
  for (const k of KEYS) for (const f of [0.5, 1.5]) sets.push([`${k} ×${f}`, { ...WEIGHTS, [k]: WEIGHTS[k] * f }]);
  return sets;
}
export function sensitivity(plugin, none) {
  const rows = weightSets().map(([name, w]) => ({ name, plugin: totalWith(plugin, w), none: totalWith(none, w) })).map((r) => ({ ...r, delta: r.plugin - r.none }));
  const base = Math.sign(rows[0].delta), flips = rows.filter((r) => Math.sign(r.delta) !== base && Math.abs(r.delta) > 1e-9);
  return { rows, flips, robust: !flips.length, min: Math.min(...rows.map((r) => r.delta)), max: Math.max(...rows.map((r) => r.delta)) };
}

function loadCases() {
  const dir = join(HERE, "cases");
  return readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
    .map((c) => ({ ...c, graph: { ...c.graph, tasks: c.graph.tasks.map((t) => ({ ...t, tier: t.tier ?? (t.tags ? tierFromTags(t.tags, c.risky) : undefined) })) } }));
}

function main(file) {
  if (!file || !existsSync(file)) { console.error("ใส่ path ของ runs.json จาก _to_delete/dispatch/<เวลา>/"); process.exit(2); }
  const byId = new Map(loadCases().map((c) => [c.id, c]));
  const rows = JSON.parse(readFileSync(file, "utf8")).filter((r) => byId.has(r.case)).map((r) => ({ ...r, risky: byId.get(r.case).risky, score: scoreRun(byId.get(r.case), r.answer) }));
  const arm = (a) => summarizeArm(rows.filter((r) => r.arm === a));
  const P = arm("plugin"), N = arm("none");
  if (!P || !N) { console.error("ต้องมีผลทั้ง 2 แขน"); process.exit(2); }
  const s = sensitivity(P, N);
  console.log("| ชุดน้ำหนัก | มี plugin | ไม่มี plugin | Δ |\n|---|---|---|---|");
  for (const r of s.rows) console.log(`| ${r.name} | ${r.plugin.toFixed(2)} | ${r.none.toFixed(2)} | ${r.delta >= 0 ? "+" : ""}${r.delta.toFixed(2)} |`);
  console.log(`\nΔ อยู่ระหว่าง ${s.min.toFixed(2)} ถึง ${s.max.toFixed(2)} · ${s.robust ? "**ทนทาน** เปลี่ยนน้ำหนักแล้วผลสรุปไม่กลับข้าง" : `**ไม่ทนทาน** กลับข้างใน: ${s.flips.map((r) => r.name).join(" · ")}`}`);
}

function selfTest() {
  const m = (p, rest) => ({ ratio_ok: { p }, tier_acc: rest, iron_clean: rest, effort_set: rest, has_expect: rest, wave_ok: rest });
  const strong = sensitivity(m(0.9, 0.9), m(0.5, 0.5)), mixed = sensitivity(m(1, 0.4), m(0.4, 0.6));
  const cases = [
    ["ค่าเดิมรวมเท่า summarizeArm (เต็ม 10)", Math.abs(totalWith(m(1, 1), WEIGHTS) - 10) < 1e-9],
    ["ดีกว่าทุกข้อ ทนทาน", strong.robust && strong.min > 0],
    ["ดีข้อหนักแย่ข้อเบา อาจกลับข้างเมื่อน้ำหนักเปลี่ยน", !mixed.robust],
    ["ชุดน้ำหนัก 14 ชุด", weightSets().length === 2 + 2 * KEYS.length],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) (process.argv.includes("--self-test") ? selfTest : () => main(process.argv[2]))();
