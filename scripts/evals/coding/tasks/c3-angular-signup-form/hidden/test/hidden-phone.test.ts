import "@angular/compiler";
import { test } from "node:test";
import assert from "node:assert/strict";
import { SignupForm } from "../src/signup-form";

function filled(phone: string): SignupForm {
  const f = new SignupForm();
  f.form.get("name")!.setValue("Somchai");
  f.form.get("email")!.setValue("somchai@example.com");
  f.form.get("password")!.setValue("secret123");
  f.form.get("phone")!.setValue(phone);
  return f;
}

const valid: Array<[string, string]> = [
  ["0812345678", "0812345678"],
  ["0612345678", "0612345678"],
  ["0912345678", "0912345678"],
  ["081-234-5678", "0812345678"],
  ["081 234 5678", "0812345678"],
  ["+66812345678", "0812345678"],
  ["+66 81 234 5678", "0812345678"],
  ["+66-81-234-5678", "0812345678"],
];

const invalid = ["0712345678", "0212345678", "081234567", "08123456789", "08l2345678", "abc", "+6681234567", "+66712345678"];

for (const [input] of valid) {
  test(`เบอร์ถูก: ${input}`, () => {
    const f = filled(input);
    assert.equal(f.form.get("phone")!.errors, null);
    assert.equal(f.valid, true);
  });
}

for (const input of invalid) {
  test(`เบอร์ผิด: ${input}`, () => {
    const f = filled(input);
    assert.ok(f.form.get("phone")!.errors?.["thaiMobile"], "ต้องมี error thaiMobile");
    assert.equal(f.valid, false);
  });
}

test("ไม่กรอกเบอร์ได้ error required ไม่ใช่ thaiMobile", () => {
  const f = filled("");
  const errors = f.form.get("phone")!.errors;
  assert.ok(errors?.["required"]);
  assert.equal(errors?.["thaiMobile"], undefined);
  assert.equal(f.valid, false);
});

for (const [input, expected] of valid) {
  test(`payload แปลงเบอร์ ${input} เป็น ${expected}`, () => {
    const p = filled(input).toPayload();
    assert.equal(p.phone, expected);
  });
}

test("payload ยังมีช่องเดิมครบ", () => {
  const p = filled("081-234-5678").toPayload();
  assert.deepEqual(p, { name: "Somchai", email: "somchai@example.com", password: "secret123", phone: "0812345678" });
});
