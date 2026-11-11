#!/usr/bin/env node
// ตรวจตัวตรวจก่อนใช้ token: รัน grader ชนิด regex ของ case.yaml กับคำตอบอ้างอิงและคำตอบที่จงใจทำผิด · ไม่เรียก model
// คำตอบอ้างอิงต้องผ่านทุกข้อ · คำตอบที่ผิด 1 จุดต้องตกข้อนั้นข้อเดียว
// ดัดแปลงจากคอร์ส CWN2026 สัปดาห์ 2 บท Skill Optimization (skill-optimizer) ของเจ้าของ repo · เรียบเรียงใหม่ 2026-11-11
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HELP = `ใช้: node scripts/evals/gate/grader-check.mjs <case.yaml> --good <ไฟล์> [--good <ไฟล์> …] [--bad <ชื่อ grader>=<ไฟล์> …]
       node scripts/evals/gate/grader-check.mjs --self-test

--good  คำตอบที่ถูกทุกข้อ (ข้อความล้วน เช่น .md) ต้องผ่าน grader regex ทุกตัว
--bad   คำตอบที่จงใจทำผิด 1 จุด ต้องตกเฉพาะ grader ที่บอกชื่อ ตัวอื่นต้องผ่าน
ตรวจเฉพาะ type: regex ที่ target เป็น last_message · match contains หรือ not_contains
grader ชนิดอื่น (llm · tool_used) · target trace · match count:N จะขึ้นว่า "ไม่ได้ตรวจ"

exit: 0 ทุกข้อเป็นตามที่คาด · 1 มีข้อไม่เป็นตามที่คาด (ตัวตรวจหรือคำตอบอ้างอิงผิด) · 2 ใช้ผิดหรืออ่าน case.yaml ไม่ได้`;

// ---------- อ่าน case.yaml (เฉพาะรายการ graders แบบที่ repo นี้เขียน ไม่ใช่ YAML เต็ม) ----------

/** ค่า YAML บรรทัดเดียว: 'single' (คู่ '' = ') · "double" (escape แบบ JSON) · ค่าธรรมดา (ตัดคอมเมนต์ท้าย) */
export function yamlScalar(raw) {
  const s = raw.trim();
  if (s.startsWith("'")) return s.slice(1, s.lastIndexOf("'")).replace(/''/g, "'");
  if (s.startsWith('"')) return JSON.parse(s.slice(0, s.lastIndexOf('"') + 1));
  return s.replace(/\s+#.*$/, "");
}

/** รายการ grader ใต้ `graders:` · คีย์ที่ย่อหน้าลึกกว่าคีย์ของ grader (เช่นใน criteria: |) ไม่นับ */
export function parseGraders(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const start = lines.findIndex((l) => /^graders:\s*$/.test(l));
  if (start < 0) return [];
  const graders = [];
  let current = null, keyIndent = -1;
  for (const line of lines.slice(start + 1)) {
    if (/^[^\s#-]/.test(line)) break; // คีย์ระดับบนตัวถัดไป
    const item = line.match(/^(\s*-\s+)(\w+):(.*)$/);
    if (item) {
      current = { [item[2]]: yamlScalar(item[3]) };
      graders.push(current);
      keyIndent = item[1].length;
      continue;
    }
    const kv = line.match(/^(\s*)(\w+):(.*)$/);
    if (current && kv && kv[1].length === keyIndent) current[kv[2]] = yamlScalar(kv[3]);
  }
  return graders;
}

// ---------- ให้คะแนน ----------

/** ผล 1 grader กับ 1 ข้อความ: true ผ่าน · false ตก · string = เหตุที่ไม่ได้ตรวจ */
export function gradeText(grader, text) {
  if (grader.type !== "regex") return `ไม่ได้ตรวจ (ชนิด ${grader.type} ต้องเรียก model หรือดู trace)`;
  if ((grader.target ?? "last_message") !== "last_message") return `ไม่ได้ตรวจ (target ${grader.target})`;
  const match = grader.match ?? "contains";
  if (!["contains", "not_contains"].includes(match)) return `ไม่ได้ตรวจ (match ${match})`;
  const found = new RegExp(grader.pattern, grader.flags ?? "").test(text);
  return match === "contains" ? found : !found;
}

/** texts = [{ label, text, expectFail: ชื่อ grader | null }] → { rows, unexpected } */
export function checkGraders(graders, texts) {
  const unexpected = [];
  const rows = graders.map((g) => {
    try { return { name: g.name, results: texts.map((t) => gradeText(g, t.text)) }; }
    catch (e) { // เช่น (?i) แบบ Python/PCRE ที่ RegExp ของ JavaScript ไม่รับ
      unexpected.push(`${g.name}: regex ใช้ใน JavaScript ไม่ได้ (${e.message})`);
      return { name: g.name, results: texts.map(() => "ไม่ได้ตรวจ (regex ผิดรูป)") };
    }
  });
  for (const row of rows) {
    row.results.forEach((r, i) => {
      if (typeof r === "string") return;
      const shouldPass = texts[i].expectFail !== row.name;
      if (r !== shouldPass) unexpected.push(`${row.name} กับ ${texts[i].label}: ${r ? "ผ่าน" : "ตก"} แต่ควร${shouldPass ? "ผ่าน" : "ตก"}`);
    });
  }
  return { rows, unexpected };
}

// ---------- พิมพ์ ----------

function printReport(rows, texts, unexpected) {
  const cell = (r) => (typeof r === "string" ? "–" : r ? "ผ่าน" : "ตก");
  console.log(`| grader | ${texts.map((t) => t.label).join(" | ")} |`);
  console.log(`|---|${texts.map(() => "---|").join("")}`);
  for (const row of rows) console.log(`| ${row.name} | ${row.results.map(cell).join(" | ")} |`);
  const skipped = rows.filter((r) => typeof r.results[0] === "string");
  for (const r of skipped) console.log(`- ${r.name}: ${r.results[0]}`);
  for (const u of unexpected) console.log(`ไม่เป็นตามที่คาด: ${u}`);
  console.log(unexpected.length
    ? `\nผล: ไม่ผ่าน ${unexpected.length} ข้อ → เปิดคำตอบดูว่าตัวตรวจหรือคำตอบอ้างอิงผิด · ตัวตรวจผิดให้แก้ก่อนรัน eval`
    : "\nผล: ตัวตรวจ regex ตัดสินตามที่คาดทุกข้อ");
}

// ---------- self-test ----------

function selfTest() {
  const yaml = [
    "name: demo-behaviour",
    "graders:",
    "  # คอมเมนต์ในรายการ",
    "  - name: has-breaker",
    "    type: regex",
    '    pattern: "เบรกเกอร์|\\\\bbreaker\\\\b"',
    "    flags: i",
    "    match: contains",
    "  - name: no-promise",
    "    type: regex",
    "    pattern: 'ได้แน่|it''s certain'",
    "    match: not_contains",
    "    target: last_message",
    "  - name: judge",
    "    type: llm",
    "    criteria: |",
    "      ผ่านเมื่อ",
    "      match: contains",
    "  - name: count-check",
    "    type: regex",
    '    pattern: "x"',
    '    match: "count:3"',
    "expected_outcome: ไม่ใช่ grader",
  ].join("\n");
  const graders = parseGraders(yaml);
  const byName = Object.fromEntries(graders.map((g) => [g.name, g]));
  const good = "ปิด Breaker ก่อนน้ำเข้า";
  const texts = [
    { label: "good", text: good, expectFail: null },
    { label: "bad:no-promise", text: `${good} ได้แน่นอน`, expectFail: "no-promise" },
  ];
  const ok = checkGraders(graders, texts);
  const wrongExpect = checkGraders(graders, [{ label: "bad", text: good, expectFail: "has-breaker" }]);
  const falseFail = checkGraders(graders, [{ label: "good", text: "ยังบอกไม่ได้ว่าได้แน่ไหม ปิดเบรกเกอร์ก่อน", expectFail: null }]);
  const pcreFlag = checkGraders([{ name: "inline-flag", type: "regex", pattern: "(?i)vet" }], [{ label: "good", text: "VET", expectFail: null }]);

  const checks = [
    ["อ่านได้ 4 grader · ไม่หลุดไปอ่าน expected_outcome", graders.length === 4],
    ['"double" แปลง \\\\b เป็น \\b', byName["has-breaker"].pattern === "เบรกเกอร์|\\bbreaker\\b"],
    ["'single' แปลง '' เป็น '", byName["no-promise"].pattern === "ได้แน่|it's certain"],
    ["คีย์ใน criteria: | ไม่ทับคีย์ของ grader", byName.judge.match === undefined],
    ["flags i ทำงาน", gradeText(byName["has-breaker"], "BREAKER off") === true],
    ["not_contains ตกเมื่อเจอคำ", gradeText(byName["no-promise"], "ได้แน่") === false],
    ["llm และ count:N ไม่ได้ตรวจ", typeof gradeText(byName.judge, good) === "string" && typeof gradeText(byName["count-check"], "xxx") === "string"],
    ["คำตอบอ้างอิงผ่าน และคำตอบผิด 1 จุดตกข้อเดียว", ok.unexpected.length === 0],
    ["คำตอบที่ควรตกแต่ผ่าน ถูกรายงาน", wrongExpect.unexpected.length === 1],
    ["ตัวตรวจตกคำตอบที่ถูก (คำปฏิเสธ) ถูกรายงาน", falseFail.unexpected.some((u) => u.startsWith("no-promise"))],
    ["regex (?i) ที่ JavaScript ไม่รับ ถูกรายงาน ไม่ล้มทั้งไฟล์", pcreFlag.unexpected.length === 1 && pcreFlag.unexpected[0].includes("JavaScript")],
  ];
  let passed = 0;
  for (const [name, pass] of checks) { console.log(`${pass ? "ผ่าน" : "ไม่ผ่าน"}  ${name}`); if (pass) passed++; }
  console.log(`\nself-test ${passed}/${checks.length} ผ่าน`);
  return passed === checks.length ? 0 : 1;
}

// ---------- main ----------

function main(argv) {
  if (argv.includes("--self-test")) return selfTest();
  const casePath = argv[0];
  const values = (flag) => argv.flatMap((a, i) => (a === flag ? [argv[i + 1]] : []));
  const texts = [
    ...values("--good").map((file) => ({ label: `good:${file.split(/[\\/]/).pop()}`, text: readFileSync(file, "utf8"), expectFail: null })),
    ...values("--bad").map((spec) => {
      const eq = spec.indexOf("=");
      if (eq < 1) throw new Error(`--bad ต้องเป็น <ชื่อ grader>=<ไฟล์>: ${spec}`);
      const name = spec.slice(0, eq), file = spec.slice(eq + 1);
      return { label: `bad:${name}`, text: readFileSync(file, "utf8"), expectFail: name };
    }),
  ];
  if (!casePath || casePath.startsWith("--") || !texts.length) { console.log(HELP); return 2; }
  const graders = parseGraders(readFileSync(casePath, "utf8"));
  const checkable = (g) => { try { return typeof gradeText(g, "") === "boolean"; } catch { return true; } }; // regex ผิดรูปก็นับ ให้ไปรายงานในตาราง
  const regexNames = new Set(graders.filter(checkable).map((g) => g.name));
  if (!regexNames.size) { console.log(`ไม่มี grader regex ที่ตรวจได้ใน ${casePath}`); return 2; }
  const unknown = texts.filter((t) => t.expectFail && !regexNames.has(t.expectFail));
  if (unknown.length) { console.log(`--bad อ้าง grader ที่ไม่ใช่ regex ที่ตรวจได้: ${unknown.map((t) => t.expectFail).join(" ")} (มี ${[...regexNames].join(" ")})`); return 2; }
  const { rows, unexpected } = checkGraders(graders, texts);
  printReport(rows, texts, unexpected);
  return unexpected.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (e) { console.error(`ผิดพลาด: ${e.message}`); process.exitCode = 2; }
}
