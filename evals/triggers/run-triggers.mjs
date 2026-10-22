#!/usr/bin/env node
/**
 * run-triggers.mjs — วัดว่า Claude เปิด skill ที่ควรเปิดไหม (trigger eval)
 *
 *   node evals/triggers/run-triggers.mjs                       ทุกเคส · รอบละ 1 · plugin ทั้งหมดในรีโปนี้
 *   node evals/triggers/run-triggers.mjs --runs 3 --cases docx-edit,readme
 *   node evals/triggers/run-triggers.mjs --src <โฟลเดอร์ plugins อื่น> --label before
 *   node evals/triggers/run-triggers.mjs --budget-fraction 0.02 --label budget2   ลองงบรายการ skill 2%
 *
 * ทุกเคสรัน `claude -p` ในโฟลเดอร์ใหม่ใต้ _to_delete/triggers/ (คัดลอก fixtures/ ไปด้วย)
 * โหลดเฉพาะ plugin จาก --src ด้วย --plugin-dir · --setting-sources project จึงไม่โหลด plugin ที่ติดตั้งในเครื่อง
 * ห้ามเครื่องมือเขียนไฟล์ · รันคำสั่ง · ส่ง agent → วัดแค่การเลือก skill ช่วงต้นงาน ไม่ได้ทำงานจริง
 * ผ่าน = เปิดครบทุกตัวใน expect_all และอย่างน้อย 1 ตัวใน expect_any (ว่าง = ไม่บังคับ) · เทียบชื่อหลัง ":" จึงไม่สนชื่อ plugin
 * ผลรายรอบ → _to_delete/triggers/<label>/*.json · ตารางสรุปต่อท้าย RESULTS.md
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, cpSync, rmSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : def; };
const SRC = resolve(opt("src", join(ROOT, "plugins")));
const LABEL = opt("label", "current");
const RUNS = Number(opt("runs", "1"));
const PARALLEL = Number(opt("parallel", "4"));
const BUDGET = opt("budget", "1");
const ONLY = opt("cases", "")?.split(",").filter(Boolean);
const FRACTION = opt("budget-fraction", "");   // ลองงบรายการ skill ค่าอื่น เช่น 0.02 (ค่าเริ่มของ Claude Code = 1% ของ context)
const WIN = process.platform === "win32";

const cases = JSON.parse(readFileSync(join(HERE, "cases.json"), "utf8")).filter((c) => !ONLY.length || ONLY.includes(c.id));
const plugins = readdirSync(SRC).filter((p) => existsSync(join(SRC, p, ".claude-plugin", "plugin.json"))).map((p) => join(SRC, p));
const OUT = join(ROOT, "_to_delete", "triggers", LABEL);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const base = (s) => String(s ?? "").split(":").pop();

function run(c, n) {
  return new Promise((done) => {
    const work = join(OUT, `${c.id}-${n}`);
    cpSync(join(HERE, "fixtures"), work, { recursive: true });
    const debug = join(OUT, `${c.id}-${n}.debug.log`);
    const args = ["-p", c.prompt, ...plugins.flatMap((p) => ["--plugin-dir", p]), "--setting-sources", "project", "--strict-mcp-config",
      "--disallowedTools", "Write", "Edit", "MultiEdit", "NotebookEdit", "Bash", "Agent", "Task", "WebSearch", "WebFetch",
      "--output-format", "stream-json", "--verbose", "--max-turns", "8", "--max-budget-usd", BUDGET, "--debug-file", debug,
      ...(FRACTION ? ["--settings", JSON.stringify({ skillListingBudgetFraction: Number(FRACTION) })] : [])];
    // claude เป็นไฟล์ .exe เรียกตรงได้ทุกระบบ · ห้ามใช้ shell บน Windows เพราะ Node ไม่ quote อาร์กิวเมนต์ให้ (prompt มีช่องว่าง · รายชื่อเครื่องมือมีวงเล็บ)
    const p = spawn("claude", args, { cwd: work, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.on("close", () => {
      const skills = [];
      let cost = 0;
      for (const line of out.split("\n")) {
        let m; try { m = JSON.parse(line); } catch { continue; }
        if (m.type === "result") cost = m.total_cost_usd ?? 0;
        for (const b of m.message?.content ?? []) if (b.type === "tool_use" && b.name === "Skill") skills.push(b.input?.skill);
      }
      let overBudget = null;
      try { overBudget = readFileSync(debug, "utf8").match(/Skill listing over budget: [^\n]*/)?.[0] ?? null; } catch { /* ไม่มี log */ }
      const got = new Set(skills.map(base));
      const pass = c.expect_all.every((s) => got.has(s)) && (!c.expect_any.length || c.expect_any.some((s) => got.has(s)));
      const r = { id: c.id, run: n, pass, skills, cost, overBudget };
      writeFileSync(join(OUT, `${c.id}-${n}.json`), JSON.stringify(r, null, 2));
      rmSync(work, { recursive: true, force: true });
      console.log(`  ${pass ? "✓" : "✗"} ${c.id} #${n}  ${skills.join(", ") || "(ไม่เปิด skill)"}`);
      done(r);
    });
  });
}

const jobs = cases.flatMap((c) => Array.from({ length: RUNS }, (_, i) => () => run(c, i + 1)));
const results = [];
async function worker() { while (jobs.length) results.push(await jobs.shift()()); }
await Promise.all(Array.from({ length: PARALLEL }, worker));

const byCase = cases.map((c) => {
  const rs = results.filter((r) => r.id === c.id);
  return `| ${c.id} | ${rs.filter((r) => r.pass).length}/${rs.length} | ${[...new Set(rs.flatMap((r) => r.skills.map(base)))].join(", ") || "—"} |`;
});
const passed = results.filter((r) => r.pass).length;
const cost = results.reduce((a, r) => a + r.cost, 0);
const budgetLine = results.find((r) => r.overBudget)?.overBudget ?? "ไม่เกินงบ";
const fractionNote = FRACTION ? ` · skillListingBudgetFraction ${FRACTION}` : "";
const table = [
  "", `## ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ${LABEL} · ผ่าน ${passed}/${results.length} · $${cost.toFixed(2)}`, "",
  `- plugin: ${plugins.length} ตัวจาก \`${SRC}\`${fractionNote} · listing: ${budgetLine}`, "",
  "| เคส | ผ่าน | skill ที่เปิด |", "|---|---|---|", ...byCase, "",
].join("\n");
appendFileSync(join(HERE, "RESULTS.md"), table);
console.log(table);
