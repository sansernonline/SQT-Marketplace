#!/usr/bin/env node
// node plan.mjs <plan.json> [--agents N] [--log <โฟลเดอร์ log>] [--json]   วางแผนกราฟงาน: rank · สายวิกฤต · จำนวนลูกทีม · ลำดับปล่อย
// node plan.mjs --self-test
// plan.json: { "name": "...", "max_agents": 6, "tasks": [{ "id": "a", "title": "...", "size": 20, "needs": [], "owns": ["src/db.ts"], "solo": false, "step": "code" }] }
// size = token รวมโดยประมาณ หน่วยพัน (k) · ไม่ใช้ library ภายนอก ไม่ใช้ token
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WORKFLOW_AT = 8; // พร้อมกันเกินนี้ต้องเสนอ dynamic workflow ให้ผู้ใช้เริ่ม (parallel-split-and-merge)
const WORTH_PARALLEL = 1.3; // ขนานแล้วเร็วขึ้นไม่ถึงเท่านี้ ใช้ตัวเดียว เพราะลูกทีมทุกตัวต้องอ่านบริบทใหม่ (ค่าตั้งเอง ยังไม่ได้วัด)

const isList = (x) => x === undefined || (Array.isArray(x) && x.every((v) => typeof v === "string"));

// ตัด id และไฟล์ที่ใส่ซ้ำในชิ้นเดียวกัน · ไม่งั้น needs ซ้ำถูกนับเป็นกราฟวน และ owns ซ้ำฟ้องว่าชนกับตัวเอง
export function normalize(plan) {
  return { ...plan, tasks: plan.tasks.map((t) => ({ ...t, needs: [...new Set(t.needs ?? [])], owns: [...new Set(t.owns ?? [])] })) };
}

export function validate(plan) {
  if (!Array.isArray(plan?.tasks)) return ["tasks ต้องเป็นรายการ (array) ของชิ้นงาน"];
  const bad = plan.tasks.flatMap((t, i) => (t && typeof t === "object" && !Array.isArray(t)
    ? [!isList(t.needs) && `${t.id ?? `ชิ้นที่ ${i + 1}`}: needs ต้องเป็นรายการ id`, !isList(t.owns) && `${t.id ?? `ชิ้นที่ ${i + 1}`}: owns ต้องเป็นรายการ path`].filter(Boolean)
    : [`ชิ้นที่ ${i + 1} ต้องเป็น object`]));
  if (bad.length) return bad;
  const { tasks } = normalize(plan), errors = [], ids = new Set();
  if (!tasks.length) errors.push("ไม่มีชิ้นงานใน tasks");
  for (const t of tasks) {
    if (!t.id) errors.push(`ชิ้นที่ไม่มี id: ${JSON.stringify(t).slice(0, 60)}`);
    else if (ids.has(t.id)) errors.push(`id ซ้ำ: ${t.id}`);
    ids.add(t.id);
    if (!(t.size > 0)) errors.push(`${t.id}: size ต้องมากกว่า 0`);
  }
  for (const t of tasks) for (const n of t.needs ?? []) if (!ids.has(n)) errors.push(`${t.id}: รอชิ้น ${n} ที่ไม่มีอยู่`);
  if (errors.length) return errors;
  if (!topoOrder(tasks)) return ["กราฟวนเป็นวง: มีชิ้นที่รอกันเองเป็นทอด ๆ จนกลับมาที่เดิม"];
  const before = ancestors(tasks);
  const owner = new Map();
  for (const t of tasks) for (const f of t.owns ?? []) (owner.get(f) ?? owner.set(f, []).get(f)).push(t.id);
  for (const [f, list] of owner) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const [a, b] = [list[i], list[j]];
    if (!before.get(a).has(b) && !before.get(b).has(a)) errors.push(`${a} กับ ${b} เป็นเจ้าของ ${f} ทั้งคู่แต่ไม่ได้รอกัน → ให้ชิ้นหนึ่งรออีกชิ้น`);
  }
  return errors;
}

// เรียงชิ้นที่ต้องทำก่อนขึ้นก่อน · คืน null เมื่อกราฟวน
function topoOrder(tasks) {
  const left = new Map(tasks.map((t) => [t.id, (t.needs ?? []).length])), order = [];
  const queue = tasks.filter((t) => !left.get(t.id)).map((t) => t.id);
  while (queue.length) {
    const id = queue.shift(); order.push(id);
    for (const t of tasks) if ((t.needs ?? []).includes(id)) { left.set(t.id, left.get(t.id) - 1); if (!left.get(t.id)) queue.push(t.id); }
  }
  return order.length === tasks.length ? order : null;
}

function ancestors(tasks) {
  const byId = new Map(tasks.map((t) => [t.id, t])), memo = new Map();
  const of = (id) => memo.get(id) ?? memo.set(id, new Set((byId.get(id).needs ?? []).flatMap((n) => [n, ...of(n)]))).get(id);
  for (const t of tasks) of(t.id);
  return memo;
}

// rank = ขนาด + rank สูงสุดของชิ้นที่รอชิ้นนี้ · คิดจากชิ้นท้ายย้อนขึ้น
export function ranks(tasks) {
  const rank = new Map();
  for (const id of topoOrder(tasks).reverse()) {
    const t = tasks.find((x) => x.id === id);
    const next = tasks.filter((x) => (x.needs ?? []).includes(id)).map((x) => rank.get(x.id));
    rank.set(id, t.size + Math.max(0, ...next));
  }
  return rank;
}

// Critical Path Method (CPM): เริ่มเร็วสุด (forward pass) · เริ่มช้าสุด = สายวิกฤต − rank (backward pass) · เผื่อได้ = ช้าสุด − เร็วสุด · ชิ้นที่เผื่อได้ 0 อยู่บนสายวิกฤต
export function slack(tasks, rank) {
  const byId = new Map(tasks.map((t) => [t.id, t])), early = new Map(), end = Math.max(...rank.values());
  for (const id of topoOrder(tasks)) early.set(id, Math.max(0, ...byId.get(id).needs.map((n) => early.get(n) + byId.get(n).size)));
  return new Map(tasks.map((t) => [t.id, { early: early.get(t.id), late: end - rank.get(t.id), float: end - rank.get(t.id) - early.get(t.id) }]));
}

function criticalPath(tasks, rank) {
  const path = [];
  let cur = tasks.filter((t) => !(t.needs ?? []).length).sort((a, b) => rank.get(b.id) - rank.get(a.id))[0];
  while (cur) {
    path.push(cur.id);
    cur = tasks.filter((t) => (t.needs ?? []).includes(cur.id)).sort((a, b) => rank.get(b.id) - rank.get(a.id))[0];
  }
  return path;
}

// จำลองการปล่อยงาน: ชิ้นที่พร้อมเรียง rank สูงก่อน · ชิ้น solo ทำตอนไม่มีชิ้นอื่นทำอยู่ และระหว่างนั้นไม่ปล่อยชิ้นอื่น
export function simulate(tasks, rank, agents) {
  const done = new Set(), running = [], slots = [], out = [];
  let now = 0;
  const ready = () => tasks.filter((t) => !done.has(t.id) && !running.some((r) => r.id === t.id) && !out.some((o) => o.id === t.id)
    && (t.needs ?? []).every((n) => done.has(n))).sort((a, b) => rank.get(b.id) - rank.get(a.id) || a.id.localeCompare(b.id));
  while (done.size < tasks.length) {
    for (const t of ready()) {
      if (running.length >= agents || running.some((r) => r.solo)) break;
      if (t.solo && running.length) break;
      const lane = [...Array(agents).keys()].find((i) => !slots[i]);
      slots[lane] = t.id;
      const run = { id: t.id, solo: Boolean(t.solo), start: now, end: now + t.size, lane: lane + 1 };
      running.push(run); out.push(run);
    }
    const next = Math.min(...running.map((r) => r.end));
    now = next;
    for (const r of running.filter((x) => x.end === next)) { done.add(r.id); slots[r.lane - 1] = null; running.splice(running.indexOf(r), 1); }
  }
  return { makespan: now, schedule: out, width: Math.max(...out.map((o) => out.filter((x) => x.start <= o.start && x.end > o.start).length)) };
}

export function analyse(plan, { agents, k = {} } = {}) {
  const tasks = normalize(plan).tasks.map((t) => ({ ...t, size: t.size * (k[t.step] ?? 1) }));
  const rank = ranks(tasks), total = tasks.reduce((s, t) => s + t.size, 0);
  const cp = criticalPath(tasks, rank), cpLen = Math.max(...rank.values());
  const width = simulate(tasks, rank, tasks.length).width;
  const cap = agents ?? plan.max_agents ?? Infinity;
  const wide = Math.max(1, Math.min(width, cap, WORKFLOW_AT));
  const parallelMakespan = simulate(tasks, rank, wide).makespan;
  const parallelSpeedup = total / parallelMakespan;
  const team = parallelSpeedup < WORTH_PARALLEL ? 1 : wide;
  const sim = simulate(tasks, rank, team);
  // เวลาต่ำสุด = ขอบล่างตามสูตร · เร็วขึ้น = งานรวม ÷ เวลาที่จำลองปล่อยตาม rank ได้จริง (ไม่เกินงานรวม ÷ เวลาต่ำสุด)
  return { tasks, rank, cpm: slack(tasks, rank), total, cp, cpLen, width, wide, team, parallelMakespan, parallelSpeedup, lowerBound: Math.max(cpLen, total / wide),
    makespan: sim.makespan, speedup: total / sim.makespan, schedule: sim.schedule, needsWorkflow: width > WORKFLOW_AT && cap > WORKFLOW_AT };
}

const n1 = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(1));

export function render(plan, a) {
  const bar = (r) => { const scale = 40 / a.makespan; return "·".repeat(Math.round(r.start * scale)) + "█".repeat(Math.max(1, Math.round((r.end - r.start) * scale))); };
  const title = (id) => a.tasks.find((t) => t.id === id).title ?? id;
  const sorted = [...a.schedule].sort((x, y) => x.start - y.start || a.rank.get(y.id) - a.rank.get(x.id));
  return [
    `# แผนกราฟงาน${plan.name ? `: ${plan.name}` : ""}`, "",
    `คาด: ลูกทีม ${a.team} · สายวิกฤต ${n1(a.cpLen)}k · กว้างสุด ${a.width} · เร็วขึ้น ${a.speedup.toFixed(1)} เท่า`, "",
    `- สายวิกฤต: ${a.cp.map(title).join(" → ")} (${n1(a.cpLen)}k)`,
    `- งานรวม ${n1(a.total)}k · ขนาน ${a.wide} ตัว: เวลาต่ำสุดตามสูตร ${n1(a.lowerBound)}k · จำลองปล่อยตาม rank ได้ ${n1(a.parallelMakespan)}k (เร็วขึ้น ${a.parallelSpeedup.toFixed(1)} เท่า)`,
    ...(a.team === 1 && a.wide > 1 ? [`- ปล่อยขนาน ${a.wide} ตัวเร็วขึ้นแค่ ${a.parallelSpeedup.toFixed(1)} เท่า กราฟเกือบเป็นสายเดียว จึงใช้ลูกทีมตัวเดียวทำตาม rank (ชิ้นเล็กนอกสายวิกฤต หัวหน้าทีมทำเองระหว่างรอได้)`] : []),
    ...(a.needsWorkflow ? [`- กว้างเกิน ${WORKFLOW_AT} ชิ้น: เสนอ dynamic workflow ในคำถามตอนเริ่ม ถ้าผู้ใช้ไม่เอา แผนนี้ปล่อยรอบละ ${WORKFLOW_AT} ตาม rank`] : []),
    "", "| ลำดับปล่อย | ชิ้น | ขนาด | rank | เผื่อได้ | รอ | เจ้าของไฟล์ | ลูกทีม | เริ่ม → จบ | ไทม์ไลน์ |", "|---|---|---|---|---|---|---|---|---|---|",
    ...sorted.map((r, i) => { const t = a.tasks.find((x) => x.id === r.id); return `| ${i + 1} | ${t.id}${t.title ? ` ${t.title}` : ""}${t.solo ? " (คนเดียว)" : ""} | ${n1(t.size)}k | ${n1(a.rank.get(t.id))} | ${a.cpm.get(t.id).float ? n1(a.cpm.get(t.id).float) : "0 วิกฤต"} | ${(t.needs ?? []).join(" ") || "–"} | ${(t.owns ?? []).join(" ") || "–"} | ${r.lane} | ${n1(r.start)} → ${n1(r.end)} | \`${bar(r)}\` |`; }),
    "",
  ].join("\n");
}

// ค่า k ต่อขั้นจาก log ของโปรเจกต์ (model-scorecard) · ไม่มี log → ไม่ปรับ
async function factorsFrom(logDir) {
  if (!logDir || !existsSync(logDir)) return {};
  const { collectProject } = await import("../../model-scorecard/scripts/collect.mjs");
  const { sizeFactors } = await import("../../model-scorecard/scripts/report.mjs");
  return Object.fromEntries(sizeFactors(collectProject(logDir, "").runs).map((s) => [s.step, s.k]));
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--self-test") args.selfTest = true;
    else if (argv[i] === "--agents") args.agents = Number(argv[++i]);
    else if (argv[i] === "--log") args.log = argv[++i];
    else if (argv[i] === "--json") args.json = true;
    else args.file = argv[i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) return (await import("./plan.test.mjs")).selfTest();
  if (!args.file) { console.error("ใช้: node plan.mjs <plan.json> [--agents N] [--log <โฟลเดอร์ log>] [--json]"); process.exit(1); }
  if (args.agents !== undefined && !(Number.isInteger(args.agents) && args.agents >= 1)) { console.error("--agents ต้องเป็นจำนวนเต็มตั้งแต่ 1"); process.exit(1); }
  const plan = JSON.parse(readFileSync(args.file, "utf8"));
  if (plan.max_agents !== undefined && !(Number.isInteger(plan.max_agents) && plan.max_agents >= 1)) { console.error("max_agents ต้องเป็นจำนวนเต็มตั้งแต่ 1"); process.exit(1); }
  const errors = validate(plan);
  if (errors.length) { console.error(errors.map((e) => `- ${e}`).join("\n")); process.exit(1); }
  const k = await factorsFrom(args.log ?? join(".claude", "superuser", "log"));
  const a = analyse(plan, { agents: args.agents, k });
  console.log(args.json ? JSON.stringify({ ...a, rank: Object.fromEntries(a.rank), k }, null, 2) : render(plan, a));
}

// ไม่ await ที่ระดับบนสุด เพราะ plan.test.mjs import ไฟล์นี้กลับ ถ้า await จะรอกันเองไม่จบ
if (process.argv[1]?.endsWith("plan.mjs")) main().catch((e) => { console.error(e.message); process.exit(1); });
