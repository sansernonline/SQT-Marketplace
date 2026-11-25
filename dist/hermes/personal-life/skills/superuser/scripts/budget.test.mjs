process.env.TZ = "Asia/Bangkok";   // เวลาท้องถิ่น UTC+7 ให้ตรงตัวอย่างใน spec
import { test } from "node:test";
import assert from "node:assert/strict";
const { statusLines, statusJson, weekStats, fmtDur } = await import("./budget.mjs");

const now = new Date("2026-11-25T08:02:00Z");
const q = { at: "2026-11-25T08:02:00Z", context: 42,
  five_hour: { used: 1, reset: "2026-11-25T12:30:00Z" },
  week: { used: 65, reset: "2026-11-28T20:00:00Z" } };

test("ตัวอย่างใน spec ตรงทุกบรรทัด", () => {
  const l = statusLines(q, now);
  assert.equal(l[0], "โควตา · อ่านจาก Claude Code 15:02");
  assert.equal(l[1], "รอบ 5 ชม.    ใช้ 1%  · เหลือ 99% · รีเซ็ต 19:30 (อีก 4 ชม. 28 น.)");
  assert.equal(l[2], "รายสัปดาห์   ใช้ 65% · เหลือ 35% · รีเซ็ต อา. 29 พ.ย. 03:00 (อีก 3 วัน 12 ชม.)");
  assert.match(l[3], /^ความเร็ว     เวลาผ่านไป 50% ของสัปดาห์ ใช้ไป 65% → เร็วกว่าเฉลี่ย 1\.3 เท่า · ถ้าเร็วเท่านี้จะหมดราว ศ\. 27 พ\.ย\. 12:1\d ก่อนรีเซ็ต ~39 ชม\.$/);
  assert.equal(l[4], "งบที่เหลือ    ~10% ต่อวันจนรีเซ็ต (ที่ผ่านมาเฉลี่ย 19%/วัน)");
});

test("pace น้อยกว่า 1 → ช้ากว่าเฉลี่ย ไม่มีบรรทัดหมดก่อนรีเซ็ต", () => {
  const slow = { ...q, week: { used: 20, reset: "2026-11-28T20:00:00Z" } };
  const l = statusLines(slow, now);
  assert.match(l[3], /→ ช้ากว่าเฉลี่ย$/);
  assert.equal(weekStats(slow.week, now).runout, null);
  assert.equal(statusJson(slow, now).week.runout, null);
});

test("บรรทัดงานนี้: ไม่รู้ขนาดถัง / รู้ขนาดถัง / เกินที่เหลือ", () => {
  assert.match(statusLines(q, now, { k: 2100, hours: 3, workers: 7 }).at(-1), /^งานนี้ {8}คาด ~2,100k ≈ \?% ของสัปดาห์ \(ยังไม่รู้ขนาดถัง\) · ~3 ชม\. · ลูกทีม 7 \(รอยืนยัน\)$/);
  const ok = statusLines(q, now, { k: 2100, capK: 21000 });
  assert.match(ok.at(-1), /≈ 10% ของสัปดาห์/);
  assert.doesNotMatch(ok[3], /งานนี้ทำให้หมด/);
  const over = statusLines(q, now, { k: 9000, capK: 21000 });   // 43% > เหลือ 35%
  assert.match(over[3], /· งานนี้ทำให้หมดก่อนรีเซ็ต$/);
});

test("status --json", () => {
  const j = statusJson(q, now);
  assert.deepEqual(j.five, { used: 1, left: 99, reset: "2026-11-25T12:30:00Z" });
  assert.equal(j.week.pace, 1.3);
  assert.equal(j.week.daily_left, 10);
  assert.equal(j.week.daily_avg, 18.6);
  assert.equal(j.week.left, 35);
  assert.match(j.week.runout, /^2026-11-27T05:1\d/);
  assert.equal(j.context, 42);
  assert.equal(j.at, q.at);
});

test("ถังที่เลยเวลารีเซ็ตแล้วไม่แสดง · fmtDur", () => {
  const old = { ...q, five_hour: { used: 5, reset: "2026-11-25T01:00:00Z" } };
  assert.equal(statusLines(old, now).filter((x) => x.startsWith("รอบ 5 ชม.")).length, 0);
  assert.equal(statusJson(old, now).five, null);
  assert.equal(fmtDur(0.25), "15 น.");
});
