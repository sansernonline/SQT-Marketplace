// --self-test: ตัวเลขที่คิดด้วยมือได้ ถ้าสูตรพังข้อไหนจะล้มข้อนั้น · รันได้ทั้ง `node decide.test.mjs` และ `node decide.mjs --self-test`
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { score } from "./lib/score.mjs";
import { payoff } from "./lib/payoff.mjs";
import { knapsack } from "./lib/knapsack.mjs";
import { priority } from "./lib/priority.mjs";
import { pairwise } from "./lib/pairwise.mjs";
import { review } from "./lib/review.mjs";

const TEMPLATES = join(dirname(fileURLToPath(import.meta.url)), "..", "templates");
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} ≠ ${b}`);

const CASES = {
  "score: กฎเหล็กตัดก่อน normalize และเรียงถูก"() {
    const r = score({
      criteria: [{ name: "fee", weight: 1, better: "low" }, { name: "ret", weight: 1, better: "high" }],
      must: [{ criterion: "risk", max: 5 }],
      options: [
        { name: "A", values: { fee: 1, ret: 10, risk: 4 } },
        { name: "B", values: { fee: 2, ret: 6, risk: 4 } },
        { name: "C", values: { fee: 0, ret: 99, risk: 8 } },
      ],
    });
    assert.deepEqual(r.excluded.map((e) => e.name), ["C"], "C เสี่ยงเกิน ต้องถูกตัด");
    assert.deepEqual(r.ranked.map((o) => o.name), ["A", "B"]);
    near(r.ranked[0].score, 1, "A ดีสุดทั้ง 2 เกณฑ์");
    assert.ok(r.stable, "A ชนะทุกเกณฑ์ ขยับน้ำหนักแล้วต้องไม่พลิก");
  },
  "score: ขาดค่าเกณฑ์ = ตัดทิ้ง ไม่เติมศูนย์"() {
    const r = score({ criteria: [{ name: "x", weight: 1 }], options: [{ name: "A", values: { x: 1 } }, { name: "B", values: {} }] });
    assert.deepEqual(r.excluded.map((e) => e.name), ["B"]);
  },
  "score: สูสีแล้วขยับน้ำหนักพลิก = ไม่นิ่ง"() {
    const r = score({
      criteria: [{ name: "a", weight: 0.52 }, { name: "b", weight: 0.48 }],
      options: [{ name: "X", values: { a: 1, b: 0 } }, { name: "Y", values: { a: 0, b: 1 } }],
    });
    assert.equal(r.ranked[0].name, "X");
    assert.equal(r.stable, false);
    assert.ok(r.flips.some((f) => f.top === "Y"));
  },
  "payoff: ค่าคาดหวังกับเสียดายน้อยสุดคิดถูก"() {
    const r = payoff({
      options: ["fixed", "float"], better: "low",
      scenarios: [{ name: "up", p: 0.5 }, { name: "down", p: 0.5 }],
      table: { fixed: [100, 100], float: [150, 40] },
    });
    near(r.rows[1].ev, 95, "float EV");
    assert.equal(r.evBest, "float");
    assert.equal(r.rows[0].maxRegret, 60);
    assert.equal(r.rows[1].maxRegret, 50);
    assert.equal(r.regretBest, "float");
  },
  "payoff: โอกาสรวมไม่เป็น 1 = ไม่คิดค่าคาดหวัง"() {
    const r = payoff({ options: ["a", "b"], scenarios: [{ name: "s1", p: 0.3 }, { name: "s2", p: 0.3 }], table: { a: [1, 2], b: [2, 1] } });
    assert.equal(r.hasP, false);
    assert.equal(r.evBest, null);
  },
  "knapsack: ลองทุกชุดชนะ greedy ในเคสคลาสสิก"() {
    // greedy ตามอัตราส่วนจะหยิบ a (6/5) ก่อนแล้วใส่ b c ไม่ได้ · ดีสุดจริงคือ b + c = 10
    const r = knapsack({ budget: 8, items: [{ name: "a", cost: 5, value: 6.5 }, { name: "b", cost: 4, value: 5 }, { name: "c", cost: 4, value: 5 }] });
    assert.equal(r.value, 10);
    assert.deepEqual(r.ranked.filter((x) => x.chosen).map((x) => x.name).sort(), ["b", "c"]);
  },
  "knapsack: รายการบังคับต้องอยู่ในชุด"() {
    const r = knapsack({ budget: 10, items: [{ name: "must", cost: 6, value: 1, must: true }, { name: "x", cost: 5, value: 100 }, { name: "y", cost: 4, value: 3 }] });
    assert.deepEqual(r.ranked.filter((x) => x.chosen).map((x) => x.name).sort(), ["must", "y"]);
  },
  "knapsack: max_items จำกัดจำนวนรายการ"() {
    const r = knapsack({ budget: 100, max_items: 2, items: [{ name: "a", cost: 1, value: 3 }, { name: "b", cost: 1, value: 2 }, { name: "c", cost: 1, value: 1 }] });
    assert.deepEqual(r.ranked.filter((x) => x.chosen).map((x) => x.name), ["a", "b"]);
  },
  "ตรวจค่า: ค่าผิดต้องหยุดพร้อมชื่อช่อง ไม่คิดต่อเป็น NaN"() {
    const opts = [{ name: "A", values: { x: 1 } }, { name: "B", values: { x: 2 } }];
    assert.throws(() => score({ criteria: [{ name: "x" }], options: opts }), /weight/);
    assert.throws(() => score({ criteria: [{ name: "x", weight: "1" }], options: opts }), /weight/);
    assert.throws(() => score({ criteria: [{ name: "x", weight: 1, better: "Low" }], options: opts }), /better/);
    assert.throws(() => payoff({ options: ["a"], scenarios: [{ name: "s" }], table: { a: ["1"] } }), /table\.a\[0\]/);
    assert.throws(() => review({ cap: 3, rounds: [{ high: "x" }] }), /rounds\[0\]\.high/);
    assert.throws(() => priority({ method: "rice", items: [{ name: "a", reach: 1, impact: 1, confidence: 80, effort: 1 }] }), /confidence/);
    assert.throws(() => knapsack({ budget: 5, items: [{ name: "a", cost: 1 }] }), /value/);
  },
  "payoff: มากดี ใช้แย่สุดกับเสียดายแบบมากดี"() {
    const r = payoff({ options: ["safe", "risky"], scenarios: [{ name: "good", p: 0.5 }, { name: "bad", p: 0.5 }], table: { safe: [50, 40], risky: [100, 0] } });
    assert.equal(r.evBest, "risky", "EV 50 > 45");
    assert.equal(r.worstBest, "safe", "แย่สุด 40 > 0");
    assert.deepEqual(r.rows.map((x) => x.maxRegret), [50, 40]);
    assert.equal(r.regretBest, "risky");
  },
  "priority: wsjf = (คุณค่า + เวลา + เสี่ยง) ÷ ขนาด"() {
    const r = priority({ method: "wsjf", items: [{ name: "a", value: 8, time: 1, risk: 1, size: 5 }, { name: "b", value: 1, time: 5, risk: 3, size: 3 }] });
    near(r.rows.find((x) => x.name === "a").score, 2, "a");
    near(r.rows.find((x) => x.name === "b").score, 3, "b");
    assert.equal(r.rows[0].name, "b");
  },
  "pairwise: ชนะ 2 ต่อ 1 หลายครั้ง ความแข็งใกล้ 2 เท่า · แพ้หมดยังไม่เป็นศูนย์"() {
    const j = [];
    for (let i = 0; i < 100; i++) j.push({ first: "A", second: "B", winner: "A" }, { first: "B", second: "A", winner: "A" }, { first: "A", second: "B", winner: "B" });
    const r = pairwise({ items: ["A", "B"], judgments: j });
    const ratio = r.ranked[0].strength / r.ranked[1].strength;
    assert.ok(Math.abs(ratio - 2) < 0.05, `ratio ${ratio}`);
    const z = pairwise({ items: ["X", "Y"], judgments: [{ first: "X", second: "Y", winner: "X" }, { first: "Y", second: "X", winner: "X" }] });
    assert.ok(z.ranked[1].strength > 0, "ตัวกลางสมมติกันศูนย์");
  },
  "review: อัตราลดคิดจาก 2 รอบล่าสุด"() {
    const r = review({ cap: 5, rounds: [{ high: 0, medium: 8 }, { high: 0, medium: 2 }] });
    near(r.decay, 0.25, "2 ÷ 8"); near(r.expectNext, 0.5, "2 × 0.25");
    assert.equal(r.action, "fix-and-close", "0.5 ต่ำกว่าราคา 2");
    const partial = review({ cap: 5, value: { high: 5 }, rounds: [{ high: 1, medium: 1 }] });
    assert.equal(partial.values[0], 6, "ใส่ value บางช่อง ช่องที่เหลือใช้ค่าตั้งต้น");
  },
  "knapsack: ชุดรองลงมา · เพดานกลุ่ม · greedy เทียบชิ้นเดียว"() {
    const r = knapsack({ budget: 8, items: [{ name: "a", cost: 5, value: 6.5 }, { name: "b", cost: 4, value: 5 }, { name: "c", cost: 4, value: 5 }] });
    assert.equal(r.runnerUp.value, 6.5, "รองลงมาคือ a เดี่ยว");
    const g = knapsack({ budget: 10, groups: { tax: 5 }, items: [{ name: "x", cost: 4, value: 10, group: "tax" }, { name: "y", cost: 4, value: 9, group: "tax" }, { name: "z", cost: 2, value: 1 }] });
    assert.deepEqual(g.ranked.filter((i) => i.chosen).map((i) => i.name).sort(), ["x", "z"], "กลุ่ม tax ใส่ได้ชิ้นเดียว");
    // เกิน 20 รายการ (ใช้ greedy): ชิ้นเล็กอัตราส่วน 2 ถูกหยิบก่อน เหลืองบ 21 ใส่ชิ้นใหญ่ (ต้นทุน 22 · อัตราส่วน 1.8) ไม่ได้ · ได้แค่ 2 · ชิ้นใหญ่เดี่ยวได้ 40
    const filler = Array.from({ length: 20 }, (_, i) => ({ name: `f${i}`, cost: 30, value: 1 }));
    const big = knapsack({ budget: 22, items: [...filler, { name: "small", cost: 1, value: 2 }, { name: "big", cost: 22, value: 40 }] });
    assert.equal(big.value, 40, "ต้องเทียบกับชิ้นเดียวที่ค่าสูงสุด");
    const tie = knapsack({ budget: 10, items: [{ name: "cheap", cost: 2, value: 5 }, { name: "dear", cost: 6, value: 5 }] });
    assert.equal(tie.cost, 8, "งบพอ เลือกครบ 2 ชิ้น");
    // ชุด {x} เจอก่อน (ค่า 8 ต้นทุน 4) · ชุด {z, y} ค่า 8 เท่ากันแต่ต้นทุน 3.5 ต้องชนะ
    const tie2 = knapsack({ budget: 4, items: [{ name: "z", cost: 1, value: 3 }, { name: "x", cost: 4, value: 8 }, { name: "y", cost: 2.5, value: 5 }] });
    assert.equal(tie2.cost, 3.5, "ค่าเท่ากันต้นทุนน้อยกว่าชนะ");
    assert.equal(big.runnerUp, null, "เกิน 20 รายการไม่มีชุดรองลงมา");
  },
  "สูตรที่ test รอบ 2 ยังไม่ได้ป้องกัน"() {
    const ev = payoff({ options: ["a", "b"], scenarios: [{ name: "s1", p: 0.9 }, { name: "s2", p: 0.1 }], table: { a: [10, 0], b: [0, 50] } });
    near(ev.rows[0].ev, 9, "a = 0.9 × 10"); near(ev.rows[1].ev, 5, "b = 0.1 × 50"); assert.equal(ev.evBest, "a");
    const low = payoff({ options: ["x", "y"], better: "low", scenarios: [{ name: "s1" }, { name: "s2" }], table: { x: [1, 9], y: [5, 6] } });
    assert.deepEqual(low.rows.map((r) => r.worst), [9, 6], "ต้นทุน: แย่สุดคือค่ามากสุด");
    assert.equal(low.worstBest, "y");
    assert.equal(review({ cap: 5, rounds: [{ high: 0, medium: 3 }] }).action, "fix-and-close", "รอบแรก 3 × 0.5 = 1.5 ต่ำกว่า 2");
    assert.equal(review({ cap: 5, rounds: [{ high: 0, medium: 3 }, { high: 0, medium: 3 }] }).action, "stuck", "ค่าเท่าเดิม = ไม่คืบ");
    assert.equal(review({ cap: 5, value: { medium: 2 }, rounds: [{ high: 0, medium: 3 }] }).values[0], 6, "อ่าน value.medium");
    assert.throws(() => score({ criteria: [{ name: "x", weight: 0 }], options: [{ name: "A", values: { x: 1 } }] }), /weight/);
    const e = priority({ method: "eisenhower", items: [{ name: "edge", urgent: 3, important: 3, minutes: 10 }, { name: "long", urgent: 5, important: 5, minutes: 100 }, { name: "short", urgent: 4, important: 4, minutes: 10 }] });
    assert.equal(e.rows.find((x) => x.name === "edge").quadrant, "ทำเลย", "ด่วนและสำคัญ 3 นับว่าใช่");
    assert.deepEqual(e.rows.map((x) => x.name), ["short", "edge", "long"], "หารนาที: 16/10 > 9/10 > 25/100");
  },
  "priority: rice และ eisenhower เรียงถูก"() {
    const rice = priority({ method: "rice", items: [{ name: "a", reach: 100, impact: 1, confidence: 0.5, effort: 1 }, { name: "b", reach: 10, impact: 3, confidence: 1, effort: 0.5 }] });
    assert.deepEqual(rice.rows.map((x) => x.name), ["b", "a"]);
    const e = priority({ method: "eisenhower", items: [{ name: "drop", urgent: 1, important: 1, minutes: 1 }, { name: "now", urgent: 5, important: 5, minutes: 60 }, { name: "plan", urgent: 1, important: 5, minutes: 5 }] });
    assert.deepEqual(e.rows.map((x) => x.quadrant), ["ทำเลย", "นัดเวลาทำ", "ตัดทิ้ง"]);
  },
  "pairwise: ชนะทุกคู่ได้ที่ 1 และคู่ที่สลับแล้วกลับข้างนับเสมอ"() {
    const j = (first, second, winner) => ({ first, second, winner });
    const r = pairwise({ items: ["A", "B", "C"], judgments: [j("A", "B", "A"), j("B", "A", "A"), j("A", "C", "A"), j("C", "A", "A"), j("B", "C", "B"), j("C", "B", "C")] });
    assert.deepEqual(r.ranked.map((x) => x.name)[0], "A");
    assert.equal(r.biased, 1, "B กับ C ผลกลับข้างเมื่อสลับ");
    near(r.ranked[1].strength, r.ranked[2].strength, "B กับ C เสมอกันต้องแข็งเท่ากัน");
  },
  "review: กฎหยุดทั้ง 4 ทาง"() {
    assert.equal(review({ cap: 3, rounds: [{ high: 0, medium: 0 }] }).action, "pass");
    assert.equal(review({ cap: 3, rounds: [{ high: 1, medium: 0 }] }).action, "again", "ข้อสูงเหลือต้องตรวจซ้ำ");
    assert.equal(review({ cap: 3, rounds: [{ high: 2, medium: 4 }, { high: 0, medium: 1 }] }).action, "fix-and-close", "10 → 1 คาดรอบหน้า 0.1 ไม่คุ้ม");
    assert.equal(review({ cap: 3, rounds: [{ high: 0, medium: 6 }] }).action, "again", "6 × 0.5 = 3 ยังคุ้มราคา 2");
    assert.equal(review({ cap: 5, rounds: [{ high: 1, medium: 1 }, { high: 1, medium: 2 }] }).action, "stuck", "ค่าไม่ลด");
    assert.equal(review({ cap: 2, rounds: [{ high: 3, medium: 0 }, { high: 1, medium: 0 }] }).action, "stuck", "ครบเพดาน");
  },
  "templates: ทุกไฟล์ตัวอย่างรันผ่าน"() {
    const commands = { score, payoff, knapsack, priority, pairwise, review };
    for (const f of readdirSync(TEMPLATES).filter((x) => x.endsWith(".json"))) {
      const run = commands[basename(f, ".json")];
      assert.ok(run, `templates/${f} ไม่ตรงกับคำสั่งใด`);
      run(JSON.parse(readFileSync(join(TEMPLATES, f), "utf8")));
    }
  },
};

export function selfTest() {
  let failed = 0;
  for (const [name, fn] of Object.entries(CASES)) {
    try { fn(); console.log(`ผ่าน  ${name}`); } catch (e) { failed++; console.log(`ไม่ผ่าน ${name}\n  ${e.message}`); }
  }
  console.log(`${Object.keys(CASES).length - failed}/${Object.keys(CASES).length} ผ่าน`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) selfTest();
