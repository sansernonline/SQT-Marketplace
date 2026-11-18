import { test } from "node:test"; import assert from "node:assert/strict";
import { shippingFee } from "../shipping.js";
test("1 กก. = 40", () => assert.equal(shippingFee(1), 40));
test("2 กก. = 55", () => assert.equal(shippingFee(2), 55));
test("1.01 กก. = 55", () => assert.equal(shippingFee(1.01), 55));
test("1.5 กก. = 55", () => assert.equal(shippingFee(1.5), 55));
test("2.1 กก. = 70", () => assert.equal(shippingFee(2.1), 70));
test("5 กก. = 100", () => assert.equal(shippingFee(5), 100));
test("0.3 กก. = 40", () => assert.equal(shippingFee(0.3), 40));
