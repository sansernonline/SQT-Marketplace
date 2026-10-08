#!/usr/bin/env node
/**
 * build-targets.mjs — สร้างชุด skill/agent/command ของทุก plugin สำหรับ LLM ตัวอื่นจาก plugins/
 *
 *   node scripts/build/build-targets.mjs                 สร้างลง dist/
 *   node scripts/build/build-targets.mjs --out=<โฟลเดอร์>  สร้างลงที่อื่น (ใช้ทดสอบ)
 *
 * แหล่งความจริงคือ plugins/ (รูปแบบ Claude) เท่านั้น · dist/ เป็นผลลัพธ์ ห้ามแก้มือ
 * สคริปต์ลบโฟลเดอร์ผลลัพธ์ทิ้งแล้วสร้างใหม่ทุกครั้ง
 *
 * ทุก plugin ได้ชุดของตัวเอง เพราะชื่อ skill ซ้ำกันข้าม plugin ได้ (เช่น superuser · human-writing)
 *
 *   dist/claude-web/<plugin>.zip         claude.ai (Cowork / แชทเว็บ) อัปโหลดทีละไฟล์
 *   dist/codex/<plugin>/                 OpenAI Codex CLI → .agents/skills · .codex/agents/*.toml · AGENTS.md
 *   dist/gemini-cli/<plugin>/            Gemini CLI extension → gemini-extension.json · skills · agents · commands/*.toml
 *   dist/chat-web/<plugin>/<บทบาท>/      ChatGPT Custom GPT / Gemini Gem → instructions.md + knowledge/
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync, cpSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { deflateRawSync, crc32 } from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_ARG = process.argv.find((a) => a.startsWith("--out="))?.slice(6);
const DIST = OUT_ARG ? resolve(OUT_ARG) : join(ROOT, "dist");

// ขีดจำกัดของหน้าเว็บ (ตรวจเมื่อ 2026-10-01)
const GPT_INSTRUCTIONS_MAX = 8000; // ตัวอักษร
const KNOWLEDGE_FILES_MAX = 10;    // Gem รับ 10 ไฟล์ · Custom GPT รับ 20 → ใช้ค่าที่น้อยกว่า

// ไฟล์ที่ไม่ใส่ในชุดสำหรับหน้าเว็บ (ใหญ่เกินและหน้าเว็บรันสคริปต์แตกไฟล์ไม่ได้)
const WEB_SKIP = [/\.zip$/i];

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
  const meta = JSON.parse(readFileSync(join(dir, ".claude-plugin", "plugin.json"), "utf8"));
  const all = read("skills", (name, path) => ({ name, path, ...parse(join(path, "SKILL.md")) }));
  // skill ที่มี disable-model-invocation: true = คำสั่งที่ผู้ใช้พิมพ์เอง → แปลงเป็นคำสั่งของปลายทาง
  const isCommand = (s) => s.fields["disable-model-invocation"] === "true";
  const skills = all.filter((s) => !isCommand(s));
  return {
    plugin,
    dir,
    version: meta.version ?? "0.0.0",
    description: meta.description ?? "",
    skills,
    skillByName: new Map(skills.map((s) => [s.name, s])),
    agents: read("agents", (n, path) => ({ name: n.replace(/\.md$/, ""), ...parse(path) })),
    commands: all.filter(isCommand),
  };
});

// ── ตัวช่วยเขียนไฟล์ ──────────────────────────────────────────────────

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

// simple: สตริงแบบ JSON เป็นสตริง basic ที่ถูกต้องทั้งใน TOML และ YAML
const quote = (s) => JSON.stringify(s);

const frontmatter = (fields) =>
  "---\n" + Object.entries(fields).map(([k, v]) => `${k}: ${quote(v)}`).join("\n") + "\n---\n\n";

function contextFile(p, tool, agentsHow) {
  const roles = p.agents.map((a) => `- **${a.name}** — ${a.fields.description}`).join("\n") || "ไม่มี";
  return `# SQT ${p.plugin} — ${tool}

> สร้างอัตโนมัติจาก plugins/${p.plugin}/ โดย scripts/build/build-targets.mjs (v${p.version}) · ห้ามแก้ไฟล์นี้โดยตรง

${p.description}

ชุดนี้มี skill ${p.skills.length} ตัว · บทบาท ${p.agents.length} บทบาท · คำสั่งสำเร็จรูป ${p.commands.length} คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → ${agentsHow}
- งานหลายขั้น → เริ่มที่ skill \`superuser\` · ทุกคำตอบและเอกสารเขียนตาม skill \`human-writing\`

## บทบาททั้งหมด

${roles}
`;
}

// ── Codex CLI ─────────────────────────────────────────────────────────

function buildCodex(p) {
  const out = join(DIST, "codex", p.plugin);
  for (const s of p.skills) cpSync(s.path, join(out, ".agents/skills", s.name), { recursive: true });

  // Codex เลิกใช้ custom prompt แล้ว → แปลงคำสั่งเป็น skill ที่เรียกด้วย $ชื่อ
  for (const c of p.commands) {
    const body = c.body.replaceAll("$ARGUMENTS", "สิ่งที่ผู้ใช้ระบุมากับคำสั่ง");
    write(join(out, ".agents/skills", c.name, "SKILL.md"),
      frontmatter({ name: c.name, description: c.fields.description }) + body);
  }

  for (const a of p.agents) {
    write(join(out, ".codex/agents", `${a.name}.toml`),
      `name = ${quote(a.name)}\ndescription = ${quote(a.fields.description)}\ndeveloper_instructions = ${quote(a.body)}\n`);
  }

  write(join(out, "AGENTS.md"), contextFile(p, "OpenAI Codex CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `$ชื่อคำสั่ง`"));
}

// ── Gemini CLI (extension) ────────────────────────────────────────────

function buildGemini(p) {
  const out = join(DIST, "gemini-cli", p.plugin);
  for (const s of p.skills) cpSync(s.path, join(out, "skills", s.name), { recursive: true });

  // ชื่อเครื่องมือของ Claude (Read, Edit, …) ไม่ตรงกับของ Gemini → ตัด tools/model ทิ้งให้ใช้ค่าเริ่มต้น
  for (const a of p.agents) {
    write(join(out, "agents", `${a.name}.md`),
      frontmatter({ name: a.name, description: a.fields.description }) + a.body);
  }

  for (const c of p.commands) {
    const prompt = c.body.replaceAll("$ARGUMENTS", "{{args}}");
    write(join(out, "commands", `${c.name}.toml`),
      `description = ${quote(c.fields.description)}\nprompt = ${quote(prompt)}\n`);
  }

  write(join(out, "gemini-extension.json"), JSON.stringify({
    name: `sqt-${p.plugin}`,
    version: p.version,
    description: p.description,
    contextFileName: "GEMINI.md",
  }, null, 2) + "\n");

  write(join(out, "GEMINI.md"), contextFile(p, "Gemini CLI",
    "เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`"));
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
  if (list.length === 0) return [];
  const size = Math.ceil(list.length / n);
  return Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
}

function buildChatWeb(p) {
  const out = join(DIST, "chat-web", p.plugin);
  const tooLong = [];

  for (const a of p.agents) {
    const dir = join(out, a.name);
    // skill ที่ agent อ้างถึง + skill กลางที่ทุกบทบาทต้องใช้ · หาเฉพาะใน plugin เดียวกัน
    const named = [...a.body.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]);
    const used = [...new Set([...named, "human-writing"])]
      .filter((n) => p.skillByName.has(n)).map((n) => p.skillByName.get(n));

    let instructions = a.body;
    let slots = KNOWLEDGE_FILES_MAX;
    if (instructions.length > GPT_INSTRUCTIONS_MAX) {
      tooLong.push(`${p.plugin}/${a.name}`);
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
  return tooLong;
}

function chatWebReadme(tooLong) {
  write(join(DIST, "chat-web", "README.md"), `# ChatGPT Custom GPT / Gemini Gem

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง

1 โฟลเดอร์ = 1 GPT หรือ Gem (\`<plugin>/<บทบาท>/\`)

1. คัดลอก \`instructions.md\` ไปวางในช่อง Instructions
2. อัปโหลดทุกไฟล์ใน \`knowledge/\` เป็นไฟล์ความรู้ (Knowledge)

ขีดจำกัดที่ใช้ตอนสร้าง: Instructions ไม่เกิน ${GPT_INSTRUCTIONS_MAX} ตัวอักษร (Custom GPT) ·
ไฟล์ความรู้ไม่เกิน ${KNOWLEDGE_FILES_MAX} ไฟล์ (Gem)

บทบาทที่ยาวเกินช่อง Instructions → ย้ายเนื้อหาไปไว้ใน \`knowledge/00-role.md\`:
${tooLong.map((n) => `\`${n}\``).join(", ") || "ไม่มี"}

ข้อจำกัด: หน้าเว็บรันสคริปต์ใน skill ไม่ได้ และไม่มีคำสั่งสำเร็จรูป (slash command)
`);
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


// โฟลเดอร์หลักในไฟล์ zip ต้องเป็น <plugin>/ ไม่ใช่ plugins/<plugin>/
function buildClaudeWeb(p) {
  const files = filesUnder(p.dir, `${p.plugin}/`).filter((f) => !WEB_SKIP.some((re) => re.test(f.name)));
  const out = join(DIST, "claude-web", `${p.plugin}.zip`);
  writeZip(out, files);
  return statSync(out).size;
}

function distReadme(rows) {
  const table = rows.map((r) =>
    `| \`${r.plugin}\` | ${r.version} | ${r.skills} | ${r.agents} | ${r.commands} | ${(r.zip / 1024 / 1024).toFixed(1)} MB |`).join("\n");
  write(join(DIST, "README.md"), `# dist — ชุดสำหรับเครื่องมืออื่น

> สร้างอัตโนมัติโดย scripts/build/build-targets.mjs · ห้ามแก้ไฟล์ในโฟลเดอร์นี้โดยตรง · สร้างใหม่ → รัน \`scripts\\build-dist.cmd\`

ทุก plugin ได้ชุดของตัวเอง ติดตั้งเฉพาะ plugin ที่ใช้

| ปลายทาง | โฟลเดอร์ | วิธีใช้ |
|---|---|---|
| claude.ai (Cowork / แชทเว็บ) | \`claude-web/<plugin>.zip\` | อัปโหลดทีละไฟล์ |
| OpenAI Codex CLI | \`codex/<plugin>/\` | คัดลอกเนื้อในโฟลเดอร์ไปไว้รากโปรเจกต์ |
| Gemini CLI | \`gemini-cli/<plugin>/\` | \`gemini extensions install <โฟลเดอร์>\` |
| ChatGPT Custom GPT / Gemini Gem | \`chat-web/<plugin>/<บทบาท>/\` | ดู \`chat-web/README.md\` |

| plugin | รุ่น | skill | บทบาท | คำสั่ง | ขนาด zip |
|---|---|---:|---:|---:|---:|
${table}

ไฟล์ .zip ภายใน skill (เช่นคลังไอคอน) ไม่อยู่ใน \`claude-web/\` เพราะหน้าเว็บแตกไฟล์ไม่ได้ · ชุด codex และ gemini-cli มีครบ
`);
}

// ── main ──────────────────────────────────────────────────────────────

rmSync(DIST, { recursive: true, force: true });
const rows = [];
const tooLong = [];
for (const p of plugins) {
  const zip = buildClaudeWeb(p);
  buildCodex(p);
  buildGemini(p);
  tooLong.push(...buildChatWeb(p));
  rows.push({ plugin: p.plugin, version: p.version, skills: p.skills.length, agents: p.agents.length, commands: p.commands.length, zip });
  console.log(`  ${p.plugin.padEnd(18)} v${p.version}  ${p.skills.length} skills · ${p.agents.length} agents · ${p.commands.length} commands · zip ${(zip / 1024 / 1024).toFixed(1)} MB`);
}
chatWebReadme(tooLong);
distReadme(rows);
console.log(`dist/ → ${plugins.length} plugins · chat-web: ${tooLong.length} roles moved to knowledge/00-role.md`);
