// ยังไม่ได้รันตรวจบนเครื่องที่มี dotnet
// c2-buddhist-year-report — วาง hidden test ลงโฟลเดอร์ test project แล้วรันเฉพาะ test ใน namespace SalesReport.Tests.Hidden
// clean = `dotnet build -warnaserror` ผ่าน (ไม่มี warning)
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { run, prepare, cleanup, parseDotnet, cli } from "../../lib.mjs";

const HIDDEN = fileURLToPath(new URL("./hidden", import.meta.url));
const TEST_PROJECT = join("tests", "SalesReport.Tests");
const HIDDEN_TESTS = 7;
const FILTER = "FullyQualifiedName~SalesReport.Tests.Hidden";
const ENV = { DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1", DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1" };

/** ดึงบรรทัด warning/error ของ compiler (เช่น "warning CS8618") ไม่ซ้ำกัน ตัดชื่อไฟล์ .csproj ท้ายบรรทัดออก */
function issueLines(text) {
  const lines = text.split(/\r?\n/)
    .filter((l) => /\b(warning|error)\s+[A-Z]+\d+/.test(l))
    .map((l) => l.replace(/\s*\[[^\]]*\.csproj\]\s*$/, "").trim());
  return [...new Set(lines)];
}

export async function check(dir) {
  const ver = await run("dotnet", ["--version"], { env: ENV });
  if (ver.code !== 0) return { pass: 0, total: 0, clean: false, cleanNote: "ไม่พบ dotnet SDK", metrics: {} };

  const tmp = prepare(dir, HIDDEN, TEST_PROJECT);
  try {
    const cwd = join(tmp, TEST_PROJECT);

    const build = await run("dotnet", ["build", "-warnaserror", "-nologo"], { cwd, env: ENV });
    const issues = issueLines(build.out + build.err);
    const clean = build.code === 0;

    const test = await run("dotnet", ["test", "--filter", FILTER, "-nologo"], { cwd, env: ENV });
    const { pass, total } = parseDotnet(test.out + test.err);

    return {
      pass,
      total: Math.max(total, HIDDEN_TESTS), // build ไม่ผ่าน = นับ hidden test ทุกข้อว่าล้ม
      clean,
      cleanNote: clean ? "" : (issues.slice(0, 10).join("\n") || (build.out + build.err).trim().slice(-500)),
      metrics: { build_ms: build.ms, test_ms: test.ms, build_issues: issues.length, dotnet: ver.out.trim() },
    };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
