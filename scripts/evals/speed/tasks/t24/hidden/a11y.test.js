import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// domain ใหม่ (frontend accessibility) · ตรวจด้วย regex บน HTML ตามข้อพื้นฐานของ WCAG
const html = existsSync("signup.html") ? readFileSync("signup.html", "utf8") : "";
const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => m[0]);
const attr = (tag, a) => tag.match(new RegExp(`\\b${a}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"))?.slice(2).find((x) => x != null) ?? null;
const labels = new Set(tags("label").map((t) => attr(t, "for")).filter(Boolean));
const visible = tags("input").filter((t) => !/type\s*=\s*["']?(hidden|submit)/i.test(t));
test("html มี lang", () => assert.ok(attr(tags("html")[0] ?? "", "lang")));
test("ทุกรูปมี alt ไม่ว่าง", () => { const imgs = tags("img"); assert.ok(imgs.length >= 2); for (const t of imgs) assert.ok((attr(t, "alt") ?? "").trim(), t); });
test("ทุกช่องกรอกมีป้ายผูกกัน", () => { for (const t of visible) { const id = attr(t, "id"); assert.ok((id && labels.has(id)) || (attr(t, "aria-label") ?? "").trim() || /aria-labelledby/i.test(t), t); } });
test("ปุ่มส่งเป็น button หรือ input submit ไม่ใช่ div onclick", () => { assert.ok(!/<div[^>]*onclick/i.test(html)); assert.ok(/<button\b[^>]*>|<input\b[^>]*type\s*=\s*["']?submit/i.test(html)); });
test("ชื่อช่องครบและไม่เปลี่ยน", () => assert.deepEqual(tags("input").map((t) => attr(t, "name")).filter(Boolean).sort(), ["accept_terms", "captcha", "email", "full_name", "password", "ref"]));
test("มีหัวเรื่องหลัก h1", () => assert.ok(/<h1\b/i.test(html)));
