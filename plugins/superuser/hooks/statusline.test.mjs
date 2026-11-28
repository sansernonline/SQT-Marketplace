process.env.TZ = "Asia/Bangkok";   // เวลาท้องถิ่น UTC+7 ให้ตรงตัวอย่าง
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const { render, snapshot, runningWorkers, writeLog, teamDirFor, localDay, LOG_FILE } = await import("./statusline.mjs");

const now = Date.parse("2026-11-28T16:50:00Z");             // 23:50 เวลาไทย
const sec = (iso) => Date.parse(iso) / 1000;
const input = {
  session_id: "0a0d4022-e3b6", model: { id: "claude-opus-5-5", display_name: "Opus 5.5" }, effort: { level: "high" },
  workspace: { current_dir: "C:/w/Quanton", project_dir: "C:/w/Quanton" },
  context_window: { used_percentage: 34.4 },
  rate_limits: { five_hour: { used_percentage: 7, resets_at: sec("2026-11-28T20:50:00Z") }, seven_day: { used_percentage: 96, resets_at: sec("2026-11-28T20:00:00Z") } },
  cost: { total_cost_usd: 1.25, total_duration_ms: 1800000, total_lines_added: 40, total_lines_removed: 3 },
};
const plain = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
const run = (id, extra = {}) => ({ ts: "2026-11-28T23:38:00+07:00", session: "0a0d4022", event: "run", tool_use_id: id, spawned_id: `s${id}`, async: true, description: `งาน ${id}`, role: "worker", ...extra });

test("บรรทัด 1 ครบทุกช่อง และเวลารีเซ็ตเป็นเวลาไทย", () => {
  const out = plain(render(input, { now, branch: { name: "main", dirty: true } }));
  assert.equal(out, "Opus 5.5 (high) · Quanton · main* · บริบท 34% · 5 ชม. 7% รีเซ็ต 03:50 · สัปดาห์ 96% รีเซ็ต 03:00");
});

test("โควตา ≥ 90% เป็นสีแดง · 70–89% เหลือง", () => {
  assert.match(render(input, { now }), /\x1b\[31mสัปดาห์ 96%/);
  const mid = { ...input, rate_limits: { five_hour: { used_percentage: 75 } } };
  assert.match(render(mid, { now }), /\x1b\[33m5 ชม\. 75%\x1b\[0m/);
});

test("ไม่มีข้อมูล = ไม่ล้ม · เวลารีเซ็ตที่ผ่านไปแล้วไม่แสดง", () => {
  assert.equal(render({}, { now }), "");
  const old = { rate_limits: { five_hour: { used_percentage: 5, resets_at: sec("2026-11-28T10:00:00Z") } } };
  assert.equal(plain(render(old, { now })), "5 ชม. 5%");
});

test("งานเบื้องหลัง: ตัดงานที่ส่งกลับแล้ว แชตอื่น และงานเก่าเกิน 6 ชม.", () => {
  const runs = [run("a"), run("b"), { event: "result", tool_use_id: "b" }, run("c", { session: "ffffffff" }),
    run("d", { ts: "2026-11-28T10:00:00+07:00" }), run("e", { async: false }), run("f"), { event: "result", spawned_id: "sf" }];
  const w = runningWorkers(runs, "0a0d4022", now);
  assert.deepEqual(w.map((x) => x.name), ["งาน a"]);
  assert.equal(w[0].minutes, 12);
  assert.equal(plain(render(input, { now, workers: w }).split("\n")[1]), "เบื้องหลัง 1 งาน: งาน a (12 นาที)");
});

test("เกิน 3 งานแสดง +N", () => {
  const w = ["a", "b", "c", "d", "e"].map((n) => ({ name: n, minutes: 70 }));
  assert.equal(render(input, { now, workers: w }).split("\n")[1],"เบื้องหลัง 5 งาน: a (1 ชม. 10 นาที) · b (1 ชม. 10 นาที) · c (1 ชม. 10 นาที) +2");
});

test("snapshot มีช่องคงที่ให้ dashboard", () => {
  const s = snapshot(input, { now, workers: [], branch: { name: "main", dirty: false } });
  assert.deepEqual(Object.keys(s), ["ts", "session", "project", "branch", "model", "effort", "context_pct", "five_hour", "week", "cost_usd", "duration_min", "lines_added", "lines_removed", "workers"]);
  assert.equal(s.session, "0a0d4022");
  assert.deepEqual(s.week, { used: 96, reset: "2026-11-28T20:00:00.000Z" });
  assert.equal(s.duration_min, 30);
  assert.equal(snapshot({}, { now }).five_hour, null);
});

test("log จดไม่เกินนาทีละครั้งต่อแชต และปิดได้ด้วยโมดูล log", () => {
  const team = mkdtempSync(join(tmpdir(), "sl-test-"));
  try {
    const s = snapshot(input, { now });
    assert.equal(writeLog(team, s, now), true);
    assert.equal(writeLog(team, s, now + 30000), false);
    assert.equal(writeLog(team, { ...s, session: "other" }, now + 30000), true);
    assert.equal(writeLog(team, s, now + 61000), true);
    const lines = readFileSync(join(team, "log", localDay(now), LOG_FILE), "utf8").trim().split("\n");
    assert.equal(lines.length, 3);
    assert.equal(JSON.parse(lines[0]).context_pct, 34.4);
    writeFileSync(join(team, "config.json"), JSON.stringify({ modules: { log: false } }));
    assert.equal(writeLog(team, s, now + 999999), false);
  } finally { rmSync(team, { recursive: true, force: true }); }
});

test("โฟลเดอร์ทีม: มี .claude/superuser ใช้ของโปรเจกต์ · ไม่มีใช้ของกลาง", () => {
  const home = mkdtempSync(join(tmpdir(), "sl-home-")), proj = join(home, "p");
  try {
    mkdirSync(join(proj, ".claude", "superuser"), { recursive: true });
    assert.equal(teamDirFor(proj, home), join(proj, ".claude", "superuser"));
    assert.equal(teamDirFor(join(home, "none"), home), join(home, ".claude", "superuser"));
    assert.equal(teamDirFor(home, home), join(home, ".claude", "superuser"));
    assert.ok(!existsSync(join(home, ".claude")));
  } finally { rmSync(home, { recursive: true, force: true }); }
});
