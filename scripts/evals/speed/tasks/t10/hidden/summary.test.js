import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// งานใหญ่ไม่ใช่โค้ด: 4 ไฟล์ วันที่ 4 รูปแบบ (มี พ.ศ.) · แถวซ้ำ · ไม่มีราคา · คืนสินค้า
const exp = JSON.parse(readFileSync(new URL("./expected.json", import.meta.url), "utf8"));
let got = null; try { got = JSON.parse(readFileSync("summary.json", "utf8")); } catch { /* ไม่มีหรือพัง */ }
const md = existsSync("report.md") ? readFileSync("report.md", "utf8") : "";
const section = (name) => (md.split(/^##\s+/m).find((s) => s.startsWith(name)) ?? "");
const TH = { bangna: "บางนา", rangsit: "รังสิต", chonburi: "ชลบุรี", rayong: "ระยอง" };

test("summary.json อ่านได้", () => assert.ok(got));
for (const [b, e] of Object.entries(exp.branches)) {
  test(`${b} ยอดรายเดือนและรวม`, () => {
    const g = got?.branches?.[b] ?? {};
    for (const k of ["jul", "aug", "sep", "total"]) assert.equal(Math.round(g[k]), e[k], `${b}.${k}`);
  });
  test(`${b} growth`, () => assert.ok(Math.abs((got?.branches?.[b]?.growth_sep_vs_jul_pct ?? 999) - e.growth_sep_vs_jul_pct) <= 0.05));
  test(`${b} สินค้าขายดี`, () => assert.equal(got?.branches?.[b]?.top_product, e.top_product));
}
test("ยอดรวมทั้งหมด", () => assert.equal(Math.round(got?.grand_total), exp.grand_total));
test("สาขาสูงสุด", () => assert.equal(got?.top_branch, exp.top_branch));
test("ปัญหาข้อมูลครบและไม่เกิน", () => {
  const k = (i) => `${i.file}:${i.line}:${i.type}`;
  assert.deepEqual([...(got?.issues ?? [])].map(k).sort(), exp.issues.map(k).sort());
});
test("report.md มี 3 หัวข้อ", () => { for (const h of ["สรุป", "รายสาขา", "ปัญหาข้อมูล"]) assert.ok(section(h), h); });
test("ย่อหน้าแรกของสรุปมียอดรวมและสาขาสูงสุด", () => {
  const p = section("สรุป").replace(/^[^\n]*\n+/, "").split(/\n\s*\n/)[0] ?? "";
  assert.ok(p.replace(/,/g, "").includes(String(exp.grand_total)));
  assert.ok(p.includes(TH[exp.top_branch]) || p.includes(exp.top_branch));
});
test("หัวข้อปัญหาข้อมูลบอกทุกบรรทัด", () => {
  const s = section("ปัญหาข้อมูล");
  for (const i of exp.issues) assert.ok(new RegExp(`\\b${i.line}\\b`).test(s), `${i.file} บรรทัด ${i.line}`);
});
