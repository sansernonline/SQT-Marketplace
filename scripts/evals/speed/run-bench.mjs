#!/usr/bin/env node
/**
 * run-bench.mjs — เทียบ plugin 2 รุ่นบนงานชุดเดียวกัน: เวลา · จำนวนรอบ · ค่าใช้จ่าย · ลูกทีม · test ที่ซ่อนไว้
 *
 *   node scripts/evals/speed/run-bench.mjs --old <git ref>|none [--new <git ref>|worktree] [--tasks t1,t4] [--runs 2]
 *        [--plugin software-company] [--budget 8] [--parallel 4] [--save-ratios]
 *
 *   --old    รุ่นก่อน เป็น git ref เช่น HEAD หรือ f105afc · none = ไม่โหลด plugin เลย (แขนเทียบ "ไม่ใช้ superuser")
 *   --new    รุ่นหลัง ค่าเริ่ม = ไฟล์ในโฟลเดอร์ตอนนี้ (worktree) · ใส่ git ref ก็ได้
 *   --save-ratios  ใช้กับ --old none · เขียนอัตราส่วน (มี ÷ ไม่มี) ลง plugins/superuser/hooks/bench-ratios.json ให้ hook ใช้ประมาณใน SUMMARY.md
 *   ผลรายรอบอยู่ใน _to_delete/bench/ · ตารางสรุปต่อท้าย scripts/evals/speed/RESULTS.md
 *
 * ทุกรอบรัน `claude -p` ในโฟลเดอร์ทดสอบที่สร้างใหม่ ใช้เฉพาะ plugin ที่ส่งด้วย --plugin-dir
 * (--setting-sources project จึงไม่โหลด plugin ที่ติดตั้งในเครื่อง) · agent ได้สิทธิ์แค่แก้ไฟล์ · รัน test · git
 * ค่าใช้จ่ายจริงตัดจากบัญชี Claude ที่ล็อกอินอยู่ · จำกัดรอบละ --budget ดอลลาร์
 */
import { spawn, execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { median, pairRatios, ratioCI, passHatK, fmtCI } from "./stats.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const OUT = join(ROOT, "_to_delete", "bench");
const WIN = process.platform === "win32";
const PY = WIN ? "python" : "python3";

const args = Object.fromEntries(process.argv.slice(2).join(" ").split(/\s*--/).filter(Boolean).map((p) => {
  const [k, ...v] = p.trim().split(/\s+/); return [k, v.join(" ") || true];
}));
if (!args.old) { console.error("ต้องใส่ --old <git ref> เช่น --old HEAD"); process.exit(1); }
const PLUGIN = args.plugin ?? "software-company";
const TASKS = (args.tasks ?? "t1,t4").split(",");
const RUNS = Number(args.runs ?? 2);
const BUDGET = String(args.budget ?? 8);
const PARALLEL = Number(args.parallel ?? 4);
// แขน none ได้คำสั่งเดียวกันทุกคำ ยกเว้นประโยคที่ให้ใช้ superuser · ต่างกันแค่นี้ผลต่างจึงมาจาก plugin
const TASK_PROMPT = "ทำงานตาม TASK.md ในโฟลเดอร์นี้ให้เสร็จจนส่งมอบได้ · ผมไม่อยู่ ห้ามถามกลางทาง ตัดสินใจเองแล้วจดไว้ · จบแล้วสรุปสั้น ๆ ว่าทำอะไรไปและผ่าน test อะไร";
const promptFor = (label) => (label === "none" ? TASK_PROMPT : "ใช้ skill `superuser` ของ plugin " + PLUGIN + " " + TASK_PROMPT);
const BASELINE = args.old === "none";
const ALLOWED = ["Read", "Edit", "Write", "Glob", "Grep", "Agent", "Task", "Skill", "TodoWrite",
  ...["npm", "node", "python", "python3", "pytest", "git", "ls", "cat", "cd", "mkdir", "cp", "grep", "head", "tail", "echo"].map((c) => `Bash(${c} *)`)];

const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" }).trim();

/** โฟลเดอร์ plugin ของรุ่นที่ขอ: plugin ที่เทียบ + ของกลางที่มันพึ่ง (superuser) จาก repo รุ่นเดียวกัน
 *  --plugin-dir ไม่ติดตั้ง dependencies ให้ ส่งแค่ plugin เดียวทีมจะไม่มี skill superuser แกน · reviewer · hook (ตั้งแต่ superuser 2.0.0)
 *  worktree = ใช้ไฟล์ในโฟลเดอร์ตอนนี้ · git ref = แตกออกมาที่ _to_delete/bench/src-<ชื่อ>/ */
function pluginDirs(label, ref) {
  if (ref === "none") return [];
  let root = ROOT;
  if (ref && ref !== true && ref !== "worktree") {
    root = join(OUT, `src-${label}`);
    if (existsSync(root)) { try { git("worktree", "remove", "--force", root); } catch { rmSync(root, { recursive: true, force: true }); } }
    git("worktree", "add", "--detach", root, ref);
  }
  return [...new Set([PLUGIN, "superuser"])].map((p) => join(root, "plugins", p)).filter((d) => existsSync(join(d, ".claude-plugin", "plugin.json")));
}

function run(cmd, argv, opts) {
  return new Promise((done) => {
    // claude เป็น .exe เรียกตรง · คำสั่งอื่น (npm · python) บน Windows เป็น .cmd ต้องผ่าน shell แต่ Node ไม่ quote ให้ จึง quote เอง
    const viaShell = WIN && cmd !== "claude";
    const q = (s) => (viaShell && /[\s()&|<>^"]/.test(s) ? `"${String(s).replace(/"/g, '\\"')}"` : s);
    const p = spawn(cmd, argv.map(q), { ...opts, shell: viaShell, stdio: ["ignore", "pipe", "pipe"] });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => done({ code, out, err }));
  });
}

/** นับลูกทีมที่เปิด และรอบที่เปิดพร้อมกันหลายตัว จาก transcript ของ session */
function countAgents(sessionId) {
  const base = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");
  if (!sessionId || !existsSync(base)) return { agents: [], batches: [] };
  for (const d of readdirSync(base)) {
    const f = join(base, d, `${sessionId}.jsonl`);
    if (!existsSync(f)) continue;
    const agents = [], batches = [];
    for (const line of readFileSync(f, "utf8").split("\n")) {
      let m; try { m = JSON.parse(line); } catch { continue; }
      const c = m?.message?.role === "assistant" && Array.isArray(m.message.content) ? m.message.content : [];
      const calls = c.filter((b) => b.type === "tool_use" && (b.name === "Agent" || b.name === "Task"));
      calls.forEach((b) => agents.push(b.input?.subagent_type ?? "?"));
      if (calls.length > 1) batches.push(calls.length);
    }
    return { agents, batches };
  }
  return { agents: [], batches: [] };
}

/** token รวมทุก model รวมลูกทีม (modelUsage ของ claude -p) · ไม่มี → usage ของ session หลักอย่างเดียว · นับ cache ด้วยเพื่อให้เทียบกับ log ของ hook ได้ */
function totalTokens(j) {
  const mu = Object.values(j.modelUsage ?? {});
  if (mu.length) return mu.reduce((s, m) => s + (m.inputTokens ?? 0) + (m.outputTokens ?? 0) + (m.cacheReadInputTokens ?? 0) + (m.cacheCreationInputTokens ?? 0), 0);
  const u = j.usage;
  return u ? (u.input_tokens ?? 0) + (u.output_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) : null;
}

async function hidden(task, work) {
  const check = `${work}-check`;
  rmSync(check, { recursive: true, force: true });
  cpSync(work, check, { recursive: true, filter: (s) => !s.includes(join(".claude", "worktrees")) });
  const hid = join(HERE, "tasks", task, "hidden");
  let pass = 0, total = 0;
  for (const f of readdirSync(hid)) {
    if (f.endsWith(".py")) {
      cpSync(join(hid, f), join(check, f));
      const r = await run(PY, ["-m", "pytest", "-q", f], { cwd: check });
      const p = /(\d+) passed/.exec(r.out), x = /(\d+) failed/.exec(r.out), e = /(\d+) error/.exec(r.out);
      pass += Number(p?.[1] ?? 0); total += Number(p?.[1] ?? 0) + Number(x?.[1] ?? 0) + Number(e?.[1] ?? 0);
    } else if (f.endsWith(".test.js")) {
      mkdirSync(join(check, "hidden"), { recursive: true });
      cpSync(join(hid, f), join(check, "hidden", f));
      const r = await run("node", ["--test", join("hidden", f)], { cwd: check });
      const p = /# pass (\d+)/.exec(r.out), x = /# fail (\d+)/.exec(r.out);
      pass += Number(p?.[1] ?? 0); total += Number(p?.[1] ?? 0) + Number(x?.[1] ?? 0);
    }
  }
  return { pass, total };
}

async function one({ task, label, plugin, n }) {
  const id = `${task}-${label}-${n}`, work = join(OUT, "runs", id);
  rmSync(work, { recursive: true, force: true });
  cpSync(join(HERE, "tasks", task, "repo"), work, { recursive: true });
  cpSync(join(HERE, "tasks", task, "TASK.md"), join(work, "TASK.md"));
  for (const a of [["init", "-q"], ["add", "-A"], ["-c", "user.name=bench", "-c", "user.email=bench@local", "commit", "-qm", "start"]])
    execFileSync("git", a, { cwd: work });
  const sid = randomUUID(); // ตั้ง session เอง จะได้หา transcript ของรอบนี้เจอแน่นอน
  const t0 = Date.now();
  const r = await run("claude", ["-p", promptFor(label), "--session-id", sid, ...plugin.flatMap((d) => ["--plugin-dir", d]), "--setting-sources", "project", "--strict-mcp-config",
    "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED, "--output-format", "json", "--max-budget-usd", BUDGET], { cwd: work });
  const wall = Math.round((Date.now() - t0) / 1000);
  let j = {}; try { j = JSON.parse(r.out); } catch { /* claude ล้ม → ดู stderr ในไฟล์ */ }
  const h = await hidden(task, work);
  const a = countAgents(sid);
  const row = { id, task, label, n, wall, turns: j.num_turns ?? null, cost: j.total_cost_usd ?? null, tokens: totalTokens(j), agents: a.agents, batches: a.batches,
    hidden: `${h.pass}/${h.total}`, passAll: h.total > 0 && h.pass === h.total, denied: (j.permission_denials ?? []).length, error: j.is_error ?? (r.code !== 0) };
  writeFileSync(join(OUT, "runs", `${id}.json`), JSON.stringify({ ...row, stderr: r.err.slice(-2000), result: j.result }, null, 2));
  console.log(`${id.padEnd(14)} ${wall}s · turns ${row.turns} · $${(row.cost ?? 0).toFixed(2)} · token ${row.tokens ?? "?"} · ลูกทีม ${a.agents.length} · test ${row.hidden}`);
  return row;
}

mkdirSync(join(OUT, "runs"), { recursive: true });
const OLD = BASELINE ? "none" : "old";
const versions = [[OLD, pluginDirs("old", args.old)], ["new", pluginDirs("new", args.new)]];
for (const [label, dirs] of versions) console.log(`${label}: โหลด ${dirs.map((d) => d.replace(ROOT, ".")).join(" · ") || "ไม่มี plugin"}`);
const jobs = TASKS.flatMap((task) => Array.from({ length: RUNS }, (_, i) => versions.map(([label, plugin]) => ({ task, label, plugin, n: i + 1 }))).flat());
const rows = [];
for (let i = 0; i < jobs.length; i += PARALLEL) rows.push(...(await Promise.all(jobs.slice(i, i + PARALLEL).map(one))));

// สรุป: ค่ากลางต่องาน ต่อรุ่น · ผลแกว่งแรงจึงไม่ใช้ค่าเฉลี่ย · pass^1 = สัดส่วนรอบที่ผ่าน test ที่ซ่อนไว้ครบ · pass^k = ผ่านครบทุกรอบ (k = จำนวนรอบ)
const pick = (rs, k) => rs.map((r) => r[k]).filter((x) => x != null);
const f0 = (x) => (x == null ? "–" : x.toFixed(0)), f2 = (x) => (x == null ? "–" : x.toFixed(2));
const lines = [`\n## ${new Date().toISOString().slice(0, 16).replace("T", " ")} · old=${args.old} · new=${args.new ?? "worktree"} · ${RUNS} รอบ/รุ่น\n`,
  "| งาน | รุ่น | เวลา ค่ากลาง (วินาที) | รอบคุย ค่ากลาง | ค่าใช้จ่าย ค่ากลาง ($) | token ค่ากลาง | ลูกทีมเฉลี่ย | ส่งพร้อมกัน | test ที่ซ่อนไว้ | pass^1 · pass^k |", "|---|---|---|---|---|---|---|---|---|---|"];
for (const task of TASKS) for (const [label] of versions) {
  const rs = rows.filter((r) => r.task === task && r.label === label);
  const agents = rs.length ? rs.reduce((s, r) => s + r.agents.length, 0) / rs.length : 0;
  lines.push(`| ${task} | ${label} | ${f0(median(pick(rs, "wall")))} | ${f0(median(pick(rs, "turns")))} | ${f2(median(pick(rs, "cost")))} | ${f0(median(pick(rs, "tokens")))} | ${agents.toFixed(1)} | ${rs.filter((r) => r.batches.length).length}/${rs.length} | ${rs.map((r) => r.hidden).join(" · ")} | ${f2(passHatK(rs.filter((r) => r.passAll).length, rs.length, 1))} · ${f2(passHatK(rs.filter((r) => r.passAll).length, rs.length, rs.length))} |`);
}

// อัตราส่วน new ÷ old จับคู่ตามงานและรอบ (รอบที่ n ของรุ่นหนึ่งคู่กับรอบที่ n ของอีกรุ่น) · น้อยกว่า 1 = new ใช้น้อยกว่า
const pairsOf = (key, tasks = TASKS) => tasks.flatMap((task) => rows.filter((r) => r.task === task && r.label === "new").map((a) => {
  const b = rows.find((r) => r.task === task && r.label === OLD && r.n === a.n);
  return [a[key], b?.[key]];
}));
const passRate = (label) => { const rs = rows.filter((r) => r.label === label); return rs.length ? rs.filter((r) => r.passAll).length / rs.length : null; };
const ratios = Object.fromEntries(["wall", "cost", "tokens"].map((k) => [k, ratioCI(pairRatios(pairsOf(k)))]));
lines.push("", `อัตราส่วน new ÷ ${OLD} ทุกงานรวมกัน (ค่ากลาง · ช่วง 95% แบบ bootstrap): เวลา ${fmtCI(ratios.wall)} · ค่าใช้จ่าย ${fmtCI(ratios.cost)} · token ${fmtCI(ratios.tokens)}`,
  `ผ่าน test ที่ซ่อนไว้ครบ: new ${f2(passRate("new"))} · ${OLD} ${f2(passRate(OLD))}${passRate("new") < passRate(OLD) ? " · **new คุณภาพต่ำกว่า ไม่นับว่าประหยัด**" : ""}`);
const results = join(HERE, "RESULTS.md");
if (!existsSync(results)) writeFileSync(results, "# ผลเทียบความเร็ว\n\nสร้างโดย `scripts/evals/speed/run-bench.mjs` · ใหม่สุดอยู่ล่างสุด\n");
appendFileSync(results, lines.join("\n") + "\n");
console.log(lines.join("\n"));

// อัตราส่วนให้ hook ใช้ประมาณ "ถ้าไม่ใช้ superuser" ใน log/SUMMARY.md · ต้องเป็นแขน none เท่านั้น เพราะเทียบ 2 รุ่นของ plugin ไม่ได้บอกว่าประหยัดเท่าไร
if (args["save-ratios"]) {
  if (!BASELINE) console.error("--save-ratios ใช้ได้กับ --old none เท่านั้น · ไม่ได้เขียนไฟล์");
  else {
    const file = join(ROOT, "plugins", "superuser", "hooks", "bench-ratios.json");
    writeFileSync(file, JSON.stringify({
      _about: "สร้างโดย scripts/evals/speed/run-bench.mjs --old none --save-ratios · อัตราส่วน = ใช้ superuser ÷ ไม่ใช้ · ห้ามแก้มือ",
      date: new Date().toISOString().slice(0, 10), new: args.new ?? "worktree", tasks: TASKS, runs: RUNS,
      wall: ratios.wall, cost: ratios.cost, tokens: ratios.tokens, passAll: { with: passRate("new"), without: passRate("none") },
    }, null, 2) + "\n");
    console.log(`เขียน ${file.replace(ROOT, ".")}`);
  }
}
for (const [label] of versions) { const d = join(OUT, `src-${label}`); if (existsSync(d)) try { git("worktree", "remove", "--force", d); } catch { /* ลบเองทีหลัง */ } }
