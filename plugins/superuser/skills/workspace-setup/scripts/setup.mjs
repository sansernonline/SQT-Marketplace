#!/usr/bin/env node
// ตั้งโปรเจกต์ให้ agent ทำงานจนจบได้: .gitignore · สิทธิ์ merge ใน .claude/settings.local.json · กฎประจำตัวใน ~/.claude/CLAUDE.md
//   node setup.mjs [--project <dir>] [--gitignore] [--permissions] [--global-rules]   ไม่ใส่ส่วนไหน = ทำครบ 3 ส่วน
//   --user  เขียนกฎสิทธิ์ลง ~/.claude/settings.json ให้ใช้ได้ทุกโปรเจกต์ แทน .claude/settings.local.json ของโปรเจกต์
//   --git-policy auto|commit|manual  จดว่าโปรเจกต์นี้ให้ agent commit · push · PR · merge เองแค่ไหน ลงหัวข้อ "กติกา" ใน .claude/superuser/CONTEXT.md
//   node setup.mjs --check [--project <dir>]   ตรวจอย่างเดียว · ขาดอะไร → exit 1
//   node setup.mjs --self-test
// เขียนซ้ำได้ไม่พัง · สำรองไฟล์เดิมไว้ใน <project>/_to_delete/ ก่อนเขียนทับทุกครั้ง · JSON ที่อ่านไม่ได้ไม่แตะ
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir, tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ALLOW = ["Bash(git add:*)", "Bash(git commit:*)", "Bash(git push:*)", "Bash(gh pr:*)", "Bash(git branch -d:*)", "Bash(git worktree remove:*)"];
// git push:* กว้างพอจะรวม force push จึงกันไว้ด้วย deny ซึ่งชนะ allow เสมอ
export const DENY = ["Bash(git push --force:*)", "Bash(git push -f:*)", "Bash(git push --force-with-lease:*)"];
const userConfigDir = () => process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
export const CORE_MARK = "<!-- sqt-core-rules -->";
const lf = (s) => s.replace(/\r\n/g, "\n");
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "-");   // 20261026-142305

// โปรเจกต์ที่เป็น plugin หรือ marketplace เอง: .claude-plugin คือตัวสินค้า ห้าม ignore
export const isPluginRepo = (project) =>
  ["marketplace.json", "plugin.json"].some((f) => existsSync(join(project, ".claude-plugin", f)));

export function wantedIgnores(project) {
  // _to_delete/ คือที่วางของชั่วคราวตามกฎประจำตัว ห้ามขึ้น git ทุกโปรเจกต์ (ผู้ใช้สั่ง 2026-10-26)
  return isPluginRepo(project) ? [".claude/", "_to_delete/"] : [".claude/", ".claude-plugin/", "_to_delete/"];
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

function readSettings(file) {
  if (!existsSync(file)) return {};
  try { return JSON.parse(readFileSync(file, "utf8")); } catch { return null; }
}

// 2. สิทธิ์ให้ agent push เปิด PR merge และลบ branch ที่ merge แล้วเองได้
// กฎที่มีอยู่แล้วในไฟล์ระดับผู้ใช้นับว่าครบ ไม่ต้องเพิ่มซ้ำในโปรเจกต์
export function permissions(project, write, { user = false, userFile = join(userConfigDir(), "settings.json") } = {}) {
  const file = user ? userFile : join(project, ".claude", "settings.local.json");
  const data = readSettings(file);
  if (data === null) return { file, missing: ALLOW, error: `${file} ไม่ใช่ JSON ที่อ่านได้ — ไม่แตะ แก้ไฟล์ก่อน` };
  const list = (d, key) => (Array.isArray(d?.permissions?.[key]) ? d.permissions[key] : []);
  const userData = user ? {} : readSettings(userFile);
  const lack = (key, wanted) => wanted.filter((r) => !list(data, key).includes(r) && !list(userData, key).includes(r));
  const add = { allow: lack("allow", ALLOW), deny: lack("deny", DENY) };
  const missing = [...add.allow, ...add.deny];
  if (write && missing.length) {
    if (existsSync(file)) backup(project, file, user ? "user-settings.json" : "settings.local.json");
    data.permissions = { ...(data.permissions ?? {}), allow: [...list(data, "allow"), ...add.allow], deny: [...list(data, "deny"), ...add.deny] };
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  }
  return { file, missing };
}

// 2.1 นโยบาย git ต่อโปรเจกต์ · สิทธิ์ทางเทคนิคมีทุกโปรเจกต์ แต่จะทำเองได้ไหมขึ้นกับบรรทัดนี้
// CLAUDE.md นับหัวข้อ "กติกา" ใน CONTEXT.md เป็นคำอนุญาตของผู้ใช้อยู่แล้ว
export const POLICY_MARK = "- **git อัตโนมัติ:**";
export const POLICIES = {
  auto: "commit ใน branch งาน · push · เปิด PR · merge · ลบ branch ได้เอง หลัง CI ผ่านและผู้ตรวจตัวใหม่ให้ผ่าน · ไม่ commit ลง main ตรง",
  commit: "commit ใน branch งานได้เอง · push · PR · merge ถามก่อนทุกครั้ง",
  manual: "ไม่ commit · push · merge เอง ผู้ใช้ review เอง · ใส่ข้อความ commit ที่แนะนำไว้ในคำตอบ",
};

export function gitPolicy(project, value, write, today = new Date().toISOString().slice(0, 10)) {
  const file = join(project, ".claude", "superuser", "CONTEXT.md");
  const raw = existsSync(file) ? readFileSync(file, "utf8") : "";
  const text = lf(raw);
  const line = text.split("\n").find((l) => l.startsWith(POLICY_MARK));
  if (!write || !value) return { file, current: line ?? null };
  if (!POLICIES[value]) return { file, error: `--git-policy ต้องเป็น ${Object.keys(POLICIES).join(" · ")}` };
  const next = `${POLICY_MARK} ${POLICIES[value]} (ผู้ใช้เลือก \`${value}\` ${today})`;
  let out;
  if (line) out = text.replace(line, next);
  else if (/^## กติกา\s*$/m.test(text)) out = text.replace(/^## กติกา\s*$/m, (h) => `${h}\n${next}`);
  else out = `${text}${text && !text.endsWith("\n") ? "\n" : ""}${text ? "\n" : ""}## กติกา\n${next}\n`;
  if (existsSync(file)) backup(project, file, "context-md");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, raw.includes("\r\n") ? out.replace(/\n/g, "\r\n") : out);   // คงการขึ้นบรรทัดแบบเดิม
  return { file, current: next };
}

// 3. กฎประจำตัวของเจ้าของ · ต้นฉบับคือ hooks/core-rules.md ของ plugin superuser (ตัดหัวสำเนาออก)
export function rulesSource(hooksDir = join(HERE, "..", "..", "..", "hooks")) {
  return lf(readFileSync(join(hooksDir, "core-rules.md"), "utf8")).replace(/^<!-- สำเนาที่ [^\n]*-->\n/, "");
}

export function globalRules(project, write, { configDir = userConfigDir(), src = rulesSource() } = {}) {
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
  ok.push(["gitignore", gi.startsWith("node_modules\n") && (gi.match(/^\.claude\/$/gm) ?? []).length === 1 && gi.includes(".claude-plugin/") && gi.includes("_to_delete/")]);
  gitignore(plug, true);
  const pg = readFileSync(join(plug, ".gitignore"), "utf8");
  ok.push(["plugin repo", pg.includes(".claude/") && pg.includes("_to_delete/") && !pg.includes(".claude-plugin/")]);
  // สิทธิ์: เก็บกฎเดิม · ไม่ซ้ำ · มีสำเนาสำรอง · JSON พังไม่แตะ
  mkdirSync(join(proj, ".claude"));
  writeFileSync(join(proj, ".claude", "settings.local.json"), JSON.stringify({ permissions: { allow: ["Bash(ls:*)"] }, x: 1 }));
  const userFile = join(cfg, "settings.json");   // ไม่ให้ไฟล์จริงของเครื่องมีผลกับผลทดสอบ
  permissions(proj, true, { userFile }); permissions(proj, true, { userFile });
  const s = JSON.parse(readFileSync(join(proj, ".claude", "settings.local.json"), "utf8"));
  ok.push(["permissions", s.x === 1 && s.permissions.allow[0] === "Bash(ls:*)" && s.permissions.allow.length === 1 + ALLOW.length && permissions(proj, false, { userFile }).missing.length === 0]);
  // --user: เก็บค่าเดิมในไฟล์ผู้ใช้ · โปรเจกต์ใหม่ที่ไม่มีไฟล์ของตัวเองนับว่าครบเพราะกฎอยู่ระดับผู้ใช้
  writeFileSync(userFile, JSON.stringify({ theme: "dark" }));
  permissions(proj, true, { user: true, userFile });
  const u = JSON.parse(readFileSync(userFile, "utf8"));
  ok.push(["user permissions", u.theme === "dark" && ALLOW.every((r) => u.permissions.allow.includes(r)) && DENY.every((r) => u.permissions.deny.includes(r)) && permissions(join(t, "fresh"), false, { userFile }).missing.length === 0]);
  mkdirSync(join(plug, ".claude"), { recursive: true });
  writeFileSync(join(plug, ".claude", "settings.local.json"), "{ broken");
  const bad = permissions(plug, true, { userFile });
  ok.push(["broken json", Boolean(bad.error) && readFileSync(join(plug, ".claude", "settings.local.json"), "utf8") === "{ broken"]);
  // กฎประจำตัว: ตัดหัวสำเนา · สำรองไฟล์เดิม · รันซ้ำแล้วไม่ขาด
  writeFileSync(join(cfg, "CLAUDE.md"), "กฎของฉันเอง\n");
  const src = rulesSource(hooks);
  const g = globalRules(proj, true, { configDir: cfg, src });
  ok.push(["global rules", src.startsWith(CORE_MARK) && readFileSync(join(cfg, "CLAUDE.md"), "utf8") === src && readFileSync(g.saved, "utf8") === "กฎของฉันเอง\n" && globalRules(proj, false, { configDir: cfg, src }).missing.length === 0]);
  // นโยบาย git: ยังไม่เลือก → ว่าง · เลือกแล้วเปลี่ยนได้โดยมีบรรทัดเดียว · ไฟล์ที่มีหัวข้อกติกาอยู่แล้วแทรกใต้หัวข้อ
  const before = gitPolicy(proj, null, false).current;
  gitPolicy(proj, "manual", true, "2026-01-01"); gitPolicy(proj, "auto", true, "2026-01-02");
  const ctx = readFileSync(join(proj, ".claude", "superuser", "CONTEXT.md"), "utf8");
  mkdirSync(join(plug, ".claude", "superuser"), { recursive: true });
  writeFileSync(join(plug, ".claude", "superuser", "CONTEXT.md"), "# งาน\n\n## กติกา\n- ข้อเดิม\n");
  gitPolicy(plug, "commit", true, "2026-01-03");
  const ctx2 = readFileSync(join(plug, ".claude", "superuser", "CONTEXT.md"), "utf8");
  ok.push(["git policy", before === null && ctx.split(POLICY_MARK).length === 2 && ctx.includes("`auto` 2026-01-02") && ctx2.includes(`## กติกา\n${POLICY_MARK}`) && ctx2.includes("- ข้อเดิม") && Boolean(gitPolicy(proj, "yes", true).error)]);
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
  const picked = ["--gitignore", "--permissions", "--global-rules", "--git-policy"].filter((f) => args.includes(f));
  const run = (f) => picked.length === 0 || picked.includes(f);
  let gaps = 0;
  if (run("--gitignore")) {
    const r = gitignore(project, !check);
    gaps += r.missing.length;
    console.log(`.gitignore: ${r.missing.length ? (check ? "ขาด " : "เพิ่ม ") + r.missing.join(" · ") : "ครบแล้ว"}`);
    for (const n of r.notes) console.log(`  หมายเหตุ: ${n}`);
  }
  if (run("--permissions")) {
    const r = permissions(project, !check, { user: args.includes("--user") });
    if (r.error) { console.log(`สิทธิ์: ${r.error}`); gaps++; }
    else { gaps += r.missing.length; console.log(`สิทธิ์ (${r.file}): ${r.missing.length ? (check ? "ขาด " : "เพิ่ม ") + r.missing.join(" · ") : "ครบแล้ว"}`); }
  }
  if (run("--global-rules")) {
    const r = globalRules(project, !check);
    gaps += r.missing.length;
    console.log(`กฎประจำตัว (~/.claude/CLAUDE.md): ${r.missing.length ? `${check ? "ต้องติดตั้ง" : "ติดตั้งแล้ว"} (${r.why})${r.saved ? ` · ไฟล์เดิมสำรองไว้ที่ ${r.saved}` : ""}` : "เป็นรุ่นล่าสุดแล้ว"}`);
  }
  if (run("--git-policy")) {
    const i = args.indexOf("--git-policy");
    const value = i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null;
    const r = gitPolicy(project, value, !check && Boolean(value));
    if (r.error) { console.log(`นโยบาย git: ${r.error}`); gaps++; }
    // ยังไม่เลือกเป็นคำแนะนำ ไม่นับว่าขาด · ไม่งั้น --check ล้มทุกโปรเจกต์ที่ยังไม่เคยถาม
    else if (!r.current) console.log(`นโยบาย git: ยังไม่ได้เลือก · ถามผู้ใช้ 1 ครั้ง แล้วรัน --git-policy ${Object.keys(POLICIES).join("|")}`);
    else console.log(`นโยบาย git (${r.file}): ${r.current.slice(POLICY_MARK.length).trim()}`);
  }
  if (!check && run("--permissions")) console.log("\nกฎสิทธิ์และกฎประจำตัวมีผลกับ session ใหม่ · เปิด Claude Code ใหม่หรือเริ่ม session ใหม่");
  process.exit(check && gaps ? 1 : 0);
}
