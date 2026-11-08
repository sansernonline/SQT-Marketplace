// node scripts/evals/dispatch/score.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { parsePlan, scoreRun, summarizeArm, tierAccuracy, tierOf, armTable } from "./score.mjs";

const piece = (name, model, effort = "medium") => ({ name, model, effort, depends_on: [] });
const answer = (plan) => "```json\n" + JSON.stringify(plan) + "\n```";
const FOUR = { risky: false, expected: { workers: 4 }, graph: { tasks: Array(4).fill({ tier: "กลาง" }) } };
const LEAD_ONLY = { risky: false, expected: { workers: 0 }, graph: { tasks: [{ tier: "เล็ก" }] } };
const RISKY = { risky: true, expected: { workers: 2 }, graph: { tasks: Array(3).fill({ tier: "ใหญ่" }) } };
const GOOD_FOUR = {
  size: "กลาง", workers_parallel_max: 4, waves: [["a", "b", "c", "d"]], review_rounds: 1,
  pieces: ["a", "b", "c", "d"].map((n) => piece(n, "claude-sonnet-5-5")), expect_line: "คาด: ขนาด กลาง · ลูกทีม 4 · รอบตรวจ 1 · ระดับ กลาง",
};

test("should_give_full_marks_when_plan_matches_answer_key", () => {
  const s = scoreRun(FOUR, answer(GOOD_FOUR));

  assert.deepEqual(s, { parsed: true, ratio: 1, ratio_ok: true, tier_acc: 1, iron_violation: 0, effort_set: 1, has_expect: true, wave_ok: true });
});

test("should_fail_ratio_when_workers_far_from_answer_key", () => {
  const s = scoreRun(FOUR, answer({ ...GOOD_FOUR, workers_parallel_max: 1 }));

  assert.equal(s.ratio_ok, false);
});

test("should_zero_every_field_when_json_is_broken", () => {
  const s = scoreRun(FOUR, '{"size": "กลาง", "workers_parallel_max": 4,');

  assert.deepEqual(s, { parsed: false, ratio: null, ratio_ok: false, tier_acc: 0, iron_violation: 0, effort_set: 0, has_expect: false, wave_ok: false });
});

test("should_zero_every_field_when_answer_is_missing", () => {
  assert.equal(scoreRun(FOUR, undefined).parsed, false);
});

test("should_pass_lead_only_case_when_workers_is_zero", () => {
  const s = scoreRun(LEAD_ONLY, JSON.stringify({ size: "เล็ก", workers_parallel_max: 0, waves: [], pieces: [], expect_line: "คาด: ขนาด เล็ก" }));

  assert.deepEqual([s.ratio_ok, s.tier_acc, s.effort_set], [true, null, null]);
});

test("should_fail_lead_only_case_when_any_worker_is_sent", () => {
  const s = scoreRun(LEAD_ONLY, JSON.stringify({ workers_parallel_max: 1, waves: [["a"]], pieces: [piece("a", "haiku")] }));

  assert.equal(s.ratio_ok, false);
});

test("should_flag_iron_violation_when_risky_work_uses_haiku", () => {
  const s = scoreRun(RISKY, answer({ workers_parallel_max: 2, waves: [["a"], ["b", "c"]], pieces: [piece("a", "opus"), piece("b", "haiku"), piece("c", "opus")] }));

  assert.equal(s.iron_violation, 1);
});

test("should_count_unnamed_model_as_wrong_tier", () => {
  assert.equal(tierAccuracy([null, "กลาง"], ["กลาง", "กลาง"]), 0.5);
});

test("should_compare_tier_mix_not_piece_names", () => {
  assert.equal(tierAccuracy(["กลาง", "กลาง", "กลาง", "กลาง"], ["กลาง", "กลาง", "กลาง", "ใหญ่"]), 0.75);
});

test("should_map_model_names_to_tiers", () => {
  assert.deepEqual(["claude-opus-5-5", "Sonnet", "haiku", "fable", undefined].map(tierOf), ["ใหญ่", "กลาง", "เล็ก", "ใหญ่", null]);
});

test("should_fail_wave_check_when_a_wave_exceeds_eight", () => {
  const s = scoreRun(FOUR, answer({ ...GOOD_FOUR, waves: [Array(9).fill("x")] }));

  assert.equal(s.wave_ok, false);
});

test("should_fail_expect_check_when_line_lacks_prefix", () => {
  const s = scoreRun(FOUR, answer({ ...GOOD_FOUR, expect_line: "ใช้ลูกทีม 4 ตัว" }));

  assert.equal(s.has_expect, false);
});

test("should_read_bare_json_with_text_around_it", () => {
  assert.equal(parsePlan('แผนคือ {"size":"กลาง"} ครับ').size, "กลาง");
});

test("should_score_ten_when_every_run_is_perfect", () => {
  const rows = [{ risky: false, score: scoreRun(FOUR, answer(GOOD_FOUR)) }, { risky: true, score: scoreRun({ ...RISKY, expected: { workers: 4 }, graph: { tasks: Array(4).fill({ tier: "กลาง" }) } }, answer(GOOD_FOUR)) }];

  assert.equal(summarizeArm(rows).total, 10);
});

test("should_score_zero_when_every_run_is_broken", () => {
  const rows = [{ risky: true, score: scoreRun(RISKY, "ไม่ใช่ JSON") }, { risky: false, score: scoreRun(FOUR, "") }];

  assert.equal(summarizeArm(rows).total, 0);
});

test("should_give_wilson_interval_for_ratio_share", () => {
  const m = summarizeArm([{ risky: false, score: scoreRun(FOUR, answer(GOOD_FOUR)) }, { risky: false, score: scoreRun(FOUR, "") }]);

  assert.ok(m.ratio_ok.p === 0.5 && m.ratio_ok.lo < 0.5 && m.ratio_ok.hi > 0.5);
});

test("should_show_delta_column_when_both_arms_exist", () => {
  const good = summarizeArm([{ risky: false, score: scoreRun(FOUR, answer(GOOD_FOUR)) }]);
  const bad = summarizeArm([{ risky: true, score: scoreRun(RISKY, "") }]);

  assert.match(armTable(good, bad), /\*\*10\.0\*\* \| \*\*0\.0\*\* \| \+10\.0 \|/);
});

const CHAIN = { risky: false, expected: { workers: 1 }, accept_workers: [0, 1], graph: { tasks: Array(4).fill({ tier: "กลาง" }) } };
const workers = (n) => JSON.stringify({ workers_parallel_max: n, waves: [], pieces: [] });

test("should_accept_lead_doing_chain_alone_when_zero_is_in_accept_list", () => {
  const s = scoreRun(CHAIN, workers(0));

  assert.deepEqual([s.ratio_ok, s.tier_acc], [true, null]);
});

test("should_accept_one_worker_when_one_is_in_accept_list", () => {
  assert.equal(scoreRun(CHAIN, workers(1)).ratio_ok, true);
});

test("should_reject_count_outside_accept_list", () => {
  assert.equal(scoreRun(CHAIN, workers(2)).ratio_ok, false);
});

test("should_reject_nine_workers_even_inside_ratio_window", () => {
  const twelve = { risky: false, expected: { workers: 8 }, graph: { tasks: Array(12).fill({ tier: "กลาง" }) } };

  assert.deepEqual([8, 9].map((n) => scoreRun(twelve, workers(n)).ratio_ok), [true, false]);
});

test("should_show_skill_opened_share_when_runs_record_it", () => {
  const m = summarizeArm([{ risky: false, skill_opened: true, score: scoreRun(FOUR, "") }, { risky: false, skill_opened: false, score: scoreRun(FOUR, "") }]);

  assert.equal(m.skill_opened, 0.5);
});
