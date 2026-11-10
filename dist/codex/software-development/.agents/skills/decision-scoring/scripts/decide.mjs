#!/usr/bin/env node
// node decide.mjs <score|payoff|knapsack|priority|pairwise|review> <ไฟล์.json> [--json]
// อ่านตัวเลขจากไฟล์ JSON แล้วตัดสินด้วยสูตร ไม่ใช้ความรู้สึก · รูปไฟล์แต่ละแบบดูใน ../templates/<แบบ>.json
// node decide.mjs --self-test
import { readFileSync } from "node:fs";
import { score, renderScore } from "./lib/score.mjs";
import { payoff, renderPayoff } from "./lib/payoff.mjs";
import { knapsack, renderKnapsack } from "./lib/knapsack.mjs";
import { priority, renderPriority } from "./lib/priority.mjs";
import { pairwise, renderPairwise } from "./lib/pairwise.mjs";
import { review, renderReview } from "./lib/review.mjs";

export const COMMANDS = {
  score: { run: score, render: (r, input) => renderScore(r, input.criteria) },
  payoff: { run: payoff, render: renderPayoff },
  knapsack: { run: knapsack, render: renderKnapsack },
  priority: { run: priority, render: renderPriority },
  pairwise: { run: pairwise, render: renderPairwise },
  review: { run: review, render: renderReview },
};

function main(argv) {
  if (argv.includes("--self-test")) return import("./decide.test.mjs").then((t) => t.selfTest());
  const [command, file] = argv.filter((a) => !a.startsWith("--"));
  const c = COMMANDS[command];
  if (!c || !file) return fail(`ใช้: node decide.mjs <${Object.keys(COMMANDS).join("|")}> <ไฟล์.json> [--json]`);
  let input;
  try { input = JSON.parse(readFileSync(file, "utf8")); } catch (e) { return fail(`อ่าน ${file} ไม่ได้: ${e.message}`); }
  try {
    const result = c.run(input);
    console.log(argv.includes("--json") ? JSON.stringify(result, null, 2) : c.render(result, input));
  } catch (e) { fail(e.message); }
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

main(process.argv.slice(2));
