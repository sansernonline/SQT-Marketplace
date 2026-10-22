import "@angular/compiler";
import { test } from "node:test";
import assert from "node:assert/strict";
import { SignupForm } from "../src/signup-form";

test("ฟอร์มว่างยังไม่ผ่าน", () => {
  const f = new SignupForm();
  assert.equal(f.valid, false);
});

test("อีเมลผิดรูปแบบไม่ผ่าน", () => {
  const f = new SignupForm();
  f.form.get("email")!.setValue("not-an-email");
  assert.ok(f.form.get("email")!.errors?.["email"]);
});

test("payload ตัดช่องว่างหน้าหลังชื่อและอีเมล", () => {
  const f = new SignupForm();
  f.form.get("name")!.setValue("  Somchai ");
  f.form.get("email")!.setValue(" somchai@example.com ");
  f.form.get("password")!.setValue("secret123");
  const p = f.toPayload();
  assert.equal(p.name, "Somchai");
  assert.equal(p.email, "somchai@example.com");
});
