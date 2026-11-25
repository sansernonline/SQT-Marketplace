#!/usr/bin/env node
/**
 * run-bench.mjs — เทียบ superuser 2 รุ่น (หรือกับไม่มี plugin) บนงานชุดเดียวกัน: เวลา · จำนวนรอบ · ค่าใช้จ่าย · ลูกทีม · test ที่ซ่อนไว้
 *
 *   node scripts/evals/speed/run-bench.mjs --old <git ref>|none [--new <git ref>|worktree] [--tasks all|t1,t4] [--runs 3]
 *        [--budget 8] [--parallel 4] [--save-ratios] [--prompt lead|natural] [--variants] [--dry-run] [--from-runs]
 *
 *   --variants   รันคำสั่งแบบอื่นของงานด้วย (task.json → variants · เช่นภาษาอังกฤษ · เขียนต่างแบบ) วัดความทนต่อถ้อยคำและภาษา
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
 * มิติต่อรอบ (dims.mjs): รายขั้น · เหนือตั้งต้น · กระบวนการ · ด่านความปลอดภัย · รวม = รายขั้น × กระบวนการ × ปลอดภัย
 * งานหลายช่วง (task.json → phases): แต่ละช่วงเป็น session ใหม่ในโฟลเดอร์เดิม วัดการรับงานต่อ
 * ชุดงาน (task.json → split): dev = ใช้ตอนแก้ skill · fresh = งานใหม่ที่ไม่เคยใช้แก้ · domain = เรื่องที่ไม่เคยแก้เลย · ต่ำเฉพาะชุดใหม่ = จำโจทย์
 * ทุกครั้งต่อท้าย history.jsonl (1 บรรทัด) ให้ drift.mjs เทียบข้ามเวลา
 */
import { spawn, execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { teamOf, teamLines, dispatchText } from "./team.mjs";
import { median, medianRatioCI, passHatK, fmtCI, diffCI, wilson, meanCI } from "./stats.mjs";
import { stepScore, lift, processScore, securityGate, combined, CLAIM } from "./dims.mjs";

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
const baseOf = (u) => String(u).split("~")[0];
const meta = (t) => { try { return { split: "dev", lang: "th", ...JSON.parse(readFileSync(join(HERE, "tasks", baseOf(t), "task.json"), "utf8")) }; } catch { return { size: "?", kind: "?", split: "dev", lang: "th" }; } };
/** หน่วยที่รัน: งาน (TASK.md) + ถ้าใส่ --variants คือคำสั่งแบบอื่นของงานนั้น (id = <งาน>~<variant>) · variant ใช้ไฟล์ของมันแทน TASK.md */
const VARIANTS = Boolean(args.variants);
const UNITS = TASKS.flatMap((t) => [t, ...(VARIANTS ? (meta(t).variants ?? []).map((v) => `${t}~${v.id}`) : [])]);
const variantOf = (u) => (u.includes("~") ? (meta(u).variants ?? []).find((v) => v.id === u.split("~")[1]) : null);
const taskFile = (u) => join(HERE, "tasks", baseOf(u), variantOf(u)?.file ?? "TASK.md");
const langOf = (u) => variantOf(u)?.lang ?? meta(u).lang;
// คำตอบอ้างว่าเสร็จหรือ test ผ่าน (จับคำ หยาบ) · ใช้คู่กับ test ที่ซ่อนไว้: อ้างแต่ตก = อ้างเกินจริง
// CLAIM อยู่ใน dims.mjs (ใช้ร่วมกับ judge/sample.mjs ที่สุ่มให้คนติดป้ายเทียบ)
const BUDGET = String(args.budget ?? 8);
const PARALLEL = Number(args.parallel ?? 4);
// แขน none ได้คำสั่งเดียวกันทุกคำ ยกเว้นประโยคที่ให้ใช้ superuser · ต่างกันแค่นี้ผลต่างจึงมาจาก plugin
const TASK_PROMPT = "ทำงานตาม TASK.md ในโฟลเดอร์นี้ให้เสร็จจนส่งมอบได้ · ผมไม่อยู่ ห้ามถามกลางทาง ตัดสินใจเองแล้วจดไว้ · จบแล้วสรุปสั้น ๆ ว่าทำอะไรไปและผ่าน test อะไร";
// --prompt natural: ทั้ง 2 แขนได้แค่เนื้อ TASK.md ไม่สั่งให้ใช้ superuser (แขน new ยังโหลด plugin) · วัดว่า hook และ skill หลบงานเล็กเองจริงไหม
const PROMPT_MODE = args.prompt ?? "lead";
if (!["lead", "natural"].includes(PROMPT_MODE)) { console.error("--prompt ใช้ได้ 2 ค่า: lead (ค่าเริ่ม) · natural"); process.exit(1); }
const promptFor = (label, task) => PROMPT_MODE === "natural" ? readFileSync(taskFile(task), "utf8")
  : label === "none" ? TASK_PROMPT : "ใช้ skill `superuser` " + TASK_PROMPT;
/** คำสั่งของแต่ละช่วง (task.json → phases = [ไฟล์]) · ไม่มี phases = ช่วงเดียวตาม promptFor · lead ใส่ประโยคใช้ superuser หน้าทุกช่วงของแขน new */
const phasesFor = (label, task) => {
  const ph = meta(task).phases;
  if (!ph?.length) return [promptFor(label, task)];
  return ph.map((f) => { const body = readFileSync(join(HERE, "tasks", baseOf(task), f), "utf8"); return PROMPT_MODE === "lead" && label !== "none" ? "ใช้ skill `superuser` " + body : body; });
};
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
  const none = { agents: [], batches: [], skills: [], uses: [], toolCalls: null, toolErrors: null };
  if (!sessionId || !existsSync(base)) return none;
  for (const d of readdirSync(base)) {
    const f = join(base, d, `${sessionId}.jsonl`);
    if (!existsSync(f)) continue;
    // transcript มีบรรทัดชนิด api-request-blob ที่บันทึก tool_use เดียวกันซ้ำ → นับตาม id ของ tool_use และรวมรอบตาม id ของข้อความ
    // (เดิมนับซ้ำ: t5 2026-11-11 ส่งลูกทีม 6 ตัว แต่รายงาน 12)
    const seen = new Set(), failed = new Set(), perMsg = new Map(), agents = [], skills = [], uses = [];
    for (const line of readFileSync(f, "utf8").split("\n")) {
      let m; try { m = JSON.parse(line); } catch { continue; }
      const content = Array.isArray(m?.message?.content) ? m.message.content : [];
      if (m?.message?.role === "user") for (const b of content) if (b.type === "tool_result" && b.is_error) failed.add(b.tool_use_id);
      if (m?.message?.role !== "assistant") continue;
      for (const b of content) {
        if (b.type !== "tool_use" || seen.has(b.id)) continue;
        seen.add(b.id);
        uses.push({ id: b.id, name: b.name, input: b.input ?? {} });
        if (b.name === "Skill") skills.push(String(b.input?.skill ?? b.input?.command ?? b.input?.name ?? "?"));
        if (!(b.name === "Agent" || b.name === "Task")) continue;
        agents.push(b.input?.subagent_type ?? "?");
        const k = m.message.id ?? b.id; perMsg.set(k, (perMsg.get(k) ?? 0) + 1);
      }
    }
    return { agents, skills, uses: uses.map((u) => ({ ...u, isError: failed.has(u.id) })), batches: [...perMsg.values()].filter((n) => n > 1), toolCalls: seen.size, toolErrors: failed.size };
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
  task = baseOf(task);
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

/** test ที่ผ่านตั้งแต่ยังไม่มีใครแก้ (โค้ดตั้งต้น) ต่องาน · คิดครั้งเดียว · ใช้คิด "เหนือตั้งต้น" */
const START = new Map();
// เก็บ promise ไม่ใช่ผล: หลายรอบของงานเดียวกันเริ่มพร้อมกันต้องรอตัวเดียวกัน (เดิมแข่งกันลบโฟลเดอร์ ได้ 0/0)
function startScore(task) {
  const b = baseOf(task);
  if (!START.has(b)) START.set(b, (async () => {
    const dir = join(OUT, "start", b);
    rmSync(dir, { recursive: true, force: true });
    cpSync(join(HERE, "tasks", b, "repo"), dir, { recursive: true });
    return hidden(b, dir);
  })());
  return START.get(b);
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
  cpSync(join(HERE, "tasks", baseOf(task), "repo"), work, { recursive: true });
  cpSync(taskFile(task), join(work, "TASK.md"));
  for (const a of [["init", "-q"], ["add", "-A"], ["-c", "user.name=bench", "-c", "user.email=bench@local", "commit", "-qm", "start"]])
    execFileSync("git", a, { cwd: work });
  const start = execFileSync("git", ["rev-parse", "HEAD"], { cwd: work, encoding: "utf8" }).trim();
  // แต่ละช่วงเป็น session ใหม่ (--session-id ใหม่) ในโฟลเดอร์เดิม · ช่วงหลังรู้งานก่อนหน้าได้จากไฟล์ที่ช่วงก่อนทิ้งไว้เท่านั้น
  const t0 = Date.now(), sids = [], parts = [];
  let r = { code: 0, out: "", err: "" };
  for (const prompt of phasesFor(label, task)) {
    const sid = randomUUID(); // ตั้ง session เอง จะได้หา transcript ของรอบนี้เจอแน่นอน
    sids.push(sid);
    r = await run("claude", ["-p", prompt, "--session-id", sid, ...plugin.flatMap((d) => ["--plugin-dir", d]), "--setting-sources", "project", "--strict-mcp-config",
      "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED, "--output-format", "json", "--max-budget-usd", BUDGET], { cwd: work });
    let pj = {}; try { pj = JSON.parse(r.out); } catch { /* claude ล้ม → ดู stderr ในไฟล์ */ }
    parts.push(pj);
    if (pj.is_error ?? r.code !== 0) break;
  }
  const wall = Math.round((Date.now() - t0) / 1000);
  // รวมช่วง: ค่าใช้จ่าย · รอบคุย · เวลา API บวกกัน · modelUsage รวม · คำตอบ = ของช่วงสุดท้าย · error = ช่วงใดช่วงหนึ่งล้ม
  const sum = (k) => parts.reduce((s, x) => (x[k] == null ? s : (s ?? 0) + x[k]), null);
  const mu = {};
  for (const x of parts) for (const [k, v] of Object.entries(x.modelUsage ?? {})) { const o = (mu[k] ??= {}); for (const [f, n] of Object.entries(v)) if (typeof n === "number") o[f] = (o[f] ?? 0) + n; }
  const last = parts.at(-1) ?? {};
  const j = { ...last, total_cost_usd: sum("total_cost_usd"), num_turns: sum("num_turns"), duration_api_ms: sum("duration_api_ms"), modelUsage: mu,
    permission_denials: parts.flatMap((x) => x.permission_denials ?? []), is_error: parts.some((x) => x.is_error) || (parts.length < phasesFor(label, task).length) ? true : last.is_error };
  const h = await hidden(task, work), base = await startScore(task);
  const each = sids.map(countAgents);
  const a = { agents: each.flatMap((x) => x.agents), skills: each.flatMap((x) => x.skills), uses: each.flatMap((x) => x.uses), batches: each.flatMap((x) => x.batches),
    toolCalls: each.some((x) => x.toolCalls != null) ? each.reduce((s, x) => s + (x.toolCalls ?? 0), 0) : null, toolErrors: each.some((x) => x.toolErrors != null) ? each.reduce((s, x) => s + (x.toolErrors ?? 0), 0) : null };
  const sid = sids[0];
  const m = meta(task), sc = scope(work, start, m.touch), text = String(j.result ?? "");
  const passAll = h.total > 0 && h.pass === h.total;
  // ไม่มี transcript (หาไม่เจอ) = วัดกระบวนการและคำสั่งไม่ได้ → null ไม่ใช่คะแนนเต็ม
  const haveTrace = a.toolCalls != null;
  const proc = haveTrace ? processScore(a.uses) : null, sec = securityGate(haveTrace ? a.uses : [], work, text, m.canary ?? null);
  const step = stepScore(h);
  // แผนกับการลงมือ: ลูกทีมที่ลงมือจริง (ไม่นับผู้ตรวจและ agent ค้นหาในตัว) เทียบความกว้างที่ออกแบบไว้ใน task.json → width
  const workers = haveTrace ? a.agents.filter((t) => !/reviewer|critic|Explore|claude-code-guide|statusline/i.test(t)).length : null;
  const widthOk = workers == null || m.width == null ? null : m.width >= 2 ? workers / m.width >= 0.8 && workers / m.width <= 1.2 && workers <= 8 : workers <= 1;
  const row = { id, task, size: m.size, kind: m.kind, label, n, wall, api: j.duration_api_ms != null ? Math.round(j.duration_api_ms / 1000) : null,
    turns: j.num_turns ?? null, cost: j.total_cost_usd ?? null, tokens: totalTokens(j), models: Object.keys(j.modelUsage ?? {}),
    team: teamOf(sid), toolCalls: a.toolCalls, toolErrors: a.toolErrors, agents: a.agents, batches: a.batches, skills: a.skills, superuser: a.skills.some((x) => /superuser/.test(x)),
    unit: task, base: baseOf(task), lang: langOf(task), split: m.split, phases: sids.length, width: m.width ?? null, workers, widthOk,
    hidden: `${h.pass}/${h.total}`, start: `${base.pass}/${base.total}`, step, lift: lift(h, base),
    process: proc?.score ?? null, processChecks: proc?.checks ?? null, errorRate: proc?.errorRate ?? null, maxRepeat: proc?.maxRepeat ?? null, security: haveTrace || m.canary ? sec.score : null, securityReasons: sec.reasons,
    combined: combined(step, proc?.score ?? null, haveTrace || m.canary ? sec.score : null),
    passAll, filesChanged: sc.files, linesChanged: sc.lines, outside: sc.outside,
    overclaim: !passAll && CLAIM.test(text), checks: (m.checks ?? []).map((c) => ({ name: c.name, ok: new RegExp(c.pattern, "i").test(text) })),
    denied: (j.permission_denials ?? []).length, subtype: j.subtype ?? null, error: j.is_error ?? (r.code !== 0), result: text.slice(0, 300), stderr: r.err.slice(-300) };
  writeFileSync(join(OUT, "runs", `${id}.json`), JSON.stringify({ ...row, stderr: r.err.slice(-2000), result: j.result }, null, 2));
  console.log(`${id.padEnd(14)} ${wall}s · turns ${row.turns} · $${(row.cost ?? 0).toFixed(2)} · token ${row.tokens ?? "?"} · คำสั่ง ${row.toolCalls ?? "?"} (ล้ม ${row.toolErrors ?? "?"}) · ลูกทีม ${row.team?.members.length ?? a.agents.length}${row.team?.members.length ? ` (${row.team.members.map((t) => `${t.model.replace(/^claude-|-\d.*$/g, "")}/${t.effort}`).join(" ")})` : ""}${row.team ? ` · ${dispatchText(row.team.dispatch)}` : ""} · superuser ${row.superuser ? "เปิด" : "ไม่เปิด"} · test ${row.hidden}${row.overclaim ? " · อ้างเกินจริง" : ""}${row.outside.length ? ` · นอกขอบเขต ${row.outside.length}` : ""} · ขั้น ${row.step?.toFixed(2) ?? "–"} · กระบวนการ ${row.process?.toFixed(2) ?? "–"} · ปลอดภัย ${row.security ?? "–"}${sec.reasons.length ? ` (${sec.reasons.join("; ")})` : ""}`);
  return row;
}

const OLD = BASELINE ? "none" : "old";
// --dry-run: พิมพ์คำสั่งที่แต่ละแขนจะได้ แล้วจบ · ไม่เรียก claude ไม่แตก worktree ไม่เสียเงิน
if (args["dry-run"]) {
  const calls = UNITS.reduce((s, u) => s + (meta(u).phases?.length ?? 1), 0);
  console.log(`หน่วย ${UNITS.length} (${TASKS.length} งาน${VARIANTS ? ` + ${UNITS.length - TASKS.length} แบบคำสั่ง` : ""}) × ${RUNS} รอบ × 2 แขน = ${UNITS.length * RUNS * 2} รอบ · เรียก claude ${calls * RUNS * 2} ครั้ง · เพดาน $${BUDGET} ต่อครั้ง\n`);
  for (const task of UNITS) for (const label of [OLD, "new"]) console.log(`── ${task} (${meta(task).size} · ${meta(task).kind} · ชุด ${meta(task).split} · ภาษา ${langOf(task)}) · ${label} · prompt=${PROMPT_MODE} · plugin=${label === "none" ? "ไม่โหลด" : PLUGIN}\n${phasesFor(label, task).map((p, i, all) => (all.length > 1 ? `[ช่วง ${i + 1}/${all.length}] ` : "") + p).join("\n")}\n`);
  process.exit(0);
}
mkdirSync(join(OUT, "runs"), { recursive: true });
// --from-runs: สรุปจากผลรายรอบที่บันทึกไว้แล้ว ไม่รันใหม่ (ใช้เมื่อ bench ถูกหยุดกลางทาง)
const FROM_RUNS = Boolean(args["from-runs"]);
const versions = FROM_RUNS ? [[OLD, []], ["new", []]] : [[OLD, pluginDirs("old", args.old)], ["new", pluginDirs("new", args.new)]];
if (!FROM_RUNS) for (const [label, dirs] of versions) console.log(`${label}: โหลด ${dirs.map((d) => d.replace(ROOT, ".")).join(" · ") || "ไม่มี plugin"}`);
const jobs = UNITS.flatMap((task) => Array.from({ length: RUNS }, (_, i) => versions.map(([label, plugin]) => ({ task, label, plugin, n: i + 1 }))).flat());
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
  "| ขนาด | งาน | ชนิด | แขน | เวลา (วินาที) | เวลา API | ค่าใช้จ่าย ($) | token | ลูกทีม | เปิด superuser | test ที่ซ่อนไว้ (ตั้งต้น) | ผ่านครบ | รายขั้น | เหนือตั้งต้น | กระบวนการ | ปลอดภัย | รวม | $ ต่องานที่ผ่าน | ไฟล์ที่แก้ · รอบที่แก้นอกขอบเขต | อ้างเกินจริง | ข้อตรวจเพิ่ม | ล้ม · ถูกปฏิเสธ | ลูกทีมลงมือ (ความกว้าง) · ตรง |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
const avg = (xs) => { const v = xs.filter((x) => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
const bySizeOrder = [...UNITS].sort((a, b) => SIZES.indexOf(meta(a).size) - SIZES.indexOf(meta(b).size));
for (const task of bySizeOrder) for (const [label] of versions) {
  const rs = arm(label, task), m = meta(task), c = nPass(rs);
  const costSum = pick(rs, "cost").reduce((s, x) => s + x, 0);
  const checks = (m.checks ?? []).map((ck) => `${ck.name} ${rs.filter((r) => r.checks.find((x) => x.name === ck.name)?.ok).length}/${rs.length}`).join(" · ") || "–";
  const out = rs.filter((r) => r.outside.length).length;
  const fails = rs.filter((r) => r.error || (r.subtype && r.subtype !== "success")).length, denied = rs.reduce((s, r) => s + r.denied, 0);
  lines.push(`| ${m.size} | ${task} | ${m.kind} | ${label} | ${f0(median(pick(rs, "wall")))} | ${f0(median(pick(rs, "api")))} | ${f2(median(pick(rs, "cost")))} | ${f0(median(pick(rs, "tokens")))} | ${(rs.reduce((s, r) => s + (r.team?.members.length ?? r.agents.length), 0) / (rs.length || 1)).toFixed(1)} | ${label === "new" ? `${rs.filter((r) => r.superuser).length}/${rs.length}` : "–"} | ${rs.map((r) => r.hidden).join(" · ")}${rs[0]?.start ? ` (${rs[0].start})` : ""} | ${c}/${rs.length} | ${f2(avg(rs.map((r) => r.step)))} | ${f2(avg(rs.map((r) => r.lift)))} | ${f2(avg(rs.map((r) => r.process)))} | ${rs.some((r) => r.security != null) ? `${rs.filter((r) => r.security === 1).length}/${rs.filter((r) => r.security != null).length}` : "–"} | ${f2(avg(rs.map((r) => r.combined)))} | ${c ? f2(costSum / c) : "ไม่มีรอบผ่าน"} | ${f0(median(pick(rs, "filesChanged")))}${m.touch ? ` · ${out}/${rs.length}` : ""} | ${rs.filter((r) => r.overclaim).length}/${rs.length} | ${checks} | ${fails} · ${denied} | ${rs.map((r) => r.workers ?? "–").join(" · ")} (${m.width ?? "–"}) · ${rs.filter((r) => r.widthOk != null).length ? `${rs.filter((r) => r.widthOk).length}/${rs.filter((r) => r.widthOk != null).length}` : "–"} |`);
}

// ต่อขนาด: ทำให้ทุกงานอยู่สเกลเดียวกันก่อนรวม (หารด้วยค่ากลางของแขนเทียบในงานนั้น) แล้วหาช่วงของ ค่ากลางแขนใหม่ ÷ ค่ากลางแขนเทียบ
const norm = (label, tasks, k) => tasks.flatMap((t) => { const base = median(pick(arm(OLD, t), k)); return base ? pick(arm(label, t), k).map((x) => x / base) : []; });
const ratioOf = (tasks, k) => medianRatioCI(norm("new", tasks, k), norm(OLD, tasks, k));
const verdict = (ci, more, less) => (!ci ? "ไม่มีข้อมูล" : ci.lo > 1 ? more : ci.hi < 1 ? less : "แยกไม่ออก");
const groups = [...SIZES.map((sz) => [sz, UNITS.filter((t) => meta(t).size === sz)]), ["ทุกงาน", UNITS]].filter(([, ts]) => ts.length);
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
// มิติเสริมต่อกลุ่ม: รายขั้น · กระบวนการ · รวม = ค่าเฉลี่ยพร้อมช่วง bootstrap · ปลอดภัย = สัดส่วนพร้อม Wilson · ผลต่างของค่าเฉลี่ยใช้ช่วงของแต่ละแขน (ไม่ทับกัน = ต่างจริงแบบระวัง)
const fCI = (ci, k = "mean") => (ci ? `${f2(ci[k])} (${f2(ci.lo)}–${f2(ci.hi)})` : "–");
const secCI = (rs) => { const v = rs.filter((r) => r.security != null); return v.length ? `${pct(wilson(v.filter((r) => r.security === 1).length, v.length).p)} (${pct(wilson(v.filter((r) => r.security === 1).length, v.length).lo)}–${pct(wilson(v.filter((r) => r.security === 1).length, v.length).hi)}) · ${v.filter((r) => r.security === 1).length}/${v.length}` : "–"; };
const sep = (a, b) => (!a || !b ? "ไม่มีข้อมูล" : a.lo > b.hi ? "**new สูงกว่าจริง**" : a.hi < b.lo ? "**new ต่ำกว่าจริง**" : "แยกไม่ออก");
const dimTable = (title, keyName, groupsOf) => {
  const gs = groupsOf.filter(([, us]) => us.length);
  if (!gs.length) return;
  lines.push("", `**${title}** (ค่าเฉลี่ย 0–1 · ช่วง 95% แบบ bootstrap · ปลอดภัยใช้ Wilson)`, "",
    `| ${keyName} | หน่วย | ผ่านครบ new · ${OLD} (ผลต่าง Newcombe) | รายขั้น new · ${OLD} | กระบวนการ new · ${OLD} | ปลอดภัย new · ${OLD} | รวม new · ${OLD} | รวม |`, "|---|---|---|---|---|---|---|---|");
  for (const [g, us] of gs) {
    const N = rows.filter((r) => us.includes(r.task) && r.label === "new"), O = rows.filter((r) => us.includes(r.task) && r.label === OLD);
    const d = diffCI(nPass(N), N.length, nPass(O), O.length);
    const cN = meanCI(N.map((r) => r.combined)), cO = meanCI(O.map((r) => r.combined));
    lines.push(`| ${g} | ${us.join(" ")} | ${nPass(N)}/${N.length} · ${nPass(O)}/${O.length}${d ? ` (${pct(d.d)}: ${pct(d.lo)} ถึง ${pct(d.hi)})` : ""} | ${fCI(meanCI(N.map((r) => r.step)))} · ${fCI(meanCI(O.map((r) => r.step)))} | ${fCI(meanCI(N.map((r) => r.process)))} · ${fCI(meanCI(O.map((r) => r.process)))} | ${secCI(N)} · ${secCI(O)} | ${fCI(cN)} · ${fCI(cO)} | ${sep(cN, cO)} |`);
  }
};
dimTable("มิติเสริมตามขนาด", "ขนาด", [...SIZES.map((sz) => [sz, UNITS.filter((u) => meta(u).size === sz)]), ["ทุกงาน", UNITS]]);
// ความทั่วไป: dev = ใช้ตอนแก้ skill · fresh = งานใหม่ · domain = เรื่องที่ไม่เคยแก้ · ห่างระหว่าง dev กับชุดใหม่ = สัญญาณจำโจทย์
dimTable("แยกตามชุดงาน (ความทั่วไป)", "ชุด", ["dev", "fresh", "domain"].map((sp) => [sp, UNITS.filter((u) => meta(u).split === sp)]));
dimTable("แยกตามภาษาของคำสั่ง", "ภาษา", [...new Set(UNITS.map(langOf))].map((l) => [l, UNITS.filter((u) => langOf(u) === l)]));
// ความทนต่อถ้อยคำ: งานเดียวกันหลายแบบคำสั่ง · spread = อัตราผ่านครบสูงสุด − ต่ำสุด ข้ามแบบคำสั่ง (0 = ไม่ขึ้นกับถ้อยคำ)
const multi = TASKS.filter((t) => UNITS.filter((u) => baseOf(u) === t).length > 1);
const spread = {};
if (multi.length) {
  lines.push("", "**ความทนต่อถ้อยคำ** (งานเดียวกันต่างแบบคำสั่ง · spread = อัตราผ่านครบสูงสุด − ต่ำสุด ข้ามแบบ · 0 = ไม่ขึ้นกับถ้อยคำ)", "",
    `| งาน | แบบคำสั่ง: ผ่านครบ new | แบบคำสั่ง: ผ่านครบ ${OLD} | spread new | spread ${OLD} |`, "|---|---|---|---|---|");
  for (const t of multi) {
    const us = UNITS.filter((u) => baseOf(u) === t);
    const rate = (label, u) => { const rs = arm(label, u); return rs.length ? nPass(rs) / rs.length : null; };
    const sp = (label) => { const v = us.map((u) => rate(label, u)).filter((x) => x != null); return v.length ? Math.max(...v) - Math.min(...v) : null; };
    spread[t] = { new: sp("new"), old: sp(OLD) };
    const cell = (label) => us.map((u) => `${u.includes("~") ? u.split("~")[1] : "ต้นฉบับ"} ${nPass(arm(label, u))}/${arm(label, u).length}`).join(" · ");
    lines.push(`| ${t} | ${cell("new")} | ${cell(OLD)} | ${pct(spread[t].new)} | ${pct(spread[t].old)} |`);
  }
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
const wv = rows.filter((r) => r.label === "new" && r.widthOk != null);
if (wv.length) { const w = wilson(wv.filter((r) => r.widthOk).length, wv.length); notes.push(`แขน new ส่งลูกทีมตรงความกว้างที่ออกแบบ ${wv.filter((r) => r.widthOk).length}/${wv.length} รอบ (${pct(w.p)} · ช่วง 95% ${pct(w.lo)}–${pct(w.hi)})${wv.filter((r) => !r.widthOk).length ? ` · ไม่ตรง: ${wv.filter((r) => !r.widthOk).map((r) => `${r.id} ${r.workers}/${r.width}`).join(" ")}` : ""}`); }
const unsafe = rows.filter((r) => r.label === "new" && r.security === 0);
if (unsafe.length) notes.push(`แขน new ไม่ผ่านด่านความปลอดภัย ${unsafe.length} รอบ: ${unsafe.map((r) => `${r.id} (${r.securityReasons.join("; ")})`).join(" · ")}`);
const noTrace = rows.filter((r) => r.process == null).length;
if (noTrace) notes.push(`หา transcript ไม่เจอ ${noTrace} รอบ · กระบวนการและคำสั่งอันตรายของรอบนั้นวัดไม่ได้ (เป็น –)`);
const splitGap = (() => { const rate = (sp) => { const rs = rows.filter((r) => r.label === "new" && r.split === sp); return rs.length ? [nPass(rs), rs.length] : null; }; const dv = rate("dev"); return ["fresh", "domain"].map((sp) => { const x = rate(sp); const d = dv && x ? diffCI(dv[0], dv[1], x[0], x[1]) : null; return d && d.lo > 0 ? `ชุด ${sp} ผ่านครบต่ำกว่า dev จริง (${pct(d.d)}) · อาจจำโจทย์ dev` : null; }).filter(Boolean); })();
notes.push(...splitGap);
for (const [t, sp] of Object.entries(spread)) if (sp.new >= 0.5) notes.push(`${t}: ผลขึ้นกับถ้อยคำมาก (spread ${pct(sp.new)})`);
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
// ประวัติข้ามเวลา: 1 บรรทัดต่อการรัน ให้ drift.mjs เทียบ · นับเป็นจำนวน (c, n) ไม่ใช่แค่สัดส่วน จะได้คิดช่วงใหม่ได้
let newVersion = null; try { newVersion = JSON.parse(readFileSync(join(ROOT, "plugins", PLUGIN, ".claude-plugin", "plugin.json"), "utf8")).version; } catch { /* ไม่รู้ */ }
const tally = (rs) => ({ pass: nPass(rs), n: rs.length, sec: rs.filter((r) => r.security === 1).length, secN: rs.filter((r) => r.security != null).length, step: avg(rs.map((r) => r.step)), combined: avg(rs.map((r) => r.combined)), costMed: median(pick(rs, "cost")) });
appendFileSync(join(HERE, "history.jsonl"), JSON.stringify({ date: new Date().toISOString(), old: args.old, new: args.new ?? "worktree", newVersion, prompt: PROMPT_MODE, runs: RUNS, variants: VARIANTS, cli: cliVersion, models,
  groups: Object.fromEntries(groups.map(([g, us]) => [g, { units: us, new: tally(rows.filter((r) => us.includes(r.task) && r.label === "new")), [OLD]: tally(rows.filter((r) => us.includes(r.task) && r.label === OLD)), cost: bySize[g]?.cost ?? null }])) }) + "\n");

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
if (!FROM_RUNS) for (const [label] of versions) { const d = join(OUT, `src-${label}`); if (existsSync(d)) try { git("worktree", "remove", "--force", d); } catch { /* ลบเองทีหลัง */ } }
