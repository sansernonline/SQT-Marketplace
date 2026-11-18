import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// งานเอกสาร: 5 บทจาก 6 ไฟล์ต้นทาง · ฉบับล่าสุดชนะ · เรื่องที่ฉบับเก่ายังไม่ถูกแก้ยังใช้ฉบับเก่า · ห้ามแต่งเลข
const FILES = ["01-welcome", "02-work-rules", "03-it-setup", "04-benefits", "05-faq"];
const SRC = ["hr-policy.md", "hr-announcement.md", "it-guide.md", "it-setup.md", "benefits.md", "onboarding-plan.md"];
const read = (f) => (existsSync(`handbook/${f}.md`) ? readFileSync(`handbook/${f}.md`, "utf8") : "");
const norm = (s) => s.replace(/(\d),(?=\d)/g, "$1");
const ch = Object.fromEntries(FILES.map((f) => [f, norm(read(f))]));
const has = (f, re) => assert.ok(re.test(ch[f]), `${f} ต้องมี ${re}`);
const lacks = (f, re) => assert.ok(!re.test(ch[f]), `${f} ต้องไม่มี ${re}`);

for (const [i, f] of FILES.entries()) {
  test(`${f} มีหัวข้อบทและเนื้อหา`, () => {
    assert.ok(ch[f].length > 80, "ไฟล์ไม่มีหรือสั้นเกินไป");
    assert.match(ch[f], new RegExp(`^#\\s*บทที่\\s*${i + 1}\\b`, "m"));
  });
}
test("ทุกบทมีบรรทัดที่มาและอ้างไฟล์ต้นทางที่มีจริง", () => {
  for (const f of FILES) {
    const m = /^ที่มา:(.*)$/m.exec(ch[f]);
    assert.ok(m, `${f} ไม่มีบรรทัดที่มา`);
    assert.ok(SRC.some((s) => m[1].includes(s)), `${f} ที่มาไม่ตรงชื่อไฟล์ต้นทาง`);
  }
});

test("บท 1 เวลาและที่นัดวันแรก", () => { has("01-welcome", /09:00/); has("01-welcome", /ล็อบบี้/); has("01-welcome", /4001/); });
test("บท 1 รับเครื่อง 14:00 ตามฉบับไอทีใหม่", () => has("01-welcome", /14:00/));
test("บท 2 เวลาทำงานฉบับใหม่ 09:00-18:00", () => { has("02-work-rules", /09:00/); has("02-work-rules", /18:00/); });
test("บท 2 ไม่มีเวลาทำงานฉบับเก่า", () => { lacks("02-work-rules", /17:30/); lacks("02-work-rules", /08:30/); });
test("บท 2 ลาพักร้อน 8 วัน ไม่ใช่ 6", () => { has("02-work-rules", /พักร้อน[\s\S]{0,30}\b8\b/); lacks("02-work-rules", /พักร้อน[\s\S]{0,30}\b6\b/); });
test("บท 2 ลาป่วย 30 วันและทดลองงาน 119 วัน (ฉบับเดิมยังใช้)", () => { has("02-work-rules", /\b30\b/); has("02-work-rules", /\b119\b/); });
test("บท 3 รหัสผ่าน 12 ตัว เปลี่ยนทุก 90 วัน ไม่ใช่ 10/180", () => {
  has("03-it-setup", /รหัสผ่าน[\s\S]{0,60}\b12\b/); has("03-it-setup", /\b90\b/); lacks("03-it-setup", /\b180\b/); lacks("03-it-setup", /\b10 ตัว/);
});
test("บท 3 บังคับยืนยันตัวตน 2 ชั้น", () => has("03-it-setup", /ยืนยันตัวตน 2 ชั้น/));
test("บท 3 VPN ใช้ WireGuard ไม่ใช่ Cisco", () => { has("03-it-setup", /WireGuard/); lacks("03-it-setup", /Cisco/i); });
test("บท 3 เบอร์ไอที 4100 ไม่ใช่ 2200", () => { has("03-it-setup", /4100/); lacks("03-it-setup", /2200/); });
test("บท 4 ประกันผู้ป่วยนอก 1500 บาท 15 ครั้ง", () => { has("04-benefits", /1500/); has("04-benefits", /\b15 ครั้ง/); });
test("บท 4 ผู้ป่วยใน 100000 ไม่ใช่ 50000", () => { has("04-benefits", /100000/); lacks("04-benefits", /50000/); });
test("บท 4 ค่าอาหาร 60 ไม่ใช่ 50", () => { has("04-benefits", /ค่าอาหาร[\s\S]{0,30}\b60\b/); lacks("04-benefits", /ค่าอาหาร[\s\S]{0,30}\b50\b/); });
test("บท 4 กองทุนสำรองเลี้ยงชีพสมทบ 5", () => has("04-benefits", /กองทุนสำรองเลี้ยงชีพ[\s\S]{0,60}\b5\b/));
test("บท 4 บอกว่าสิทธิ์เริ่มหลังผ่านทดลองงาน", () => has("04-benefits", /ผ่านทดลองงาน/));
test("บท 5 วันเงินเดือนไม่มีข้อมูล ให้ถามฝ่ายบุคคล", () => {
  const sec = ch["05-faq"].split(/^##\s+/m).find((s) => /เงินเดือน/.test(s.split("\n")[0])) ?? "";
  assert.ok(sec, "ไม่มีหัวข้อเงินเดือน"); assert.match(sec, /ไม่มีข้อมูล|ไม่ได้ระบุ|ไม่ระบุ|ไม่มีในเอกสาร/); assert.match(sec, /ฝ่ายบุคคล|HR/);
  assert.ok(!/\d/.test(sec.replace(/\b4001\b/g, "")), "ห้ามมีตัวเลขในคำตอบที่ไม่มีข้อมูล");
});
test("บท 5 ค่าล่วงเวลาไม่มีข้อมูล ให้ถามฝ่ายบุคคล", () => {
  const sec = ch["05-faq"].split(/^##\s+/m).find((s) => /ล่วงเวลา|OT/.test(s.split("\n")[0])) ?? "";
  assert.ok(sec, "ไม่มีหัวข้อค่าล่วงเวลา"); assert.match(sec, /ไม่มีข้อมูล|ไม่ได้ระบุ|ไม่ระบุ|ไม่มีในเอกสาร/); assert.match(sec, /ฝ่ายบุคคล|HR/);
  assert.ok(!/\d/.test(sec.replace(/\b4001\b/g, "")), "ห้ามมีตัวเลขในคำตอบที่ไม่มีข้อมูล");
});
test("ไม่มีเลขที่ไม่ได้มาจากฉบับล่าสุด (แต่งเลข หรือใช้เลขฉบับเก่า)", () => {
  const ALLOWED = new Set(["9", "0", "18", "8", "30", "119", "12", "90", "4100", "4001", "15", "1500", "100000", "60", "14", "2569"]);
  const bad = new Set();
  for (const f of FILES) {
    const text = ch[f].replace(/^ที่มา:.*$/gm, "");
    for (const t of text.match(/\d+(?:\.\d+)?/g) ?? []) { const n = String(Number(t)); if (Number(n) > 5 && !ALLOWED.has(n)) bad.add(`${f}:${t}`); }
  }
  assert.deepEqual([...bad], []);
});
