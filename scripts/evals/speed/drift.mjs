#!/usr/bin/env node
/**
 * drift.mjs — ผลของ superuser เลื่อนไปตามเวลาไหม (รุ่น plugin · รุ่น model · รุ่น Claude Code เปลี่ยน) · อ่าน history.jsonl ที่ run-bench.mjs ต่อท้าย · ไม่เสียเงิน
 *
 *   node scripts/evals/speed/drift.mjs            # เทียบการรันล่าสุดกับครั้งก่อนที่เทียบกันได้ + ตารางแนวโน้มกลุ่ม "ทุกงาน"
 *   node scripts/evals/speed/drift.mjs --self-test
 *
 * เทียบกันได้ = แขนเทียบชนิดเดียวกัน (none กับ none · git ref กับ git ref) · prompt เดียวกัน · --variants เหมือนกัน · หน่วยงานในกลุ่มเหมือนกัน
 * สูตร: ผลต่างอัตราผ่านครบของแขน new = Newcombe (ล่าสุด − ก่อน) · ขอบล่าง > 0 ดีขึ้นจริง · ขอบบน < 0 แย่ลงจริง
 *        ปลอดภัยเทียบแบบเดียวกัน · ค่าใช้จ่ายรายงานเป็นอัตราส่วนค่ากลาง ล่าสุด ÷ ก่อน (ไม่มีช่วง เพราะไม่ได้เก็บค่ารายรอบในประวัติ)
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { diffCI } from "./stats.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const kind = (h) => `${h.old === "none" ? "none" : "ref"}|${h.prompt}|${h.variants ? "v" : "-"}`;

/** เทียบ 2 บรรทัดประวัติ → แถวต่อกลุ่มที่หน่วยงานตรงกัน */
export function compare(prev, cur) {
  const out = [];
  for (const [g, c] of Object.entries(cur.groups ?? {})) {
    const p = prev.groups?.[g];
    if (!p || JSON.stringify([...p.units].sort()) !== JSON.stringify([...c.units].sort())) continue;
    const d = diffCI(c.new.pass, c.new.n, p.new.pass, p.new.n);
    const s = c.new.secN && p.new.secN ? diffCI(c.new.sec, c.new.secN, p.new.sec, p.new.secN) : null;
    const verdict = !d ? "ไม่มีข้อมูล" : d.lo > 0 ? "ดีขึ้นจริง" : d.hi < 0 ? "แย่ลงจริง" : "แยกไม่ออก";
    out.push({ group: g, pass: d, security: s, verdict, cost: p.new.costMed && c.new.costMed ? c.new.costMed / p.new.costMed : null });
  }
  return out;
}

function main() {
  const f = join(HERE, "history.jsonl");
  if (!existsSync(f)) { console.error("ยังไม่มี history.jsonl · รัน run-bench.mjs อย่างน้อย 2 ครั้ง"); process.exit(2); }
  const hs = readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const cur = hs.at(-1), prev = hs.slice(0, -1).reverse().find((h) => kind(h) === kind(cur));
  const pct = (x) => (x == null ? "–" : `${Math.round(x * 100)}%`);
  const tag = (h) => `${h.date.slice(0, 16)} · superuser ${h.newVersion ?? "?"} · ${h.models} · Claude Code ${h.cli}`;
  if (!prev) console.log(`ยังไม่มีครั้งก่อนที่เทียบได้กับ ${tag(cur)}`);
  else {
    console.log(`ล่าสุด: ${tag(cur)}\nก่อนหน้า: ${tag(prev)}\n\n| กลุ่ม | ผ่านครบ new ล่าสุด − ก่อน (ช่วง 95%) | คำตัดสิน | ปลอดภัย ล่าสุด − ก่อน | ค่าใช้จ่ายค่ากลาง ล่าสุด ÷ ก่อน |\n|---|---|---|---|---|`);
    for (const r of compare(prev, cur)) console.log(`| ${r.group} | ${pct(r.pass?.d)} (${pct(r.pass?.lo)} ถึง ${pct(r.pass?.hi)}) | ${r.verdict} | ${r.security ? `${pct(r.security.d)} (${pct(r.security.lo)} ถึง ${pct(r.security.hi)})` : "–"} | ${r.cost?.toFixed(2) ?? "–"} |`);
  }
  console.log(`\n**แนวโน้ม "ทุกงาน"** (ชนิดเดียวกับล่าสุด)\n\n| วันที่ | superuser | ผ่านครบ new | ผ่านครบ เทียบ | รวม new | ค่าใช้จ่ายค่ากลาง new |\n|---|---|---|---|---|---|`);
  for (const h of hs.filter((x) => kind(x) === kind(cur))) {
    const g = h.groups?.["ทุกงาน"]; if (!g) continue;
    const o = Object.entries(g).find(([k]) => k !== "new" && k !== "units" && k !== "cost")?.[1];
    console.log(`| ${h.date.slice(0, 10)} | ${h.newVersion ?? "?"} | ${g.new.pass}/${g.new.n} | ${o ? `${o.pass}/${o.n}` : "–"} | ${g.new.combined?.toFixed(2) ?? "–"} | ${g.new.costMed?.toFixed(2) ?? "–"} |`);
  }
}

function selfTest() {
  const h = (pass, n, units = ["t1", "t2"]) => ({ old: "none", prompt: "natural", variants: false, groups: { "ทุกงาน": { units, new: { pass, n, sec: n, secN: n, costMed: 1 } } } });
  const up = compare(h(2, 20), h(18, 20)), same = compare(h(10, 20), h(11, 20)), diffUnits = compare(h(2, 20), h(18, 20, ["t1"]));
  const cases = [
    ["2/20 → 18/20 ดีขึ้นจริง", up[0].verdict === "ดีขึ้นจริง"],
    ["10/20 → 11/20 แยกไม่ออก", same[0].verdict === "แยกไม่ออก"],
    ["หน่วยงานไม่ตรงไม่เทียบ", diffUnits.length === 0],
    ["ชนิดต่างกันไม่เทียบ", kind({ old: "none", prompt: "natural" }) !== kind({ old: "HEAD", prompt: "natural" })],
  ];
  let ok = 0;
  for (const [name, pass] of cases) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) (process.argv.includes("--self-test") ? selfTest : main)();
