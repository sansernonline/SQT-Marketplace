import { test } from "node:test";
import assert from "node:assert/strict";
import { wait } from "./keep-waiting.mjs";

const noSleep = () => Promise.resolve();

test("returns done at once when the file already exists", async () => {
  const r = await wait({ seconds: 5, untilFile: "x", exists: () => true, sleep: noSleep });
  assert.equal(r.done, true);
});

test("returns not done when the deadline passes without the file", async () => {
  const r = await wait({ seconds: 0.05, untilFile: "x", exists: () => false, sleep: () => new Promise((res) => setTimeout(res, 30)) });
  assert.equal(r.done, false);
});

test("notices a file that appears while waiting", async () => {
  let calls = 0;
  const r = await wait({ seconds: 5, untilFile: "x", exists: () => ++calls > 2, sleep: noSleep });
  assert.equal(r.done, true);
});

test("without --until-file it only sleeps and reports not done", async () => {
  const r = await wait({ seconds: 0.02, sleep: () => new Promise((res) => setTimeout(res, 10)) });
  assert.equal(r.done, false);
});
