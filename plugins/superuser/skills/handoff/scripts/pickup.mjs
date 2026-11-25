#!/usr/bin/env node
// pickup.mjs — ร่างการ์ด "รับงานต่อ" และย้ายข้อที่ปิดแล้วไป CONTEXT-archive.md
//   node pickup.mjs draft [--root <dir>]
//   node pickup.mjs archive [--context <path to CONTEXT.md>]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILES = 15;
const today = () => new Date().toLocaleDateString("sv-SE");   // YYYY-MM-DD ตามเวลาเครื่อง

// ── draft ───────────────────────────────────────────────────────────────
// ตัวสร้างล้วน: ไม่แตะดิสก์ · files = null แปลว่าไม่ใช่ git
export function buildCard({ date, branch, files, lastCommit }) {
  let part;
  if (files == null) part = "ไม่ใช่ git";
  else if (!files.length) part = "ไม่มีไฟล์ที่เปลี่ยน";
  else part = files.slice(0, MAX_FILES).join(", ") + (files.length > MAX_FILES ? `, +${files.length - MAX_FILES} more` : "");
  return `- **${date} ${branch ?? "-"} (กำลังทำ):** ${part} · last commit: ${lastCommit || "-"} · ต่อไป: (รอยืนยัน)`;
}

const git = (root, args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

export function draftCard(root = process.cwd()) {
  let inside = false;
  try { inside = git(root, ["rev-parse", "--is-inside-work-tree"]).trim() === "true"; } catch { /* ไม่ใช่ git */ }
  if (!inside) return buildCard({ date: today(), branch: "-", files: null, lastCommit: "" });
  let branch = "-", lastCommit = "";
  try { branch = git(root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim(); } catch { /* ยังไม่มี commit */ }
  try { lastCommit = git(root, ["log", "-1", "--format=%s"]).trim(); } catch { /* ยังไม่มี commit */ }
  // quotepath=off ให้ชื่อไทยออกมาตรง · rename "a -> b" เก็บชื่อใหม่ · ตัดเครื่องหมายคำพูดที่ git ครอบชื่อที่มีช่องว่าง
  const files = git(root, ["-c", "core.quotepath=off", "status", "--porcelain"]).split("\n").filter(Boolean)
    .map((l) => l.slice(3).split(" -> ").at(-1).trim().replace(/^"(.*)"$/, "$1"));
  return buildCard({ date: today(), branch, files, lastCommit });
}

// ── archive ─────────────────────────────────────────────────────────────
const isClosed = (head) => {
  const bold = head.match(/\*\*(.*?)\*\*/)?.[1] ?? "";
  // ปิดเฉพาะป้ายสถานะในวงเล็บที่ขึ้นต้นด้วย ปิด/เสร็จ เช่น "(ปิด · …)" "(เสร็จ 2026-11-23)" · คำว่า ปิด/เสร็จ กลางประโยคไม่นับ
  // "(ปิดบางส่วน)" และข้อที่ยังมี ติด/ทำอยู่/กำลังทำ ถือว่ายังเปิด (reviewer 2026-11-25)
  if (/ติด|ทำอยู่|กำลังทำ/.test(bold)) return false;
  return /\(\s*(ปิด|เสร็จ)(?!บางส่วน)/.test(bold) || /^-\s+(\*\*)?\(เดิม\)/.test(head);
};

// แยก "รับงานต่อ" เป็นข้อ: คืนช่วงบรรทัดของหัวข้อกับรายการข้อ { start, end, items: [{ from, to, closed }] }
function parseSection(lines) {
  const s = lines.findIndex((l) => /^## รับงานต่อ/.test(l));
  if (s < 0) return null;
  let e = lines.findIndex((l, i) => i > s && /^## /.test(l));
  if (e < 0) e = lines.length;
  const items = [];
  for (let i = s + 1; i < e; i++) {
    if (!/^-\s/.test(lines[i])) continue;
    let to = i + 1;
    while (to < e && /^\s+\S/.test(lines[to])) to++;
    items.push({ from: i, to, closed: isClosed(lines[i]) });
    i = to - 1;
  }
  return { start: s, end: e, items };
}

export function countClosed(text) {
  const sec = parseSection(text.split("\n"));
  return sec ? sec.items.filter((x) => x.closed).length : 0;
}

export function archive(contextPath, date = today()) {
  const lines = readFileSync(contextPath, "utf8").split("\n");
  const sec = parseSection(lines);
  const closed = sec ? sec.items.filter((x) => x.closed) : [];
  if (!closed.length) return { moved: 0, left: sec ? sec.items.length : 0 };
  const moved = closed.flatMap((x) => lines.slice(x.from, x.to));
  const drop = new Set(closed.flatMap((x) => Array.from({ length: x.to - x.from }, (_, k) => x.from + k)));
  // เขียน archive ก่อน · ถ้าเขียนไม่ได้ CONTEXT.md ยังไม่ถูกแตะ ข้อไม่หาย
  const arch = join(dirname(contextPath), "CONTEXT-archive.md");
  let old = existsSync(arch) ? readFileSync(arch, "utf8") : "";
  if (old && !old.endsWith("\n")) old += "\n";
  const lastHead = old.split("\n").filter((l) => /^## /.test(l)).at(-1);
  const head = lastHead === `## ${date}` ? "" : `${old ? "\n" : ""}## ${date}\n`;
  writeFileSync(arch, `${old}${head}${moved.join("\n")}\n`);
  writeFileSync(contextPath, lines.filter((_, i) => !drop.has(i)).join("\n"));
  return { moved: closed.length, left: sec.items.length - closed.length };
}

// ── CLI ─────────────────────────────────────────────────────────────────
function main(argv) {
  const [cmd, ...rest] = argv;
  const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
  if (cmd === "draft") { console.log(draftCard(resolve(opt("--root") ?? process.cwd()))); return 0; }
  if (cmd === "archive") {
    const given = opt("--context");
    const ctx = given ? resolve(given) : [".claude/superuser/CONTEXT.md", "CONTEXT.md"].map((p) => resolve(p)).find((p) => existsSync(p));
    if (!ctx || !existsSync(ctx)) { console.error("ไม่พบ CONTEXT.md (ใช้ --context <path>)"); return 1; }
    const { moved, left } = archive(ctx);
    console.log(`ย้าย ${moved} รายการ · เหลือ ${left} รายการ`);
    return 0;
  }
  console.error("usage: pickup.mjs draft [--root <dir>] | archive [--context <path>]");
  return 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
