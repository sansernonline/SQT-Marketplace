import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { parseCsv, loadLabels, metrics, calibrate, assignSplit, report } from "./calibrate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const mk = (n, human, judge, split = "test") => Array.from({ length: n }, (_, i) => ({ id: `${human}${judge}${split}${i}`, human, judge, split, category: "" }));

test("metrics: คิด TPR TNR accuracy ตามมือ", () => {
  // คนว่าผ่าน 10 (judge ผ่าน 8) · คนว่าไม่ผ่าน 10 (judge ไม่ผ่าน 9)
  const rows = [...mk(8, "pass", "pass"), ...mk(2, "pass", "fail"), ...mk(9, "fail", "fail"), ...mk(1, "fail", "pass")];
  const m = metrics(rows);
  assert.equal(m.tpr, 0.8);
  assert.equal(m.tnr, 0.9);
  assert.equal(m.accuracy, 17 / 20);
});

test("parseCsv: ค่าในเครื่องหมายคำพูดที่มีจุลภาคและบรรทัดว่างท้ายไฟล์", () => {
  const r = parseCsv('id,human,judge,note\r\na,pass,pass,"มี, จุลภาค"\r\nb,fail,pass,\r\n\r\n');
  assert.equal(r.length, 2);
  assert.equal(r[0].note, "มี, จุลภาค");
  assert.equal(r[1].judge, "pass");
});

test("loadLabels: ป้ายผิดรูปแบบบอกแถวที่ผิด", () => {
  assert.throws(() => loadLabels(JSON.stringify([{ id: "x", human: "maybe", judge: "pass" }]), true), /human ต้องเป็น pass หรือ fail/);
});

test("calibrate: ป้ายไม่พอ 20 ต่อฝั่ง = ไม่ถึงเกณฑ์แม้ accuracy 100%", () => {
  const r = calibrate([...mk(5, "pass", "pass"), ...mk(5, "fail", "fail")]);
  assert.equal(r.enough, false);
  assert.equal(r.reached, false);
  assert.match(r.problems.join("\n"), /ป้ายผ่านมี 5 ข้อ/);
});

test("calibrate: ใช้ split test ตัดสิน และรายงานข้อที่ไม่ตรง", () => {
  const rows = [
    ...mk(20, "pass", "pass", "train"), ...mk(20, "fail", "fail", "train"),
    ...mk(9, "pass", "pass", "test"), ...mk(1, "pass", "fail", "test"),
    ...mk(10, "fail", "fail", "test"),
  ];
  const r = calibrate(rows, { bar: 0.85, minPerClass: 20 });
  assert.equal(r.gateOn, "test");
  assert.equal(r.bySplit.test.tpr, 0.9);
  assert.equal(r.reached, true);
  assert.equal(r.mismatches.length, 1);
  assert.equal(r.mismatches[0].kind, "judge เข้มเกิน (FN)");
  assert.match(report(r), /ถึงเกณฑ์/);
});

test("calibrate: judge หลวมเกิน (TNR ต่ำ) ล้มแม้ TPR สูง", () => {
  const rows = [...mk(20, "pass", "pass"), ...mk(14, "fail", "fail"), ...mk(6, "fail", "pass")];
  const r = calibrate(rows);
  assert.equal(r.all.tpr, 1);
  assert.equal(r.all.tnr, 0.7);
  assert.equal(r.reached, false);
});

test("assignSplit: ผลเดิมทุกครั้งและครบ 3 split ในชุดใหญ่", () => {
  assert.equal(assignSplit("case-1"), assignSplit("case-1"));
  const seen = new Set(Array.from({ length: 200 }, (_, i) => assignSplit(`c${i}`)));
  assert.deepEqual([...seen].sort(), ["dev", "test", "train"]);
});

test("CLI: --help ออก 0 · ไฟล์ที่ถึงเกณฑ์ออก 0 · ไม่ถึงออก 2", () => {
  assert.equal(spawnSync(process.execPath, [join(HERE, "calibrate.mjs"), "--help"]).status, 0);
  const dir = mkdtempSync(join(tmpdir(), "judge-"));
  const good = [...mk(20, "pass", "pass"), ...mk(20, "fail", "fail")];
  const bad = [...mk(20, "pass", "pass"), ...mk(20, "fail", "pass")];
  writeFileSync(join(dir, "good.json"), JSON.stringify(good));
  writeFileSync(join(dir, "bad.json"), JSON.stringify(bad));
  assert.equal(spawnSync(process.execPath, [join(HERE, "calibrate.mjs"), join(dir, "good.json")]).status, 0);
  assert.equal(spawnSync(process.execPath, [join(HERE, "calibrate.mjs"), join(dir, "bad.json")]).status, 2);
});
