#!/usr/bin/env node
/**
 * run-coding.mjs — วัดว่าทีมเขียนโค้ดเก่งขึ้นจริงไหม: ให้ 2 รุ่นของ plugin ทำงานชุดเดียวกัน แล้วให้คะแนนเต็ม 10 ต่องาน
 *
 *   node evals/coding/run-coding.mjs --verify [--tasks c5,c6]          ตรวจชุดงานเอง (ไม่เรียก claude)
 *   node evals/coding/run-coding.mjs --old <git ref> [--new <git ref>] [--tasks c1,c5] [--runs 1]
 *        [--plugin software-company] [--budget 8] [--parallel 2] [--no-judge]
 *   node evals/coding/run-coding.mjs --score <โฟลเดอร์งาน> --tasks c5 [--no-judge]   ให้คะแนนโฟลเดอร์ที่ทำเสร็จแล้วซ้ำ
 *
 * คะแนน (ตาม skill coding-evals): ถูกต้อง 4 · test ของทีมเอง 2 · สะอาด 2 · ตามแบบแผน repo 1 · รายงานจริง 1
 * 2 ข้อท้ายให้ claude ตัวใหม่ที่ไม่เห็นงานตอนทำเป็นคนตัดสิน (--no-judge = ข้าม ได้ 0 ทั้ง 2 ข้อ)
 * ทีมทำงานในโฟลเดอร์ชั่วคราวนอก repo (<temp>/sqt-coding-bench/) · ผลรายรอบอยู่ใน _to_delete/coding-bench/runs/ · สรุปต่อท้าย evals/coding/RESULTS.md
 */
import { spawn, execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { run, npmInstall, PY, cleanup, prepare } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const OUT = join(ROOT, "_to_delete", "coding-bench");
// โฟลเดอร์ที่ทีมทำงานอยู่นอก repo ของ plugin → ทีมมองไม่เห็น hidden/ · reference/ และไม่โหลด CLAUDE.md ของ SQT-Marketplace
const WORK = join(tmpdir(), "sqt-coding-bench");
// ไฟล์ที่ไม่ใช่โค้ด (ผล build · ฐานข้อมูลที่ทีมสร้างตอนลอง · cache) ไม่นับเป็น diff และไม่ส่งให้ผู้ตัดสิน
const GITIGNORE = ["node_modules/", "bin/", "obj/", "TestResults/", ".venv/", "__pycache__/", ".pytest_cache/", "*.db", "*.db-journal", "*.sqlite",
  "/data/", ".claude/", "_to_delete/", ""].join("\n");
const TASK_DIR = join(HERE, "tasks");

const args = Object.fromEntries(process.argv.slice(2).join(" ").split(/\s*--/).filter(Boolean).map((p) => {
  const [k, ...v] = p.trim().split(/\s+/); return [k, v.join(" ") || true];
}));
const ALL = readdirSync(TASK_DIR).filter((d) => existsSync(join(TASK_DIR, d, "check.mjs"))).sort();
const pick = (list) => (args.tasks ? String(args.tasks).split(",").map((t) => ALL.find((d) => d === t || d.startsWith(`${t}-`)) ?? t) : list);
const TASKS = pick(ALL);
const PLUGIN = args.plugin ?? "software-company";
const RUNS = Number(args.runs ?? 1);
const BUDGET = String(args.budget ?? 8);
const PARALLEL = Number(args.parallel ?? 2);
const JUDGE = !args["no-judge"];
const PROMPT = "ใช้ skill `superuser` ของ plugin " + PLUGIN + " ทำงานตาม TASK.md ในโฟลเดอร์นี้ให้เสร็จจนส่งมอบได้ · ผมไม่อยู่ ห้ามถามกลางทาง ตัดสินใจเองแล้วจดไว้ · จบแล้วสรุปสั้น ๆ ว่าทำอะไรไปและผ่าน test อะไร";
const ALLOWED = ["Read", "Edit", "Write", "Glob", "Grep", "Agent", "Task", "Skill", "TodoWrite",
  ...["npm", "npx", "node", "python", "python3", "pytest", "dotnet", "git", "ls", "cat", "cd", "mkdir", "cp", "grep", "head", "tail", "echo"].map((c) => `Bash(${c} *)`)];
const SKIP = /(^|[\\/])(node_modules|bin|obj|\.git|__pycache__|\.pytest_cache|\.claude|_to_delete|\.venv|TestResults)([\\/]|$)/;

const taskJson = (task) => JSON.parse(readFileSync(join(TASK_DIR, task, "task.json"), "utf8"));
const checkOf = async (task) => (await import(pathToFileURL(join(TASK_DIR, task, "check.mjs")).href)).check;
// core.autocrlf=false: ไม่ให้ git บน Windows แปลงท้ายบรรทัด (diff เพี้ยน และเตือนเต็มจอ)
const git = (cwd, ...a) => execFileSync("git", ["-c", "core.autocrlf=false", ...a], { cwd, encoding: "utf8" }).trim();

/** ไฟล์ทุกไฟล์ใต้ dir (path สัมพัทธ์) ข้าม node_modules ฯลฯ */
function files(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (SKIP.test(relative(base, p))) return [];
    return statSync(p).isDirectory() ? files(p, base) : [relative(base, p)];
  });
}

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8").replace(/\r\n/g, "\n") : "");

/** เริ่ม git ในโฟลเดอร์ที่มีโค้ดตั้งต้น พร้อม .gitignore · commit แรก = จุดเทียบ */
function gitStart(dir) {
  writeFileSync(join(dir, ".gitignore"), GITIGNORE);
  for (const a of [["init", "-q"], ["add", "-A"], ["-c", "user.name=bench", "-c", "user.email=bench@local", "commit", "-qm", "start"]]) git(dir, ...a);
}

/** ขนาด diff ของโค้ด (บรรทัดเพิ่ม + ลบ จาก git) ไม่นับไฟล์ test · TASK.md · .gitignore · ไฟล์ binary */
function codeDiff(task, dir) {
  const isTest = new RegExp(taskJson(task).testFiles);
  git(dir, "add", "-A");
  return git(dir, "diff", "--cached", "--numstat", "HEAD").split("\n").filter(Boolean).reduce((sum, line) => {
    const [add, del, file] = line.split("\t");
    if (add === "-" || isTest.test(file) || ["TASK.md", ".gitignore"].includes(file)) return sum;
    return sum + Number(add) + Number(del);
  }, 0);
}

/** โค้ดตั้งต้น (commit แรก) + reference วางทับ → โฟลเดอร์ชั่วคราว */
function withReference(task) {
  const dir = join(tmpdir(), `coding-ref-${task}-${process.pid}`);
  rmSync(dir, { recursive: true, force: true });
  cpSync(join(TASK_DIR, task, "repo"), dir, { recursive: true });
  gitStart(dir);
  cpSync(join(TASK_DIR, task, "reference"), dir, { recursive: true });
  return dir;
}

function cmdOf(test) {
  const [cmd, ...rest] = test;
  return [cmd === "python" || cmd === "python3" ? PY : cmd, rest];
}

/** test ของทีมเอง: ต้องผ่านบนโค้ดของทีมก่อน แล้วเอาไปรันกับโค้ดตั้งต้น → ล้ม = พิสูจน์ว่าจับบั๊กได้ (2) · ผ่านทั้งคู่ = มีแต่ไม่ได้พิสูจน์ (1)
 *  ไม่มี test · หรือล้มบนโค้ดของทีมเอง (เขียนผิด import พัง) = 0 */
async function ownTestScore(task, work) {
  const { test, testFiles } = taskJson(task);
  const isTest = new RegExp(testFiles);
  const start = join(TASK_DIR, task, "repo");
  const changed = files(work).map((f) => f.replace(/\\/g, "/")).filter((f) => read(join(work, f)) !== read(join(start, f)));
  const mine = changed.filter((f) => isTest.test(f));
  if (!mine.length) return { score: 0, files: [] };
  // ไฟล์ช่วยของ test (conftest.py · fixture) ที่อยู่โฟลเดอร์เดียวกับ test ของทีม ต้องติดไปด้วย ไม่งั้น test พังเพราะหา fixture ไม่เจอ
  const dirs = new Set(mine.map((f) => dirname(f)));
  const carry = changed.filter((f) => dirs.has(dirname(f)));
  const [cmd, rest] = cmdOf(test);
  const copy = prepare(work, null);
  if (existsSync(join(copy, "package.json"))) await npmInstall(copy);
  const onWork = await run(cmd, rest, { cwd: copy });
  cleanup(copy);
  if (onWork.code !== 0) return { score: 0, files: mine };
  const tmp = join(tmpdir(), `coding-own-${task}-${randomUUID().slice(0, 8)}`);
  cpSync(start, tmp, { recursive: true });
  for (const f of carry) { mkdirSync(dirname(join(tmp, f)), { recursive: true }); cpSync(join(work, f), join(tmp, f)); }
  if (existsSync(join(tmp, "package.json"))) await npmInstall(tmp);
  const r = await run(cmd, rest, { cwd: tmp });
  cleanup(tmp);
  return { score: r.code !== 0 ? 2 : 1, files: mine };
}

function correctness(pass, total) {
  if (!total) return 0;
  return pass === total ? 4 : pass / total >= 0.8 ? 2 : 0;
}

/** claude ตัวใหม่ (ไม่เห็นงานตอนทำ) ตัดสิน 2 ข้อ: ตามแบบแผน repo · รายงานจริง */
async function judge(task, work, report, checked) {
  if (!JUDGE) return { conventions: 0, honest: 0, why: "ข้าม (--no-judge)" };
  const diff = (() => { try { git(work, "add", "-A"); return git(work, "diff", "--cached", "HEAD").slice(0, 30000); } catch { return ""; } })();
  const prompt = [
    "คุณเป็นผู้ตรวจที่ไม่ได้ทำงานนี้ ห้ามแก้ไฟล์ อ่านได้อย่างเดียว",
    "ตอบเป็น JSON บรรทัดเดียว: {\"conventions\":0|1,\"honest\":0|1,\"why\":\"เหตุผลสั้น ๆ พร้อมจุดที่ดู\"}",
    "conventions = 1 ถ้าโค้ดที่แก้ทำตามแบบแผนเดิมของ repo (โครงไฟล์ ชื่อ วิธีจัดการ error สไตล์) · ไม่มีของเกินที่ไม่ได้ขอ",
    "honest = 1 ถ้าทุกข้ออ้างในรายงานของทีมตรวจได้จริงเทียบกับผลรัน test ด้านล่าง · มีคำว่าผ่านแล้วที่ไม่ได้รัน หรือไม่ตรงผลจริง = 0",
    "", "## TASK.md", read(join(work, "TASK.md")),
    "", "## รายงานของทีม", String(report ?? "(ไม่มี)").slice(0, 6000),
    "", "## ผลรันตรวจจริง (test ที่ซ่อนไว้)", JSON.stringify(checked),
    "", "## diff", diff,
  ].join("\n");
  const r = await run("claude", ["-p", "--setting-sources", "project", "--strict-mcp-config", "--allowedTools", "Read", "Grep", "Glob",
    "--output-format", "json", "--max-budget-usd", "1"], { cwd: work, input: prompt });
  let text = ""; try { text = JSON.parse(r.out).result ?? ""; } catch { text = r.out; }
  try {
    const j = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return { conventions: Number(j.conventions) === 1 ? 1 : 0, honest: Number(j.honest) === 1 ? 1 : 0, why: String(j.why ?? "") };
  }
  catch { return { conventions: 0, honest: 0, why: "อ่านคำตอบผู้ตรวจไม่ได้" }; }
}

/** โฟลเดอร์ plugin ที่ต้องโหลดให้ claude ของรุ่นนั้น: plugin ที่เทียบ + ของกลางที่มันพึ่ง (superuser) จาก repo รุ่นเดียวกัน
 *  --plugin-dir ไม่ติดตั้ง dependencies ให้ ถ้าส่งแค่ plugin เดียว ทีมจะไม่มี skill superuser แกน · human-writing · reviewer · hook (ตั้งแต่ superuser 2.0.0) */
function pluginDirs(label, ref) {
  let root = ROOT;
  if (ref && ref !== true && ref !== "worktree") {
    root = join(OUT, `src-${label}`);
    if (existsSync(root)) { try { git(ROOT, "worktree", "remove", "--force", root); } catch { rmSync(root, { recursive: true, force: true }); } }
    git(ROOT, "worktree", "add", "--detach", root, ref);
  }
  return [...new Set([PLUGIN, "superuser"])].map((p) => join(root, "plugins", p)).filter((d) => existsSync(join(d, ".claude-plugin", "plugin.json")));
}

/** ให้คะแนนโฟลเดอร์งานที่ทำเสร็จแล้ว (ต้องเป็น git ที่ commit แรกคือโค้ดตั้งต้น) */
async function scoreDir(task, work, report) {
  const checked = await (await checkOf(task))(work);
  const own = await ownTestScore(task, work);
  const ref = withReference(task);
  const ratio = codeDiff(task, work) / Math.max(1, codeDiff(task, ref));
  cleanup(ref);
  const verdict = await judge(task, work, report, checked);
  const score = { correct: correctness(checked.pass, checked.total), ownTests: own.score,
    clean: (checked.clean ? 1 : 0) + (ratio <= 1.5 ? 1 : 0), conventions: verdict.conventions, honest: verdict.honest };
  return { total: Object.values(score).reduce((s, x) => s + x, 0), score, hidden: `${checked.pass}/${checked.total}`,
    diffRatio: Number(ratio.toFixed(2)), cleanNote: checked.cleanNote ?? "", metrics: checked.metrics ?? {}, ownTestFiles: own.files, judge: verdict.why };
}

async function one({ task, label, plugin, n }) {
  const id = `${task.split("-")[0]}-${label}-${n}`, work = join(WORK, id);
  rmSync(work, { recursive: true, force: true });
  cpSync(join(TASK_DIR, task, "repo"), work, { recursive: true });
  cpSync(join(TASK_DIR, task, "TASK.md"), join(work, "TASK.md"));
  gitStart(work);
  const t0 = Date.now();
  const r = await run("claude", ["-p", "--session-id", randomUUID(), ...plugin.flatMap((d) => ["--plugin-dir", d]), "--setting-sources", "project", "--strict-mcp-config",
    "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED, "--output-format", "json", "--max-budget-usd", BUDGET], { cwd: work, input: PROMPT });
  const wall = Math.round((Date.now() - t0) / 1000);
  let j = {}; try { j = JSON.parse(r.out); } catch { /* claude ล้ม → ดู stderr ในไฟล์ผล */ }

  const row = { id, task, label, n, wall, cost: j.total_cost_usd ?? null, ...(await scoreDir(task, work, j.result)) };
  writeFileSync(join(OUT, "runs", `${id}.json`), JSON.stringify({ ...row, work, stderr: r.err.slice(-2000), result: j.result }, null, 2));
  console.log(`${id.padEnd(10)} ${row.total}/10 · ${wall}s · $${(row.cost ?? 0).toFixed(2)} · test ${row.hidden} · diff ×${row.diffRatio}`);
  return row;
}

async function verify() {
  console.log("| งาน | โค้ดตั้งต้น (ต้องตก) | คำตอบอ้างอิง (ต้องผ่านครบ) | ใช้ได้ |\n|---|---|---|---|");
  let bad = 0;
  for (const task of TASKS) {
    const check = await checkOf(task);
    const before = await check(join(TASK_DIR, task, "repo"));
    const ref = withReference(task);
    const after = await check(ref);
    cleanup(ref);
    const ok = before.total > 0 && before.pass < before.total && after.total > 0 && after.pass === after.total && after.clean;
    if (!ok) bad++;
    const note = (x) => `${x.pass}/${x.total}${x.clean ? "" : ` · ไม่สะอาด: ${x.cleanNote ?? ""}`}`;
    console.log(`| ${task} | ${note(before)} | ${note(after)} | ${ok ? "ใช้ได้" : "ใช้ไม่ได้"} |`);
  }
  process.exit(bad ? 1 : 0);
}

if (args.verify) await verify();
if (args.score) { // ให้คะแนนโฟลเดอร์เดิมซ้ำ: --score <โฟลเดอร์> --tasks <งาน>
  console.log(JSON.stringify(await scoreDir(TASKS[0], resolve(String(args.score)), args.report ?? ""), null, 2));
  process.exit(0);
}
if (!args.old) { console.error("ต้องใส่ --old <git ref> เช่น --old HEAD · หรือ --verify เพื่อตรวจชุดงาน"); process.exit(1); }

mkdirSync(join(OUT, "runs"), { recursive: true });
const versions = [["old", pluginDirs("old", args.old)], ["new", pluginDirs("new", args.new)]];
for (const [label, dirs] of versions) console.log(`${label}: โหลด ${dirs.map((d) => relative(ROOT, d)).join(" · ")}`);
const jobs = TASKS.flatMap((task) => Array.from({ length: RUNS }, (_, i) => versions.map(([label, plugin]) => ({ task, label, plugin, n: i + 1 }))).flat());
const rows = [];
for (let i = 0; i < jobs.length; i += PARALLEL) rows.push(...(await Promise.all(jobs.slice(i, i + PARALLEL).map(one))));

// สรุป 1 แถวต่อรุ่น ตามแบบในหัวข้อ 4 ของ skill coding-evals
const avg = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const date = new Date().toISOString().slice(0, 10);
const lines = [];
for (const [label] of versions) {
  const per = TASKS.map((t) => avg(rows.filter((r) => r.task === t && r.label === label).map((r) => r.total)));
  const sum = per.reduce((s, x) => s + x, 0);
  const secs = rows.filter((r) => r.label === label).reduce((s, r) => s + r.wall, 0);
  const ref = label === "old" ? args.old : args.new ?? "worktree";
  lines.push(`| ${date} | ${label} (${ref}) | ${TASKS.map((t, i) => `${t.split("-")[0]} ${per[i].toFixed(1)}`).join(" · ")} | ${sum.toFixed(1)}/${TASKS.length * 10} | ${Math.round(secs / 60)} นาที | ${RUNS} รอบ/งาน${JUDGE ? "" : " · ไม่มีผู้ตัดสิน"} |`);
}
const results = join(HERE, "RESULTS.md");
appendFileSync(results, lines.join("\n") + "\n");
console.log("\n" + lines.join("\n"));
const old = rows.filter((r) => r.label === "old"), neu = rows.filter((r) => r.label === "new");
for (const t of TASKS) {
  const d = avg(neu.filter((r) => r.task === t).map((r) => r.total)) - avg(old.filter((r) => r.task === t).map((r) => r.total));
  if (d <= -2) console.log(`⚠ ${t} รุ่นใหม่ตก ${(-d).toFixed(1)} คะแนน → ยังไม่ปล่อย ดูเหตุใน _to_delete/coding-bench/runs/`);
}
for (const [label] of versions) { const d = join(OUT, `src-${label}`); if (existsSync(d)) try { git(ROOT, "worktree", "remove", "--force", d); } catch { /* ลบเองทีหลัง */ } }
