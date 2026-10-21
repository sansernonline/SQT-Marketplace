#!/usr/bin/env node
// คัดลอกไฟล์กลางของ skill superuser ไปทุก plugin ที่มี skills/superuser · ตรวจว่าของกลาง (skill · agent · hook) อยู่ใน superuser ที่เดียว
//   node scripts/sync/sync-superuser.mjs          → เขียนทับของกลางในทุก plugin
//   node scripts/sync/sync-superuser.mjs --check  → ตรวจอย่างเดียว · ไม่ตรงออกด้วยรหัส 1
// ของกลาง = ไฟล์ใน SHARED_FILES ทั้งไฟล์ + บล็อก <!-- superuser:begin X --> ... <!-- superuser:end X --> ในไฟล์ของ BLOCK_FILES
//   + บล็อก context ของ references/context-template.md ที่สร้างจาก templates/CONTEXT.md และ templates/IMPROVEMENTS.md
// ส่วนอื่นของแต่ละ plugin ไม่ถูกแตะ (ดู plugins/superuser/ADAPT.md)
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ของกลางที่อยู่ใน plugin superuser ที่เดียว · plugin อื่นประกาศ "dependencies": ["superuser"] แล้วใช้ร่วมกัน
// ห้ามมีสำเนาใน plugin อื่น: สำเนาทำให้ชื่อ skill ซ้ำในรายการ skill ของทุก session จนเกินงบรายการ และ hook ทำงานซ้ำทุกเหตุการณ์
export const SHARED_ONLY_IN_SUPERUSER = [
  "skills/agent-patterns", "skills/answer-shape", "skills/commit-log", "skills/handoff", "skills/human-writing", "skills/no-ai-look", "skills/simplify",
  "agents/learning-reviewer.md", "agents/brainstormer.md", "agents/reviewer.md",
  "hooks",
];
// ไฟล์ใน skill superuser ที่คัดลอกไปทุก plugin (skill superuser ของแต่ละ plugin ปรับตามสาขา จึงยังเป็นสำเนา)
export const SHARED_FILES = [
  "skills/superuser/references/playbook-learn-from-session.md",
  "skills/superuser/references/playbook-template.md",
  "skills/superuser/references/learning-loop.md",
  "skills/superuser/references/brief-template.md",
  "skills/superuser/references/team-files.md",
  "skills/superuser/references/evidence.md",
  "skills/superuser/references/team-roles.md",
  "skills/superuser/templates/improvements-queue.md",
];
export const SKILL = "skills/superuser/SKILL.md";
const REF = "skills/superuser/references";
// ไฟล์ที่มีบล็อกกลาง · ส่วนนอกบล็อกแต่ละ plugin เขียนเอง
export const BLOCK_FILES = [SKILL, `${REF}/playbook-review.md`, `${REF}/playbook-unattended-run.md`];
// plugin ที่เขียนไฟล์นี้เองทั้งไฟล์ ไม่รับบล็อก (เหตุผลใน plugins/superuser/ADAPT.md ข้อ 1)
export const OPT_OUT = {
  "software-company": [`${REF}/playbook-review.md`, `${REF}/playbook-unattended-run.md`],
};
// แม่แบบ CONTEXT.md ของแต่ละ plugin · บล็อก context สร้างจาก templates ของ superuser · plugin ไหนไม่มีไฟล์นี้ ข้าม
export const CONTEXT_FILE = `${REF}/context-template.md`;
const BLOCK = /<!-- superuser:begin ([a-z-]+) -->\n([\s\S]*?)<!-- superuser:end \1 -->/g;

const lf = (text) => text.replace(/\r\n/g, "\n");

export function blocksOf(text) {
  return new Map([...lf(text).matchAll(BLOCK)].map((m) => [m[1], m[2]]));
}

const fence = (title, text) => `## ${title}\n\n\`\`\`markdown\n${lf(text).trimEnd()}\n\`\`\`\n`;
function contextBlock(source) {
  const tpl = (name) => readFileSync(join(source, "skills/superuser/templates", name), "utf8");
  return new Map([["context", `${fence("CONTEXT.md", tpl("CONTEXT.md"))}\n${fence("IMPROVEMENTS.md", tpl("IMPROVEMENTS.md"))}`]]);
}

// เขียนเนื้อบล็อกจากต้นฉบับทับบล็อกชื่อเดียวกันในไฟล์ปลายทาง · ไม่มีไฟล์หรือไม่มี marker → แจ้งให้ใส่ครั้งแรกด้วยมือ
function syncBlocks(file, label, masterBlocks, problems, writes) {
  if (!existsSync(file)) { problems.push(`${label} ไม่มี — คัดลอกจาก plugins/superuser แล้วปรับส่วนนอกบล็อก`); return; }
  const original = readFileSync(file, "utf8");
  let text = lf(original);
  for (const [name, body] of masterBlocks) {
    const open = `<!-- superuser:begin ${name} -->\n`;
    const close = `<!-- superuser:end ${name} -->`;
    const at = text.indexOf(open);
    const end = text.indexOf(close, at);
    if (at < 0 || end < 0) { problems.push(`${label} ไม่มีบล็อก superuser:${name} — ใส่ marker ครั้งแรกด้วยมือ`); continue; }
    if (text.slice(at + open.length, end) !== body) {
      problems.push(`${label} บล็อก superuser:${name} ไม่ตรงกับต้นฉบับ`);
      text = text.slice(0, at + open.length) + body + text.slice(end);
    }
  }
  if (text !== lf(original)) writes.push([file, original.includes("\r\n") ? text.replace(/\n/g, "\r\n") : text]);
}

// คืนรายการปัญหา และข้อความใหม่ของแต่ละไฟล์ (ใช้ร่วมกับ validate-marketplace.mjs)
export function plan(root) {
  const pluginsDir = join(root, "plugins");
  const source = join(pluginsDir, "superuser");
  const targets = readdirSync(pluginsDir).filter((p) => p !== "superuser" && existsSync(join(pluginsDir, p, SKILL)));
  const problems = [];
  const writes = [];
  // กฎประจำตัว: ต้นฉบับ scripts/install/CLAUDE.global.md → สำเนาที่ hook ส่งให้ทุก session · hook ส่งได้ไม่เกิน 10,000 ตัวอักษร
  const rulesSrc = lf(readFileSync(join(root, "scripts", "install", "CLAUDE.global.md"), "utf8"));
  const rulesDst = join(source, "hooks", "core-rules.md");
  if (rulesSrc.length > 9500) problems.push(`scripts/install/CLAUDE.global.md ยาว ${rulesSrc.length} ตัวอักษร เกิน 9,500 — hook ส่งไม่ครบ ต้องแก้มือ`);
  if (!existsSync(rulesDst) || lf(readFileSync(rulesDst, "utf8")) !== rulesSrc) {
    problems.push("superuser/hooks/core-rules.md ไม่ตรงกับ scripts/install/CLAUDE.global.md");
    writes.push([rulesDst, rulesSrc]);
  }
  // ชื่อ skill ในตัวบอก skill ต้องมีจริง
  const router = JSON.parse(readFileSync(join(source, "hooks", "skill-router.json"), "utf8"));
  const known = new Set([...(router.external ?? []), ...readdirSync(pluginsDir).flatMap((p) => existsSync(join(pluginsDir, p, "skills")) ? readdirSync(join(pluginsDir, p, "skills")) : [])]);
  for (const r of router.rules ?? []) {
    try { new RegExp(r.pattern, "i"); } catch (e) { problems.push(`skill-router.json pattern พัง (${e.message}) — ต้องแก้มือ`); }
    for (const s of r.skills ?? []) if (s.includes(":") ? !existsSync(join(pluginsDir, s.split(":")[0], "skills", s.split(":")[1], "SKILL.md")) : !known.has(s)) problems.push(`skill-router.json อ้าง skill "${s}" ที่ไม่มีใน plugins/ — ต้องแก้มือ`);
  }
  for (const p of targets) {
    for (const rel of SHARED_ONLY_IN_SUPERUSER) {
      if (existsSync(join(pluginsDir, p, rel))) problems.push(`${p}/${rel} ต้องไม่มี — ของกลางอยู่ใน plugins/superuser ที่เดียว (ย้ายสำเนาไป _to_delete/)`);
    }
    const meta = JSON.parse(readFileSync(join(pluginsDir, p, ".claude-plugin", "plugin.json"), "utf8"));
    if (!(meta.dependencies ?? []).some((d) => (typeof d === "string" ? d : d.name).split("@")[0] === "superuser")) {
      problems.push(`${p}/.claude-plugin/plugin.json ไม่มี "dependencies": ["superuser"]`);
    }
    for (const rel of SHARED_FILES) {
      const want = lf(readFileSync(join(source, rel), "utf8"));
      const file = join(pluginsDir, p, rel);
      const have = existsSync(file) ? lf(readFileSync(file, "utf8")) : null;
      if (have !== want) {
        problems.push(`${p}/${rel} ${have === null ? "ไม่มี" : "ไม่ตรงกับต้นฉบับใน superuser"}`);
        writes.push([file, want]);
      }
    }
    for (const rel of BLOCK_FILES) {
      if (OPT_OUT[p]?.includes(rel)) continue;
      syncBlocks(join(pluginsDir, p, rel), `${p}/${rel}`, blocksOf(readFileSync(join(source, rel), "utf8")), problems, writes);
    }
    const ctx = join(pluginsDir, p, CONTEXT_FILE);
    if (existsSync(ctx)) syncBlocks(ctx, `${p}/${CONTEXT_FILE}`, contextBlock(source), problems, writes);
  }
  return { targets, problems, writes };
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/sync-superuser.mjs")) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const check = process.argv.includes("--check");
  const { targets, problems, writes } = plan(root);
  for (const line of problems) console.log(`  ${check ? "✗" : "→"} ${line}`);
  if (check) {
    console.log(problems.length ? `\n${problems.length} จุดไม่ตรง · รัน node scripts/sync/sync-superuser.mjs` : `ของกลางตรงกันทั้ง ${targets.length} plugin`);
    process.exit(problems.length ? 1 : 0);
  }
  const missing = problems.filter((line) => line.includes("ไม่มีบล็อก") || line.includes("ต้องไม่มี") || line.includes("dependencies") || line.includes("ต้องแก้มือ"));
  for (const [file, text] of writes) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); }
  console.log(`\nเขียน ${writes.length} ไฟล์ · ${targets.length} plugin${missing.length ? ` · ต้องแก้มือ ${missing.length} จุด` : ""}`);
  process.exit(missing.length ? 1 : 0);
}
