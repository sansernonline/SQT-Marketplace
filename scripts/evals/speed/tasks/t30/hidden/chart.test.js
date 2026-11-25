import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// domain ใหม่ (กราฟข้อมูล) · สัดส่วนความสูงต้องตรงข้อมูล ไม่ใช่แค่มีรูป
const svg = existsSync("chart.svg") ? readFileSync("chart.svg", "utf8") : "";
const data = readFileSync("data/sales.csv", "utf8").trim().split("\n").slice(1).map((l) => l.split(",")).map(([m, v]) => [m, Number(v)]);
const bars = [...svg.matchAll(/<rect\b[^>]*data-month\s*=\s*["']([^"']+)["'][^>]*>/g)].map((x) => [x[1], Number(x[0].match(/\bheight\s*=\s*["']([\d.]+)/)?.[1])]);
const plain = svg.replace(/<[^>]+>/g, " ").replace(/,/g, "");
test("มี viewBox และ title", () => { assert.match(svg, /viewBox\s*=/); assert.match(svg, /<title>[^<]+<\/title>/); });
test("ไม่มี script หรือไฟล์ภายนอก", () => assert.ok(svg && !/<script|href\s*=\s*["']https?:/i.test(svg)));
test("แท่งครบตามเดือนและเรียงตามไฟล์", () => assert.deepEqual(bars.map((b) => b[0]), data.map((d) => d[0])));
test("ความสูงเป็นสัดส่วนกับยอด (คลาด ≤ 2%)", () => {
  const k = bars.map(([, h], i) => h / data[i][1]); assert.ok(k.length && k.every((x) => x > 0));
  for (const x of k) assert.ok(Math.abs(x / k[0] - 1) <= 0.02, String(k));
});
test("ป้ายเดือนไทยและตัวเลขครบ", () => { for (const t of ["มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค."]) assert.ok(plain.includes(t), t); for (const [, v] of data) assert.ok(plain.includes(String(v)), String(v)); });
