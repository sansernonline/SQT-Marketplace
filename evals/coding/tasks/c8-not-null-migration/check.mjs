// check.mjs — c8-not-null-migration
import { join, dirname } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { run, prepare, cleanup, npmInstall, parseNodeTest, cli } from "../../lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOTAL = 6;

export async function check(dir) {
  const tmp = prepare(dir, join(HERE, "hidden"));
  try {
    const inst = await npmInstall(tmp);
    if (inst.code !== 0) return { pass: 0, total: TOTAL, clean: false, cleanNote: "npm install ล้ม: " + inst.err.slice(0, 400), metrics: {} };

    const metricsFile = join(tmp, "eval-metrics.json");
    const t = await run("node", ["--test", "--test-reporter=tap", "test/hidden.test.mjs"],
      { cwd: tmp, env: { EVAL_METRICS_FILE: metricsFile } });
    const { pass, total } = parseNodeTest(t.out);
    const metrics = existsSync(metricsFile) ? JSON.parse(readFileSync(metricsFile, "utf8")) : {};
    metrics.test_ms = t.ms;

    const c = await run("node", ["clean-check.mjs"], { cwd: tmp });
    let problems;
    try { problems = JSON.parse(c.out.trim().split("\n").pop()).problems; } catch { problems = ["clean-check ล้ม: " + (c.out + c.err).slice(0, 400)]; }
    const clean = problems.length === 0;
    return { pass, total: total || TOTAL, clean, cleanNote: problems.join(" | "), metrics };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
