// check.mjs — c7-slow-monthly-report
import { join, dirname } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { run, PY, prepare, cleanup, parsePytest, cli } from "../../lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

export async function check(dir) {
  const tmp = prepare(dir, join(HERE, "hidden"));
  try {
    const metricsFile = join(tmp, "eval-metrics.json");
    const t = await run(PY, ["-m", "pytest", "-q", "-p", "no:cacheprovider", "tests/test_hidden_report.py"],
      { cwd: tmp, env: { EVAL_METRICS_FILE: metricsFile } });
    const { pass, total } = parsePytest(t.out);
    const metrics = existsSync(metricsFile) ? JSON.parse(readFileSync(metricsFile, "utf8")) : {};
    metrics.test_ms = t.ms;
    const c = await run(PY, ["-m", "compileall", "-q", "-x", "[\\\\/](node_modules|\\.venv)[\\\\/]", "."], { cwd: tmp });
    const clean = c.code === 0;
    return { pass, total: total || 4, clean, cleanNote: clean ? "" : "compileall ล้ม: " + (c.out + c.err).slice(0, 400), metrics };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
