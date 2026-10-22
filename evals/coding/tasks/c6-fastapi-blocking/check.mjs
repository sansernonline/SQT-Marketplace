// c6-fastapi-blocking — run the hidden concurrency tests on a temp copy; clean = every .py file compiles
// hidden/ also puts back the original slow_client.py, so editing the vendor file does not count as a fix.
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { PY, run, prepare, cleanup, parsePytest, cli } from "../../lib.mjs";

const HIDDEN = fileURLToPath(new URL("./hidden", import.meta.url));
const HIDDEN_TESTS = 3;

export async function check(dir) {
  const tmp = prepare(dir, HIDDEN);
  const metricsFile = join(tmp, "eval-metrics.json");
  try {
    const test = await run(PY, ["-m", "pytest", "-q", "-p", "no:cacheprovider", join("tests", "test_hidden_concurrency.py")], {
      cwd: tmp,
      env: { EVAL_METRICS_FILE: metricsFile },
    });
    const { pass, total } = parsePytest(test.out);
    const build = await run(PY, ["-m", "compileall", "-q", "."], { cwd: tmp });
    const clean = build.code === 0;
    const metrics = existsSync(metricsFile) ? JSON.parse(readFileSync(metricsFile, "utf8")) : {};
    return {
      pass,
      total: Math.max(total, HIDDEN_TESTS), // a collection error still counts every hidden test as failed
      clean,
      cleanNote: clean ? "" : (build.out + build.err).trim().slice(0, 500),
      metrics,
    };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
