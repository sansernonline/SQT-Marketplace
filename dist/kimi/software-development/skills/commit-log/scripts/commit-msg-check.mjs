#!/usr/bin/env node
// ตรวจข้อความ commit ตามกฎที่เป็นกลไกใน ../SKILL.md หัวข้อ 3–5 · ผิดข้อไหนบอกข้อนั้นแล้ว exit 1
//   node commit-msg-check.mjs "feat(auth): เพิ่มล็อกอินด้วย LINE"
//   node commit-msg-check.mjs --file .git/COMMIT_EDITMSG
//   node commit-msg-check.mjs --self-test
// เรื่องที่ต้องใช้วิจารณญาณ (subject บอกผลต่อคนอ่านไหม · ใช้ chore กับฟีเจอร์ไหม · ค่าลับ) ยังต้องตรวจด้วยตา
import { readFileSync } from "node:fs";

export const TYPES = ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build", "revert"];
const SUBJECT_MAX = 50; // SKILL.md หัวข้อ 4 · นับเป็นตัวที่เห็นบนจอ (สระและวรรณยุกต์ไทยรวมกับพยัญชนะ)
const BODY_WIDTH = 72; // SKILL.md หัวข้อ 4 · ความกว้างที่ git log แสดงพอดีหน้าจอ
const BODY_LINES = 3; // SKILL.md หัวข้อ 4 "body ไม่เกิน 3 บรรทัดสั้น"
const HEADER = /^([a-z]+)(?:\(([^)]*)\))?(!)?: (.+)$/;
const BANNED = [/\bwip\b/i, /\bfinal\b/i, /แก้นิดหน่อย/, /^(update code|fix bugs?|bug ?fix(es)?)$/i]; // SKILL.md หัวข้อ 5
const FILE_NAME = /\b[\w.-]+\.(m?js|ts|tsx|py|cs|java|go|php|rb|sql|json|ya?ml|html|css|md)\b/g;
const NOT_PAST = new Set(["need", "embed", "seed", "feed", "speed", "shed", "proceed", "exceed", "succeed", "red", "bed", "shared"]); // ลงท้าย ed แต่ไม่ใช่รูปอดีตของคำสั่ง (shared = คำคุณศัพท์ เช่น shared config)
const FOOTER = /^([\w-]+: |[\w-]+ #|BREAKING CHANGE: )/;

const graphemes = (s) => [...new Intl.Segmenter("th", { granularity: "grapheme" }).segment(s)].length;

export function check(message) {
  const lines = message.replace(/\r/g, "").replace(/\n+$/, "").split("\n").filter((l) => !l.startsWith("#"));
  const header = lines[0]?.trim() ?? "";
  if (!header) return ["ข้อความว่าง · บรรทัดแรกต้องเป็น <type>(<scope>): <subject>"];
  if (/^Merge (pull request|branch|remote-tracking branch) /.test(header) || /^Revert ".+"$/.test(header)) return []; // git merge และ git revert เขียนเอง ไม่ใช่ข้อความที่ agent เขียน
  const broken = [];
  const m = header.match(HEADER);
  if (!m) return [`บรรทัดแรกผิดรูป · ต้องเป็น <type>(<scope>): <subject> เช่น fix(stock): เบิกของที่เหลือพอดีได้ · ได้ "${header}"`];
  const [, type, scope, , subject] = m; // ! หลัง type พอบอกว่าของเดิมพัง footer BREAKING CHANGE: ใส่หรือไม่ก็ได้ตาม Conventional Commits
  if (!TYPES.includes(type)) broken.push(`type "${type}" ไม่มีในรายการ · ใช้ ${TYPES.join(" ")}`);
  if (scope !== undefined && !scope.trim()) broken.push("scope ว่าง · ใส่ชื่อโมดูล หรือตัดวงเล็บออก");
  if (/^misc$/i.test(scope ?? "")) broken.push("scope ห้ามเป็น misc · ใช้ชื่อโมดูลหรือฟีเจอร์ เช่น auth report stock");
  if (type !== "revert" && graphemes(subject) > SUBJECT_MAX) broken.push(`subject ยาว ${graphemes(subject)} ตัว เกิน ${SUBJECT_MAX} · ตัดคำ ย้ายเหตุผลไป body`);
  if (/[.。]$/.test(subject)) broken.push("subject ลงท้ายด้วยจุด · ลบจุดท้ายออก");
  const first = subject.split(/\s/)[0];
  if (/^[A-Z][a-z]+$/.test(first)) broken.push(`subject อังกฤษขึ้นต้นตัวเล็ก · "${first}" → "${first.toLowerCase()}"`);
  if (/^[a-z]+ed$/i.test(first) && !NOT_PAST.has(first.toLowerCase())) broken.push(`subject อังกฤษใช้รูปคำสั่ง · "${first}" → รูปปัจจุบัน เช่น added → add`);
  if (BANNED.some((re) => re.test(subject))) broken.push("มีคำต้องห้าม (WIP · final · update code · fix bug · แก้นิดหน่อย) · บอกว่าอะไรเปลี่ยนสำหรับคนอ่าน");
  if ((subject.match(FILE_NAME) ?? []).length >= 2) broken.push("subject เป็นรายชื่อไฟล์ · diff บอกอยู่แล้ว ให้บอกว่าอะไรเปลี่ยน");
  const rest = lines.slice(1);
  if (rest.length && rest[0].trim()) broken.push("ต้องเว้น 1 บรรทัดว่างระหว่างบรรทัดแรกกับ body");
  const body = rest.filter((l) => l.trim() && !FOOTER.test(l));
  if (body.length > BODY_LINES) broken.push(`body ${body.length} บรรทัด เกิน ${BODY_LINES} · เหลือเฉพาะเหตุผล`);
  const wide = rest.filter((l) => graphemes(l) > BODY_WIDTH && !/https?:\/\//.test(l));
  if (wide.length) broken.push(`body มี ${wide.length} บรรทัดยาวเกิน ${BODY_WIDTH} ตัว · ขึ้นบรรทัดใหม่`);
  return broken;
}

function main(argv) {
  if (argv.includes("--self-test")) return import("./commit-msg-check.test.mjs").then((t) => t.selfTest());
  const i = argv.indexOf("--file");
  let message;
  try { message = i >= 0 ? readFileSync(argv[i + 1], "utf8") : argv.find((a) => !a.startsWith("--")); } catch (e) { return fail(`อ่าน ${argv[i + 1]} ไม่ได้: ${e.message}`); }
  if (message === undefined) return fail('ใช้: node commit-msg-check.mjs "<ข้อความ>" | --file <ไฟล์> | --self-test');
  const broken = check(message);
  if (!broken.length) return console.log("ผ่าน");
  fail(`ไม่ผ่าน ${broken.length} ข้อ\n${broken.map((b) => `- ${b}`).join("\n")}`);
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("commit-msg-check.mjs")) main(process.argv.slice(2));
