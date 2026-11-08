// รัน: node --test scripts/evals/models/summary.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { modelStats, recommendation, minRunsToQualify, uncountedModels } from "./summary.mjs";

const rows = (model, scores, cost) => scores.map((score) => ({ model, score, cost }));

test("ผ่านคือคะแนนรอบนั้น ≥ 8 และคิด $ ต่องานที่ผ่านจาก $ เฉลี่ย ÷ อัตราผ่าน", () => {
  const [s] = modelStats(rows("a", [10, 8, 7, 3], 0.1));

  assert.equal(s.passes, 2);
  assert.ok(Math.abs(s.costPerPass - 0.2) < 1e-9);
});

test("ผ่านศูนย์รอบ ไม่มี $ ต่องานที่ผ่าน", () => {
  assert.equal(modelStats(rows("a", [1, 2], 0.1))[0].costPerPass, null);
});

test("ขอบล่าง Wilson ของ 6/6 ถึง 0.6 แต่ 5/5 ยังไม่ถึง", () => {
  assert.ok(modelStats(rows("a", Array(6).fill(10), 1))[0].lower >= 0.6);
  assert.ok(modelStats(rows("a", Array(5).fill(10), 1))[0].lower < 0.6);
  assert.equal(minRunsToQualify(), 6);
});

test("ทุก model ผ่านหมด → แยกไม่ออก (ชนเพดาน)", () => {
  const stats = modelStats([...rows("a", [10, 10, 10], 0.1), ...rows("b", [9, 10, 10], 0.5)]);

  assert.match(recommendation(stats), /แยกไม่ออก \(ชนเพดาน\)/);
});

test("เลือกตัวถูกสุดที่ขอบล่างถึงเกณฑ์ ข้ามตัวถูกที่ตกบ่อย", () => {
  const stats = modelStats([...rows("cheap", [10, 2, 3, 2, 10, 1], 0.1), ...rows("mid", Array(6).fill(10), 0.5), ...rows("top", [10, 10, 10, 10, 10, 2], 2)]);

  assert.match(recommendation(stats), /^mid /);
});

test("ไม่มีตัวถึงเกณฑ์ → บอกว่าเลือกไม่ได้", () => {
  const stats = modelStats([...rows("a", [10, 2, 3], 0.1), ...rows("b", [1, 1, 1], 0.5)]);

  assert.match(recommendation(stats), /ยังเลือกไม่ได้/);
});

test("model ที่ทุกรอบถูกตัด ยังขึ้นในรายการพร้อมจำนวนรอบที่ไม่นับ", () => {
  const all = [...rows("a", [10, 10], 0.1), ...rows("b", [0, 0, 0], 0.5)];
  const valid = all.filter((r) => r.model === "a");

  assert.deepEqual(uncountedModels(all, valid), [{ model: "b", cut: 3 }]);
});
