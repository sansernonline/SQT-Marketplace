// c5-csv-import — run the hidden pytest tests on a temp copy; clean = every .py file compiles
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { PY, run, prepare, cleanup, parsePytest, cli } from "../../lib.mjs";

const HIDDEN = fileURLToPath(new URL("./hidden", import.meta.url));
const HIDDEN_TESTS = 6;

export async function check(dir) {
  const tmp = prepare(dir, HIDDEN);
  try {
    const test = await run(PY, ["-m", "pytest", "-q", "-p", "no:cacheprovider", join("tests", "test_hidden_import.py")], { cwd: tmp });
    const { pass, total } = parsePytest(test.out);
    const build = await run(PY, ["-m", "compileall", "-q", "."], { cwd: tmp });
    const clean = build.code === 0;
    return {
      pass,
      total: Math.max(total, HIDDEN_TESTS), // a collection error still counts every hidden test as failed
      clean,
      cleanNote: clean ? "" : (build.out + build.err).trim().slice(0, 500),
      metrics: {},
    };
  } finally {
    cleanup(tmp);
  }
}

cli(import.meta, check);
