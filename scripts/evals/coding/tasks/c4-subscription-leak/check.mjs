// c4-subscription-leak — ตรวจ subscription ค้างหลัง ngOnDestroy
// hidden/ วาง test, scripts/measure.ts และ src/price-feed.service.ts ตัวเดิมทับ (กันการแก้ service)
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { existsSync, rmSync, symlinkSync } from "node:fs";
import { prepare, cleanup, npmInstall, run, parseNodeTest, cli } from "../../lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

// คัดลอก node_modules ทั้งก้อนช้า
// ถ้างานมี node_modules อยู่แล้ว ให้ชี้ไปที่ของเดิมแทน (junction ใช้ได้บน Windows โดยไม่ต้องเป็น admin) · ถ้าไม่มีก็ลงใหม่
async function linkOrInstall(dir, tmp) {
  const own = join(resolve(dir), "node_modules");
  rmSync(join(tmp, "node_modules"), { recursive: true, force: true });
  if (existsSync(own)) { symlinkSync(own, join(tmp, "node_modules"), "junction"); return { code: 0, err: "" }; }
  return npmInstall(tmp);
}

export async function check(dir) {
  const tmp = prepare(dir, join(HERE, "hidden"));
  try {
    const inst = await linkOrInstall(dir, tmp);
    if (inst.code !== 0) return { pass: 0, total: 1, clean: false, cleanNote: "npm install ล้ม: " + inst.err.slice(0, 300), metrics: {} };

    const t = await run("node", ["--import", "tsx", "--test", "--test-reporter=tap", "test/hidden-leak.test.ts"], { cwd: tmp });
    const { pass, total } = parseNodeTest(t.out);

    const m = await run("node", ["--import", "tsx", join("scripts", "measure.ts")], { cwd: tmp });
    const left = Number(/"subscriptions_after_destroy":\s*(\d+)/.exec(m.out)?.[1] ?? -1);

    const tsc = await run("node", [join("node_modules", "typescript", "bin", "tsc"), "--noEmit", "-p", "tsconfig.json"], { cwd: tmp });
    const tscErrors = (tsc.out.match(/error TS\d+/g) ?? []).length + (tsc.code !== 0 && !/error TS/.test(tsc.out) ? 1 : 0);

    return {
      pass, total,
      clean: tscErrors === 0,
      cleanNote: tscErrors === 0 ? "" : `tsc มี error ${tscErrors} จุด`,
      metrics: { subscriptions_after_destroy: left, tsc_errors: tscErrors, test_ms: t.ms },
    };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
