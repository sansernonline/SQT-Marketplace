#!/usr/bin/env node
// ตั้งโปรเจกต์ให้ agent ทำงานจนจบได้: .gitignore · สิทธิ์ merge ใน .claude/settings.local.json · กฎประจำตัวใน ~/.claude/CLAUDE.md
//   node setup.mjs [--project <dir>] [--gitignore] [--permissions] [--global-rules]   ไม่ใส่ส่วนไหน = ทำครบ 3 ส่วน
//   node setup.mjs --check [--project <dir>]   ตรวจอย่างเดียว · ขาดอะไร → exit 1
//   node setup.mjs --self-test
// เขียนซ้ำได้ไม่พัง · สำรองไฟล์เดิมไว้ใน <project>/_to_delete/ ก่อนเขียนทับทุกครั้ง · JSON ที่อ่านไม่ได้ไม่แตะ
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir, tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ALLOW = ["Bash(gh pr merge:*)", "Bash(git branch -d:*)", "Bash(git push origin --delete:*)", "Bash(git worktree remove:*)"];
export const CORE_MARK = "<!-- sqt-core-rules -->";
const lf = (s) => s.replace(/\r\n/g, "\n");
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "-");   // 20261026-142305

// โปรเจกต์ที่เป็น plugin หรือ marketplace เอง: .claude-plugin คือตัวสินค้า ห้าม ignore
export const isPluginRepo = (project) =>
  ["marketplace.json", "plugin.json"].some((f) => existsSync(join(project, ".claude-plugin", f)));

export function wantedIgnores(project) {
  return isPluginRepo(project) ? [".claude/"] : [".claude/", ".claude-plugin/"];
}

function backup(project, file, name) {
  const dir = join(project, "_to_delete");
  mkdirSync(dir, { recursive: true });
  const to = join(dir, `${name}-backup-${stamp()}`);
  copyFileSync(file, to);
  return to;
}

function tracked(project, path) {
  try { return execFileSync("git", ["-C", project, "ls-files", path], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n").filter(Boolean); }
  catch { return []; }   // ไม่ใช่ git repo
}

// 1. .gitignore
export function gitignore(project, write) {
  const file = join(project, ".gitignore");
  const text = existsSync(file) ? lf(readFileSync(file, "utf8")) : "";
  const have = new Set(text.split("\n").map((l) => l.trim()));
  const missing = wantedIgnores(project).filter((p) => !have.has(p) && !have.has(p.replace(/\/$/, "")));
  const out = { missing, notes: [] };
  if (isPluginRepo(project)) out.notes.push(".claude-plugin/ เป็นตัว plugin หรือ marketplace ของ repo นี้ จึงไม่ ignore");
  for (const p of wantedIgnores(project)) {
    const t = tracked(project, p);
    if (t.length) out.notes.push(`${p} มี ${t.length} ไฟล์ที่ commit แล้ว .gitignore ไม่เอาออกให้ · ถ้าจะเอาออกจาก git (ไฟล์ในเครื่องยังอยู่): git rm -r --cached "${p}"`);
  }
  if (write && missing.length) {
    const add = (text && !text.endsWith("\n") ? "\n" : "") + "\n# Claude Code: ตั้งค่าส่วนตัวและไฟล์ทำงานของ agent (workspace-setup)\n" + missing.join("\n") + "\n";
    writeFileSync(file, text + add);
  }
  return out;
}

// 2. สิทธิ์ให้ agent merge และลบ branch ที่ merge แล้วเองได้
export function permissions(project, write) {
  const file = join(project, ".claude", "settings.local.json");
  let data = {};
  if (existsSync(file)) {
    try { data = JSON.parse(readFileSync(file, "utf8")); }
    catch { return { missing: ALLOW, error: `${file} ไม่ใช่ JSON ที่อ่านได้ — ไม่แตะ แก้ไฟล์ก่อน` }; }
  }
  const allow = data.permissions?.allow ?? [];
  const missing = ALLOW.filter((r) => !allow.includes(r));
  if (write && missing.length) {
    if (existsSync(file)) backup(project, file, "settings.local.json");
    data.permissions = { ...(data.permissions ?? {}), allow: [...allow, ...missing] };
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  }
  return { missing };
}

// 3. กฎประจำตัวของเจ้าของ · ต้นฉบับคือ hooks/core-rules.md ของ plugin superuser (ตัดหัวสำเนาออก)
export function rulesSource(hooksDir = join(HERE, "..", "..", "..", "hooks")) {
  return lf(readFileSync(join(hooksDir, "core-rules.md"), "utf8")).replace(/^<!-- สำเนาที่ [^\n]*-->\n/, "");
}

export function globalRules(project, write, { configDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), src = rulesSource() } = {}) {
  const file = join(configDir, "CLAUDE.md");
  const have = existsSync(file) ? lf(readFileSync(file, "utf8")) : null;
  if (have === src) return { missing: [] };
  const why = have === null ? "ยังไม่มีไฟล์" : have.includes(CORE_MARK) ? "เป็นกฎรุ่นเก่า" : "เป็นไฟล์ที่ไม่ได้มาจาก superuser";
  if (write) {
    const saved = have === null ? null : backup(project, file, "claude-md");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(file, src);
    return { missing: [file], why, saved };
  }
  return { missing: [file], why };
}

function selfTest() {
  const t = mkdtempSync(join(tmpdir(), "cps-"));
  const proj = join(t, "proj"), plug = join(t, "plug"), cfg = join(t, "cfg"), hooks = join(t, "hooks");
  for (const d of [proj, plug, cfg, hooks, join(plug, ".claude-plugin")]) mkdirSync(d, { recursive: true });
  writeFileSync(join(plug, ".claude-plugin", "marketplace.json"), "{}");
  writeFileSync(join(proj, ".gitignore"), "node_modules\n");
  writeFileSync(join(hooks, "core-rules.md"), "<!-- สำเนาที่ x -->\n" + CORE_MARK + "\nกฎ\n");
  const ok = [];
  // .gitignore: โปรเจกต์ทั่วไปได้ 2 บรรทัด · รันซ้ำไม่เพิ่ม · repo ที่เป็น plugin ไม่ ignore .claude-plugin
  gitignore(proj, true); gitignore(proj, true);
  const gi = readFileSync(join(proj, ".gitignore"), "utf8");
  ok.push(["gitignore", gi.startsWith("node_modules\n") && (gi.match(/^\.claude\/$/gm) ?? []).length === 1 && gi.includes(".claude-plugin/")]);
  gitignore(plug, true);
  const pg = readFileSync(join(plug, ".gitignore"), "utf8");
  ok.push(["plugin repo", pg.includes(".claude/") && !pg.includes(".claude-plugin/")]);
  // สิทธิ์: เก็บกฎเดิม · ไม่ซ้ำ · มีสำเนาสำรอง · JSON พังไม่แตะ
  mkdirSync(join(proj, ".claude"));
  writeFileSync(join(proj, ".claude", "settings.local.json"), JSON.stringify({ permissions: { allow: ["Bash(ls:*)"] }, x: 1 }));
  permissions(proj, true); permissions(proj, true);
  const s = JSON.parse(readFileSync(join(proj, ".claude", "settings.local.json"), "utf8"));
  ok.push(["permissions", s.x === 1 && s.permissions.allow[0] === "Bash(ls:*)" && s.permissions.allow.length === 1 + ALLOW.length && permissions(proj, false).missing.length === 0]);
  mkdirSync(join(plug, ".claude"), { recursive: true });
  writeFileSync(join(plug, ".claude", "settings.local.json"), "{ broken");
  const bad = permissions(plug, true);
  ok.push(["broken json", Boolean(bad.error) && readFileSync(join(plug, ".claude", "settings.local.json"), "utf8") === "{ broken"]);
  // กฎประจำตัว: ตัดหัวสำเนา · สำรองไฟล์เดิม · รันซ้ำแล้วไม่ขาด
  writeFileSync(join(cfg, "CLAUDE.md"), "กฎของฉันเอง\n");
  const src = rulesSource(hooks);
  const g = globalRules(proj, true, { configDir: cfg, src });
  ok.push(["global rules", src.startsWith(CORE_MARK) && readFileSync(join(cfg, "CLAUDE.md"), "utf8") === src && readFileSync(g.saved, "utf8") === "กฎของฉันเอง\n" && globalRules(proj, false, { configDir: cfg, src }).missing.length === 0]);
  rmSync(t, { recursive: true, force: true });
  for (const [name, pass] of ok) console.log(`  ${pass ? "ผ่าน" : "ล้ม"} ${name}`);
  const n = ok.filter(([, p]) => p).length;
  console.log(`\nself-test ${n}/${ok.length} ผ่าน`);
  process.exit(n === ok.length ? 0 : 1);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/setup.mjs")) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  const at = args.indexOf("--project");
  const project = resolve(at >= 0 ? args[at + 1] : process.cwd());
  const check = args.includes("--check");
  const picked = ["--gitignore", "--permissions", "--global-rules"].filter((f) => args.includes(f));
  const run = (f) => picked.length === 0 || picked.includes(f);
  let gaps = 0;
  if (run("--gitignore")) {
    const r = gitignore(project, !check);
    gaps += r.missing.length;
    console.log(`.gitignore: ${r.missing.length ? (check ? "ขาด " : "เพิ่ม ") + r.missing.join(" · ") : "ครบแล้ว"}`);
    for (const n of r.notes) console.log(`  หมายเหตุ: ${n}`);
  }
  if (run("--permissions")) {
    const r = permissions(project, !check);
    if (r.error) { console.log(`สิทธิ์: ${r.error}`); gaps++; }
    else { gaps += r.missing.length; console.log(`สิทธิ์ (.claude/settings.local.json): ${r.missing.length ? (check ? "ขาด " : "เพิ่ม ") + r.missing.join(" · ") : "ครบแล้ว"}`); }
  }
  if (run("--global-rules")) {
    const r = globalRules(project, !check);
    gaps += r.missing.length;
    console.log(`กฎประจำตัว (~/.claude/CLAUDE.md): ${r.missing.length ? `${check ? "ต้องติดตั้ง" : "ติดตั้งแล้ว"} (${r.why})${r.saved ? ` · ไฟล์เดิมสำรองไว้ที่ ${r.saved}` : ""}` : "เป็นรุ่นล่าสุดแล้ว"}`);
  }
  if (!check && run("--permissions")) console.log("\nกฎสิทธิ์และกฎประจำตัวมีผลกับ session ใหม่ · เปิด Claude Code ใหม่หรือเริ่ม session ใหม่");
  process.exit(check && gaps ? 1 : 0);
}
