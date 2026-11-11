#!/usr/bin/env node
// แยกต้นทุนของรอบ bench จาก transcript: context รอบคุยแรก (ต้นทุนก่อนลงมือ) · รอบสุดท้าย · จำนวนรอบคุย · skill ที่เปิด
// ใช้หลัง run-bench.mjs เพื่อตอบว่า token ที่เพิ่มมาจากรายการ skill ตอนเริ่ม · ไฟล์ที่โหลดเมื่อเปิด skill · หรือรอบคุยที่มากขึ้น
//   node scripts/evals/speed/breakdown.mjs                 # ทุกรอบใน _to_delete/bench/runs
//   node scripts/evals/speed/breakdown.mjs t1-new-1 t1-none-1
// ไม่เรียก model · ไม่เสียเงิน · อ่าน transcript จาก ~/.claude/projects (หรือ CLAUDE_CONFIG_DIR)
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const PROJECTS = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");

// รันเฉพาะเมื่อเรียกไฟล์นี้ตรง ไม่รันตอนถูก import
if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === join(process.argv[1]).toLowerCase()) {
  if (process.argv.includes("--self-test")) selfTest();
  else main(process.argv.slice(2));
}

/** สรุป 1 transcript · รวมบรรทัดที่ message id ซ้ำ (Claude Code บันทึก 1 ข้อความเป็นหลายบรรทัด) */
export function summarize(lines) {
  const seen = new Map(), skills = new Set();
  for (const line of lines) {
    let m; try { m = JSON.parse(line); } catch { continue; }
    const msg = m.message;
    if (msg?.role !== "assistant" || m.isSidechain) continue;
    const u = msg.usage;
    if (u && msg.id && !seen.has(msg.id)) seen.set(msg.id, (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0));
    for (const b of msg.content ?? []) if (b.type === "tool_use" && b.name === "Skill" && b.input?.skill) skills.add(b.input.skill);
  }
  const ctx = [...seen.values()];
  return { turns: ctx.length, first: ctx[0] ?? 0, last: ctx.at(-1) ?? 0, total: ctx.reduce((a, b) => a + b, 0), skills: [...skills] };
}

function transcriptOf(id) {
  if (!existsSync(PROJECTS)) return null;
  const key = id.replace(/[^A-Za-z0-9]/g, "-");
  const files = readdirSync(PROJECTS).filter((d) => d.endsWith(key))
    .flatMap((d) => readdirSync(join(PROJECTS, d)).filter((f) => f.endsWith(".jsonl")).map((f) => join(PROJECTS, d, f)));
  return files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0] ?? null;
}

function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : 0; }

function main(ids) {
  const runs = join(ROOT, "_to_delete", "bench", "runs");
  if (!ids.length && existsSync(runs)) ids = readdirSync(runs).filter((f) => /^t\d+-.+-\d+\.json$/.test(f)).map((f) => f.slice(0, -5));
  if (!ids.length) { console.error("ไม่เจอรอบ bench · รัน run-bench.mjs ก่อน หรือส่งชื่อรอบ เช่น t1-new-1"); process.exit(2); }
  const groups = new Map();
  for (const id of ids) {
    const f = transcriptOf(id);
    if (!f) { console.error(`ไม่เจอ transcript ของ ${id}`); continue; }
    const s = summarize(readFileSync(f, "utf8").split("\n"));
    const [task, arm] = id.split("-");
    const g = groups.get(`${task} ${arm}`) ?? []; g.push(s); groups.set(`${task} ${arm}`, g);
  }
  console.log("| งาน · แขน | รอบ | context รอบคุยแรก | context รอบคุยสุดท้าย | รอบคุย | context รวมทุกรอบคุย | skill ที่เปิด |\n|---|---|---|---|---|---|---|");
  for (const [k, g] of [...groups].sort()) {
    const skills = [...new Set(g.flatMap((s) => s.skills))].join(" · ") || "-";
    console.log(`| ${k} | ${g.length} | ${median(g.map((s) => s.first))} | ${median(g.map((s) => s.last))} | ${median(g.map((s) => s.turns))} | ${median(g.map((s) => s.total))} | ${skills} |`);
  }
  console.log("\nค่ากลางของแต่ละกลุ่ม · context = input + cache read + cache write ของข้อความ assistant ที่ไม่ซ้ำ id");
}

function selfTest() {
  const L = (id, input, cache, tools = []) => JSON.stringify({ message: { role: "assistant", id, usage: { input_tokens: input, cache_read_input_tokens: cache }, content: tools } });
  const s = summarize([
    L("a", 10, 1000, [{ type: "tool_use", name: "Skill", input: { skill: "x:superuser" } }]),
    L("a", 10, 1000),                  // บรรทัดซ้ำ id เดียวกัน ต้องไม่นับซ้ำ
    L("b", 5, 1500),
    JSON.stringify({ isSidechain: true, message: { role: "assistant", id: "c", usage: { input_tokens: 999 } } }),
    "ไม่ใช่ JSON",
  ]);
  const ok = s.turns === 2 && s.first === 1010 && s.last === 1505 && s.total === 2515 && s.skills.join() === "x:superuser" && median([3, 1, 2]) === 2;
  console.log(ok ? "self-test ผ่าน" : `self-test ไม่ผ่าน ${JSON.stringify(s)}`);
  process.exit(ok ? 0 : 1);
}
