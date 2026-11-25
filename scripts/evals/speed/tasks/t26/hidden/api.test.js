import { test } from "node:test"; import assert from "node:assert/strict";
// งานใหม่ (fresh) · 2 ชิ้นอิสระ ทำขนานได้ · นาฬิกาปลอม จึงไม่ขึ้นกับเวลาเครื่อง
const { retry } = await import(new URL("../src/retry.mjs", import.meta.url)).catch(() => ({}));
const { TokenBucket } = await import(new URL("../src/bucket.mjs", import.meta.url)).catch(() => ({}));
test("retry สำเร็จครั้งที่ 3 รอ 100 แล้ว 200", async () => {
  const waits = []; let n = 0;
  const v = await retry(async (a) => { n++; if (a < 3) throw new Error("x"); return "ok"; }, { tries: 3, baseMs: 100, sleep: async (ms) => waits.push(ms) });
  assert.equal(v, "ok"); assert.equal(n, 3); assert.deepEqual(waits, [100, 200]);
});
test("retry ครบแล้วโยน error ตัวสุดท้าย ไม่รอหลังครั้งสุดท้าย", async () => {
  const waits = [];
  await assert.rejects(retry(async (a) => { throw new Error(`e${a}`); }, { tries: 2, baseMs: 50, sleep: async (ms) => waits.push(ms) }), /e2/);
  assert.deepEqual(waits, [50]);
});
test("retryable false โยนทันที", async () => {
  let n = 0; const e = Object.assign(new Error("bad"), { retryable: false });
  await assert.rejects(retry(async () => { n++; throw e; }, { tries: 5, sleep: async () => {} }), /bad/); assert.equal(n, 1);
});
test("bucket เริ่มเต็ม · ไม่พอคืน false ไม่หัก", () => {
  let t = 0; const b = new TokenBucket({ capacity: 3, refillPerSec: 1, now: () => t });
  assert.equal(b.take(2), true); assert.equal(b.take(2), false); assert.equal(b.take(1), true); assert.equal(b.take(1), false);
});
test("bucket เติมตามเวลาไม่เกินความจุ", () => {
  let t = 0; const b = new TokenBucket({ capacity: 2, refillPerSec: 2, now: () => t });
  b.take(2); t = 500; assert.equal(b.take(1), true); assert.equal(b.take(1), false); t = 10_000; assert.equal(b.take(2), true); assert.equal(b.take(1), false);
});
test("bucket ขอเกินความจุ RangeError", () => { const b = new TokenBucket({ capacity: 2, refillPerSec: 1, now: () => 0 }); assert.throws(() => b.take(3), RangeError); });
