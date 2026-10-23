import { test } from "node:test";
import assert from "node:assert/strict";
import { shippingFee } from "./shipping.mjs";

test("ยอดน้อยคิดค่าส่งตามพื้นที่", () => {
  assert.equal(shippingFee(300, "bangkok"), 40);
  assert.equal(shippingFee(300, "remote"), 90);
});

test("ยอดถึงเกณฑ์ส่งฟรี", () => {
  assert.equal(shippingFee(2000, "central"), 0);
});

test("พื้นที่ที่ไม่รู้จักต้องแจ้ง error", () => {
  assert.throws(() => shippingFee(500, "mars"), /ไม่รู้จักพื้นที่/);
});
