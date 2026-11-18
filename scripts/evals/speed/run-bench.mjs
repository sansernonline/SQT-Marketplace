#!/usr/bin/env node
/**
 * run-bench.mjs — เทียบ superuser 2 รุ่น (หรือกับไม่มี plugin) บนงานชุดเดียวกัน: เวลา · จำนวนรอบ · ค่าใช้จ่าย · ลูกทีม · test ที่ซ่อนไว้
 *
 *   node scripts/evals/speed/run-bench.mjs --old <git ref>|none [--new <git ref>|worktree] [--tasks all|t1,t4] [--runs 3]
 *        [--budget 8] [--parallel 4] [--save-ratios] [--prompt lead|natural] [--dry-run] [--from-runs]
 *
 *   --old    รุ่นก่อน เป็น git ref เช่น HEAD หรือ f105afc · none = ไม่โหลด plugin เลย (แขนเทียบ "ไม่ใช้ superuser")
 *   --new    รุ่นหลัง ค่าเริ่ม = ไฟล์ในโฟลเดอร์ตอนนี้ (worktree) · ใส่ git ref ก็ได้
 *   --from-runs  ไม่รันใหม่ · สรุปจาก _to_delete/bench/runs/*.json ที่มี (bench ถูกหยุดกลางทาง)
 *   --save-ratios  ใช้กับ --old none · เขียนอัตราส่วน (มี ÷ ไม่มี) ลง plugins/superuser/hooks/bench-ratios.json ให้ hook ใช้ประมาณใน SUMMARY.md
 *   ผลรายรอบอยู่ใน _to_delete/bench/ · ตารางสรุปต่อท้าย scripts/evals/speed/RESULTS.md
 *
 * ทุกรอบรัน `claude -p` ในโฟลเดอร์ทดสอบที่สร้างใหม่ โหลดแค่ plugin superuser ด้วย --plugin-dir ไม่มี plugin อื่นปน
 * (--setting-sources project จึงไม่โหลด plugin ที่ติดตั้งในเครื่อง) · agent ได้สิทธิ์แค่แก้ไฟล์ · รัน test · git
 * ค่าใช้จ่ายจริงตัดจากบัญชี Claude ที่ล็อกอินอยู่ · จำกัดรอบละ --budget ดอลลาร์
 *
 * วัดตรง ๆ ไม่เลือกแต่ตัวเลขที่ดี: ทุกงานมี tasks/<งาน>/task.json (ขนาด · ชนิด · ขอบเขตไฟล์ · ข้อตรวจเพิ่ม)
 * ต่อรอบเก็บ: superuser ถูกเปิดจริงไหม · ไฟล์ที่แก้นอกขอบเขต · คำตอบอ้างว่าเสร็จ/ผ่านแต่ test ที่ซ่อนไว้ตก · ล้ม · ถูกปฏิเสธ · ชนเพดาน
 * สรุปแยกตามขนาดงาน ไม่รวมทุกงานเป็นตัวเลขเดียว เพราะงานเล็กแพงขึ้นซ่อนอยู่ใต้งานใหญ่ที่ดีขึ้นได้
 */
import { spawn, execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { teamOf, teamLines } from "./team.mjs";
import { median, medianRatioCI, passHatK, fmtCI, diffCI } from "./stats.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const OUT = join(ROOT, "_to_delete", "bench");
const WIN = process.platform === "win32";
const PY = WIN ? "python" : "python3";

const args = Object.fromEntries(process.argv.slice(2).join(" ").split(/\s*--/).filter(Boolean).map((p) => {
  const [k, ...v] = p.trim().split(/\s+/); return [k, v.join(" ") || true];
}));
if (!args.old) { console.error("ต้องใส่ --old <git ref> เช่น --old HEAD"); process.exit(1); }
// วัดแค่ superuser · ไม่รับ --plugin แล้ว เพราะโหลด plugin อื่นพร้อมกันทำให้แยกไม่ออกว่าผลมาจากตัวไหน
if (args.plugin) { console.error("ไม่รับ --plugin แล้ว · bench นี้โหลดแค่ superuser"); process.exit(1); }
const PLUGIN = "superuser";
// ค่าเริ่ม all = ทุกงานใน tasks/ (ทุกขนาด ทุกชนิด) · เลือกบางงานด้วย --tasks t1,t8
const ALL_TASKS = readdirSync(join(HERE, "tasks")).filter((t) => existsSync(join(HERE, "tasks", t, "TASK.md"))).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const TASKS = !args.tasks || args.tasks === "all" ? ALL_TASKS : args.tasks.split(",");
for (const t of TASKS) if (!ALL_TASKS.includes(t)) { console.error(`ไม่มีงาน ${t} · มี: ${ALL_TASKS.join(" ")}`); process.exit(1); }
const RUNS = Number(args.runs ?? 3);
const SIZES = ["เล็ก", "กลาง", "ใหญ่"];
/** tasks/<งาน>/task.json: size · kind · about · touch (regex ไฟล์ที่ควรแก้) · checks [{name, pattern}] ค้นในคำตอบสุดท้าย */
const meta = (t) => { try { return JSON.parse(readFileSync(join(HERE, "tasks", t, "task.json"), "utf8")); } catch { return { size: "?", kind: "?" }; } };
// คำตอบอ้างว่าเสร็จหรือ test ผ่าน (จับคำ หยาบ) · ใช้คู่กับ test ที่ซ่อนไว้: อ้างแต่ตก = อ้างเกินจริง
const CLAIM = /ผ่าน\s*(ครบ|ทั้งหมด|หมด|ทุก)|test\s*(ทั้งหมด\s*)?ผ่าน|tests?\s+(all\s+)?pass(ed|ing)?|all\s+\d*\s*tests?\s+pass|เสร็จ(เรียบร้อย|สมบูรณ์)?แล้ว|ส่งมอบได้/i;
const BUDGET = String(args.budget ?? 8);
const PARALLEL = Number(args.parallel ?? 4);
// แขน none ได้คำสั่งเดียวกันทุกคำ ยกเว้นประโยคที่ให้ใช้ superuser · ต่างกันแค่นี้ผลต่างจึงมาจาก plugin
const TASK_PROMPT = "ทำงานตาม TASK.md ในโฟลเดอร์นี้ให้เสร็จจนส่งมอบได้ · ผมไม่อยู่ ห้ามถามกลางทาง ตัดสินใจเองแล้วจดไว้ · จบแล้วสรุปสั้น ๆ ว่าทำอะไรไปและผ่าน test อะไร";
// --prompt natural: ทั้ง 2 แขนได้แค่เนื้อ TASK.md ไม่สั่งให้ใช้ superuser (แขน new ยังโหลด plugin) · วัดว่า hook และ skill หลบงานเล็กเองจริงไหม
const PROMPT_MODE = args.prompt ?? "lead";
if (!["lead", "natural"].includes(PROMPT_MODE)) { console.error("--prompt ใช้ได้ 2 ค่า: lead (ค่าเริ่ม) · natural"); process.exit(1); }
const promptFor = (label, task) => PROMPT_MODE === "natural" ? readFileSync(join(HERE, "tasks", task, "TASK.md"), "utf8")
  : label === "none" ? TASK_PROMPT : "ใช้ skill `superuser` " + TASK_PROMPT;
const BASELINE = args.old === "none";
const ALLOWED = ["Read", "Edit", "Write", "Glob", "Grep", "Agent", "Task", "Skill", "TodoWrite",
  ...["npm", "node", "python", "python3", "pytest", "git", "ls", "cat", "cd", "mkdir", "cp", "grep", "head", "tail", "echo"].map((c) => `Bash(${c} *)`)];

const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" }).trim();

/** โฟลเดอร์ plugin superuser ของรุ่นที่ขอ (โหลดตัวเดียว ไม่มี plugin อื่นปน)
 *  worktree = ใช้ไฟล์ในโฟลเดอร์ตอนนี้ · git ref = แตกออกมาที่ _to_delete/bench/src-<ชื่อ>/ */
function pluginDirs(label, ref) {
  if (ref === "none") return [];
  let root = ROOT;
  if (ref && ref !== true && ref !== "worktree") {
    root = join(OUT, `src-${label}`);
    if (existsSync(root)) { try { git("worktree", "remove", "--force", root); } catch { rmSync(root, { recursive: true, force: true }); } }
    git("worktree", "add", "--detach", root, ref);
  }
  return [join(root, "plugins", PLUGIN)].filter((d) => existsSync(join(d, ".claude-plugin", "plugin.json")));
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

/** จาก transcript ของ session: ลูกทีมที่เปิด · รอบที่เปิดพร้อมกันหลายตัว · คำสั่งทั้งหมดที่เรียก (tool_use) · คำสั่งที่ล้ม (tool_result is_error) */
function countAgents(sessionId) {
  const base = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");
  const none = { agents: [], batches: [], skills: [], toolCalls: null, toolErrors: null };
  if (!sessionId || !existsSync(base)) return none;
  for (const d of readdirSync(base)) {
    const f = join(base, d, `${sessionId}.jsonl`);
    if (!existsSync(f)) continue;
    // transcript มีบรรทัดชนิด api-request-blob ที่บันทึก tool_use เดียวกันซ้ำ → นับตาม id ของ tool_use และรวมรอบตาม id ของข้อความ
    // (เดิมนับซ้ำ: t5 2026-11-11 ส่งลูกทีม 6 ตัว แต่รายงาน 12)
    const seen = new Set(), failed = new Set(), perMsg = new Map(), agents = [], skills = [];
    for (const line of readFileSync(f, "utf8").split("\n")) {
      let m; try { m = JSON.parse(line); } catch { continue; }
      const content = Array.isArray(m?.message?.content) ? m.message.content : [];
      if (m?.message?.role === "user") for (const b of content) if (b.type === "tool_result" && b.is_error) failed.add(b.tool_use_id);
      if (m?.message?.role !== "assistant") continue;
      for (const b of content) {
        if (b.type !== "tool_use" || seen.has(b.id)) continue;
        seen.add(b.id);
        if (b.name === "Skill") skills.push(String(b.input?.skill ?? b.input?.command ?? b.input?.name ?? "?"));
        if (!(b.name === "Agent" || b.name === "Task")) continue;
        agents.push(b.input?.subagent_type ?? "?");
        const k = m.message.id ?? b.id; perMsg.set(k, (perMsg.get(k) ?? 0) + 1);
      }
    }
    return { agents, skills, batches: [...perMsg.values()].filter((n) => n > 1), toolCalls: seen.size, toolErrors: failed.size };
  }
  return none;
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
  // ไฟล์ประกอบ test (เฉลย · ต้นฉบับ) ไปอยู่ข้าง test ใน hidden/
  mkdirSync(join(check, "hidden"), { recursive: true });
  for (const f of readdirSync(hid)) if (!f.endsWith(".py") && !f.endsWith(".test.js")) cpSync(join(hid, f), join(check, "hidden", f), { recursive: true });
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

/** ไฟล์ที่ทีมแก้ เทียบกับ commit ตั้งต้น (รวมไฟล์ใหม่) · นอกขอบเขต = ไม่ตรง touch ของ task.json */
function scope(work, start, touch) {
  try {
    execFileSync("git", ["add", "-A"], { cwd: work });
    const out = execFileSync("git", ["diff", "--cached", "--numstat", start], { cwd: work, encoding: "utf8" });
    const skip = /^(\.claude\/|hidden\/|node_modules\/|.*__pycache__|\.pytest_cache|package-lock\.json$)/;
    const files = out.trim().split("\n").filter(Boolean).map((l) => { const [a, d, f] = l.split("\t"); return { f, n: (Number(a) || 0) + (Number(d) || 0) }; }).filter((x) => !skip.test(x.f));
    const re = touch ? new RegExp(touch) : null;
    return { files: files.length, lines: files.reduce((s, x) => s + x.n, 0), outside: re ? files.filter((x) => !re.test(x.f)).map((x) => x.f) : [] };
  } catch { return { files: null, lines: null, outside: [] }; }
}

async function one({ task, label, plugin, n }) {
  const id = `${task}-${label}-${n}`, work = join(OUT, "runs", id);
  rmSync(work, { recursive: true, force: true });
  cpSync(join(HERE, "tasks", task, "repo"), work, { recursive: true });
  cpSync(join(HERE, "tasks", task, "TASK.md"), join(work, "TASK.md"));
  for (const a of [["init", "-q"], ["add", "-A"], ["-c", "user.name=bench", "-c", "user.email=bench@local", "commit", "-qm", "start"]])
    execFileSync("git", a, { cwd: work });
  const start = execFileSync("git", ["rev-parse", "HEAD"], { cwd: work, encoding: "utf8" }).trim();
  const sid = randomUUID(); // ตั้ง session เอง จะได้หา transcript ของรอบนี้เจอแน่นอน
  const t0 = Date.now();
  const r = await run("claude", ["-p", promptFor(label, task), "--session-id", sid, ...plugin.flatMap((d) => ["--plugin-dir", d]), "--setting-sources", "project", "--strict-mcp-config",
    "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED, "--output-format", "json", "--max-budget-usd", BUDGET], { cwd: work });
  const wall = Math.round((Date.now() - t0) / 1000);
  let j = {}; try { j = JSON.parse(r.out); } catch { /* claude ล้ม → ดู stderr ในไฟล์ */ }
  const h = await hidden(task, work);
  const a = countAgents(sid), m = meta(task), sc = scope(work, start, m.touch), text = String(j.result ?? "");
  const passAll = h.total > 0 && h.pass === h.total;
  const row = { id, task, size: m.size, kind: m.kind, label, n, wall, api: j.duration_api_ms != null ? Math.round(j.duration_api_ms / 1000) : null,
    turns: j.num_turns ?? null, cost: j.total_cost_usd ?? null, tokens: totalTokens(j), models: Object.keys(j.modelUsage ?? {}),
    team: teamOf(sid), toolCalls: a.toolCalls, toolErrors: a.toolErrors, agents: a.agents, batches: a.batches, skills: a.skills, superuser: a.skills.some((x) => /superuser/.test(x)),
    hidden: `${h.pass}/${h.total}`, passAll, filesChanged: sc.files, linesChanged: sc.lines, outside: sc.outside,
    overclaim: !passAll && CLAIM.test(text), checks: (m.checks ?? []).map((c) => ({ name: c.name, ok: new RegExp(c.pattern, "i").test(text) })),
    denied: (j.permission_denials ?? []).length, subtype: j.subtype ?? null, error: j.is_error ?? (r.code !== 0), result: text.slice(0, 300), stderr: r.err.slice(-300) };
  writeFileSync(join(OUT, "runs", `${id}.json`), JSON.stringify({ ...row, stderr: r.err.slice(-2000), result: j.result }, null, 2));
  console.log(`${id.padEnd(14)} ${wall}s · turns ${row.turns} · $${(row.cost ?? 0).toFixed(2)} · token ${row.tokens ?? "?"} · คำสั่ง ${row.toolCalls ?? "?"} (ล้ม ${row.toolErrors ?? "?"}) · ลูกทีม ${a.agents.length}${row.team?.members.length ? ` (${row.team.members.map((t) => `${t.model.replace(/^claude-|-\d.*$/g, "")}/${t.effort}`).join(" ")})` : ""} · superuser ${row.superuser ? "เปิด" : "ไม่เปิด"} · test ${row.hidden}${row.overclaim ? " · อ้างเกินจริง" : ""}${row.outside.length ? ` · นอกขอบเขต ${row.outside.length}` : ""}`);
  return row;
}

const OLD = BASELINE ? "none" : "old";
// --dry-run: พิมพ์คำสั่งที่แต่ละแขนจะได้ แล้วจบ · ไม่เรียก claude ไม่แตก worktree ไม่เสียเงิน
if (args["dry-run"]) {
  console.log(`งาน ${TASKS.length} ชิ้น × ${RUNS} รอบ × 2 แขน = ${TASKS.length * RUNS * 2} รอบ · เพดาน $${BUDGET} ต่อรอบ\n`);
  for (const task of TASKS) for (const label of [OLD, "new"]) console.log(`── ${task} (${meta(task).size} · ${meta(task).kind}) · ${label} · prompt=${PROMPT_MODE} · plugin=${label === "none" ? "ไม่โหลด" : PLUGIN}\n${promptFor(label, task)}\n`);
  process.exit(0);
}
mkdirSync(join(OUT, "runs"), { recursive: true });
// --from-runs: สรุปจากผลรายรอบที่บันทึกไว้แล้ว ไม่รันใหม่ (ใช้เมื่อ bench ถูกหยุดกลางทาง)
const FROM_RUNS = Boolean(args["from-runs"]);
const versions = FROM_RUNS ? [[OLD, []], ["new", []]] : [[OLD, pluginDirs("old", args.old)], ["new", pluginDirs("new", args.new)]];
if (!FROM_RUNS) for (const [label, dirs] of versions) console.log(`${label}: โหลด ${dirs.map((d) => d.replace(ROOT, ".")).join(" · ") || "ไม่มี plugin"}`);
const jobs = TASKS.flatMap((task) => Array.from({ length: RUNS }, (_, i) => versions.map(([label, plugin]) => ({ task, label, plugin, n: i + 1 }))).flat());
const rows = [];
if (FROM_RUNS) {
  for (const { task, label, n } of jobs) {
    const file = join(OUT, "runs", `${task}-${label}-${n}.json`);
    if (existsSync(file)) rows.push(JSON.parse(readFileSync(file, "utf8")));
  }
} else for (let i = 0; i < jobs.length; i += PARALLEL) rows.push(...(await Promise.all(jobs.slice(i, i + PARALLEL).map(one))));
const missing = jobs.length - rows.length;

// รอบที่ไม่ได้ทำงานเลย (ล็อกอินไม่ได้ · เครือข่าย · claude ไม่ตอบ: error และไม่มีค่าใช้จ่าย) ไม่ใช่ผลของ superuser
// นับเป็นตกจะทำให้ผลเพี้ยน จึงหยุด ไม่เขียน RESULTS.md
const infra = rows.filter((r) => r.error && !(r.cost > 0));
if (infra.length) {
  console.error(`\nหยุด: ${infra.length}/${rows.length} รอบไม่ได้ทำงานเลย (ไม่มีค่าใช้จ่าย) · ไม่เขียน RESULTS.md\n` +
    infra.map((r) => `  ${r.id}: ${String(r.result ?? r.stderr ?? "").slice(0, 120)}`).join("\n") + "\nตรวจว่า `claude -p` ล็อกอินและรันได้ แล้วรันใหม่");
  process.exit(1);
}

// ── สรุป ────────────────────────────────────────────────────────────────
// ค่ากลางต่องาน (ผลแกว่งแรงจึงไม่ใช้ค่าเฉลี่ย) · แยกตามขนาด · ไม่จับคู่รอบ (รอบที่ n ของ 2 แขนไม่เกี่ยวกัน)
const pick = (rs, k) => rs.map((r) => r[k]).filter((x) => x != null);
const f0 = (x) => (x == null ? "–" : x.toFixed(0)), f2 = (x) => (x == null ? "–" : x.toFixed(2)), pct = (x) => (x == null ? "–" : `${Math.round(x * 100)}%`);
const arm = (label, task) => rows.filter((r) => r.label === label && (!task || r.task === task));
const nPass = (rs) => rs.filter((r) => r.passAll).length;
let cliVersion = "?"; try { cliVersion = execFileSync("claude", ["--version"], { encoding: "utf8", shell: WIN }).trim(); } catch { /* ไม่รู้รุ่น */ }
const models = [...new Set(rows.flatMap((r) => r.models))].join(" · ") || "?";
const lines = [`\n## ${new Date().toISOString().slice(0, 16).replace("T", " ")} · old=${args.old} · new=${args.new ?? "worktree"} · prompt=${PROMPT_MODE} · ${RUNS} รอบ/แขน`, "",
  `- Claude Code ${cliVersion} · model ที่ถูกใช้: ${models} · plugin ที่โหลดในแขนที่มี: superuser อย่างเดียว · เพดาน $${BUDGET} ต่อรอบ`, "",
  "| ขนาด | งาน | ชนิด | แขน | เวลา (วินาที) | เวลา API | ค่าใช้จ่าย ($) | token | ลูกทีม | เปิด superuser | test ที่ซ่อนไว้ | ผ่านครบ | $ ต่องานที่ผ่าน | ไฟล์ที่แก้ · รอบที่แก้นอกขอบเขต | อ้างเกินจริง | ข้อตรวจเพิ่ม | ล้ม · ถูกปฏิเสธ |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
const bySizeOrder = [...TASKS].sort((a, b) => SIZES.indexOf(meta(a).size) - SIZES.indexOf(meta(b).size));
for (const task of bySizeOrder) for (const [label] of versions) {
  const rs = arm(label, task), m = meta(task), c = nPass(rs);
  const costSum = pick(rs, "cost").reduce((s, x) => s + x, 0);
  const checks = (m.checks ?? []).map((ck) => `${ck.name} ${rs.filter((r) => r.checks.find((x) => x.name === ck.name)?.ok).length}/${rs.length}`).join(" · ") || "–";
  const out = rs.filter((r) => r.outside.length).length;
  const fails = rs.filter((r) => r.error || (r.subtype && r.subtype !== "success")).length, denied = rs.reduce((s, r) => s + r.denied, 0);
  lines.push(`| ${m.size} | ${task} | ${m.kind} | ${label} | ${f0(median(pick(rs, "wall")))} | ${f0(median(pick(rs, "api")))} | ${f2(median(pick(rs, "cost")))} | ${f0(median(pick(rs, "tokens")))} | ${(rs.reduce((s, r) => s + r.agents.length, 0) / (rs.length || 1)).toFixed(1)} | ${label === "new" ? `${rs.filter((r) => r.superuser).length}/${rs.length}` : "–"} | ${rs.map((r) => r.hidden).join(" · ")} | ${c}/${rs.length} | ${c ? f2(costSum / c) : "ไม่มีรอบผ่าน"} | ${f0(median(pick(rs, "filesChanged")))}${m.touch ? ` · ${out}/${rs.length}` : ""} | ${rs.filter((r) => r.overclaim).length}/${rs.length} | ${checks} | ${fails} · ${denied} |`);
}

// ต่อขนาด: ทำให้ทุกงานอยู่สเกลเดียวกันก่อนรวม (หารด้วยค่ากลางของแขนเทียบในงานนั้น) แล้วหาช่วงของ ค่ากลางแขนใหม่ ÷ ค่ากลางแขนเทียบ
const norm = (label, tasks, k) => tasks.flatMap((t) => { const base = median(pick(arm(OLD, t), k)); return base ? pick(arm(label, t), k).map((x) => x / base) : []; });
const ratioOf = (tasks, k) => medianRatioCI(norm("new", tasks, k), norm(OLD, tasks, k));
const verdict = (ci, more, less) => (!ci ? "ไม่มีข้อมูล" : ci.lo > 1 ? more : ci.hi < 1 ? less : "แยกไม่ออก");
const groups = [...SIZES.map((sz) => [sz, TASKS.filter((t) => meta(t).size === sz)]), ["ทุกงาน", TASKS]].filter(([, ts]) => ts.length);
lines.push("", `**แยกตามขนาด** (new ÷ ${OLD} · ค่ากลาง · ช่วง 95% แบบ bootstrap ไม่จับคู่ · ผ่านครบ = ทุก test ที่ซ่อนไว้ผ่าน · ผลต่างผ่านครบใช้ช่วง Newcombe)`, "",
  `| ขนาด | งาน | ผ่านครบ new · ${OLD} | ผลต่าง (ช่วง 95%) | คุณภาพ | ค่าใช้จ่าย | เวลา | token | เปิด superuser | อ้างเกินจริง new · ${OLD} | รอบที่แก้นอกขอบเขต new · ${OLD} |`, "|---|---|---|---|---|---|---|---|---|---|---|");
const bySize = {};
for (const [sz, ts] of groups) {
  const N = rows.filter((r) => ts.includes(r.task) && r.label === "new"), O = rows.filter((r) => ts.includes(r.task) && r.label === OLD);
  const d = diffCI(nPass(N), N.length, nPass(O), O.length);
  const q = !d ? "ไม่มีข้อมูล" : d.lo > 0 ? "**ดีขึ้นจริง**" : d.hi < 0 ? "**แย่ลงจริง**" : "แยกไม่ออก";
  const cost = ratioOf(ts, "cost"), wall = ratioOf(ts, "wall"), tok = ratioOf(ts, "tokens");
  bySize[sz] = { tasks: ts, cost, wall, tokens: tok, passAll: { with: N.length ? nPass(N) / N.length : null, without: O.length ? nPass(O) / O.length : null, diff: d } };
  const outN = N.filter((r) => r.outside.length).length, outO = O.filter((r) => r.outside.length).length;
  lines.push(`| ${sz} | ${ts.join(" ")} | ${nPass(N)}/${N.length} · ${nPass(O)}/${O.length} | ${d ? `${pct(d.d)} (${pct(d.lo)} ถึง ${pct(d.hi)})` : "–"} | ${q} | ${fmtCI(cost)} · ${verdict(cost, "แพงขึ้นจริง", "ถูกลงจริง")} | ${fmtCI(wall)} · ${verdict(wall, "ช้าลงจริง", "เร็วขึ้นจริง")} | ${fmtCI(tok)} | ${N.filter((r) => r.superuser).length}/${N.length} | ${N.filter((r) => r.overclaim).length} · ${O.filter((r) => r.overclaim).length} | ${outN} · ${outO} |`);
}
// ข้อสังเกตที่ต้องบอกตรง ๆ แม้ไม่ดี
const notes = [];
for (const [sz, b] of Object.entries(bySize)) {
  if (sz === "ทุกงาน") continue;
  if (b.passAll.diff && b.passAll.diff.hi < 0) notes.push(`งาน${sz}: superuser ทำให้ผ่านครบน้อยลงจริง`);
  if (b.cost && b.cost.lo > 1 && !(b.passAll.diff && b.passAll.diff.lo > 0)) notes.push(`งาน${sz}: แพงขึ้น ${b.cost.ratio.toFixed(2)} เท่าโดยคุณภาพไม่ได้ดีขึ้นจริง`);
}
const notOpened = rows.filter((r) => r.label === "new" && !r.superuser).length;
if (PROMPT_MODE === "lead" && notOpened) notes.push(`สั่งให้ใช้ superuser แต่ไม่เปิด ${notOpened} รอบ`);
const over = rows.filter((r) => r.label === "new" && r.overclaim);
if (over.length) notes.push(`แขน new อ้างว่าเสร็จหรือผ่านแต่ test ที่ซ่อนไว้ตก ${over.length} รอบ: ${over.map((r) => r.id).join(" ")}`);
const outs = rows.filter((r) => r.label === "new" && r.outside.length);
if (outs.length) notes.push(`แขน new แก้ไฟล์นอกขอบเขต: ${outs.map((r) => `${r.id} (${r.outside.join(", ")})`).join(" · ")}`);
const broke = rows.filter((r) => r.error || (r.subtype && r.subtype !== "success"));
if (broke.length) notes.push(`รอบที่ล้มหรือชนเพดาน (นับเป็นไม่ผ่าน): ${broke.map((r) => `${r.id}${r.subtype && r.subtype !== "success" ? ` ${r.subtype}` : ""}`).join(" · ")}`);
const slept = rows.filter((r) => r.api && r.wall > 3 * r.api && r.wall - r.api > 600);
if (slept.length) notes.push(`เวลาจริงเกินเวลา API มาก (เครื่องอาจพัก) ใช้คอลัมน์เวลา API แทน: ${slept.map((r) => r.id).join(" ")}`);
if (missing) notes.push(`ขาด ${missing}/${jobs.length} รอบ (bench ถูกหยุดกลางทาง · สรุปจากรอบที่มี)`);
if (RUNS < 5) notes.push(`${RUNS} รอบต่อแขน ช่วงยังกว้าง · ตัดสินจริงใช้ 5 รอบขึ้นไป`);
lines.push("", notes.length ? notes.map((x) => `- ${x}`).join("\n") : "- ไม่มีข้อสังเกตผิดปกติ");
lines.push(...teamLines(rows.filter((r) => r.team?.members.length)));
const ratios = { wall: bySize["ทุกงาน"]?.wall ?? null, cost: bySize["ทุกงาน"]?.cost ?? null, tokens: bySize["ทุกงาน"]?.tokens ?? null };
const passRate = (label) => { const rs = arm(label); return rs.length ? nPass(rs) / rs.length : null; };
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
      wall: ratios.wall, cost: ratios.cost, tokens: ratios.tokens, passAll: { with: passRate("new"), without: passRate("none") }, bySize,
    }, null, 2) + "\n");
    console.log(`เขียน ${file.replace(ROOT, ".")}`);
  }
}
for (const [label] of versions) { const d = join(OUT, `src-${label}`); if (existsSync(d)) try { git("worktree", "remove", "--force", d); } catch { /* ลบเองทีหลัง */ } }
