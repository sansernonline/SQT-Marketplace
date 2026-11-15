// --self-test: คู่ไฟล์ที่รู้ผลแน่ · รันได้ทั้ง `node i18n-pair-check.test.mjs` และ `node i18n-pair-check.mjs --self-test`
import assert from "node:assert/strict";
import { compare, placeholders, flatten, duplicateKeys } from "./i18n-pair-check.mjs";

const CASES = {
  "คู่ที่ตรงกันผ่าน"() {
    assert.deepEqual(compare({ cart: { items: "มี {count} ชิ้น" } }, { cart: { items: "{count} items" } }), []);
  },
  "{count} หายข้างเดียวต้องจับได้"() {
    const p = compare({ cart: { items: "มี {count} ชิ้น" } }, { cart: { items: "Some items" } });
    assert.equal(p.length, 1);
    assert.match(p[0], /cart\.items.*\{count\}/);
  },
  "จำนวนตัวแทนค่าไม่เท่ากัน"() {
    assert.equal(compare({ a: "{n} และ {n}" }, { a: "{n}" }).length, 1);
  },
  "ชื่อตัวแทนค่าต่างกัน"() {
    assert.equal(compare({ a: "สวัสดี {name}" }, { a: "Hello {user}" }).length, 1);
  },
  "คีย์ขาดและเกิน แบน object ซ้อน"() {
    const p = compare({ a: { b: "x", c: "y" } }, { a: { b: "x", d: "z" } });
    assert.deepEqual(p.map((s) => s.split(":")[0]).sort(), ["a.c", "a.d"]);
  },
  "แบน array เป็นเลขลำดับ"() {
    assert.deepEqual(Object.keys(flatten({ list: ["a", "b"] })), ["list.0", "list.1"]);
  },
  "รู้จักตัวแทนค่าหลายแบบ"() {
    assert.deepEqual(placeholders("{{user}} {count} %s %1$d :name"), ["%1$d", "%s", ":name", "{count}", "{user}"]);
  },
  "ICU plural นับเป็นชื่อเดียว"() {
    assert.deepEqual(placeholders("{count, plural, one {# item} other {# items}}"), ["{count}"]);
  },
  "50%discount ไม่นับเป็น %d"() {
    assert.deepEqual(placeholders("ลด 50%discount วันนี้"), []);
    assert.deepEqual(placeholders("%d items · %s."), ["%d", "%s"]);
  },
  "คีย์ซ้ำใน object เดียวกันจับได้ ต่าง object ไม่นับ"() {
    assert.deepEqual(duplicateKeys('{"a": {"x": "1", "x": "2"}, "b": {"x": "3"}, "list": [{"k": 1}, {"k": 2, "k": 3}], "s": "\\"x\\": y"}'), ["a.x", "list.1.k"]);
    assert.deepEqual(duplicateKeys('{"a": "1", "b": "2"}'), []);
  },
  "เวลาและ URL ไม่นับเป็น :name"() {
    assert.deepEqual(placeholders("เวลา 10:30 ที่ https://x.co/a หมายเหตุ: ดูด้านล่าง"), []);
  },
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  console.log(`self-test ${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("i18n-pair-check.test.mjs")) selfTest();
