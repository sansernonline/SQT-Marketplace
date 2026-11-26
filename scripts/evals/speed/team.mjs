#!/usr/bin/env node
/**
 * team.mjs — ใครทำอะไรในรอบ bench: หัวหน้า model ไหน · ลูกทีมแต่ละตัวเป็นชนิดไหน ได้งานอะไร model/effort อะไร ใช้เงินเท่าไร
 * อ่านจาก transcript ของ Claude Code (`<session>/subagents/*.meta.json` + `*.jsonl`) · ไม่เรียก model ไม่เสียเงิน
 *
 *   node scripts/evals/speed/team.mjs [t4-new-1 t4-new-2 …]   # ไม่ใส่ = ทุกรอบที่หาเจอ · พิมพ์ตาราง markdown
 *
 * ค่าใช้จ่ายรายตัวคิดจาก usage × ราคาใน model-scorecard/references/prices.json (ประมาณ ไม่ใช่ยอดตัดบัญชี)
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PRICES = JSON.parse(readFileSync(resolve(HERE, "../../../plugins/superuser/skills/superuser/parts/model-scorecard/references/prices.json"), "utf8")).per_mtok;
const PROJECTS = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");

/** usage ของไฟล์ transcript 1 ไฟล์ → model ที่ใช้ · ดอลลาร์โดยประมาณ · จำนวนรอบคุย (นับข้อความ assistant ไม่ซ้ำ id) */
function usageOf(file) {
  const ids = new Set();
  let model = null, costUsd = 0;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    let o; try { o = JSON.parse(line); } catch { continue; }
    const m = o?.message;
    if (o?.type !== "assistant" || !m?.usage || ids.has(m.id)) continue;
    ids.add(m.id);
    model = m.model ?? model;
    const p = PRICES[m.model];
    if (!p) continue;
    const u = m.usage;
    const write1h = u.cache_creation?.ephemeral_1h_input_tokens ?? 0;
    const write5m = (u.cache_creation_input_tokens ?? 0) - write1h;
    costUsd += ((u.input_tokens ?? 0) * p.input + (u.output_tokens ?? 0) * p.output + (u.cache_read_input_tokens ?? 0) * p.cache_read
      + write5m * p.cache_write + write1h * p.cache_write_1h) / 1e6;
  }
  return { model, costUsd, turns: ids.size };
}

/** sessionId → { lead, members } · หา transcript ไม่เจอ → null */
export function teamOf(sessionId) {
  if (!sessionId || !existsSync(PROJECTS)) return null;
  for (const d of readdirSync(PROJECTS)) {
    const main = join(PROJECTS, d, `${sessionId}.jsonl`);
    // transcript เสียครึ่งไฟล์ต้องไม่ทำให้ผลของรอบที่จ่ายเงินไปแล้วหาย → คืน null แทน throw
    if (existsSync(main)) try { return teamFromFile(main); } catch { return null; }
  }
  return null;
}

function teamFromFile(main) {
  const subDir = join(main.replace(/\.jsonl$/, ""), "subagents");
  const members = !existsSync(subDir) ? [] : readdirSync(subDir).filter((f) => f.endsWith(".meta.json")).map((f) => {
    const meta = JSON.parse(readFileSync(join(subDir, f), "utf8"));
    const log = join(subDir, f.replace(/\.meta\.json$/, ".jsonl"));
    const used = existsSync(log) ? usageOf(log) : { model: null, costUsd: 0, turns: 0 };
    return { type: meta.agentType ?? "?", task: meta.description ?? "", model: used.model ?? meta.pickedEffortModel ?? meta.model ?? "?",
      asked: meta.model ?? "(ไม่ระบุ)", effort: meta.effort ?? "(ไม่ระบุ)", costUsd: used.costUsd, turns: used.turns };
  });
  return { lead: usageOf(main), members, dispatch: dispatchOf(main) };
}

// ด่านของ hook ที่ตีกลับคำสั่งเรียก Agent · จับจากข้อความ error ที่ hook คืน
const GATES = [["ด่านส่งงาน", /Dispatch gate/], ["ด่านโควตา", /Quota gate/]];

/** หัวหน้าเรียก Agent กี่ครั้ง · ถูกตีกลับกี่ครั้ง แยกตามด่าน
 *  เหตุที่ต้องนับ: bench t5 2026-11-18 ได้ลูกทีม 7 ตัว แต่เรียก Agent 19 ครั้ง (ด่านตีกลับ 12) และตารางเดิมไม่บอก
 *  transcript บันทึก tool_use ซ้ำได้ → นับตาม tool_use_id ครั้งเดียว */
function dispatchOf(main) {
  const agentIds = new Set(), seen = new Set(), rejected = {};
  for (const line of readFileSync(main, "utf8").split("\n")) {
    let o; try { o = JSON.parse(line); } catch { continue; }
    const content = Array.isArray(o?.message?.content) ? o.message.content : [];
    for (const b of content) {
      if (b.type === "tool_use" && (b.name === "Agent" || b.name === "Task")) agentIds.add(b.id);
      if (b.type !== "tool_result" || !agentIds.has(b.tool_use_id) || seen.has(b.tool_use_id)) continue;
      seen.add(b.tool_use_id);
      if (!b.is_error) continue;
      const text = JSON.stringify(b.content);
      const gate = GATES.find(([, re]) => re.test(text))?.[0] ?? "อื่น";
      rejected[gate] = (rejected[gate] ?? 0) + 1;
    }
  }
  return { sent: agentIds.size, rejected };
}

/** "ส่ง 19 · ตีกลับ 12 (ด่านส่งงาน 6 · ด่านโควตา 6)" · ไม่มีตีกลับ → "ส่ง 7 · ตีกลับ 0" */
export function dispatchText(d) {
  if (!d) return "–";
  const parts = Object.entries(d.rejected).map(([gate, n]) => `${gate} ${n}`);
  const total = Object.values(d.rejected).reduce((s, n) => s + n, 0);
  return `ส่ง ${d.sent} · ตีกลับ ${total}${parts.length ? ` (${parts.join(" · ")})` : ""}`;
}

const short = (model) => String(model).replace(/^claude-/, "").replace(/-\d+(-\d+)*$/, "");
const usd = (n) => `$${n.toFixed(2)}`;

/** แถวของตาราง "ทีมรายรอบ" ใน RESULTS.md · rows = ผลรายรอบที่มี .team */
export function teamLines(rows) {
  const withTeam = rows.filter((r) => r.team);
  if (!withTeam.length) return [];
  const lines = ["", "**ทีมรายรอบ** (ค่าใช้จ่ายรายตัวคิดจาก token × ราคา · ประมาณ)", "",
    "| รอบ | หัวหน้า | ลูกทีม | เรียก Agent | ลูกทีมแต่ละตัว: ชนิด · model/effort · งาน · $ |", "|---|---|---|---|---|"];
  for (const r of withTeam) {
    const { lead, members, dispatch } = r.team;
    const each = members.map((m) => `${m.type.replace(/^superuser:/, "")} · ${short(m.model)}/${m.effort} · ${m.task} · ${usd(m.costUsd)}`).join("<br>") || "–";
    lines.push(`| ${r.id} | ${short(lead.model ?? "?")} · ${usd(lead.costUsd)} | ${members.length} · ${usd(members.reduce((s, m) => s + m.costUsd, 0))} | ${dispatchText(dispatch)} | ${each} |`);
  }
  return lines;
}

// ใช้ตรง: หา transcript จากชื่อโฟลเดอร์รอบ (`…bench-runs-<id>`) · เลือกโฟลเดอร์ที่ใหม่สุดเมื่อมีหลาย worktree
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const want = process.argv.slice(2);
  const found = new Map();
  for (const d of readdirSync(PROJECTS)) {
    const id = d.match(/bench-runs-(t\d+-[a-z]+-\d+)$/)?.[1];
    if (!id || (want.length && !want.includes(id))) continue;
    const dir = join(PROJECTS, d);
    const main = readdirSync(dir).filter((f) => f.endsWith(".jsonl")).map((f) => join(dir, f))
      .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
    if (main && (!found.has(id) || statSync(main).mtimeMs > statSync(found.get(id)).mtimeMs)) found.set(id, main);
  }
  const rows = [...found].sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true })).map(([id, main]) => ({ id, team: teamFromFile(main) }));
  console.log(rows.length ? teamLines(rows).join("\n") : "ไม่เจอ transcript ของรอบ bench");
}
