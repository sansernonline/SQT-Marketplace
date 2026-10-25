#!/usr/bin/env node
// ด่านหน้าตา (PostToolUse · Write/Edit/MultiEdit): แก้ไฟล์ UI แล้วรัน slop_scan.py ของ skill no-ai-look กับไฟล์นั้นทันที
// P0/P1 → ส่งกลับให้ agent แก้ (decision block · ไฟล์เขียนไปแล้ว ไม่ได้ย้อน) · P2 → แจ้งเป็นบริบท · P3 ไม่แจ้ง
// ผลเดิมของไฟล์เดิมใน session เดียวกัน → เงียบ ไม่เตือนซ้ำทุกครั้งที่แก้
// ปิด: "ui_scan": false ใน .claude/superuser/config.json ของโฟลเดอร์งาน · ไม่มี Python → เงียบ ไม่ล้ม
// node ui-scan-hook.mjs --self-test
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCANNER = join(HERE, "..", "skills", "no-ai-look", "scripts", "slop_scan.py");
const UI_EXT = new Set([".html", ".htm", ".css", ".scss", ".less", ".jsx", ".tsx", ".vue", ".svelte", ".astro"]);
const SKIP_PATH = /(^|[\\/])(_to_delete|\.claude|node_modules|dist|build|\.next|out|vendor|coverage|evals)([\\/]|$)|\.min\./;
const PYTHONS = [["python", []], ["py", ["-3"]], ["python3", []]];
const MAX_SHOWN = 8;
const STATE_DIR = join(tmpdir(), "superuser-ui-scan");

function readJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

export function moduleOn(cwd) {
  if (!cwd) return true;
  const cfg = readJson(join(cwd, ".claude", "superuser", "config.json"), null);
  return cfg?.modules?.ui_scan !== false;
}

export function targetOf(input) {
  if (!["Write", "Edit", "MultiEdit"].includes(input.tool_name)) return null;
  const file = input.tool_input?.file_path;
  if (!file || !UI_EXT.has(extname(file).toLowerCase()) || SKIP_PATH.test(file) || !existsSync(file)) return null;
  return file;
}

// คืนรายการผล หรือ null เมื่อหา Python ไม่เจอหรือสคริปต์พัง
export function scan(file) {
  for (const [cmd, pre] of PYTHONS) {
    const r = spawnSync(cmd, [...pre, "-I", SCANNER, file, "--json", "--min", "P2"], { encoding: "utf8", timeout: 8000, windowsHide: true, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    if (r.error || ![0, 1].includes(r.status)) continue;
    try { const found = JSON.parse(r.stdout); if (Array.isArray(found)) return found; } catch { /* ลองตัวถัดไป */ }
  }
  return null;
}

// ผลเหมือนรอบก่อนของไฟล์นี้ใน session นี้ → true (ไม่ต้องเตือนซ้ำ) · จดผลรอบนี้ไว้
export function seenBefore(session, file, found, dir = STATE_DIR) {
  const sig = found.map((f) => `${f.rule}@${f.line}`).sort().join(",");
  const key = createHash("sha1").update(`${session}|${file}`).digest("hex").slice(0, 16);
  const path = join(dir, `${key}.txt`);
  let old = null;
  try { old = readFileSync(path, "utf8"); } catch { /* รอบแรก */ }
  try { mkdirSync(dir, { recursive: true }); writeFileSync(path, sig); } catch { /* จดไม่ได้ก็แค่เตือนซ้ำ */ }
  return old === sig;
}

export function message(file, found) {
  const lines = found.slice(0, MAX_SHOWN).map((f) => `- ${f.level} บรรทัด ${f.line} \`${f.rule}\` — ${f.hint}`);
  const more = found.length > MAX_SHOWN ? `\n- …อีก ${found.length - MAX_SHOWN} ข้อ (รัน slop_scan.py กับไฟล์นี้เพื่อดูทั้งหมด)` : "";
  return `ด่านหน้าตา (no-ai-look · slop_scan): ${file}\n${lines.join("\n")}${more}\n`
    + "แก้ตามคำแนะนำ หรือถ้าตั้งใจ ใส่ `/* slop-ok: <rule> <เหตุผล> */` (CSS) หรือ `<!-- slop-ok: <rule> <เหตุผล> -->` (HTML) ในไฟล์เดียวกัน · ผลนี้เป็นเหตุให้ดู ไม่ใช่คำสั่งให้เปลี่ยน · ยังต้องดูภาพจริงด้วยตา";
}

export function decide(input, scanFn = scan, stateDir = STATE_DIR) {
  if (!moduleOn(input.cwd)) return null;
  const file = targetOf(input);
  if (!file) return null;
  const found = (scanFn(file) ?? []).filter((f) => !f.kept);
  if (!found.length || seenBefore(input.session_id ?? "", file, found, stateDir)) return null;
  const text = message(file, found);
  if (found.some((f) => f.level === "P0" || f.level === "P1")) return { decision: "block", reason: text };
  return { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: text } };
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "ui-scan-test-"));
  const state = join(dir, "state");
  const css = join(dir, "bad.css");
  writeFileSync(css, ".t{background:linear-gradient(90deg,#7c3aed,#22d3ee);-webkit-background-clip:text;color:transparent}\np{text-align:justify}");
  const ok = join(dir, "good.css");
  writeFileSync(ok, "body{color:#1a1a1a;background-color:#fff;line-height:1.6}");
  const ev = (file, tool = "Write") => ({ session_id: "s1", cwd: dir, tool_name: tool, tool_input: { file_path: file } });
  const checks = [];
  const t = (name, cond) => checks.push([name, !!cond]);

  const real = scan(css);
  if (real === null) console.log("ข้าม: หา Python ไม่เจอ · ทดสอบด้วยผลปลอมแทน");
  const fake = () => [{ rule: "justified", line: 2, level: "P1", hint: "h", kept: null }, { rule: "gradient-text", line: 1, level: "P2", hint: "h", kept: null }];
  const scanFn = real === null ? fake : scan;
  if (real !== null) t("สแกนจริงเจอ justified และ gradient-text", ["justified", "gradient-text"].every((r) => real.some((f) => f.rule === r)));

  const first = decide(ev(css), scanFn, state);
  t("P1 → block", first?.decision === "block" && first.reason.includes("justified"));
  t("ผลเดิมรอบสอง → เงียบ", decide(ev(css, "Edit"), scanFn, state) === null);
  t("ไฟล์ดี → เงียบ", decide(ev(ok), real === null ? () => [] : scan, state) === null);
  t("P2 อย่างเดียว → additionalContext", decide({ ...ev(css), session_id: "s2" }, () => [{ rule: "neon-glow", line: 1, level: "P2", hint: "h", kept: null }], state)?.hookSpecificOutput?.additionalContext?.includes("neon-glow"));
  t("ข้อที่ slop-ok → เงียบ", decide({ ...ev(css), session_id: "s3" }, () => [{ rule: "neon-glow", line: 1, level: "P2", hint: "h", kept: "ตั้งใจ" }], state) === null);
  t("ไม่ใช่ไฟล์ UI → เงียบ", targetOf(ev(join(dir, "a.py"))) === null);
  t("_to_delete → เงียบ", targetOf(ev(join(dir, "_to_delete", "x.css"))) === null);
  t("Bash → เงียบ", targetOf({ tool_name: "Bash", tool_input: { command: "ls" } }) === null);
  mkdirSync(join(dir, ".claude", "superuser"), { recursive: true });
  writeFileSync(join(dir, ".claude", "superuser", "config.json"), JSON.stringify({ modules: { ui_scan: false } }));
  t("ปิดโมดูล → เงียบ", decide({ ...ev(css), session_id: "s4" }, scanFn, state) === null);

  for (const [name, pass] of checks) console.log(`${pass ? "ผ่าน" : "ล้ม "} ${name}`);
  const failed = checks.filter(([, p]) => !p).length;
  console.log(`self-test ${checks.length - failed}/${checks.length}`);
  return failed ? 1 : 0;
}

function main() {
  if (process.argv.includes("--self-test")) process.exit(selfTest());
  let input;
  try { input = JSON.parse(readFileSync(0, "utf8")); } catch { return; }
  const out = decide(input);
  if (out) process.stdout.write(JSON.stringify(out));
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/ui-scan-hook.mjs")) main();
