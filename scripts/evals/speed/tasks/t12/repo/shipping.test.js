import { test } from "node:test"; import assert from "node:assert/strict";
import { shippingFee } from "./shipping.js";
test("0.5 กก. คิด 40", () => assert.equal(shippingFee(0.5), 40));
test("1 กก. คิด 40", () => assert.equal(shippingFee(1), 40));
test("2 กก. คิด 55", () => assert.equal(shippingFee(2), 55));
test("1.2 กก. ปัดขึ้นเป็น 2 กก. คิด 55", () => assert.equal(shippingFee(1.2), 55));
