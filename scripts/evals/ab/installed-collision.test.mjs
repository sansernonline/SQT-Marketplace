import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { installedCopies, activeCopies, collisionMessage } from "./installed-collision.mjs";

function fakeHome(plugins, enabled) {
  const home = mkdtempSync(join(tmpdir(), "collide-"));
  mkdirSync(join(home, "plugins"));
  writeFileSync(join(home, "plugins", "installed_plugins.json"), JSON.stringify({ version: 2, plugins }));
  writeFileSync(join(home, "settings.json"), JSON.stringify({ enabledPlugins: enabled }));
  return home;
}

test("เจอสำเนาที่ติดตั้งตามชื่อ plugin และไม่จับชื่อที่ใกล้เคียง", () => {
  const home = fakeHome({ "superuser@m": [{ version: "3.0.0" }], "superuser-x@m": [{ version: "1.0.0" }] }, { "superuser@m": true });
  const found = installedCopies("superuser", home);
  assert.equal(found.length, 1);
  assert.equal(found[0].version, "3.0.0");
});

test("สำเนาที่ปิดไว้ไม่นับเป็นชน", () => {
  const home = fakeHome({ "superuser@m": [{ version: "3.0.0" }] }, { "superuser@m": false });
  assert.equal(activeCopies("superuser", home).length, 0);
});

test("ไม่มีไฟล์ติดตั้ง ไม่ error และข้อความว่าง", () => {
  const home = mkdtempSync(join(tmpdir(), "collide-empty-"));
  assert.deepEqual(installedCopies("superuser", home), []);
  assert.equal(collisionMessage("superuser", []), "");
});

test("ข้อความบอกคำสั่งปิดและ flag ยืนยัน", () => {
  const msg = collisionMessage("superuser", [{ id: "superuser@m", version: "3.0.0", enabled: true }]);
  assert.match(msg, /claude plugin disable superuser@m/);
  assert.match(msg, /--allow-installed/);
});
