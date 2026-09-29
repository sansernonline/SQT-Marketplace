#!/usr/bin/env node
/**
 * sync-docs.mjs — เขียนตัวเลขนับและรายการ skill ในเอกสารจากของจริงในโฟลเดอร์ plugins/
 *
 *   node scripts/sync-docs.mjs            เขียนทับไฟล์เอกสาร
 *   node scripts/sync-docs.mjs --check    ตรวจอย่างเดียว ไม่แก้ไฟล์ (ใช้ใน CI)
 *
 * แหล่งความจริงคือโฟลเดอร์ plugins/ เท่านั้น เอกสารทุกไฟล์เป็นผลลัพธ์
 * บล็อกคำอธิบายที่เขียนมือใน docs/REFERENCE.md ถูกเก็บไว้และย้ายตามอัตโนมัติ
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");
const CORE = "software-company";

// ── อ่านของจริงจาก plugins/ ────────────────────────────────────────────

function listDir(path) {
  return existsSync(path) ? readdirSync(path).sort() : [];
}

function readFrontmatter(file) {
  const text = readFileSync(file, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(\w+):\s*(.*)$/);
    if (pair) fields[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return fields;
}

function scanPlugins() {
  return listDir(join(ROOT, "plugins")).map((name) => {
    const dir = join(ROOT, "plugins", name);
    const skills = listDir(join(dir, "skills")).map((skillName) => ({
      name: skillName,
      description: readFrontmatter(join(dir, "skills", skillName, "SKILL.md")).description ?? "",
    }));
    return {
      name,
      agents: listDir(join(dir, "agents")).map((f) => f.replace(/\.md$/, "")),
      commands: listDir(join(dir, "commands")).map((f) => f.replace(/\.md$/, "")),
      skills,
    };
  });
}

/** skill ตัวนี้ถูกอ้างใน agent ไฟล์ไหนบ้าง */
function findAgentsUsing(plugin, skillName) {
  const dir = join(ROOT, "plugins", plugin.name, "agents");
  return plugin.agents.filter((agent) =>
    readFileSync(join(dir, `${agent}.md`), "utf8").includes(`\`${skillName}\``)
  );
}

// ── เขียนไฟล์เอกสาร ───────────────────────────────────────────────────

const pending = new Map();

function edit(relativePath, transform) {
  const file = join(ROOT, relativePath);
  const before = readFileSync(file, "utf8");
  const after = transform(before);
  if (after !== before) pending.set(relativePath, after);
}

function updateReadme(plugins, totals) {
  edit("README.md", (text) => {
    const core = plugins.find((p) => p.name === CORE);
    const addOnSkills = totals.skills - core.skills.length;
    text = text.replace(
      /\*\*รวม \d+ agents · \d+ skills · \d+ commands\*\* — core \d+ skills \+ add-on \d+ skills/,
      `**รวม ${totals.agents} agents · ${totals.skills} skills · ${totals.commands} commands** — core ${core.skills.length} skills + add-on ${addOnSkills} skills`
    );
    text = text.replace(/\*\*14 plugins\*\*/g, `**${plugins.length} plugins**`);
    for (const p of plugins) {
      const row = new RegExp(
        `(\\|[^|\\n]*\`${p.name}\`[^|\\n]*\\|)\\s*\\d+\\s*\\|\\s*\\d+\\s*\\|\\s*\\d+\\s*\\|`
      );
      text = text.replace(row, `$1 ${p.agents.length} | ${p.skills.length} | ${p.commands.length} |`);
    }
    return text;
  });
}

function updatePluginsDoc(plugins, totals) {
  edit("docs/PLUGINS.md", (text) => {
    text = text.replace(/ทั้งหมด \*\*\d+ plugins\*\*/, `ทั้งหมด **${plugins.length} plugins**`);
    for (const p of plugins) {
      const section = new RegExp(
        `(\`${p.name}\`[\\s\\S]{0,400}?)\\*\\*\\d+ agents · \\d+ skills · \\d+ commands\\*\\*`
      );
      text = text.replace(
        section,
        `$1**${p.agents.length} agents · ${p.skills.length} skills · ${p.commands.length} commands**`
      );
    }
    const core = plugins.find((p) => p.name === CORE);
    text = text.replace(/\d+ plugins\n\d+ agents \(\d+ core \+ \d+ add-on\)\n\d+ skills \(\d+ core \+ \d+ add-on\)\n\d+ commands \(\d+ core \+ \d+ add-on\)/,
      [
        `${plugins.length} plugins`,
        `${totals.agents} agents (${core.agents.length} core + ${totals.agents - core.agents.length} add-on)`,
        `${totals.skills} skills (${core.skills.length} core + ${totals.skills - core.skills.length} add-on)`,
        `${totals.commands} commands (${core.commands.length} core + ${totals.commands - core.commands.length} add-on)`,
      ].join("\n")
    );
    return text;
  });
}

function updateGlobalReadme(core) {
  const version = JSON.parse(
    readFileSync(join(ROOT, "plugins", CORE, ".claude-plugin", "plugin.json"), "utf8")
  ).version;
  edit("plugins-global/README.md", (text) =>
    text.replace(
      /\*\*ในไฟล์:\*\* \d+ skills · \d+ agents · \d+ commands · `plugin\.json` v[\d.]+/,
      `**ในไฟล์:** ${core.skills.length} skills · ${core.agents.length} agents · ${core.commands.length} commands · \`plugin.json\` v${version}`
    )
  );
}

/**
 * เก็บบรรทัดคำอธิบายที่เขียนมือไว้ โดยจับคู่กับชื่อ skill
 * ตัดตั้งแต่หัวข้อหนึ่งถึงหัวข้อถัดไป ไม่พึ่งเส้นคั่น `---` เพราะบางบล็อกไม่มี
 */
function harvestNotes(text) {
  const headings = [...text.matchAll(/^### \d+\.\s*([a-z0-9-]+)/gm)];
  const notes = new Map();
  headings.forEach((heading, index) => {
    const bodyStart = heading.index + heading[0].length;
    const bodyEnd = index + 1 < headings.length ? headings[index + 1].index : text.length;
    const kept = text
      .slice(bodyStart, bodyEnd)
      .split("\n")
      .filter((line) => line.startsWith("**") && !line.startsWith("**ใช้กับ:**"))
      .join("\n");
    if (kept) notes.set(heading[1], kept);
  });
  return notes;
}

function updateReference(plugins, totals) {
  const core = plugins.find((p) => p.name === CORE);
  edit("docs/REFERENCE.md", (text) => {
    const start = text.indexOf("## 🛠️ Skills (");
    const end = text.indexOf("## ⚡ Commands (");
    if (start < 0 || end < 0) throw new Error("docs/REFERENCE.md: หาหัวข้อ Skills หรือ Commands ไม่เจอ");
    // เก็บคำอธิบายจากช่วง Skills เท่านั้น ไม่งั้นบล็อกสุดท้ายจะกลืนหัวข้อ Commands เข้ามาด้วย
    const notes = harvestNotes(text.slice(start, end));

    // เรียงตามลำดับเดิมในไฟล์ แล้วต่อท้ายด้วย skill ใหม่ที่ยังไม่เคยมี
    const previousOrder = [...text.slice(start, end).matchAll(/^### \d+\.\s*([a-z0-9-]+)/gm)].map((m) => m[1]);
    const names = core.skills.map((s) => s.name);
    const ordered = [
      ...previousOrder.filter((name) => names.includes(name)),
      ...names.filter((name) => !previousOrder.includes(name)),
    ];

    const blocks = ordered.map((name, index) => {
      const skill = core.skills.find((s) => s.name === name);
      const users = findAgentsUsing(core, name);
      const lines = [`### ${index + 1}. ${name}`];
      if (users.length) lines.push(`**ใช้กับ:** ${users.join(", ")}`);
      lines.push(notes.get(name) ?? `**Description:** ${skill.description}`);
      return lines.join("\n");
    });

    const section = `## 🛠️ Skills (${core.skills.length})\n\n${blocks.join("\n\n---\n\n")}\n\n---\n\n`;
    text = text.slice(0, start) + section + text.slice(end);
    text = text.replace(/## 🧑‍💼 Agents \(\d+\)/, `## 🧑‍💼 Agents (${core.agents.length})`);
    text = text.replace(/## ⚡ Commands \(\d+\)/, `## ⚡ Commands (${core.commands.length})`);
    return text;
  });
}

// ── รัน ───────────────────────────────────────────────────────────────

const plugins = scanPlugins();
const totals = {
  agents: plugins.reduce((sum, p) => sum + p.agents.length, 0),
  skills: plugins.reduce((sum, p) => sum + p.skills.length, 0),
  commands: plugins.reduce((sum, p) => sum + p.commands.length, 0),
};
const core = plugins.find((p) => p.name === CORE);

updateReadme(plugins, totals);
updatePluginsDoc(plugins, totals);
updateGlobalReadme(core);
updateReference(plugins, totals);

console.log(
  `\n  ของจริง: ${plugins.length} plugins · ${totals.agents} agents · ${totals.skills} skills · ${totals.commands} commands` +
  `\n  core ${CORE}: ${core.agents.length} agents · ${core.skills.length} skills · ${core.commands.length} commands\n`
);

if (pending.size === 0) {
  console.log("  เอกสารตรงกับของจริงแล้ว ไม่มีอะไรต้องแก้\n");
  process.exit(0);
}

if (CHECK_ONLY) {
  console.log("  เอกสารไม่ตรงกับของจริง:");
  for (const path of pending.keys()) console.log(`    ✗ ${path}`);
  console.log("\n  แก้ด้วย: node scripts/sync-docs.mjs\n");
  process.exit(1);
}

for (const [path, content] of pending) {
  writeFileSync(join(ROOT, path), content);
  console.log(`  ✓ เขียนใหม่ ${path}`);
}
console.log("");
