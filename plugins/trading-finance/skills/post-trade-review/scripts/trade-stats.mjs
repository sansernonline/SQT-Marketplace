#!/usr/bin/env node
// trade-stats.mjs - win rate, expectancy in R, max drawdown and streaks from a trade journal (Node stdlib only)
// Usage: node trade-stats.mjs <file.json|file.csv> [--capital 100000] [--json]   |   node trade-stats.mjs --self-test
// JSON: [ {...} ] or { "capital": 100000, "trades": [ {...} ] } · CSV: the trade-journal.csv header
// Per trade: r_multiple (required; blank = still open, skipped) · optional account (live/paper), pnl_baht, violation
// Rows must be in exit order: drawdown and streaks follow file order.
import { readFileSync } from 'node:fs';

// Starting value, not measured: under 20 closed trades the win rate swings by roughly +-15 points
// (binomial standard error at 50% with N=10 is 16 points), so the numbers describe rule-following, not the strategy.
// 20 is the cutoff written in post-trade-review/SKILL.md.
const MIN_SAMPLE = 20;
// Starting value, not measured: a stop that holds loses about 1R plus costs; above 1.2R suggests slipped or moved stops
const MAX_AVG_LOSS_R = 1.2;
// Starting value, not measured: above 1 rule break in 10 trades the results describe the breaks, not the strategy
const MAX_VIOLATION_RATE = 0.1;

// Wilson score interval, same formula as copy-trade-check/scripts/signal-check.mjs (z = 1.96 -> 95%)
// en.wikipedia.org/wiki/Binomial_proportion_confidence_interval
export function wilson(k, n, z = 1.96) {
  const p = k / n;
  const centre = p + (z * z) / (2 * n);
  const half = (z / (2 * n)) * Math.sqrt(4 * n * p * (1 - p) + z * z);
  const d = 1 + (z * z) / n;
  return [(centre - half) / d, (centre + half) / d];
}

// RFC 4180-style: quoted fields may hold commas and doubled quotes
export function parseCsv(text) {
  const rows = [[]];
  let field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { rows.at(-1).push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      rows.at(-1).push(field); field = ''; rows.push([]);
    } else field += c;
  }
  rows.at(-1).push(field);
  const [header, ...body] = rows.filter((r) => r.some((f) => f.trim() !== ''));
  const keys = header.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

const isBlank = (v) => v === undefined || v === null || v === '';
// violation: blank and no / n / none / false / 0 / - / ไม่ / ไม่มี mean no violation; any other text (e.g. moved-stop) is one
const NO_VIOLATION = ['no', 'n', 'none', 'false', '0', '-', 'ไม่', 'ไม่มี'];
const isViolation = (v) => !isBlank(v) && !NO_VIOLATION.includes(String(v).trim().toLowerCase());
const toNum = (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v);

// Throws a Thai message naming the bad row and field; returns { trades, open } (open = rows skipped as unclosed).
export function validate(rawTrades) {
  if (!Array.isArray(rawTrades) || rawTrades.length === 0) throw new Error('ต้องมีรายการเทรดอย่างน้อย 1 รายการ');
  const trades = [];
  let open = 0;
  rawTrades.forEach((t, i) => {
    if (!t || typeof t !== 'object') throw new Error(`รายการที่ ${i + 1} ต้องเป็นอ็อบเจกต์`);
    if (isBlank(t.r_multiple)) { open++; return; }
    const r = toNum(t.r_multiple);
    if (typeof r !== 'number' || !Number.isFinite(r)) throw new Error(`ช่อง r_multiple ของรายการที่ ${i + 1} ต้องเป็นตัวเลข (ได้ ${JSON.stringify(t.r_multiple)})`);
    const pnl = isBlank(t.pnl_baht) ? null : toNum(t.pnl_baht);
    if (pnl !== null && (typeof pnl !== 'number' || !Number.isFinite(pnl))) throw new Error(`ช่อง pnl_baht ของรายการที่ ${i + 1} ต้องเป็นตัวเลขหรือเว้นว่าง (ได้ ${JSON.stringify(t.pnl_baht)})`);
    trades.push({ r, pnl, account: isBlank(t.account) ? 'all' : String(t.account).toLowerCase(), violation: isViolation(t.violation) });
  });
  if (trades.length === 0) throw new Error('ไม่มีรายการที่ปิดแล้ว (ช่อง r_multiple ว่างทุกแถว)');
  return { trades, open };
}

// Largest fall from a running peak of the cumulative series; the start (0) counts as a peak.
function maxDrawdown(steps, start = 0) {
  let equity = start, peak = start, dd = 0, ddPeak = start;
  for (const s of steps) {
    equity += s;
    if (equity > peak) peak = equity;
    if (peak - equity > dd) { dd = peak - equity; ddPeak = peak; }
  }
  return { dd, peak: ddPeak };
}

const longestRun = (flags) => flags.reduce((acc, f) => { const run = f ? acc.run + 1 : 0; return { run, best: Math.max(acc.best, run) }; }, { run: 0, best: 0 }).best;
const sum = (xs) => xs.reduce((s, x) => s + x, 0);

export function statsFor(trades, capital) {
  const n = trades.length;
  const wins = trades.filter((t) => t.r > 0);
  const losses = trades.filter((t) => t.r <= 0);
  const winRate = wins.length / n;
  const avgWin = wins.length ? sum(wins.map((t) => t.r)) / wins.length : 0;
  const avgLoss = losses.length ? -sum(losses.map((t) => t.r)) / losses.length : 0;
  const payoff = avgLoss > 0 ? avgWin / avgLoss : null;
  const hasPnl = trades.every((t) => t.pnl !== null);
  const grossLoss = hasPnl ? -sum(trades.filter((t) => t.pnl < 0).map((t) => t.pnl)) : 0;
  const ddR = maxDrawdown(trades.map((t) => t.r));
  const ddBaht = hasPnl && capital ? maxDrawdown(trades.map((t) => t.pnl), capital) : null;
  return {
    n, wins: wins.length, losses: losses.length, winRate, winRateCI: wilson(wins.length, n), avgWin, avgLoss, payoff,
    expectancy: winRate * avgWin - (1 - winRate) * avgLoss,
    profitFactor: hasPnl && grossLoss > 0 ? sum(trades.filter((t) => t.pnl > 0).map((t) => t.pnl)) / grossLoss : null,
    breakevenWinRate: payoff === null ? null : 1 / (1 + payoff),
    maxDrawdownR: ddR.dd,
    maxDrawdownPct: ddBaht ? (ddBaht.dd / ddBaht.peak) * 100 : null,
    maxWinStreak: longestRun(trades.map((t) => t.r > 0)),
    maxLossStreak: longestRun(trades.map((t) => t.r <= 0)),
    violationRate: trades.filter((t) => t.violation).length / n,
    smallSample: n < MIN_SAMPLE,
  };
}

export function analyze(rawTrades, capital) {
  const { trades, open } = validate(rawTrades);
  if (capital !== undefined && capital !== null && !(typeof capital === 'number' && Number.isFinite(capital) && capital > 0)) throw new Error(`ช่อง capital ต้องเป็นตัวเลขมากกว่า 0 (ได้ ${JSON.stringify(capital)})`);
  const groups = [...new Set(trades.map((t) => t.account))];
  return { open, groups: Object.fromEntries(groups.map((g) => [g, statsFor(trades.filter((t) => t.account === g), capital)])) };
}

const f = (n, d = 2) => n.toFixed(d);
const pct = (n) => `${Math.round(n * 1000) / 10}%`;
const rr = (n) => `${n >= 0 ? '+' : ''}${f(n)}R`;

export function report(r) {
  const out = [];
  for (const [name, s] of Object.entries(r.groups)) {
    out.push(
      `### ${name === 'all' ? 'ทุกรายการ' : name} · ${s.n} รายการ${s.smallSample ? ` · ตัวอย่างน้อย (น้อยกว่า ${MIN_SAMPLE})` : ''}`,
      '',
      '| ตัวเลข | ค่า |',
      '|---|---|',
      `| อัตราชนะ | ${pct(s.winRate)} (${s.wins}/${s.n}) · ช่วง 95% ${pct(s.winRateCI[0])}–${pct(s.winRateCI[1])} |`,
      `| กำไรเฉลี่ย | ${f(s.avgWin)}R |`,
      `| ขาดทุนเฉลี่ย | ${f(s.avgLoss)}R${f(s.avgLoss) > MAX_AVG_LOSS_R ? ` · สูงกว่า ${MAX_AVG_LOSS_R}R: stop อาจหลุดหรือถูกขยับ` : ''} |`,
      `| อัตราส่วนกำไรต่อขาดทุน | ${s.payoff === null ? '-' : f(s.payoff)} |`,
      `| Expectancy | ${rr(s.expectancy)} ต่อรายการ |`,
      `| อัตราชนะที่เสมอทุน | ${s.breakevenWinRate === null ? '-' : pct(s.breakevenWinRate)} |`,
      `| Profit factor | ${s.profitFactor === null ? '-' : f(s.profitFactor)} |`,
      `| Max drawdown | ${f(s.maxDrawdownR)}R${s.maxDrawdownPct === null ? '' : ` (${f(s.maxDrawdownPct, 1)}% ของทุน)`} |`,
      `| ชนะติดกันยาวสุด | ${s.maxWinStreak} |`,
      `| แพ้ติดกันยาวสุด | ${s.maxLossStreak} |`,
      `| ฝ่าฝืนกฎ | ${pct(s.violationRate)}${s.violationRate > MAX_VIOLATION_RATE ? ` · เกิน ${MAX_VIOLATION_RATE * 100}%: ตัวเลขนี้สะท้อนการผิดกฎ ไม่ใช่กลยุทธ์` : ''} |`,
      '',
    );
    if (s.smallSample) out.push(`ตัวอย่างน้อย: ใช้ดูการทำตามกฎได้ ยังตัดสินว่ากลยุทธ์ดีหรือไม่ไม่ได้`, '');
  }
  if (r.open > 0) out.push(`ข้าม ${r.open} รายการที่ยังไม่ปิด (r_multiple ว่าง)`, '');
  out.push('ข้อมูลทั่วไป ไม่ใช่คำแนะนำการลงทุน');
  return out.join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b) => Math.abs(a - b) < 0.005;
  const throwsWith = (fn, word) => { try { fn(); return false; } catch (e) { return e.message.includes(word); } };
  // SKILL.md worked example: 10 trades -> 40% · 1.75R · 1.20R · -0.02R · drawdown 3.2R (3.1%)
  const Rs = [2, -1, -1, 3, -1.2, 0.5, -1, 1.5, -1, -2];
  const trades = Rs.map((r) => ({ r_multiple: r, pnl_baht: r * 1000, account: 'live' }));
  const s = analyze(trades, 100000).groups.live;
  t('อัตราชนะ 40%', near(s.winRate, 0.4) && s.wins === 4 && s.losses === 6);
  // Wilson 4/10 by hand: centre (0.4 + 0.19208) / 1.38416 = 0.4278, half 0.196 x sqrt(9.6 + 3.8416) / 1.38416 = 0.2596 -> 16.8%-68.7%
  t('ช่วง Wilson 4/10', near(s.winRateCI[0], 0.1682) && near(s.winRateCI[1], 0.6873));
  t('กำไรเฉลี่ย 1.75R', near(s.avgWin, 1.75));
  t('ขาดทุนเฉลี่ย 1.20R', near(s.avgLoss, 1.2));
  t('payoff 1.46 / เสมอทุน 41%', near(s.payoff, 1.458) && near(s.breakevenWinRate, 0.4068));
  t('expectancy -0.02R', near(s.expectancy, -0.02));
  t('drawdown 3.2R', near(s.maxDrawdownR, 3.2));
  t('drawdown 3.1% ของทุน', near(s.maxDrawdownPct, (3200 / 103000) * 100));
  t('profit factor 0.97', near(s.profitFactor, 7000 / 7200));
  t('แพ้ติดกัน 2 ชนะติดกัน 1', s.maxLossStreak === 2 && s.maxWinStreak === 1);
  t('ตัวอย่างน้อย N=10', s.smallSample === true);
  t('ตัวอย่างพอ N=20', analyze([...trades, ...trades], 100000).groups.live.smallSample === false);
  // streaks: 3 wins then 4 losses
  const run = analyze([1, 1, 1, -1, -1, -1, -1].map((r) => ({ r_multiple: r }))).groups.all;
  t('streak 3 ชนะ 4 แพ้', run.maxWinStreak === 3 && run.maxLossStreak === 4);
  // all winners: no losses -> payoff null, drawdown 0
  const win = analyze([{ r_multiple: 1 }, { r_multiple: 2 }]).groups.all;
  t('ชนะหมด ไม่มี payoff', win.payoff === null && win.maxDrawdownR === 0 && near(win.expectancy, 1.5));
  // live and paper split; open row skipped; violation counted
  const mix = analyze([{ account: 'live', r_multiple: '1.5', violation: 'moved-stop' }, { account: 'paper', r_multiple: '-1' }, { account: 'live', r_multiple: '' }]);
  t('แยก live/paper', Object.keys(mix.groups).join() === 'live,paper' && mix.open === 1 && near(mix.groups.live.violationRate, 1));
  // edge/ts-viol.csv: "no" "false" "0" "ไม่" and blank are not violations (was 75%)
  const viol = analyze(parseCsv(['account,r_multiple,pnl_baht,violation', 'live,2,2000,no', 'live,-1,-1000,False', 'live,1,1000,', 'live,-1,-1000,0', 'live,1,1,ไม่', 'live,1,1,moved-stop'].join('\n'))).groups.live;
  t('violation no/false/0/ไม่/ว่าง ไม่นับ', near(viol.violationRate, 1 / 6));
  // CSV with a quoted comma
  const csv = parseCsv('id,account,reason,r_multiple\n1,live,"broke high, volume 2x",1.55\n2,paper,x,-1\n');
  t('CSV เครื่องหมายคำพูด', csv.length === 2 && csv[0].reason === 'broke high, volume 2x' && csv[0].r_multiple === '1.55');
  t('CSV ใช้ได้กับ analyze', near(analyze(csv).groups.live.expectancy, 1.55));
  // input checks name the row and field
  t('r_multiple เป็นข้อความ', throwsWith(() => analyze([{ r_multiple: 'abc' }]), 'r_multiple'));
  t('pnl_baht ผิด', throwsWith(() => analyze([{ r_multiple: 1, pnl_baht: 'x' }]), 'pnl_baht'));
  t('ไม่มีรายการ', throwsWith(() => analyze([]), 'อย่างน้อย 1'));
  t('capital ผิด', throwsWith(() => analyze([{ r_multiple: 1 }], -5), 'capital'));
  t('ปิดแล้ว 0 รายการ', throwsWith(() => analyze([{ r_multiple: '' }]), 'ไม่มีรายการที่ปิดแล้ว'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const capIdx = args.indexOf('--capital');
  const file = args.find((a, i) => !a.startsWith('--') && (capIdx < 0 || i !== capIdx + 1));
  if (!file) { console.error('ใช้: node trade-stats.mjs <ไฟล์.json|ไฟล์.csv> [--capital 100000] [--json] | --self-test'); process.exit(2); }
  try {
    const text = readFileSync(file, 'utf8');
    const data = file.toLowerCase().endsWith('.csv') ? parseCsv(text) : JSON.parse(text);
    const trades = Array.isArray(data) ? data : data?.trades;
    const capital = capIdx >= 0 ? Number(args[capIdx + 1]) : data?.capital;
    const r = analyze(trades, capital);
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
