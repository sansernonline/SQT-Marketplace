#!/usr/bin/env node
// เตือนรูปแบบโค้ดอันตรายตอนแก้ไฟล์ (PostToolUse · Write/Edit/MultiEdit) · เตือนอย่างเดียว ไม่บล็อก
// สแกนเฉพาะข้อความที่เพิ่งเขียน (ไม่อ่านไฟล์ ไม่โหลดอะไรจากเน็ต ไม่เรียก LLM) · แต่ละกฎเตือนครั้งเดียวต่อ session
// ปิด: "code_patterns": false ใน .claude/superuser/config.json ของโฟลเดอร์งาน (แบบเดียวกับ ui_scan)
//      หรือตัวแปรแวดล้อม SQT_CODE_PATTERNS=off (ปิดทุกโปรเจกต์) · ข้อมูลเข้าไม่ถูกรูป → เงียบ ไม่ล้ม
// รายการกฎเขียนเองจากแนวปฏิบัติทั่วไป (OWASP · เอกสาร .NET · Python) แนวคิดรายการจาก security-guidance ของ
// claude-plugins-official (Apache-2.0 · ดู 2026-11-10) ไม่ได้คัดลอกข้อความ
// ทดสอบ: node code-pattern-warn.mjs --self-test
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, extname } from "node:path";
import { tmpdir, userInfo } from "node:os";
import { createHash } from "node:crypto";

const JS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".vue", ".svelte"];
const PY = [".py"];
const CS = [".cs", ".cshtml"];
const HTML = [".html", ".htm", ".cshtml", ".vue", ".svelte"];
const SKIP_PATH = /(^|[\\/])(\.claude|node_modules|dist|build|\.next|out|vendor|coverage|evals)([\\/]|$)|\.min\./;
const MAX_CHARS = 200_000;
const USER = (() => { try { return userInfo().username.replace(/[^\w.-]/g, "_"); } catch { return "user"; } })();
const STATE_DIR = join(tmpdir(), `sqt-code-pattern-${USER}`);

// exts = ส่วนต่อท้ายไฟล์ที่ใช้กฎนี้ · path = ใช้กับเส้นทางไฟล์แทน (เช่น workflow)
export const RULES = [
  { id: "js-eval", exts: JS, re: /\beval\s*\(|new\s+Function\s*\(/, msg: "eval หรือ new Function รันข้อความเป็นโค้ด ถ้าข้อความมาจากผู้ใช้คือช่องให้รันคำสั่งได้ · ใช้ JSON.parse หรือตารางฟังก์ชันแทน" },
  // js-exec ไม่จับ util.promisify(exec)(...) และไม่เตือน .exec ของตัวแปรที่ชื่อมี re · regex · pattern (ถือว่าเป็น RegExp)
  { id: "js-exec", exts: JS, re: /(?<!\/[a-z]{0,6}\.)(?<!(?<![\w$])(?:re|rx|regex|regexp|pattern|matcher|[\w$]{0,40}(?:Re|RE|Rx|Regex|REGEX|RegExp|Pattern|PATTERN|Matcher)|[\w$]{0,40}_(?:re|rx|regex|pattern))\.)(?<!RegExp\([^)]{0,200}\)\.)\bexec(?:Sync)?\s*\(\s*(?:`[^`]{0,500}\$\{|[^)]{0,300}\+)/, msg: "exec ต่อสตริงจากตัวแปรเป็น command injection · ใช้ execFile หรือ spawn ที่ส่ง argument เป็น array" },
  { id: "js-innerhtml", exts: [...JS, ...HTML], re: /\.(?:inner|outer)HTML\s*=(?!=)|dangerouslySetInnerHTML|\bv-html\b|document\.write\s*\(/, msg: "ใส่ HTML จากตัวแปรโดยตรงเสี่ยง XSS · ใช้ textContent หรือ sanitize ด้วย DOMPurify ก่อน" },
  { id: "js-sql-concat", exts: JS, re: /\.(?:query|execute|raw)\s*\(\s*(?:`[^`]{0,500}\$\{|["'][^"']{0,500}["']\s*\+)/, msg: "ต่อสตริงเป็น SQL เสี่ยง SQL injection · ใช้ parameter (? หรือ $1)" },
  { id: "tls-off", exts: [...JS, ...PY], re: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0|verify\s*=\s*False/, msg: "ปิดการตรวจใบรับรอง TLS ทำให้ถูกดักกลางทางได้ · ใส่ CA ที่ถูกต้องแทนการปิด" },
  { id: "py-pickle", exts: PY, re: /\b(?:c?[Pp]ickle|dill|marshal|shelve)\.loads?\s*\(|read_pickle\s*\(|allow_pickle\s*=\s*True/, msg: "pickle และพวกเดียวกันรันโค้ดได้เมื่อโหลดไฟล์ที่ไม่น่าเชื่อถือ · ใช้ JSON หรือ schema ที่ตรวจชนิด" },
  { id: "py-yaml", exts: PY, re: /\byaml\.(?:unsafe_load|load)\s*\((?![^)]{0,300}Safe)/, msg: "yaml.load รันโค้ด Python ได้ · ใช้ yaml.safe_load" },
  { id: "py-torch", exts: PY, re: /\btorch\.load\s*\((?![^)]{0,300}weights_only\s*=\s*True)/, msg: "torch.load ค่าเริ่มต้นแกะ pickle รันโค้ดได้ · ใส่ weights_only=True" },
  { id: "py-shell", exts: PY, re: /\bsubprocess\.\w+\([^)]{0,300}shell\s*=\s*True|\bos\.system\s*\(/, msg: "shell=True หรือ os.system กับข้อความจากผู้ใช้เป็น command injection · ส่ง argument เป็น list โดยไม่ใช้ shell" },
  { id: "py-eval", exts: PY, re: /(?<![\w.])(?:eval|exec)\s*\(/, msg: "eval และ exec รันข้อความเป็นโค้ด · ใช้ ast.literal_eval ถ้าต้องการแค่ค่าคงที่" },
  { id: "weak-cipher", exts: [...JS, ...PY, ...CS], re: /MODE_ECB|CipherMode\.ECB|aes-\d+-ecb|createCipher\s*\(/i, msg: "โหมด ECB ไม่ซ่อนรูปแบบของข้อมูล · ใช้ AES-GCM" },
  { id: "dotnet-binaryformatter", exts: CS, re: /\bBinaryFormatter\b|TypeNameHandling\.(?:All|Auto|Objects|Arrays)|\bNetDataContractSerializer\b/, msg: "BinaryFormatter และ TypeNameHandling แกะข้อมูลเป็นชนิดที่ผู้ส่งเลือกได้ รันโค้ดได้ · ใช้ System.Text.Json กับชนิดที่ประกาศไว้" },
  { id: "dotnet-sql-concat", exts: CS, re: /new\s+SqlCommand\s*\(\s*(?:\$"|@\$"|"[^"]*"\s*\+)|FromSqlRaw\s*\(\s*\$"|ExecuteSqlRaw\s*\(\s*\$"/, msg: "ต่อสตริงเป็น SQL เสี่ยง SQL injection · ใช้ SqlParameter หรือ FromSqlInterpolated" },
  { id: "dotnet-tls-off", exts: CS, re: /ServerCertificateCustomValidationCallback\s*=\s*[^;]{0,300}(?:true|DangerousAcceptAnyServerCertificateValidator)|ServerCertificateValidationCallback\s*[+]?=\s*[^;]{0,300}true/, msg: "รับทุกใบรับรองคือปิดการตรวจ TLS · ใช้ใบรับรองที่ถูกต้อง" },
  { id: "html-no-sri", exts: HTML, re: /<script\b(?![^>]{0,500}\bintegrity=)[^>]{0,500}\bsrc=["']https?:\/\//i, msg: "script จาก CDN ภายนอกไม่มี integrity (SRI) ถ้า CDN ถูกแก้ ผู้ใช้โดนรันโค้ดแปลกปลอม · ใส่ integrity และ crossorigin หรือโฮสต์เอง" },
  { id: "gha-injection", path: /\.github[\\/]workflows[\\/][^\\/]+\.ya?ml$/, re: /\$\{\{\s*github\.event\.(?:issue\.(?:title|body)|pull_request\.(?:title|body|head\.ref)|comment\.body|review\.body|head_commit\.message)/, msg: "ใส่ข้อความจาก issue หรือ PR ลงใน run: ตรง ๆ เป็น command injection · ส่งผ่าน env: แล้วอ้าง \"$VAR\"" },
];

export function newText(input) {
  const t = input?.tool_input ?? {};
  if (input?.tool_name === "Write") return String(t.content ?? "");
  if (input?.tool_name === "Edit") return String(t.new_string ?? "");
  if (input?.tool_name === "MultiEdit") return (Array.isArray(t.edits) ? t.edits : []).map((e) => String(e?.new_string ?? "")).join("\n");
  return "";
}

export function findHits(file, text) {
  if (!file || SKIP_PATH.test(file)) return [];
  const ext = extname(file).toLowerCase();
  const body = text.slice(0, MAX_CHARS);
  return RULES.filter((r) => (r.path ? r.path.test(file) : r.exts.includes(ext)) && r.re.test(body));
}

function unseen(session, hits, dir = STATE_DIR) {
  const path = join(dir, `${createHash("sha1").update(String(session)).digest("hex").slice(0, 16)}.json`);
  let seen = [];
  try { seen = JSON.parse(readFileSync(path, "utf8")); } catch { /* รอบแรก */ }
  const fresh = hits.filter((h) => !seen.includes(h.id));
  if (fresh.length) {
    try { mkdirSync(dir, { recursive: true }); writeFileSync(path, JSON.stringify([...seen, ...fresh.map((h) => h.id)])); } catch { /* จดไม่ได้ก็แค่เตือนซ้ำ */ }
  }
  return fresh;
}

export function moduleOn(cwd) {
  if (process.env.SQT_CODE_PATTERNS === "off") return false;
  if (!cwd) return true;
  try { return JSON.parse(readFileSync(join(cwd, ".claude", "superuser", "config.json"), "utf8"))?.modules?.code_patterns !== false; } catch { return true; }
}

export function decide(input, dir = STATE_DIR) {
  if (!["Write", "Edit", "MultiEdit"].includes(input?.tool_name)) return null;
  if (!moduleOn(input.cwd)) return null;
  const file = input.tool_input?.file_path;
  const fresh = unseen(input.session_id ?? "", findHits(file, newText(input)), dir);
  if (!fresh.length) return null;
  const lines = fresh.map((h) => `- \`${h.id}\`: ${h.msg}`);
  return { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: `เตือนรูปแบบโค้ดเสี่ยง (code-pattern-warn) ใน ${file}\n${lines.join("\n")}\nเป็นข้อเตือนให้ตรวจ ไม่ใช่คำสั่งให้เปลี่ยน · ถ้าตั้งใจและปลอดภัยแล้ว (ข้อมูลไม่ได้มาจากผู้ใช้) เขียนเหตุผลสั้น ๆ ไว้ใน comment แล้วทำต่อ` } };
}

function selfTest() {
  const dir = join(tmpdir(), `sqt-cpw-test-${process.pid}`);
  const ev = (tool, file, extra, sid = "s1") => ({ session_id: sid, tool_name: tool, tool_input: { file_path: file, ...extra } });
  const out = [];
  const t = (name, cond) => out.push([name, !!cond]);
  const msgOf = (r) => r?.hookSpecificOutput?.additionalContext ?? "";

  t("eval ใน .ts → เตือน", msgOf(decide(ev("Write", "a.ts", { content: "const x = eval(s)" }), dir)).includes("js-eval"));
  t("exec ต่อสตริงใน .js → เตือน", msgOf(decide(ev("Write", "g.js", { content: 'exec("ls " + dir)' }, "s20"), dir)).includes("js-exec"));
  t("child_process.execSync ต่อสตริง → เตือน", msgOf(decide(ev("Write", "g.js", { content: "child_process.execSync(`ls ${dir}`)" }, "s21"), dir)).includes("js-exec"));
  t("re.exec(a + b) ของ RegExp → เงียบ", decide(ev("Write", "g.js", { content: "const m = re.exec(a + b)" }, "s22"), dir) === null);
  for (const [i, c] of ["/\\d+/g.exec(a + b)", "DATE_RE.exec(s + t)", "tokenRegex.exec(a + b)", "myPattern.exec(`${a}`)", "new RegExp(p).exec(a + b)"].entries())
    t(`RegExp แบบ ${c} → เงียบ`, decide(ev("Write", "g.js", { content: `const m = ${c}` }, "s3" + i), dir) === null);
  for (const [i, c] of ['remote.exec("rm -rf " + dir)', 'preview.exec("ls " + d)', 'childProcessRef.exec("ls " + d)'].entries())
    t(`ชื่อที่แค่มี re อยู่กลาง ${c} → เตือน`, msgOf(decide(ev("Write", "g.js", { content: c }, "s4" + i), dir)).includes("js-exec"));
  t("/x/.exec(a + b) → เงียบ", decide(ev("Write", "g.js", { content: "const m = /x/.exec(a + b)" }, "s25"), dir) === null);
  t("cp.exec ต่อสตริง → เตือน", msgOf(decide(ev("Write", "g.js", { content: 'cp.exec("ls " + d)' }, "s26"), dir)).includes("js-exec"));
  t("require(child_process).exec ต่อสตริง → เตือน", msgOf(decide(ev("Write", "g.js", { content: 'require("child_process").exec("x" + y)' }, "s27"), dir)).includes("js-exec"));
  t("childProcess.execSync template → เตือน", msgOf(decide(ev("Write", "g.js", { content: "childProcess.execSync(`rm ${f}`)" }, "s28"), dir)).includes("js-exec"));
  t("ข้อเดิมใน session เดิม → เงียบ", decide(ev("Edit", "a.ts", { new_string: "eval(y)" }), dir) === null);
  t("session ใหม่ → เตือนอีก", decide(ev("Edit", "a.ts", { new_string: "eval(y)" }, "s2"), dir) !== null);
  t("โค้ดปกติ → เงียบ", decide(ev("Write", "b.ts", { content: "const a = JSON.parse(s)" }, "s3"), dir) === null);
  t("yaml.safe_load → เงียบ", decide(ev("Write", "c.py", { content: "yaml.safe_load(f)" }, "s4"), dir) === null);
  t("yaml.load → เตือน", msgOf(decide(ev("Write", "c.py", { content: "yaml.load(f)" }, "s5"), dir)).includes("py-yaml"));
  t("torch.load weights_only → เงียบ", decide(ev("Write", "d.py", { content: "torch.load(p, weights_only=True)" }, "s6"), dir) === null);
  t("torch.load ไม่มี → เตือน", msgOf(decide(ev("Write", "d.py", { content: "torch.load(p)" }, "s7"), dir)).includes("py-torch"));
  t("BinaryFormatter ใน .cs → เตือน", msgOf(decide(ev("Write", "E.cs", { content: "var f = new BinaryFormatter();" }, "s8"), dir)).includes("dotnet-binaryformatter"));
  t("SqlCommand ต่อสตริง → เตือน", msgOf(decide(ev("Write", "E.cs", { content: 'new SqlCommand("select * from t where id=" + id, c)' }, "s9"), dir)).includes("dotnet-sql-concat"));
  t("SqlCommand ใช้ parameter → เงียบ", decide(ev("Write", "E.cs", { content: 'new SqlCommand("select * from t where id=@id", c)' }, "s10"), dir) === null);
  t("workflow injection → เตือน", msgOf(decide(ev("Write", "x/.github/workflows/ci.yml", { content: "run: echo ${{ github.event.issue.title }}" }, "s11"), dir)).includes("gha-injection"));
  t("script CDN ไม่มี integrity → เตือน", msgOf(decide(ev("Write", "p.html", { content: '<script src="https://cdn.x.com/a.js"></script>' }, "s12"), dir)).includes("html-no-sri"));
  t("script CDN มี integrity → เงียบ", decide(ev("Write", "p.html", { content: '<script src="https://cdn.x.com/a.js" integrity="sha384-abc"></script>' }, "s13"), dir) === null);
  t("MultiEdit อ่านทุก edit", msgOf(decide(ev("MultiEdit", "a.js", { edits: [{ new_string: "ok" }, { new_string: "el.innerHTML = s" }] }, "s14"), dir)).includes("js-innerhtml"));
  t("node_modules → เงียบ", decide(ev("Write", "node_modules/x/a.js", { content: "eval(1)" }, "s15"), dir) === null);
  t("ไฟล์ .md → เงียบ", decide(ev("Write", "README.md", { content: "eval(1)" }, "s16"), dir) === null);
  t("Bash → เงียบ", decide({ session_id: "s17", tool_name: "Bash", tool_input: { command: "ls" } }, dir) === null);
  t("ข้อมูลเข้าพัง → เงียบ ไม่ล้ม", decide(null, dir) === null);
  const proj = join(dir, "proj");
  mkdirSync(join(proj, ".claude", "superuser"), { recursive: true });
  writeFileSync(join(proj, ".claude", "superuser", "config.json"), JSON.stringify({ modules: { code_patterns: false } }));
  t("ปิดโมดูล code_patterns → เงียบ", decide({ ...ev("Write", "f.ts", { content: "eval(s)" }, "s18"), cwd: proj }, dir) === null);
  t("config ไม่มีคีย์ → ยังเตือน", decide({ ...ev("Write", "f.ts", { content: "eval(s)" }, "s19"), cwd: dir }, dir) !== null);
  rmSync(dir, { recursive: true, force: true });
  for (const [n, p] of out) console.log(`${p ? "ผ่าน" : "ล้ม "} ${n}`);
  const failed = out.filter(([, p]) => !p).length;
  console.log(`self-test ${out.length - failed}/${out.length}`);
  return failed ? 1 : 0;
}

function main() {
  if (process.argv.includes("--self-test")) process.exit(selfTest());
  let input;
  try { input = JSON.parse(readFileSync(0, "utf8")); } catch { return; }
  try { const out = decide(input); if (out) process.stdout.write(JSON.stringify(out)); } catch { /* hook ต้องไม่ทำ session พัง */ }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/code-pattern-warn.mjs")) main();
