// node --test doctor.test.mjs · สร้างเครื่องจำลองในโฟลเดอร์ชั่วคราว ไม่แตะ ~/.claude จริง
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, rmSync, utimesSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runDoctor, formatDoctor, CHECKS } from "./doctor.mjs";

function fake() {
  const t = mkdtempSync(join(tmpdir(), "doc-"));
  const home = join(t, "home"), project = join(t, "proj"), plug = join(t, "plug");
  for (const d of [join(home, ".claude", "superuser", "quota"), join(home, ".claude", "plugins"), project, join(plug, ".claude-plugin"), join(plug, "hooks")]) mkdirSync(d, { recursive: true });
  writeFileSync(join(plug, ".claude-plugin", "plugin.json"), JSON.stringify({ version: "9.9.9" }));
  writeFileSync(join(plug, "hooks", "h.mjs"), "export const x = 1;\n");
  writeFileSync(join(plug, "hooks", "hooks.json"), JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/h.mjs"' }] }] } }));
  return { t, home, project, pluginRoot: plug };
}
const by = (r, name) => r.rows.find((x) => x.name === name);
const installed = (f, version) => writeFileSync(join(f.home, ".claude", "plugins", "installed_plugins.json"), JSON.stringify({ plugins: { "superuser@m": [{ version }] } }));

test("เครื่องสมบูรณ์: ไม่มีข้อล้ม", () => {
  const f = fake();
  installed(f, "9.9.9");
  const r = runDoctor(f);
  assert.equal(r.failed, false);
  assert.equal(by(r, "plugin superuser").status, "ok");
  assert.equal(by(r, "hook").status, "ok");
  rmSync(f.t, { recursive: true, force: true });
});

test("ไม่หยุดที่ข้อแรกที่พัง: config เสียกับ hook เสียพร้อมกัน ยังได้ครบทุกแถว", () => {
  const f = fake();
  mkdirSync(join(f.project, ".claude", "superuser"), { recursive: true });
  writeFileSync(join(f.project, ".claude", "superuser", "config.json"), "{ broken");
  writeFileSync(join(f.pluginRoot, "hooks", "h.mjs"), "export const = ;\n");
  const r = runDoctor(f);
  assert.equal(r.rows.length, CHECKS.length);
  assert.equal(by(r, "config โปรเจกต์").status, "fail");
  assert.equal(by(r, "hook").status, "fail");
  assert.equal(r.failed, true);
  rmSync(f.t, { recursive: true, force: true });
});

test("plugin เก่ากว่าต้นฉบับ: เตือนพร้อมคำสั่งอัปเดต", () => {
  const f = fake();
  installed(f, "1.0.0");
  const r = by(runDoctor(f), "plugin superuser");
  assert.equal(r.status, "warn");
  assert.match(r.fix, /plugin update/);
  rmSync(f.t, { recursive: true, force: true });
});

test("โควตา: ไฟล์เก่าเกิน 1 ชม. เตือน · accounts ไม่ใช่รายการล้ม", () => {
  const f = fake();
  const dir = join(f.home, ".claude", "superuser");
  writeFileSync(join(dir, "accounts.json"), JSON.stringify({ accounts: [{ name: ".claude" }] }));
  writeFileSync(join(dir, "quota", ".claude.json"), "{}");
  const old = new Date(Date.now() - 5 * 3600 * 1000);
  utimesSync(join(dir, "quota", ".claude.json"), old, old);
  assert.equal(by(runDoctor(f), "ไฟล์โควตา").status, "warn");
  writeFileSync(join(dir, "accounts.json"), JSON.stringify({ accounts: {} }));
  assert.equal(by(runDoctor(f), "ไฟล์โควตา").status, "fail");
  rmSync(f.t, { recursive: true, force: true });
});

test("อ่านอย่างเดียว: รันแล้วไฟล์ในเครื่องจำลองไม่เปลี่ยน และมีขั้นถัดไปข้อเดียว", () => {
  const f = fake();
  const snap = () => JSON.stringify([f.home, f.project, f.pluginRoot].map((d) => readdirSync(d, { recursive: true }).sort()));
  const before = snap();
  const out = formatDoctor(runDoctor(f));
  assert.equal(snap(), before);
  assert.equal(out.split("ขั้นถัดไป:").length, 2);
  assert.ok(out.startsWith("| ข้อ |"));
  rmSync(f.t, { recursive: true, force: true });
});

test("doctor.mjs ไม่มีคำสั่งเขียนไฟล์", () => {
  const src = readFileSync(new URL("./doctor.mjs", import.meta.url), "utf8");
  assert.ok(!/writeFileSync|mkdirSync|copyFileSync|rmSync|unlinkSync/.test(src));
});
