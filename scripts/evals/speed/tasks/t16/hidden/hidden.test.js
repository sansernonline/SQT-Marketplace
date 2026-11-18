import { test } from "node:test"; import assert from "node:assert/strict";
import { tokenize } from "../src/tokenize.js"; import { formatTracking } from "../src/tracking.js";
import { provinceOfPostcode } from "../src/postcode.js";
const W = ["ตา", "ตาก", "ลม", "ตากลม", "กรุงเทพ", "เชียงใหม่"];
test("tokenize เลือกคำยาวสุด", () => assert.deepEqual(tokenize("ตากลม", W), ["ตากลม"]));
test("tokenize ยาวสุดไม่ใช่คำแรกในรายการ", () => assert.deepEqual(tokenize("ตากลม", ["ตา", "ตาก", "ลม"]), ["ตาก", "ลม"]));
test("tokenize ตัวที่ไม่รู้จักรวมเป็น 1 token", () => assert.deepEqual(tokenize("กรุงเทพxyzลม", W), ["กรุงเทพ", "xyz", "ลม"]));
test("tokenize ช่องว่างเป็นตัวแบ่ง", () => assert.deepEqual(tokenize("ลม  ลม\tตา\nตา", W), ["ลม", "ลม", "ตา", "ตา"]));
test("tokenize ว่าง", () => { assert.deepEqual(tokenize("", W), []); assert.deepEqual(tokenize("  \n", W), []); });
test("tracking kerry", () => assert.equal(formatTracking("KEX1234567890"), "KEX-1234567890"));
test("tracking ตัดช่องว่าง ขีด และพิมพ์เล็ก", () => assert.equal(formatTracking(" kex-123 456 7890 "), "KEX-1234567890"));
test("tracking flash", () => assert.equal(formatTracking("th1234567890a"), "TH-1234567890-A"));
test("tracking ไปรษณีย์ไทย", () => assert.equal(formatTracking("EB 123456789 TH"), "EB-123456789-TH"));
test("tracking ไปรษณีย์ไทยที่ขึ้นต้น TH", () => assert.equal(formatTracking("TH123456789TH"), "TH-123456789-TH"));
test("tracking ความยาวผิดคืน null", () => { assert.equal(formatTracking("KEX123456789"), null); assert.equal(formatTracking("EB1234567890TH"), null); assert.equal(formatTracking(123), null); });
test("postcode หัวท้ายช่วง", () => {
  assert.equal(provinceOfPostcode("10000"), "กรุงเทพมหานคร"); assert.equal(provinceOfPostcode("10990"), "กรุงเทพมหานคร");
  assert.equal(provinceOfPostcode("11160"), "นนทบุรี"); assert.equal(provinceOfPostcode("83000"), "ภูเก็ต");
});
test("postcode นอกช่วงคืน null", () => { assert.equal(provinceOfPostcode("11161"), null); assert.equal(provinceOfPostcode("10991"), null); assert.equal(provinceOfPostcode("00100"), null); });
test("postcode รูปแบบผิดโยน Error", () => {
  for (const bad of ["1020", "102000", "10a00", "", " 10200", 10200, null]) assert.throws(() => provinceOfPostcode(bad), Error);
});
