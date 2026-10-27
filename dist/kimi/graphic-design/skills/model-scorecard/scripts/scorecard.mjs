#!/usr/bin/env node
// node scorecard.mjs [--log <โฟลเดอร์ log>] [--out <ไฟล์>]            รายงานของโปรเจกต์นี้ (ค่าเริ่ม .claude/superuser/log → log/MODEL-REPORT.md)
// node scorecard.mjs --rollup <โปรเจกต์ 1> <โปรเจกต์ 2> ... --out <ไฟล์>  รวมหลายโปรเจกต์ (ใช้เมื่อคนสั่งเท่านั้น · อ่านอย่างเดียว)
// node scorecard.mjs --self-test
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve, sep, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./collect.mjs";
import { buildReport } from "./report.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEAM_DIRS = [join(".claude", "superuser"), ".superuser"];

const logDirOf = (project) => join(project, TEAM_DIRS.find((d) => existsSync(join(project, d))) ?? TEAM_DIRS[0], "log");
const isInside = (file, folder) => (resolve(file) + sep).startsWith(resolve(folder) + sep);

export function parseArgs(argv) {
  const args = { rollup: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--self-test") args.selfTest = true;
    else if (argv[i] === "--log") args.log = argv[++i];
    else if (argv[i] === "--out") args.out = argv[++i];
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
  write(args.out ?? join(log, "MODEL-REPORT.md"), buildReport([[basename(dirname(dirname(dirname(log)))) || "โปรเจกต์นี้", log]], prices));
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
