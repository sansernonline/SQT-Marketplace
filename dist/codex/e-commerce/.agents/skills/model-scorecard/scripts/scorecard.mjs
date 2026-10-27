#!/usr/bin/env node
// node scorecard.mjs [--log <โฟลเดอร์ log>] [--out <ไฟล์>]            รายงานของโปรเจกต์นี้ (ค่าเริ่ม .claude/superuser/log → log/MODEL-REPORT.md)
// node scorecard.mjs --rollup <โปรเจกต์ 1> <โปรเจกต์ 2> ... --out <ไฟล์>  รวมหลายโปรเจกต์ (ใช้เมื่อคนสั่งเท่านั้น · อ่านอย่างเดียว)
// node scorecard.mjs --pick <ขั้น> [--candidates haiku,sonnet] [--log <โฟลเดอร์>]  จับ model ให้งานถัดไปของขั้นนั้น 1 ครั้งด้วย Thompson sampling
// node scorecard.mjs --self-test
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve, sep, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, collectProject } from "./collect.mjs";
import { buildReport, aggregate } from "./report.mjs";
import { contenders, pickOnce } from "./choose.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEAM_DIRS = [join(".claude", "superuser"), ".superuser"];

const logDirOf = (project) => join(project, TEAM_DIRS.find((d) => existsSync(join(project, d))) ?? TEAM_DIRS[0], "log");
// Windows ไม่สนตัวพิมพ์ของ path · เทียบแบบตัวพิมพ์เล็กทั้งคู่ ไม่งั้น --out c:/… หลุดกฎ "ห้ามเขียนลงโปรเจกต์ที่อ่าน"
const norm = (p) => (process.platform === "win32" ? resolve(p).toLowerCase() : resolve(p));
export const isInside = (file, folder) => (norm(file) + sep).startsWith(norm(folder) + sep);

export function parseArgs(argv) {
  const args = { rollup: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--self-test") args.selfTest = true;
    else if (argv[i] === "--log") args.log = argv[++i];
    else if (argv[i] === "--out") args.out = argv[++i];
    else if (argv[i] === "--pick") args.pick = argv[++i] ?? "";
    else if (argv[i] === "--candidates") args.candidates = (argv[++i] ?? "").split(",").filter(Boolean);
    else if (argv[i] === "--rollup") { while (argv[i + 1] && !argv[i + 1].startsWith("--")) args.rollup.push(argv[++i]); args.isRollup = true; }
  }
  return args;
}

function run(args) {
  const prices = readJson(join(HERE, "..", "references", "prices.json"), null);
  if (args.isRollup) {
    if (!args.rollup.length || !args.out) return fail("--rollup ต้องมีโฟลเดอร์โปรเจกต์อย่างน้อย 1 โฟลเดอร์ และ --out");
    const bad = args.rollup.find((p) => isInside(args.out, p));
    if (bad) return fail(`--out อยู่ในโปรเจกต์ที่อ่าน (${bad}) · รวมหลายโปรเจกต์ห้ามเขียนลงโปรเจกต์ที่อ่าน`);
    return write(args.out, buildReport(args.rollup.map((p) => [basename(resolve(p)), logDirOf(p)]), prices));
  }
  const log = resolve(args.log ?? logDirOf(process.cwd()));
  if (!existsSync(log)) return fail(`ไม่พบโฟลเดอร์ log: ${log} · ยังไม่มีงานลูกทีมให้สรุป`);
  if (args.pick !== undefined) return pick(args, log, prices);
  write(args.out ?? join(log, "MODEL-REPORT.md"), buildReport([[basename(dirname(dirname(dirname(log)))) || "โปรเจกต์นี้", log]], prices));
}

// พิมพ์ชื่อ model บรรทัดเดียว ให้หัวหน้าทีมใส่ใน model ของงานถัดไป · ผู้ท้าชิงไม่ถึง 2 ตัว = ไม่มีอะไรให้เลือก
function pick(args, log, prices) {
  if (!args.pick || args.pick.startsWith("--")) return fail("--pick ต้องตามด้วยชื่อขั้น เช่น --pick review");
  const list = contenders(aggregate(collectProject(log, "here").runs, prices), args.pick, prices, args.candidates ?? []);
  if (list.length < 2) return fail(`ขั้น ${args.pick} มีผู้ท้าชิง ${list.length} ตัว · เพิ่มด้วย --candidates หรือใช้ตามตารางระดับใน superuser หัวข้อ 5`);
  console.log(pickOnce(list));
}

function write(file, text) {
  mkdirSync(dirname(resolve(file)), { recursive: true });
  writeFileSync(file, text);
  console.log(`เขียน ${file}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
if (args.selfTest) await (await import("./self-test.mjs")).selfTest();
else run(args);
