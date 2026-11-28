#!/usr/bin/env node
// copy-monitor.mjs - weekly check of a followed copy-trade signal against exit rules set before subscribing (Node stdlib only)
// Usage: node copy-monitor.mjs <monitor.json> [--json]   |   node copy-monitor.mjs --self-test
// JSON: { "load": 47, "rules": { "maxDrawdownPct": 10, ... }, "periods": [ { "period", "providerPct", "start", "end", "fees", "providerDrawdownPct" } ] }
// One period = one week (or month). Deposit or withdraw only between periods; "start" is the equity after it.
// fees = subscription and VPS paid in that period, converted to the account currency (optional).
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// float tolerance so a value exactly at a limit counts as reaching it (100 → 90 gives 9.999…%)
const EPS = 1e-9;
const RULE_KEYS = ['maxDrawdownPct', 'providerMaxDrawdownPct', 'maxGapPts', 'gapPeriods', 'reviewPeriods'];

function num(v, label, { optional = false, min = -Infinity, above = -Infinity } = {}) {
  if (optional && (v === undefined || v === null || v === '')) return null;
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  if (!Number.isFinite(n) || n < min || n <= above) {
    const bound = above > -Infinity ? ` มากกว่า ${above}` : min > -Infinity ? ` ตั้งแต่ ${min}` : '';
    throw new Error(`${label} ต้องเป็นตัวเลข${bound} (ได้ ${JSON.stringify(v)})`);
  }
  return n;
}

export function monitor(data) {
  if (!data || !Array.isArray(data.periods) || data.periods.length === 0) throw new Error('JSON ต้องมี "periods" เป็นรายการอย่างน้อย 1 ช่วง');
  const load = num(data.load, 'ช่อง load (Use no more than X% เป็นเปอร์เซ็นต์)', { above: 0 });
  if (load > 100) throw new Error(`ช่อง load ต้องไม่เกิน 100 (ได้ ${load})`);
  const raw = data.rules ?? {};
  // The drawdown limit is the one rule the user must write down before subscribing; without it there is nothing to check against
  const rules = { maxDrawdownPct: num(raw.maxDrawdownPct, 'rules.maxDrawdownPct (ขาดทุนจากจุดสูงสุดที่รับได้ %)', { above: 0 }) };
  for (const k of RULE_KEYS.slice(1)) rules[k] = num(raw[k], `rules.${k}`, { optional: true, above: 0 });
  if ((rules.maxGapPts === null) !== (rules.gapPeriods === null)) throw new Error('rules.maxGapPts กับ rules.gapPeriods ต้องใส่คู่กัน');

  let netIdx = 1, peak = 1, maxDd = 0;
  const rows = data.periods.map((p, i) => {
    const label = `ช่วงที่ ${i + 1}${p?.period ? ` (${p.period})` : ''}`;
    const providerPct = num(p?.providerPct, `${label}: providerPct`);
    const start = num(p?.start, `${label}: start`, { above: 0 });
    const end = num(p?.end, `${label}: end`, { min: 0 });
    const fees = num(p?.fees, `${label}: fees`, { optional: true, min: 0 }) ?? 0;
    const providerDd = num(p?.providerDrawdownPct, `${label}: providerDrawdownPct`, { optional: true, min: 0 });
    // follower return before fees: the copy itself (MT5 help: lot = provider lot × follower/provider balance × X%)
    const followerPct = ((end - start) / start) * 100;
    // so the follower should earn the provider's return × X% (before currency, lot rounding and slippage)
    const expectedPct = providerPct * (load / 100);
    const gapPts = followerPct - expectedPct;
    // net index chains each period's net result: (end − fees) ÷ start
    netIdx *= (end - fees) / start;
    if (netIdx > peak) peak = netIdx;
    const ddPct = ((peak - netIdx) / peak) * 100;
    if (ddPct > maxDd) maxDd = ddPct;
    return { period: p?.period ?? String(i + 1), providerPct, expectedPct, followerPct, netPct: ((end - fees - start) / start) * 100, gapPts, fees, providerDd, ddPct };
  });

  const n = rows.length;
  const netReturnPct = (netIdx - 1) * 100;
  const stops = [];
  if (maxDd >= rules.maxDrawdownPct - EPS) stops.push(`ขาดทุนจากจุดสูงสุด ${maxDd.toFixed(2)}% ถึงเพดาน ${rules.maxDrawdownPct}% ที่ตั้งไว้`);
  const providerMax = Math.max(...rows.map((r) => r.providerDd ?? 0));
  if (rules.providerMaxDrawdownPct !== null && providerMax >= rules.providerMaxDrawdownPct - EPS) stops.push(`drawdown ของผู้ให้สัญญาณ ${providerMax}% เกินสถิติเดิมที่ยอมรับไว้ ${rules.providerMaxDrawdownPct}%`);
  let gapSum = null;
  if (rules.gapPeriods !== null && n >= rules.gapPeriods) {
    // sum of the last N period gaps (simple sum, not compounded, so it can be checked by hand)
    gapSum = rows.slice(-rules.gapPeriods).reduce((s, r) => s + r.gapPts, 0);
    if (gapSum <= -rules.maxGapPts + EPS) stops.push(`ผลบัญชีเราตามหลังที่ควรได้ ${(-gapSum).toFixed(2)} จุดใน ${rules.gapPeriods} ช่วงล่าสุด เกิน ${rules.maxGapPts} จุด`);
  }
  if (rules.reviewPeriods !== null && n >= rules.reviewPeriods && netReturnPct <= EPS) stops.push(`ครบ ${rules.reviewPeriods} ช่วงแล้วผลหลังหักค่าใช้จ่ายยัง ${netReturnPct.toFixed(2)}%`);
  return { load, rules, rows, n, netReturnPct, maxDrawdownPct: maxDd, currentDrawdownPct: rows[n - 1].ddPct, gapSum, stops, stop: stops.length > 0 };
}

const f = (x, d = 2) => (x === null || x === undefined ? '-' : `${x >= 0 ? '+' : ''}${x.toFixed(d)}`);

export function report(r) {
  const out = [
    `ใช้ deposit load ${r.load}% · ${r.n} ช่วง`,
    '',
    '| ช่วง | ผู้ให้สัญญาณ % | ควรได้ % | บัญชีเรา % | ห่าง (จุด) | หลังค่าใช้จ่าย % | ลงจากจุดสูงสุด % |',
    '|---|---|---|---|---|---|---|',
    ...r.rows.map((x) => `| ${x.period} | ${f(x.providerPct)} | ${f(x.expectedPct)} | ${f(x.followerPct)} | ${f(x.gapPts)} | ${f(x.netPct)} | ${x.ddPct.toFixed(2)} |`),
    '',
    `สะสมหลังค่าใช้จ่าย ${f(r.netReturnPct)}% · ลงจากจุดสูงสุดมากสุด ${r.maxDrawdownPct.toFixed(2)}% (ตอนนี้ ${r.currentDrawdownPct.toFixed(2)}%)${r.gapSum === null ? '' : ` · ห่างรวม ${r.rules.gapPeriods} ช่วงล่าสุด ${f(r.gapSum)} จุด`}`,
    '',
    r.stop ? `ผล: เลิกตาม — ชนกฎที่ตั้งไว้ล่วงหน้า\n${r.stops.map((s) => `- ${s}`).join('\n')}\nเลิก subscribe แล้วสถานะที่เปิดอยู่ไม่ปิดเอง ต้องปิดหรือตัดสินใจเอง` : 'ผล: ยังไม่ชนกฎเลิกข้อใด',
    '',
    'ข้อมูลทั่วไป ไม่ใช่คำแนะนำการลงทุน',
  ];
  return out.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { if (cond) ok++; else { bad++; console.error(`ล้ม: ${name}`); } };
  const near = (a, b, e = 1e-3) => a !== null && Math.abs(a - b) < e;

  // Hand-worked set (also written out in references/example-and-sources.md and scripts/monitor-example.json),
  // load 47% = X ≤ L ÷ (D × k) = 10 ÷ (14 × 1.5) = 47.6, rounded down:
  // W1 provider +4 · 1000 → 1018 → follower +1.8 · expected +1.88 · gap −0.08 · net idx 1.018 (peak)
  // W2 provider −2 · 1018 → 1003 → −1.4735 · expected −0.94 · gap −0.5335 · idx 1.003
  // W3 provider +2 · 1003 → 1010 · fees 30 → gross +0.6979 · net (1010 − 30 − 1003) / 1003 = −2.2931 · expected +0.94 · gap −0.2421 · idx 0.980
  // W4 provider −6 · 1010 → 960 → −4.9505 · expected −2.82 · gap −2.1305 · idx 0.980 × 960/1010 = 0.931485 · DD (1.018 − 0.931485)/1.018 = 8.4985%
  // gaps W1–W4 sum −2.9861 → not past −3
  const base = [
    { period: 'W1', providerPct: 4, start: 1000, end: 1018 },
    { period: 'W2', providerPct: -2, start: 1018, end: 1003 },
    { period: 'W3', providerPct: 2, start: 1003, end: 1010, fees: 30 },
    { period: 'W4', providerPct: -6, start: 1010, end: 960, providerDrawdownPct: 15 },
  ];
  const rules = { maxDrawdownPct: 10, providerMaxDrawdownPct: 21, maxGapPts: 3, gapPeriods: 4, reviewPeriods: 12 };
  let r = monitor({ load: 47, rules, periods: base });
  t('W2 follower', near(r.rows[1].followerPct, -1.4735));
  t('W3 net หลังค่าสมาชิก', near(r.rows[2].netPct, -2.2931) && near(r.rows[2].followerPct, 0.6979));
  t('W4 gap', near(r.rows[3].gapPts, -2.1305) && near(r.rows[3].expectedPct, -2.82));
  t('W4 DD', near(r.maxDrawdownPct, 8.4985) && near(r.currentDrawdownPct, 8.4985));
  t('ห่างรวม 4 ช่วง', near(r.gapSum, -2.9861));
  t('สะสม', near(r.netReturnPct, -6.8515));
  t('4 ช่วงยังไม่ชนกฎ', !r.stop);

  // W5 provider −1 · 960 → 948 → −1.25 · expected −0.47 · gap −0.78 · idx 0.919842 · DD 9.6422%
  // gaps W2–W5 = −0.5335 −0.2421 −2.1305 −0.78 = −3.6861 → past −3 → stop on the gap rule only
  const w5 = [...base, { period: 'W5', providerPct: -1, start: 960, end: 948 }];
  r = monitor({ load: 47, rules, periods: w5 });
  t('W5 DD', near(r.maxDrawdownPct, 9.6422));
  t('W5 ชนกฎห่าง', r.stop && r.stops.length === 1 && r.stops[0].includes('ตามหลัง') && near(r.gapSum, -3.6861));
  // the example file must carry the same load, rules and periods as the hand-worked set above
  const ex = JSON.parse(readFileSync(new URL('./monitor-example.json', import.meta.url), 'utf8'));
  t('monitor-example.json ตรงชุดคิดมือ', ex.load === 47 && JSON.stringify(ex.rules) === JSON.stringify(rules) && JSON.stringify(ex.periods) === JSON.stringify(w5));
  t('เพดาน DD 9 ชน', monitor({ load: 47, rules: { maxDrawdownPct: 9 }, periods: w5 }).stops[0]?.includes('จุดสูงสุด'));
  t('DD เท่าเพดานพอดีชน', monitor({ load: 100, rules: { maxDrawdownPct: 10 }, periods: [{ providerPct: 0, start: 100, end: 90 }] }).stop);
  t('ผู้ให้สัญญาณ DD เกิน', monitor({ load: 47, rules: { maxDrawdownPct: 50, providerMaxDrawdownPct: 15 }, periods: base }).stops[0]?.includes('ผู้ให้สัญญาณ'));
  t('ครบรอบทบทวนแล้วยังขาดทุน', monitor({ load: 47, rules: { maxDrawdownPct: 50, reviewPeriods: 5 }, periods: w5 }).stops[0]?.includes('ครบ 5'));
  t('ยังไม่ครบรอบทบทวน', !monitor({ load: 47, rules: { maxDrawdownPct: 50, reviewPeriods: 6 }, periods: w5 }).stop);
  // DD starts from the first period's start (index 1), so a first-week loss counts
  t('ขาดทุนสัปดาห์แรก', near(monitor({ load: 47, rules: { maxDrawdownPct: 50 }, periods: [{ providerPct: -2, start: 1000, end: 990 }] }).maxDrawdownPct, 1));

  const throwsWith = (fn, ...words) => { try { fn(); return false; } catch (e) { return words.every((x) => e.message.includes(x)); } };
  t('ไม่มีเพดาน DD', throwsWith(() => monitor({ load: 47, rules: {}, periods: base }), 'maxDrawdownPct'));
  t('load เกิน 100', throwsWith(() => monitor({ load: 150, rules, periods: base }), 'load'));
  t('start ศูนย์', throwsWith(() => monitor({ load: 47, rules, periods: [{ providerPct: 1, start: 0, end: 1 }] }), 'start', 'ช่วงที่ 1'));
  t('end ข้อความ', throwsWith(() => monitor({ load: 47, rules, periods: [{ period: 'W9', providerPct: 1, start: 1, end: 'abc' }] }), 'end', 'W9'));
  t('gap ไม่ครบคู่', throwsWith(() => monitor({ load: 47, rules: { maxDrawdownPct: 10, maxGapPts: 3 }, periods: base }), 'คู่'));
  t('periods ว่าง', throwsWith(() => monitor({ load: 47, rules, periods: [] }), 'periods'));

  const self = fileURLToPath(import.meta.url);
  const c = spawnSync(process.execPath, [self, join(tmpdir(), 'copy-monitor-no-such-file.json')], { encoding: 'utf8' });
  t('CLI ไม่พบไฟล์', c.status === 1 && c.stderr.includes('ไม่พบไฟล์') && !/\n\s+at /.test(c.stderr));

  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('ใช้: node copy-monitor.mjs <ไฟล์.json> [--json] | --self-test'); process.exit(2); }
  try {
    const r = monitor(JSON.parse(readFileSync(file, 'utf8')));
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
