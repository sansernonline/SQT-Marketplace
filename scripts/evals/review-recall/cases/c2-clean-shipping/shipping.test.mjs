import { test } from "node:test";
import assert from "node:assert/strict";
import { shippingFee } from "./shipping.mjs";

test("ยอดน้อยคิดค่าส่งตามพื้นที่", () => {
  assert.equal(shippingFee(300, "bangkok"), 40);
  assert.equal(shippingFee(300, "remote"), 90);
});

test("เกณฑ์ใหม่ส่งฟรีตั้งแต่ 1,000 บาท (ล้มถ้าเกณฑ์กลับเป็น 1,500)", () => {
  assert.equal(shippingFee(999, "central"), 60);
  assert.equal(shippingFee(1000, "central"), 0);
  assert.equal(shippingFee(1499, "bangkok"), 0);
});

test("พื้นที่ที่ไม่รู้จักต้องแจ้ง error", () => {
  assert.throws(() => shippingFee(500, "mars"), /ไม่รู้จักพื้นที่/);
});
