#!/usr/bin/env node
/**
 * run-review-recall.mjs — reviewer ของ superuser เจอข้อผิดที่ฝังไว้ในงานกี่ข้อ (recall) · ให้คะแนนด้วยการเทียบข้อความ ไม่ใช้ผู้ตัดสิน
 *
 *   node evals/review-recall/run-review-recall.mjs --verify      ตรวจชุดเคส (ฟรี ไม่เรียก claude)
 *   node evals/review-recall/run-review-recall.mjs --run [--cases r1,r5] [--runs 1] [--model <reviewer.md>] [--effort <reviewer.md>]
 *        [--budget 1] [--parallel 4] [--label current] [--plugins superuser]
 *
 * 1 เคส 1 รอบ = claude -p --agent superuser:reviewer ตัวใหม่ ในโฟลเดอร์ชั่วคราวนอก repo ที่มีแค่ไฟล์งาน (ไม่มี case.json)
 * reviewer ได้คำขอ · จบเมื่อ · รายชื่อไฟล์ · skill ที่งานต้องทำตาม — ไม่เห็นรายการข้อผิด
 * เจอ = แถวปัญหาในรายงานอ้าง ไฟล์:บรรทัด ของข้อนั้น · ยกข้อความที่ฝังมาตรงตัว · หรือมีคำสำคัญของข้อนั้นตั้งแต่ 2 คำในแถวเดียวกัน
 * ไม่นับหัวข้อ "ตรวจแล้วไม่เจอปัญหา" · ผลรายรอบ → _to_delete/review-recall/<label>/ · สรุปต่อท้าย RESULTS.md
 */
import { spawn } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const CASES = join(HERE, "cases");
const AGENT = "superuser:reviewer";
const AGENT_FILE = join(ROOT, "plugins", "superuser", "agents", "reviewer.md");

const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const opt = (name, def) => { const i = argv.indexOf(`--${name}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def; };
// ค่าเริ่มของโมเดลและ effort อ่านจาก frontmatter ของ reviewer.md → แก้ที่ agent แล้วชุดนี้ตามเอง
const frontmatter = existsSync(AGENT_FILE) ? readFileSync(AGENT_FILE, "utf8").split(/^---\s*$/m)[1] ?? "" : "";
const fm = (key) => frontmatter.match(new RegExp(`^${key}:\\s*(\\S+)`, "m"))?.[1];
const MODEL = opt("model", fm("model") ?? "sonnet");
const EFFORT = opt("effort", fm("effort") ?? "medium");
const BUDGET = opt("budget", "1");
const RUNS = Math.max(1, Number(opt("runs", "1")) || 1);
const PARALLEL = Math.max(1, Number(opt("parallel", "4")) || 1);
const LABEL = opt("label", "current");
const PLUGINS = opt("plugins", "superuser").split(",").filter(Boolean).map((p) => join(ROOT, "plugins", p));
const ONLY = opt("cases", "").split(",").filter(Boolean);
const OUT = join(ROOT, "_to_delete", "review-recall", LABEL);

// ชนิดข้อผิดที่ฝังได้ (มาจากรายการตรวจใน reviewer.md) · ชื่อไทยใช้ในตารางผล
const TYPES = {
  "wrong-total": "ยอดรวมผิด", "no-source": "ตัวเลขไม่มีแหล่ง", placeholder: "ช่องเติมค้าง", "old-term": "คำเดิมค้างหลังเปลี่ยนชื่อ",
  "weak-test": "test ไม่คุมโค้ดที่แก้", "thai-connectives": "ซึ่ง/โดย เกินงบ", "broken-link": "ลิงก์เสีย", "era-mix": "พ.ศ. ปน ค.ศ.",
};
// reviewer อ่าน คำนวณ และรัน test ได้ · เขียนได้แค่รายงานของตัวเองและสำเนาทิ้งใต้ _to_delete/ (กติกาใน reviewer.md)
// ปิดเว็บ: ข้อผิดทุกข้อตรวจได้จากไฟล์ในเคส · ค่าใช้จ่ายจึงคงที่กว่า
const ALLOWED = ["Read", "Grep", "Glob", "Skill", ...["node", "python", "python3", "py", "grep", "rg", "ls", "cat", "head", "tail", "wc",
  "find", "sed", "awk", "sort", "uniq", "diff", "echo", "printf", "mkdir", "cp", "cd", "test"].map((c) => `Bash(${c} *)`)];

const text = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const linesOf = (p) => text(p).replace(/\n$/, "").split("\n");
const rangeOf = (line) => (line == null ? null : Array.isArray(line) ? line : [line, line]);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const show = (a) => (/[\s"&|<>^()]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);

/** ไฟล์งานของเคส (path สัมพัทธ์ คั่นด้วย /) ทุกไฟล์ยกเว้น case.json */
function deliverables(dir, base = dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return deliverables(p, base);
    const rel = relative(base, p).replace(/\\/g, "/");
    return rel === "case.json" ? [] : [rel];
  }).sort();
}

function loadCase(folder) {
  const dir = join(CASES, folder);
  try { return { dir, folder, ...JSON.parse(text(join(dir, "case.json"))) }; }
  catch (e) { return { dir, folder, id: folder, error: `อ่าน case.json ไม่ได้: ${e.message}` }; }
}
const ALL = readdirSync(CASES).filter((d) => existsSync(join(CASES, d, "case.json"))).sort().map(loadCase);
const picked = ALL.filter((c) => !ONLY.length || ONLY.some((o) => c.id === o || c.id.startsWith(`${o}-`)));
const pluginDirs = () => PLUGINS.filter((d) => existsSync(join(d, ".claude-plugin", "plugin.json")));

/** สิ่งที่หัวหน้าทีมส่งให้ reviewer ตามหัวข้อ "What you get" ใน reviewer.md — ไม่มีรายการข้อผิด */
function promptOf(c) {
  return [
    "ตรวจงานชิ้นนี้ รอบที่ 1 · ไฟล์งานอยู่ในโฟลเดอร์ปัจจุบัน", "",
    "## ผู้ใช้ขอ (คำของผู้ใช้)", c.request, "",
    "## จบเมื่อ", ...[].concat(c.done_when ?? []).map((d) => `- ${d}`), "",
    "## ไฟล์ที่ส่งมอบ", ...deliverables(c.dir).map((f) => `- \`${f}\``), "",
    "## skill ที่งานต้องทำตาม", (c.skills ?? ["human-writing"]).join(" · "),
  ].join("\n");
}

// --add-dir ให้อ่าน references และสคริปต์ของ skill ได้เหมือนตอนใช้จริง · โฟลเดอร์ evals/ ไม่อยู่ในนั้น reviewer จึงไม่เห็นคำเฉลย
const claudeArgs = (dirs) => ["-p", "--agent", AGENT, ...dirs.flatMap((d) => ["--plugin-dir", d]), "--add-dir", ...dirs,
  "--setting-sources", "project", "--strict-mcp-config", "--model", MODEL, "--effort", EFFORT,
  "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED, "--disallowedTools", "WebSearch", "WebFetch",
  "--output-format", "stream-json", "--verbose", "--max-budget-usd", BUDGET];

// ---- ให้คะแนน ----
const HEADING = /^\s*(#{1,6}\s|\*\*[^*]+\*\*\s*:?\s*$)/;
const ROW = /^\s*(\||[-*+]\s|\d+[.)]\s)/;
const SEPARATOR = /^\s*\|[\s:|-]+$/;
const SEVERITY = /สูง|กลาง|ต่ำ|\b(high|medium|low)\b/i;
// หัวข้อที่ reviewer จดสิ่งที่ตรวจแล้วผ่าน: เป็นหัวข้อ หรือบรรทัดสั้นที่มีแค่ชื่อหัวข้อ (แถวยาวที่บังเอิญมีคำนี้ไม่นับ)
const isPassedHeader = (l) => /ตรวจแล้วไม่เจอปัญหา/.test(l) && (HEADING.test(l) || l.replace(/[#*_:\s]/g, "").length <= 25);
/** ตัวเล็ก · ตัด ` * และเครื่องหมายคำพูด · ตัดจุลภาคหลักพัน (1,500 = 1500) · ยุบช่องว่าง */
const norm = (s) => String(s).toLowerCase().replace(/[`*“”"‘’]/g, "").replace(/(\d),(?=\d{3}(?!\d))/g, "$1").replace(/\s+/g, " ").trim();

/** แถวปัญหาในรายงาน = แถวตารางหรือรายการที่มีระดับ สูง/กลาง/ต่ำ · ข้ามหัวข้อ "ตรวจแล้วไม่เจอปัญหา" ทั้งหัวข้อ
 *  รายงานไม่มีแถวแบบนั้นเลย (ไม่ได้เขียนตามแบบ) → ใช้ทุกบรรทัดที่ไม่ใช่หัวข้อ ไม่ใช่บรรทัด "งานนี้" และไม่อยู่ใต้หัวข้อที่ผ่าน */
function issueLines(report) {
  const kept = [];
  let skip = false;
  for (const line of report.split(/\r?\n/)) {
    if (isPassedHeader(line)) { skip = true; continue; }
    if (HEADING.test(line)) { skip = false; continue; }
    if (!skip && line.trim()) kept.push(line);
  }
  const rows = kept.filter((l) => ROW.test(l) && !SEPARATOR.test(l) && SEVERITY.test(l));
  return [...new Set(rows.length ? rows : kept.filter((l) => !/^[\s*_>#-]*งานนี้/.test(l)))];
}

/** ช่วงบรรทัดที่แถวหนึ่งอ้าง: ไฟล์:12 · ไฟล์:10-12 · ไฟล์#L12 · บรรทัด 12 · บรรทัดที่ 10–12 · line 12 · L12 (แถวเป็นตัวเล็กแล้ว) */
function lineRefs(row, file) {
  const refs = [];
  const add = (m) => refs.push([Number(m[1]), Number(m[2] ?? m[1])]);
  for (const m of row.matchAll(new RegExp(`${escapeRe(file)}(?::|#l)(\\d+)(?:\\s*[-–]\\s*l?(\\d+))?`, "g"))) add(m);
  for (const m of row.matchAll(/(?:บรรทัด(?:ที่)?\s*|\bline\s*|\bl)(\d+)(?:\s*[-–]\s*(\d+))?/g)) add(m);
  return refs;
}

/** ข้อผิดแต่ละข้อของเคส: เจอไหม เจอทางไหน · เคสที่มีไฟล์เดียว แถวที่อ้างแค่ "บรรทัด 12" ก็นับ */
function score(c, report) {
  const rows = issueLines(report);
  const lowRows = rows.map((r) => r.toLowerCase());
  const normRows = rows.map(norm);
  const single = deliverables(c.dir).length === 1;
  return (c.planted ?? []).map((p) => {
    const w = p.where ?? {};
    const file = basename(w.file ?? "").toLowerCase();
    const range = rangeOf(w.line);
    const byPlace = range && file && lowRows.some((r) => (single || r.includes(file))
      && lineRefs(r, file).some(([a, z]) => a <= range[1] && z >= range[0]));
    const byQuote = w.quote && normRows.some((r) => r.includes(norm(w.quote)));
    const words = [...new Set((p.keywords ?? []).map(norm))];
    const byWords = normRows.some((r) => words.filter((k) => r.includes(k)).length >= 2);
    const how = byPlace ? "ที่อยู่" : byQuote ? "ข้อความ" : byWords ? "คำสำคัญ" : "";
    return { type: p.type, hit: Boolean(how), how };
  });
}

// ---- ตรวจชุดเคส (ฟรี) ----
/** ตรวจข้อผิด 1 ข้อ: ข้อความที่ฝังอยู่จริง · prompt ไม่หลุดคำเฉลย · ตัวให้คะแนนนับแถวที่ถูกและไม่นับแถวที่ไม่ใช่ */
function checkPlanted(c, p, i, files, prompt, bad) {
  const tag = `${c.id} ข้อ ${i + 1}`;
  if (!TYPES[p.type]) bad(tag, `type "${p.type}" ไม่อยู่ใน TYPES`);
  if (!p.defect) bad(tag, "ไม่มี defect");
  if (!(Array.isArray(p.keywords) && p.keywords.length >= 2)) return bad(tag, "keywords ต้องมีอย่างน้อย 2 คำ");
  const w = p.where ?? {};
  if (!files.includes(w.file)) return bad(tag, `ไม่มีไฟล์ "${w.file}" ในเคส`);
  if (w.line == null && !w.quote) return bad(tag, "where ต้องมี line หรือ quote");
  const lines = linesOf(join(c.dir, w.file));
  const [lo, hi] = rangeOf(w.line) ?? [1, lines.length];
  if (!(lo >= 1 && hi <= lines.length && lo <= hi)) return bad(tag, `บรรทัด ${lo}–${hi} อยู่นอกไฟล์ (${lines.length} บรรทัด)`);
  if (w.quote) {
    if (!lines.slice(lo - 1, hi).some((l) => l.includes(w.quote))) bad(tag, `ไม่เจอ "${w.quote}" ใน ${w.file}:${lo}${hi > lo ? `-${hi}` : ""}`);
    const n = files.flatMap((f) => linesOf(join(c.dir, f))).filter((l) => l.includes(w.quote)).length;
    if (n > 1) bad(tag, `"${w.quote}" อยู่ ${n} บรรทัด ต้องมีบรรทัดเดียว ไม่งั้นอ้างจุดอื่นก็นับว่าเจอ`);
    if (prompt.includes(norm(w.quote))) bad(tag, "prompt มีข้อความที่ฝังไว้ (หลุดคำเฉลย)");
  }
  if (prompt.includes(norm(p.defect ?? ""))) bad(tag, "prompt มีคำอธิบายข้อผิด (หลุดคำเฉลย)");

  const at = `${w.file}:${lo}`;
  const wrap = (row) => `## ผล: ไม่ผ่าน\nงานนี้: ทดสอบตัวให้คะแนน\n\n| # | ระดับ | ที่ไหน | ปัญหา | หลักฐาน | ควรแก้เป็น |\n|---|---|---|---|---|---|\n${row}\n`;
  const hit = (report, j = i) => score(c, report)[j].hit;
  if (w.line != null && !hit(wrap(`| 1 | กลาง | \`${at}\` | ผิด | ดูเอง | แก้ |`))) bad(tag, `ตัวให้คะแนนไม่นับแถวที่อ้าง ${at}`);
  if (w.quote && !hit(wrap(`| 1 | กลาง | ทั้งไฟล์ | "${w.quote}" ผิด | ดูเอง | แก้ |`))) bad(tag, "ตัวให้คะแนนไม่นับแถวที่ยกข้อความตรงตัว");
  if (!hit(wrap(`| 1 | ต่ำ | ทั้งไฟล์ | ${p.keywords.slice(0, 2).join(" และ ")} | ดูเอง | แก้ |`))) bad(tag, "ตัวให้คะแนนไม่นับคำสำคัญ 2 คำในแถวเดียว");
  if (hit(`## ผล: ผ่าน\nงานนี้: ทดสอบ\n\n## ตรวจแล้วไม่เจอปัญหา\n- \`${at}\` ${w.quote ?? ""} ${p.keywords.join(" ")}\n`)) bad(tag, "ตัวให้คะแนนนับหัวข้อ \"ตรวจแล้วไม่เจอปัญหา\"");
  if (hit(wrap("| 1 | ต่ำ | ทั้งไฟล์ | ภาษายังแข็ง อ่านยาก | อ่านเอง | เรียบเรียงใหม่ |"))) bad(tag, "แถวกลาง ๆ ถูกนับว่าเจอ คำสำคัญกว้างไป");
  const full = wrap(`| 1 | กลาง | \`${at}\` | ${w.quote ?? ""} ${p.keywords.join(" ")} | ดูเอง | แก้ |`);
  c.planted.forEach((_, j) => { if (j !== i && hit(full, j)) bad(tag, `แถวของข้อนี้ทำให้ข้อ ${j + 1} นับว่าเจอด้วย บรรทัด ข้อความ หรือคำสำคัญชนกัน`); });
}

/** ตรวจทุกเคสที่เลือก คืนรายการปัญหาและตารางสรุป */
function check(cases) {
  const problems = [];
  const bad = (where, msg) => problems.push(`- ${where}: ${msg}`);
  if (!existsSync(AGENT_FILE)) bad("agent", `ไม่พบ ${relative(ROOT, AGENT_FILE)}`);
  if (pluginDirs().length !== PLUGINS.length) bad("plugin", `ไม่พบ plugin บางตัวใน --plugins: ${PLUGINS.map((d) => basename(d)).join(", ")}`);
  const table = ["| เคส | งาน | ไฟล์งาน | บรรทัด | ข้อผิดที่ฝัง |", "|---|---|---|---|---|"];
  for (const c of cases) {
    if (c.error) { bad(c.folder, c.error); continue; }
    if (c.id !== c.folder) bad(c.folder, `id "${c.id}" ไม่ตรงชื่อโฟลเดอร์`);
    for (const k of ["kind", "request"]) if (!c[k]) bad(c.id, `ไม่มี ${k}`);
    if (![].concat(c.done_when ?? []).length) bad(c.id, "ไม่มี done_when");
    const files = deliverables(c.dir);
    const size = files.reduce((s, f) => s + linesOf(join(c.dir, f)).length, 0);
    if (!files.length) bad(c.id, "ไม่มีไฟล์งาน");
    if (size > 60) bad(c.id, `ไฟล์งานรวม ${size} บรรทัด เกิน 60`);
    const planted = Array.isArray(c.planted) ? c.planted : [];
    if (planted.length < 1 || planted.length > 2) bad(c.id, `ฝังข้อผิด ${planted.length} ข้อ ต้อง 1–2 ข้อ`);
    const prompt = norm(promptOf(c));
    planted.forEach((p, i) => checkPlanted(c, p, i, files, prompt, bad));
    const where = (p) => `\`${p.where?.file}:${[].concat(p.where?.line ?? "?").join("-")}\``;
    table.push(`| ${c.id} | ${c.kind} | ${files.join(" · ")} | ${size} | ${planted.map((p) => `${TYPES[p.type] ?? p.type} ${where(p)}`).join(" · ")} |`);
  }
  if (!ONLY.length) {
    const seen = new Set(ALL.flatMap((c) => (c.planted ?? []).map((p) => p.type)));
    for (const t of Object.keys(TYPES)) if (!seen.has(t)) bad("ชุดเคส", `ไม่มีข้อผิดชนิด ${t}`);
  }
  return { problems, table };
}

function verify() {
  const { problems, table } = check(picked);
  const total = picked.reduce((s, c) => s + (c.planted?.length ?? 0), 0);
  console.log(table.join("\n"));
  console.log(`\n${picked.length} เคส · ฝังข้อผิด ${total} ข้อ · agent ${AGENT} · โมเดล ${MODEL} · effort ${EFFORT} (ค่าเริ่มจาก plugins/superuser/agents/reviewer.md)`);
  const first = picked.find((c) => !c.error);
  if (first) {
    console.log(`\n---- prompt ที่ reviewer จะได้ (เคส ${first.id}) ----\n${promptOf(first)}`);
    console.log(`---- คำสั่ง (prompt ส่งทาง stdin · รันในโฟลเดอร์ชั่วคราวนอก repo) ----\nclaude ${claudeArgs(pluginDirs()).map(show).join(" ")}\n`);
  }
  console.log(problems.length ? `ใช้ไม่ได้ ${problems.length} จุด\n${problems.join("\n")}` : "ใช้ได้ทุกเคส · รันจริงด้วย --run (เสียเงิน)");
  process.exit(problems.length ? 1 : 0);
}

// ---- รันจริง (เสียเงิน) ----
/** รายงานที่ reviewer เขียนลงไฟล์เอง (กติกา "ยาวเกิน ~40 บรรทัด → เขียนลง _to_delete/") · เลือกเฉพาะไฟล์ที่ขึ้นหัวผลตามแบบ */
function writtenReports(work) {
  const walk = (d) => readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    if (n === ".claude") return [];
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  return walk(work).filter((p) => /\.(md|txt)$/i.test(p)).map(text).filter((t) => /ผล\s*:\s*\**\s*(ไม่ผ่าน|ผ่าน)/.test(t));
}

function runOne(c, n, dirs) {
  return new Promise((done) => {
    const work = join(tmpdir(), "sqt-review-recall", `${LABEL}-${c.id}-${n}`);
    rmSync(work, { recursive: true, force: true });
    for (const f of deliverables(c.dir)) { mkdirSync(dirname(join(work, f)), { recursive: true }); cpSync(join(c.dir, f), join(work, f)); }
    const t0 = Date.now();
    // claude เป็นไฟล์ .exe เรียกตรงได้ทุกระบบ ห้ามผ่าน shell บน Windows (Node ไม่ quote อาร์กิวเมนต์ให้) · prompt หลายบรรทัดส่งทาง stdin
    const p = spawn("claude", claudeArgs(dirs), { cwd: work, stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "", finished = false;
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.stdin.on("error", () => {});
    p.stdin.end(promptOf(c));
    const finish = () => {
      if (finished) return;
      finished = true;
      let init = {}, res = {};
      for (const line of out.split("\n")) {
        let m; try { m = JSON.parse(line); } catch { continue; }
        if (m.type === "system" && m.subtype === "init") init = m;
        if (m.type === "result") res = m;
      }
      const report = [res.result ?? "", ...(existsSync(work) ? writtenReports(work) : [])].join("\n\n");
      const hits = score(c, report);
      // reviewer เห็น path ของ plugin ใน repo จึงเดินไปหาคำเฉลยได้ในทางทฤษฎี · เครื่องมือแตะ evals/review-recall หรือ case.json = รอบนี้ใช้ไม่ได้
      const peeked = out.split("\n").some((l) => l.includes('"tool_use"') && /evals[\\/]+review-recall|case\.json/.test(l));
      const r = { id: c.id, run: n, kind: c.kind, found: hits.filter((h) => h.hit).length, planted: hits.length, hits, peeked,
        rows: issueLines(report).filter((l) => SEVERITY.test(l)).length, cost: res.total_cost_usd ?? 0,
        seconds: Math.round((Date.now() - t0) / 1000), turns: res.num_turns ?? null, status: res.subtype ?? "ไม่มีผล",
        model: init.model ?? "", models: Object.keys(res.modelUsage ?? {}), tools: init.tools ?? [], stderr: err.slice(-2000), report };
      writeFileSync(join(OUT, `${c.id}-${n}.json`), JSON.stringify(r, null, 2));
      try { rmSync(work, { recursive: true, force: true }); } catch { /* ไฟล์ยังถูกจับอยู่ ลบเองทีหลัง */ }
      const missed = hits.filter((h) => !h.hit).map((h) => TYPES[h.type] ?? h.type);
      console.log(`  ${r.found === r.planted ? "✓" : "✗"} ${c.id} #${n}  เจอ ${r.found}/${r.planted}${missed.length ? ` · พลาด: ${missed.join(", ")}` : ""} · แถว ${r.rows} · $${r.cost.toFixed(2)} · ${r.seconds} วินาที · ${r.status}`);
      if (r.tools.includes("Write") || r.tools.includes("Edit")) console.log(`    ⚠ ไม่ได้รันเป็น ${AGENT} (มีเครื่องมือ Write/Edit) ตรวจ --plugins และชื่อ agent`);
      if (r.model && !r.model.includes(MODEL)) console.log(`    ⚠ ขอโมเดล ${MODEL} แต่ได้ ${r.model}`);
      if (peeked) console.log("    ⚠ reviewer แตะ evals/review-recall หรือ case.json ระหว่างตรวจ รอบนี้ใช้ไม่ได้");
      if (!/ผล\s*:/.test(report)) console.log(`    ⚠ รายงานไม่ได้ขึ้นหัว "ผล:" ตามแบบของ reviewer ดู ${relative(ROOT, join(OUT, `${c.id}-${n}.json`))}`);
      done(r);
    };
    p.on("error", (e) => { err += String(e); finish(); });
    p.on("close", finish);
  });
}

function summarize(cases, results, dirs) {
  const sum = (rs, k) => rs.reduce((s, r) => s + (r[k] ?? 0), 0);
  const found = sum(results, "found"), planted = sum(results, "planted");
  const models = [...new Set(results.flatMap((r) => r.models))].join(", ") || "ไม่มีข้อมูล";
  const perType = Object.entries(TYPES).map(([t, name]) => {
    const hs = results.flatMap((r) => r.hits.filter((h) => h.type === t));
    return hs.length ? `${name} ${hs.filter((h) => h.hit).length}/${hs.length}` : "";
  }).filter(Boolean).join(" · ");
  const rows = cases.map((c) => {
    const rs = results.filter((r) => r.id === c.id).sort((a, b) => a.run - b.run);
    const missed = c.planted.map((p, i) => [p, rs.filter((r) => !r.hits[i]?.hit).length]).filter(([, k]) => k)
      .map(([p, k]) => `${TYPES[p.type] ?? p.type}${RUNS > 1 ? ` ×${k}` : ""}`);
    return `| ${c.id} | ${c.kind} | ${sum(rs, "found")}/${sum(rs, "planted")} | ${missed.join(" · ") || "—"} | ${rs.map((r) => r.rows).join(" / ")} | $${sum(rs, "cost").toFixed(2)} |`;
  });
  const block = [
    "", `## ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ${LABEL} · เจอ ${found}/${planted} (${planted ? Math.round((100 * found) / planted) : 0}%) · ${MODEL} · ${EFFORT} · $${sum(results, "cost").toFixed(2)}`, "",
    `- agent \`${AGENT}\` · plugin: ${dirs.map((d) => basename(d)).join(", ")} · เคสละ ${RUNS} รอบ · เพดาน $${BUDGET} ต่อครั้ง · โมเดลที่ใช้จริง: ${models}`,
    `- แยกตามชนิด: ${perType}`,
    ...results.filter((r) => r.peeked).map((r) => `- ⚠ ${r.id} รอบ ${r.run} แตะ evals/review-recall หรือ case.json ระหว่างตรวจ ผลของรอบนี้ใช้ไม่ได้`), "",
    "| เคส | งาน | เจอ | ข้อที่พลาด | แถวปัญหาที่รายงาน | ค่าใช้จ่าย |", "|---|---|---|---|---|---|", ...rows, "",
  ].join("\n");
  appendFileSync(join(HERE, "RESULTS.md"), block);
  console.log(block);
}

async function paidRun() {
  const { problems } = check(picked);
  if (problems.length) { console.error(`ชุดเคสยังใช้ไม่ได้ ไม่รัน\n${problems.join("\n")}`); process.exit(1); }
  const cases = picked, dirs = pluginDirs();
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  console.log(`agent ${AGENT} · โมเดล ${MODEL} · effort ${EFFORT} · plugin ${dirs.map((d) => basename(d)).join(", ")} · ${cases.length} เคส × ${RUNS} รอบ = เรียก claude ${cases.length * RUNS} ครั้ง · เพดาน $${BUDGET} ต่อครั้ง`);
  const jobs = cases.flatMap((c) => Array.from({ length: RUNS }, (_, i) => () => runOne(c, i + 1, dirs)));
  const results = [];
  async function worker() { while (jobs.length) results.push(await jobs.shift()()); }
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  summarize(cases, results, dirs);
}

if (has("verify")) verify();
else if (has("run")) await paidRun();
else {
  console.error("ใส่ --verify (ตรวจชุดเคส ฟรี) หรือ --run (เรียก claude จริง เสียเงิน) · วิธีใช้อยู่ใน evals/review-recall/README.md");
  process.exit(1);
}
