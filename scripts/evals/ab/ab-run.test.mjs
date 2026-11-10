import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { cacheKey, readCache, writeCache, scoreText, runArm, compare, fmtTable } from "./ab-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const cases = [{ id: "c1", prompt: "p1", check: { must: ["ยังไม่ได้ตรวจ"], must_not: ["ผ่านแล้ว"] } }];

test("คีย์แคชเปลี่ยนเมื่อชุดเคส รอบ หรือ model เปลี่ยน", () => {
  const base = { cases, runs: 3, model: "sonnet", pluginPath: "plugins/x" };
  const k = cacheKey(base);
  assert.equal(k, cacheKey({ ...base }));
  assert.notEqual(k, cacheKey({ ...base, runs: 5 }));
  assert.notEqual(k, cacheKey({ ...base, model: "haiku" }));
  assert.notEqual(k, cacheKey({ ...base, cases: [{ ...cases[0], prompt: "แก้" }] }));
});

test("แคช: miss แล้ว hit เมื่อ sha เดิม และ stale เมื่อ ref ขยับ", () => {
  const dir = mkdtempSync(join(tmpdir(), "ab-cache-"));
  assert.equal(readCache(dir, "k1", "aaa").status, "miss");
  writeCache(dir, "k1", { sha: "aaa", cases: [] });
  assert.equal(readCache(dir, "k1", "aaa").status, "hit");
  const stale = readCache(dir, "k1", "bbb");
  assert.equal(stale.status, "stale");
  assert.equal(stale.cachedSha, "aaa");
});

test("scoreText: must ครบและไม่มี must_not จึงผ่าน · เคสไม่มีเกณฑ์ error", () => {
  assert.equal(scoreText("ยังไม่ได้ตรวจ", cases[0].check).passed, true);
  const bad = scoreText("ยังไม่ได้ตรวจ แต่ผ่านแล้ว", cases[0].check);
  assert.equal(bad.passed, false);
  assert.deepEqual(bad.failed, ["มี ผ่านแล้ว"]);
  assert.throws(() => scoreText("x", {}), /ไม่มี must/);
});

test("runArm + compare: เรียก run ตามจำนวนรอบ และคิด delta ถูก", () => {
  let calls = 0;
  const good = () => { calls++; return { text: "ยังไม่ได้ตรวจ", costUsd: 0.1 }; };
  let n = 0;
  const flaky = () => ({ text: n++ % 2 ? "ยังไม่ได้ตรวจ" : "ผ่านแล้ว", costUsd: 0.1 });
  const next = runArm({ cases, runs: 4, run: good });
  const base = runArm({ cases, runs: 4, run: flaky });
  assert.equal(calls, 4);
  const [row] = compare(base, next);
  assert.equal(row.next, 1);
  assert.equal(row.baseline, 0.5);
  assert.equal(row.delta, 0.5);
  assert.match(fmtTable([row]), /\| c1 \| 0\.50 \| 1\.00 \| \+0\.50 \|/);
});

test("runArm หยุดและตั้ง partial เมื่อชนเพดานเงิน", () => {
  const r = runArm({ cases, runs: 10, run: () => ({ text: "ยังไม่ได้ตรวจ", costUsd: 1 }), maxCostUsd: 2.5 });
  assert.equal(r.partial, true);
  assert.equal(r.cases[0].rows.length, 3);
});

test("--help ออก 0 และไม่เรียก model", () => {
  const r = spawnSync(process.execPath, [join(HERE, "ab-run.mjs"), "--help"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /--baseline-ref/);
});
