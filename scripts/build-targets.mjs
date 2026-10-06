#!/usr/bin/env node
/**
 * build-targets.mjs — สร้างชุด skill/agent/command สำหรับ LLM ตัวอื่นจาก plugins/
 *
 *   node scripts/build-targets.mjs
 *
 * แหล่งความจริงคือ plugins/ (รูปแบบ Claude) เท่านั้น — dist/ เป็นผลลัพธ์ ห้ามแก้มือ
 * สคริปต์ลบ dist/ ทิ้งแล้วสร้างใหม่ทุกครั้ง
 *
 *   dist/claude-web/  claude.ai (Cowork / แชทเว็บ) — software-company.zip สำหรับอัปโหลด
 *   dist/codex/       OpenAI Codex CLI   — .agents/skills, .codex/agents/*.toml, AGENTS.md
 *   dist/gemini-cli/  Gemini CLI extension — gemini-extension.json, skills, agents, commands/*.toml
 *   dist/chat-web/    ChatGPT Custom GPT / Gemini Gem — instructions.md + knowledge/ ต่อบทบาท
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync, cpSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { deflateRawSync, crc32 } from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const VERSION = JSON.parse(readFileSync(join(ROOT, "plugins/software-company/.claude-plugin/plugin.json"), "utf8")).version;

// ขีดจำกัดของหน้าเว็บ (ตรวจเมื่อ 2026-10-01)
const GPT_INSTRUCTIONS_MAX = 8000; // ตัวอักษร
const KNOWLEDGE_FILES_MAX = 10;    // Gem รับ 10 ไฟล์ · Custom GPT รับ 20 — ใช้ค่าที่น้อยกว่า

// ── อ่านของจริงจาก plugins/ ────────────────────────────────────────────

function listDir(path) {
  return existsSync(path) ? readdirSync(path).sort() : [];
}

function parse(file) {
  const text = readFileSync(file, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fields: {}, body: text };
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (pair) fields[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return { fields, body: match[2].trim() + "\n" };
}

const plugins = listDir(join(ROOT, "plugins")).map((plugin) => {
  const dir = join(ROOT, "plugins", plugin);
  const read = (sub, toItem) => listDir(join(dir, sub)).map((n) => toItem(n, join(dir, sub, n)));
  return {
    plugin,
    skills: read("skills", (name, path) => ({ name, path, ...parse(join(path, "SKILL.md")) })),
    agents: read("agents", (n, path) => ({ name: n.replace(/\.md$/, ""), ...parse(path) })),
    commands: read("commands", (n, path) => ({ name: n.replace(/\.md$/, ""), ...parse(path) })),
  };
});
const all = (key) => plugins.flatMap((p) => p[key].map((x) => ({ ...x, plugin: p.plugin })));
const skills = all("skills");
const agents = all("agents");
const commands = all("commands");
const skillByName = new Map(skills.map((s) => [s.name, s]));

// ── ตัวช่วยเขียนไฟล์ ──────────────────────────────────────────────────

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

// simple: สตริงแบบ JSON เป็นสตริง basic ที่ถูกต้องทั้งใน TOML และ YAML
const quote = (s) => JSON.stringify(s);

const frontmatter = (fields) =>
  "---\n" + Object.entries(fields).map(([k, v]) => `${k}: ${quote(v)}`).join("\n") + "\n---\n\n";

function rolesTable() {
  return agents.map((a) => `- **${a.name}** (${a.plugin}) — ${a.fields.description}`).join("\n");
}

function contextFile(tool, agentsHow) {
  return `# SQT Software Company — ${tool}

> สร้างอัตโนมัติจาก plugins/ โดย scripts/build-targets.mjs (v${VERSION}) — ห้ามแก้ไฟล์นี้โดยตรง

ชุดนี้จำลองทีมพัฒนาซอฟต์แวร์ครบทุกบทบาท ประกอบด้วย skill ${skills.length} ตัว
บทบาท ${agents.length} บทบาท และคำสั่งสำเร็จรูป ${commands.length} คำสั่ง

- **skill** — โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** — ${agentsHow}

## บทบาททั้งหมด

${rolesTable()}
`;
}

// ── Codex CLI ─────────────────────────────────────────────────────────

function buildCodex() {
  const out = join(DIST, "codex");
  for (const s of skills) cpSync(s.path, join(out, ".agents/skills", s.name), { recursive: true });

  // Codex เลิกใช้ custom prompt แล้ว — แปลงคำสั่งเป็น skill ที่เรียกด้วย $ชื่อ
  for (const c of commands) {
    const body = c.body.replaceAll("$ARGUMENTS", "สิ่งที่ผู้ใช้ระบุมากับคำสั่ง");
    write(join(out, ".agents/skills", c.name, "SKILL.md"),
      frontmatter({ name: c.name, description: c.fields.description }) + body);
  }

  for (const a of agents) {
    write(join(out, ".codex/agents", `${a.name}.toml`),
      `name = ${quote(a.name)}\ndescription = ${quote(a.fields.description)}\ndeveloper_instructions = ${quote(a.body)}\n`);
  }

  write(join(out, "AGENTS.md"), contextFile("OpenAI Codex CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ เช่น \"ให้ developer รีวิวโค้ดนี้\" · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง` เช่น `$code-review`"));
}

// ── Gemini CLI (extension) ────────────────────────────────────────────

function buildGemini() {
  const out = join(DIST, "gemini-cli");
  for (const s of skills) cpSync(s.path, join(out, "skills", s.name), { recursive: true });

  // ชื่อเครื่องมือของ Claude (Read, Edit, …) ไม่ตรงกับของ Gemini — ตัด tools/model ทิ้งให้ใช้ค่าเริ่มต้น
  for (const a of agents) {
    write(join(out, "agents", `${a.name}.md`),
      frontmatter({ name: a.name, description: a.fields.description }) + a.body);
  }

  for (const c of commands) {
    const prompt = c.body.replaceAll("$ARGUMENTS", "{{args}}");
    write(join(out, "commands", `${c.name}.toml`),
      `description = ${quote(c.fields.description)}\nprompt = ${quote(prompt)}\n`);
  }

  write(join(out, "gemini-extension.json"), JSON.stringify({
    name: "sqt-software-company",
    version: VERSION,
    description: "SQT software company: skills, roles and commands for the full SDLC",
    contextFileName: "GEMINI.md",
  }, null, 2) + "\n");

  write(join(out, "GEMINI.md"), contextFile("Gemini CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง` เช่น `/code-review`"));
}

// ── ChatGPT Custom GPT / Gemini Gem ───────────────────────────────────

function skillAsText(s) {
  let text = `# skill: ${s.name}\n\n${s.fields.description}\n\n${s.body}`;
  const refs = join(s.path, "references");
  for (const f of listDir(refs).filter((f) => f.endsWith(".md") && statSync(join(refs, f)).isFile())) {
    text += `\n\n## reference: ${f}\n\n${readFileSync(join(refs, f), "utf8")}`;
  }
  return text;
}

// แบ่งรายการเป็น n กองให้ใกล้เคียงกัน
function chunk(list, n) {
  const size = Math.ceil(list.length / n);
  return Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
}

function buildChatWeb() {
  const out = join(DIST, "chat-web");
  const tooLong = [];

  for (const a of agents) {
    const dir = join(out, a.plugin, a.name);
    const used = [...new Set([...a.body.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]))]
      .filter((n) => skillByName.has(n)).map((n) => skillByName.get(n));

    let instructions = a.body;
    let slots = KNOWLEDGE_FILES_MAX;
    if (instructions.length > GPT_INSTRUCTIONS_MAX) {
      tooLong.push(a.name);
      write(join(dir, "knowledge/00-role.md"), a.body);
      slots -= 1;
      instructions = `You are the **${a.name}** described in the knowledge file \`00-role.md\`.\n` +
        `Read it before every answer and follow it exactly. ${a.fields.description}\n`;
    }
    write(join(dir, "instructions.md"), instructions);

    chunk(used, slots).forEach((group, i) => {
      const file = group.length === 1 ? group[0].name : `skills-${String(i + 1).padStart(2, "0")}`;
      write(join(dir, "knowledge", `${file}.md`), group.map(skillAsText).join("\n\n---\n\n"));
    });
  }

  write(join(out, "README.md"), `# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build-targets.mjs (v${VERSION}) — ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

หนึ่งโฟลเดอร์ = หนึ่ง GPT หรือ Gem (\`<plugin>/<role>/\`)

1. คัดลอก \`instructions.md\` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน \`knowledge/\` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน ${GPT_INSTRUCTIONS_MAX} ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน ${KNOWLEDGE_FILES_MAX} ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions ถูกย้ายเนื้อหาไปไว้ใน \`knowledge/00-role.md\` แทน:
${tooLong.map((n) => `\`${n}\``).join(", ") || "ไม่มี"}

ข้อจำกัด: หน้าเว็บรัน script ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
`);
  return tooLong;
}

// ── claude.ai (Cowork / แชทเว็บ) ──────────────────────────────────────

function filesUnder(dir, prefix = "") {
  return listDir(dir).flatMap((n) => {
    const path = join(dir, n);
    return statSync(path).isDirectory() ? filesUnder(path, `${prefix}${n}/`) : [{ path, name: prefix + n }];
  });
}

// simple: เขียน zip เองด้วย zlib แทน dependency · วันที่คงที่ ไฟล์จึงไม่เปลี่ยนถ้าเนื้อหาไม่เปลี่ยน
function writeZip(out, files) {
  const DOS_DATE = 0x21; // 1980-01-01
  const local = [], central = [];
  let offset = 0;
  for (const f of files) {
    const data = readFileSync(f.path);
    const packed = deflateRawSync(data);
    const name = Buffer.from(f.name, "utf8");
    const head = (size) => {
      const b = Buffer.alloc(size);
      b.writeUInt16LE(0x0800, size === 30 ? 6 : 8);  // ชื่อไฟล์เป็น UTF-8
      b.writeUInt16LE(8, size === 30 ? 8 : 10);       // deflate
      b.writeUInt16LE(DOS_DATE, size === 30 ? 12 : 14);
      b.writeUInt32LE(crc32(data), size === 30 ? 14 : 16);
      b.writeUInt32LE(packed.length, size === 30 ? 18 : 20);
      b.writeUInt32LE(data.length, size === 30 ? 22 : 24);
      b.writeUInt16LE(name.length, size === 30 ? 26 : 28);
      return b;
    };
    const lh = head(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    const ch = head(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt32LE(offset, 42);
    local.push(lh, name, packed);
    central.push(ch, name);
    offset += lh.length + name.length + packed.length;
  }
  const dir = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.concat([...local, dir, end]));
}

// โฟลเดอร์หลักในไฟล์ zip ต้องเป็น software-company/ ไม่ใช่ plugins/software-company/
function buildClaudeWeb() {
  const core = "software-company";
  writeZip(join(DIST, "claude-web", `${core}.zip`), filesUnder(join(ROOT, "plugins", core), `${core}/`));
}

// ── main ──────────────────────────────────────────────────────────────

rmSync(DIST, { recursive: true, force: true });
buildClaudeWeb();
buildCodex();
buildGemini();
const tooLong = buildChatWeb();
console.log(`dist/ v${VERSION}: ${skills.length} skills · ${agents.length} agents · ${commands.length} commands`);
console.log(`chat-web: ${tooLong.length} roles moved to knowledge/00-role.md (instructions > ${GPT_INSTRUCTIONS_MAX} chars)`);
