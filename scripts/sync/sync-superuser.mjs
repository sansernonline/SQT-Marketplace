#!/usr/bin/env node
// คัดลอกไฟล์กลางของ skill superuser ไปทุก plugin ที่มี skills/superuser · ตรวจว่าของกลาง (skill · agent · hook) อยู่ใน superuser ที่เดียว
//   node scripts/sync/sync-superuser.mjs          → เขียนทับของกลางในทุก plugin
//   node scripts/sync/sync-superuser.mjs --check  → ตรวจอย่างเดียว · ไม่ตรงออกด้วยรหัส 1
// ของกลาง = ไฟล์ใน SHARED_FILES ทั้งไฟล์ + บล็อก <!-- superuser:begin X --> ... <!-- superuser:end X --> ในไฟล์ของ BLOCK_FILES
//   + บล็อก context ของ references/context-template.md ที่สร้างจาก templates/CONTEXT.md และ templates/IMPROVEMENTS.md
// ส่วนอื่นของแต่ละ plugin ไม่ถูกแตะ (ดู plugins/superuser/ADAPT.md)
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ของกลางที่อยู่ใน plugin superuser ที่เดียว · plugin อื่นประกาศ "dependencies": ["superuser"] แล้วใช้ร่วมกัน
// ห้ามมีสำเนาใน plugin อื่น: สำเนาทำให้ชื่อ skill ซ้ำในรายการ skill ของทุก session จนเกินงบรายการ และ hook ทำงานซ้ำทุกเหตุการณ์
export const SHARED_ONLY_IN_SUPERUSER = [
  "skills/adversarial-review-panel", "skills/agent-patterns", "skills/answer-shape", "skills/workspace-setup", "skills/commit-log", "skills/context-budget", "skills/decision-log", "skills/document-naming", "skills/flag-and-propose", "skills/handoff", "skills/human-writing", "skills/no-ai-look", "skills/owner-style-capture", "skills/parallel-attempts-pick-best", "skills/parallel-split-and-merge", "skills/polished-document-style", "skills/polite-message-th-en", "skills/principle-build-a-tool-not-handwork", "skills/principle-fix-root-cause", "skills/principle-proceed-on-reversible-work", "skills/principle-prove-it-works", "skills/principle-small-verifiable-steps", "skills/principle-user-experience-first", "skills/prior-art-review", "skills/repeated-mistakes-to-checks", "skills/research-with-sources", "skills/session-lessons-to-skills", "skills/simplify", "skills/skill-authoring", "skills/spell-out-abbreviations", "skills/status-report", "skills/targeted-fix", "skills/temp-file-discipline", "skills/translate-th-en",
  "agents/learning-reviewer.md", "agents/brainstormer.md", "agents/reviewer.md",
  "hooks",
];
// SKILL.md ของ superuser สาขาต้องมีบรรทัดนี้ (เปิดแกนก่อน) และต้องไม่มีบล็อกกลางอีก — ส่วนกลางอยู่ที่แกนที่เดียว
export const SKILL_POINTER = "เปิด `superuser:superuser` ก่อน";
// ไฟล์ใน skill superuser ที่คัดลอกไปทุก plugin (skill superuser ของแต่ละ plugin ปรับตามสาขา จึงยังเป็นสำเนา)
export const SHARED_FILES = [
  "skills/superuser/references/playbook-learn-from-session.md",
  "skills/superuser/references/playbook-template.md",
  "skills/superuser/references/playbook-team-project.md",
  "skills/superuser/references/learning-loop.md",
  "skills/superuser/references/brief-template.md",
  "skills/superuser/references/team-files.md",
  "skills/superuser/references/evidence.md",
  "skills/superuser/references/team-roles.md",
  "skills/superuser/references/voting.md",
  "skills/superuser/templates/improvements-queue.md",
  "skills/superuser/references/lead-playbook.md",
  "skills/superuser/templates/TEAM.md",
  "skills/superuser/templates/config.json",
];
export const SKILL = "skills/superuser/SKILL.md";
const REF = "skills/superuser/references";
// ไฟล์ที่มีบล็อกกลาง · ส่วนนอกบล็อกแต่ละ plugin เขียนเอง · SKILL.md ของสาขาไม่มีบล็อกแล้ว (มีเฉพาะส่วนสาขา + บรรทัดชี้ไปแกน)
export const BLOCK_FILES = [`${REF}/playbook-review.md`, `${REF}/playbook-unattended-run.md`];
// plugin ที่เขียนไฟล์นี้เองทั้งไฟล์ ไม่รับบล็อก (เหตุผลใน plugins/superuser/ADAPT.md ข้อ 1)
export const OPT_OUT = {};
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

// core-rules.md เป็นสำเนา · บทเรียน 2026-10-25: แก้สำเนาแล้ว sync เขียนทับจนงานหาย
// หัวเก็บ hash ของเนื้อหาที่ sync เขียน · เนื้อหาไม่ตรง hash = มีคนแก้มือ → ไม่เขียนทับ ไม่ว่าไฟล์ไหนแก้ทีหลัง (hook ตัดหัวนี้ก่อนส่ง)
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 12);
export const rulesHeader = (src) => `<!-- สำเนาที่ scripts/sync/sync-superuser.mjs สร้างจาก scripts/install/CLAUDE.global.md · ห้ามแก้ไฟล์นี้ แก้ที่ต้นฉบับ · sha256:${sha(src)} -->\n`;
// have = สำเนาที่มี (null = ไม่มี) · src = ต้นฉบับ · คืน { problem, write } (ไม่มี problem = ตรงแล้ว)
export function rulesCopyAction(have, src) {
  if (have === rulesHeader(src) + src) return {};
  const head = have?.match(/^<!-- สำเนาที่ [^\n]*sha256:([0-9a-f]{12}) -->\n/);
  if (head && sha(have.slice(head[0].length)) !== head[1])
    return { problem: "superuser/hooks/core-rules.md ถูกแก้มือ (เนื้อหาไม่ตรงกับ hash ในหัวไฟล์) — sync ไม่เขียนทับ ย้ายสิ่งที่แก้ไปที่ scripts/install/CLAUDE.global.md แล้วลบสำเนานี้ก่อนรันใหม่ (ต้องแก้มือ)", write: false };
  return { problem: "superuser/hooks/core-rules.md ไม่ตรงกับต้นฉบับ scripts/install/CLAUDE.global.md (ไฟล์นี้ sync สร้าง แก้ที่ต้นฉบับเท่านั้น)", write: true };
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
  const rules = rulesCopyAction(existsSync(rulesDst) ? lf(readFileSync(rulesDst, "utf8")) : null, rulesSrc);
  if (rules.problem) {
    problems.push(rules.problem);
    if (rules.write) writes.push([rulesDst, rulesHeader(rulesSrc) + rulesSrc]);
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
    const depends = (name) => (meta.dependencies ?? []).some((d) => (typeof d === "string" ? d : d.name).split("@")[0] === name);
    if (!depends("superuser")) problems.push(`${p}/.claude-plugin/plugin.json ไม่มี dependencies "superuser"`);
    // SKILL.md ของสาขา: มีบรรทัดชี้ไปแกน · ไม่มีบล็อกกลางค้าง (ส่วนกลางอยู่ที่ plugins/superuser ที่เดียว ไม่คัดลอกแล้ว)
    const skillText = existsSync(join(pluginsDir, p, SKILL)) ? lf(readFileSync(join(pluginsDir, p, SKILL), "utf8")) : "";
    if (!skillText.includes(SKILL_POINTER)) problems.push(`${p}/${SKILL} ไม่มีบรรทัด "${SKILL_POINTER}" — ต้องแก้มือ (ดู plugins/superuser/ADAPT.md ข้อ 3)`);
    if (/<!-- superuser:begin /.test(skillText)) problems.push(`${p}/${SKILL} ยังมีบล็อกกลาง superuser:begin — ตัดออก ต้องแก้มือ (ส่วนกลางอยู่ที่แกนแล้ว)`);
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
