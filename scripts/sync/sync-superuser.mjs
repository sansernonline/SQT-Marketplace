#!/usr/bin/env node
// คัดลอกของกลางจาก plugins/superuser ไปทุก plugin ที่มี skills/superuser
//   node scripts/sync/sync-superuser.mjs          → เขียนทับของกลางในทุก plugin
//   node scripts/sync/sync-superuser.mjs --check  → ตรวจอย่างเดียว · ไม่ตรงออกด้วยรหัส 1
// ของกลาง = ไฟล์ใน SHARED_FILES ทั้งไฟล์ + บล็อก <!-- superuser:begin X --> ... <!-- superuser:end X --> ใน superuser/SKILL.md
// ส่วนอื่นของแต่ละ plugin ไม่ถูกแตะ (ดู plugins/superuser/ADAPT.md)
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const SHARED_FILES = [
  "skills/agent-patterns/SKILL.md",
  "skills/human-writing/SKILL.md",
  "skills/superuser/references/playbook-learn-from-session.md",
  "skills/superuser/references/playbook-template.md",
  "skills/superuser/references/learning-loop.md",
  "skills/superuser/references/brief-template.md",
  "agents/learning-reviewer.md",
  "hooks/superuser-hook.mjs",
  "hooks/hooks.json",
];
export const SKILL = "skills/superuser/SKILL.md";
const BLOCK = /<!-- superuser:begin ([a-z-]+) -->\n([\s\S]*?)<!-- superuser:end \1 -->/g;

const lf = (text) => text.replace(/\r\n/g, "\n");

export function blocksOf(text) {
  return new Map([...lf(text).matchAll(BLOCK)].map((m) => [m[1], m[2]]));
}

// คืนรายการปัญหา และข้อความใหม่ของแต่ละไฟล์ (ใช้ร่วมกับ validate-marketplace.mjs)
export function plan(root) {
  const pluginsDir = join(root, "plugins");
  const source = join(pluginsDir, "superuser");
  const masterBlocks = blocksOf(readFileSync(join(source, SKILL), "utf8"));
  const targets = readdirSync(pluginsDir).filter((p) => p !== "superuser" && existsSync(join(pluginsDir, p, SKILL)));
  const problems = [];
  const writes = [];
  for (const p of targets) {
    for (const rel of SHARED_FILES) {
      const want = lf(readFileSync(join(source, rel), "utf8"));
      const file = join(pluginsDir, p, rel);
      const have = existsSync(file) ? lf(readFileSync(file, "utf8")) : null;
      if (have !== want) {
        problems.push(`${p}/${rel} ${have === null ? "ไม่มี" : "ไม่ตรงกับต้นฉบับใน superuser"}`);
        writes.push([file, want]);
      }
    }
    const file = join(pluginsDir, p, SKILL);
    const original = readFileSync(file, "utf8");
    let text = lf(original);
    for (const [name, body] of masterBlocks) {
      const open = `<!-- superuser:begin ${name} -->\n`;
      const close = `<!-- superuser:end ${name} -->`;
      const at = text.indexOf(open);
      const end = text.indexOf(close, at);
      if (at < 0 || end < 0) { problems.push(`${p}/${SKILL} ไม่มีบล็อก superuser:${name} — ใส่ marker ครั้งแรกด้วยมือ`); continue; }
      if (text.slice(at + open.length, end) !== body) {
        problems.push(`${p}/${SKILL} บล็อก superuser:${name} ไม่ตรงกับต้นฉบับ`);
        text = text.slice(0, at + open.length) + body + text.slice(end);
      }
    }
    if (text !== lf(original)) writes.push([file, original.includes("\r\n") ? text.replace(/\n/g, "\r\n") : text]);
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
  const missing = problems.filter((line) => line.includes("ไม่มีบล็อก"));
  for (const [file, text] of writes) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); }
  console.log(`\nเขียน ${writes.length} ไฟล์ · ${targets.length} plugin${missing.length ? ` · ยังขาด marker ${missing.length} จุด` : ""}`);
  process.exit(missing.length ? 1 : 0);
}
