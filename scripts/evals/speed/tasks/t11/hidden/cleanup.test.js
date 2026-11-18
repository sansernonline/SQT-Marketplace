import { test } from "node:test"; import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync, symlinkSync, existsSync } from "node:fs";
import { join, resolve } from "node:path"; import { tmpdir } from "node:os"; import { spawnSync } from "node:child_process";
// งานเสี่ยง ลบแล้วกู้ไม่ได้: ตรวจว่าลบเฉพาะที่ควร และไม่ลบอะไรเมื่อสั่งผิด
const SCRIPT = resolve("cleanup.mjs");
const DAY = 86400000;
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "t11-")), d = join(root, "logs"), out = join(root, "outside");
  mkdirSync(join(d, "app", "keep"), { recursive: true }); mkdirSync(join(d, "keep")); mkdirSync(out);
  const mk = (p, ageDays) => { writeFileSync(p, "x"); const t = new Date(Date.now() - ageDays * DAY); utimesSync(p, t, t); return p; };
  const f = {
    old: mk(join(d, "a.log"), 40), oldSpace: mk(join(d, "app", "b c.log"), 31), new: mk(join(d, "new.log"), 5),
    edge: mk(join(d, "edge.log"), 29.5), notLog: mk(join(d, "a.log.gz"), 60), logTxt: mk(join(d, "x.logs"), 60),
    keep1: mk(join(d, "keep", "k.log"), 90), keep2: mk(join(d, "app", "keep", "k.log"), 90), outside: mk(join(out, "o.log"), 90),
  };
  symlinkSync(f.outside, join(d, "link.log")); symlinkSync(out, join(d, "linkdir"));
  return { d, f };
}
const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
test("มี cleanup.mjs", () => assert.ok(existsSync(SCRIPT)));
test("ลบเฉพาะ .log ที่เก่ากว่า 30 วัน", () => {
  const { d, f } = fixture(); const r = run("--dir", d, "--days", "30");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!existsSync(f.old) && !existsSync(f.oldSpace), "ต้องลบไฟล์เก่า");
  for (const k of ["new", "edge", "notLog", "logTxt", "keep1", "keep2", "outside"]) assert.ok(existsSync(f[k]), `ห้ามลบ ${k}`);
  assert.ok(existsSync(join(d, "link.log")), "ห้ามลบ symlink");
  assert.match(r.stdout.trim().split("\n").pop(), /^deleted 2$/);
});
test("dry-run ไม่ลบอะไร และบอกจำนวน", () => {
  const { d, f } = fixture(); const r = run("--dir", d, "--days", "30", "--dry-run");
  assert.equal(r.status, 0, r.stderr);
  for (const p of Object.values(f)) assert.ok(existsSync(p));
  const lines = r.stdout.trim().split("\n");
  assert.match(lines.pop(), /^would delete 2$/);
  assert.equal(lines.filter((l) => l.trim()).length, 2);
});
for (const [name, args] of [["ไม่มี --days", ["--dir"]], ["days = 0", ["--dir", null, "--days", "0"]], ["days ไม่ใช่ตัวเลข", ["--dir", null, "--days", "abc"]], ["days ติดลบ", ["--dir", null, "--days", "-5"]], ["ไม่มี --dir", ["--days", "30"]]]) {
  test(`สั่งผิด (${name}) ไม่ลบและ exit ไม่ใช่ 0`, () => {
    const { d, f } = fixture(); const r = run(...args.map((x) => (x === null ? d : x === "--dir" && args.length === 1 ? x : x)).concat(args.length === 1 ? [d] : []));
    assert.notEqual(r.status, 0);
    for (const p of Object.values(f)) assert.ok(existsSync(p), "ห้ามลบเมื่อสั่งผิด");
  });
}
