#!/usr/bin/env node
// A/B ของ plugin: baseline (git ref หรือไม่มี plugin) เทียบ working tree ปัจจุบัน ผ่าน `claude -p --plugin-dir`
// baseline เก็บแคชไว้ รันใหม่เฉพาะเมื่อ ref ชี้ไป commit อื่น หรือชุดเคส/รอบ/model เปลี่ยน (แนวจาก fusion run-ab-test.sh ดู 2026-11-10)
// เรียก model จริง มีค่าใช้จ่าย · ใช้ --dry-run ดูแผนก่อน
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { cacheKey, readCache, writeCache, runArm, compare, fmtTable } from "./ab-lib.mjs";
import { activeCopies, collisionMessage } from "./installed-collision.mjs";

const HELP = `ใช้: node scripts/evals/ab/ab-run.mjs --cases <cases.json> --plugin <ชื่อ plugin> [ตัวเลือก]

cases.json = [{ "id": "...", "prompt": "...", "check": { "must": ["regex"], "must_not": ["regex"] } }]
คะแนนมาจาก regex เท่านั้น (ไม่ใช้ LLM grader) · ผ่านเมื่อ must ตรงครบและ must_not ไม่ตรงเลย

ตัวเลือก
  --baseline-ref <ref>   git ref ของ baseline (ค่าเริ่ม HEAD) · ใช้ plugin ใน ref นั้น
  --no-plugin            baseline = รอบไม่มี plugin เลย (แทน --baseline-ref)
  --runs <n>             รอบต่อเคสต่อแขน (ค่าเริ่ม 3)
  --model <ชื่อ>         model ของ claude -p (ค่าเริ่ม sonnet)
  --max-cost-usd <n>     เพดานค่าใช้จ่ายต่อแขน (ค่าเริ่ม 5) · ชนแล้วผลเป็น partial
  --cache-dir <โฟลเดอร์> แคช baseline (ค่าเริ่ม _to_delete/ab-cache)
  --refresh              ทิ้งแคช รัน baseline ใหม่
  --out <ไฟล์.json>      เขียนผลเต็ม
  --allow-installed      ข้ามด่านตรวจ plugin ที่ติดตั้งอยู่ (ใช้เมื่อยืนยันแล้วว่าไม่ถูกโหลด)
  --dry-run              พิมพ์แผนและสถานะแคช ไม่เรียก model
  -h, --help             ข้อความนี้

exit: 0 เสร็จ · 1 ผิดพลาด · 2 ชนเพดานเงิน (partial) หรือ plugin ติดตั้งชนกัน`;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const argv = process.argv.slice(2);
if (argv.includes("-h") || argv.includes("--help")) { console.log(HELP); process.exit(0); }
const opt = (f, d) => { const i = argv.indexOf(f); return i < 0 ? d : argv[i + 1]; };
const has = (f) => argv.includes(f);
const die = (m, code = 1) => { console.error(m); process.exit(code); };

const casesPath = opt("--cases"), plugin = opt("--plugin");
if (!casesPath || !plugin) die(`ต้องมี --cases และ --plugin\n\n${HELP}`);
const pluginRel = `plugins/${plugin}`;
if (!existsSync(join(ROOT, pluginRel, ".claude-plugin", "plugin.json"))) die(`ไม่เจอ ${pluginRel}`);
const cases = JSON.parse(readFileSync(casesPath, "utf8"));
const runs = Number(opt("--runs", 3)), model = opt("--model", "sonnet");
const maxCost = Number(opt("--max-cost-usd", 5));
const cacheDir = resolve(opt("--cache-dir", join(ROOT, "_to_delete", "ab-cache")));
const noPlugin = has("--no-plugin"), ref = opt("--baseline-ref", "HEAD");

const git = (...a) => spawnSync("git", a, { cwd: ROOT, encoding: "utf8" });
const sha = noPlugin ? "no-plugin" : git("rev-parse", `${ref}^{commit}`).stdout.trim();
if (!sha) die(`git ไม่รู้จัก ref ${ref}`);
const key = cacheKey({ cases, runs, model, pluginPath: noPlugin ? "-" : pluginRel });
const cache = has("--refresh") ? { status: "miss" } : readCache(cacheDir, key, sha);

const collisions = activeCopies(plugin);
if (collisions.length && !has("--allow-installed") && !has("--dry-run")) die(collisionMessage(plugin, collisions), 2);
if (collisions.length) console.log(`คำเตือน: ${collisionMessage(plugin, collisions)}`);

console.log(`เคส ${cases.length} × ${runs} รอบ × 2 แขน · model ${model} · เพดาน $${maxCost}/แขน`);
console.log(`baseline: ${noPlugin ? "ไม่มี plugin" : `${ref} (${sha.slice(0, 10)})`} · แคช: ${cache.status}${cache.status === "stale" ? ` (แคชเป็น ${String(cache.cachedSha).slice(0, 10)} · ref ขยับ รันใหม่)` : ""}`);
if (has("--dry-run")) { console.log(`dry-run: ไม่เรียก model · แคช ${join(cacheDir, `baseline-${key}.json`)}`); process.exit(0); }

// ตัวรัน 1 ครั้ง: โฟลเดอร์ทำงานว่าง · ไม่โหลดตั้งค่าผู้ใช้ จึงไม่มี plugin ที่ติดตั้งปนเข้ามา
const work = mkdtempSync(join(tmpdir(), "ab-work-"));
const runner = (pluginDir) => (prompt) => {
  const a = ["-p", prompt, "--output-format", "json", "--model", model, "--setting-sources", "project"];
  if (pluginDir) a.push("--plugin-dir", pluginDir);
  const r = spawnSync("claude", a, { cwd: work, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`claude -p ล้ม (exit ${r.status}) ${String(r.stderr).slice(0, 300)}`);
  const j = JSON.parse(r.stdout);
  return { text: j.result ?? "", costUsd: j.total_cost_usd ?? 0 };
};

let baseline = cache.data, tmpTree = null;
try {
  if (!baseline) {
    let dir = null;
    if (!noPlugin) {   // แตก ref ออกเป็นโฟลเดอร์ชั่วคราวของเราเอง ลบตอนจบ
      tmpTree = join(mkdtempSync(join(tmpdir(), "ab-base-")), "tree");
      const w = git("worktree", "add", "--detach", tmpTree, sha);
      if (w.status !== 0) die(`worktree ล้ม: ${w.stderr}`);
      dir = join(tmpTree, pluginRel);
    }
    console.log("รัน baseline ...");
    baseline = { sha, ref: noPlugin ? null : ref, ...runArm({ cases, runs, run: runner(dir), maxCostUsd: maxCost }) };
    if (!baseline.partial) writeCache(cacheDir, key, baseline);   // ผลไม่ครบไม่เก็บแคช
  } else console.log("ใช้ baseline จากแคช");
  console.log("รัน working tree ...");
  const next = runArm({ cases, runs, run: runner(join(ROOT, pluginRel)), maxCostUsd: maxCost });
  const table = compare(baseline, next);
  console.log("\n" + fmtTable(table));
  console.log(`\nค่าใช้จ่าย: baseline $${baseline.costUsd.toFixed(2)}${cache.status === "hit" ? " (แคช)" : ""} · ใหม่ $${next.costUsd.toFixed(2)}`);
  if (opt("--out")) writeFileSync(opt("--out"), JSON.stringify({ baseline, next, table }, null, 2));
  process.exitCode = baseline.partial || next.partial ? 2 : 0;
} finally {
  if (tmpTree) git("worktree", "remove", tmpTree);
  rmSync(work, { recursive: true, force: true });
}
