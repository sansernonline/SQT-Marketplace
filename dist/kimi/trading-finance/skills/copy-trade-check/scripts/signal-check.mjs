#!/usr/bin/env node
// signal-check.mjs - check a copy-trade signal provider's deal history before following it (Node stdlib only)
// Usage: node signal-check.mjs <deals.csv|deals.json> [--balance 10000] [--json]   |   node signal-check.mjs --self-test
// Columns (MQL5 signal history table): time,symbol,type,direction,volume,price,swap,profit [,commission]
// With direction in/out = MT5 deals, opens and closes matched FIFO per symbol and side (an out deal of a buy position has type sell) · without direction = one row per closed trade
// Lines starting with # are comments. Rows whose type is not buy/sell (balance, credit) are skipped and counted.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Flag thresholds: starting values, not yet measured · no source gives cut-offs (research 2026-10-27)
export const LIMITS = { minTrades: 30, minT: 2, rLot: 1.5, minLotSamples: 5, grid: 5, worstLoss: 5, holdRatio: 2, payoff: 0.5 };
const REQUIRED = ['time', 'symbol', 'type', 'volume', 'profit'];

const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
// sample standard deviation, divides by n − 1 (Student's t-test, en.wikipedia.org/wiki/Student%27s_t-test)
const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const median = (a) => { const s = [...a].sort((x, y) => x - y); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };

// Wilson score interval: [p̂ + z²/2n ± z/2n·√(4n·p̂(1−p̂) + z²)] / (1 + z²/n), z = 1.96 (en.wikipedia.org/wiki/Binomial_proportion_confidence_interval)
export function wilson(k, n, z = 1.96) {
  const p = k / n;
  const centre = p + (z * z) / (2 * n);
  const half = (z / (2 * n)) * Math.sqrt(4 * n * p * (1 - p) + z * z);
  const d = 1 + (z * z) / n;
  return [(centre - half) / d, (centre + half) / d];
}

function toNumber(v, label, field, { optional = false, positive = false } = {}) {
  if (optional && (v === undefined || v === '')) return 0;
  let s = typeof v === 'number' ? v : String(v ?? '').replace(/\s/g, '');
  if (typeof s === 'string' && /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
  const n = typeof s === 'number' ? s : s === '' ? NaN : Number(s);
  if (!Number.isFinite(n) || (positive && n <= 0)) throw new Error(`${label}: ช่อง ${field} ต้องเป็นตัวเลข${positive ? 'มากกว่า 0' : ''} ใช้จุดเป็นทศนิยม (ได้ ${JSON.stringify(v)})`);
  return n;
}

function toTime(v, label) {
  const t = Date.parse(String(v ?? '').trim().replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3').replace(' ', 'T'));
  if (!Number.isFinite(t)) throw new Error(`${label}: ช่อง time อ่านเวลาไม่ได้ (ได้ ${JSON.stringify(v)}) · ใช้รูปแบบ 2024.01.31 13:45 หรือ 2024-01-31T13:45`);
  return t;
}

function splitLine(line, sep) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') quoted = false; else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

// CSV (comma, semicolon or tab, picked from the header line) → rows with lower-case keys and a line label
export function parseCsv(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).map((t, i) => ({ t, no: i + 1 })).filter((l) => l.t.trim() && !l.t.trim().startsWith('#'));
  if (lines.length < 2) throw new Error('ไฟล์ต้องมีบรรทัดหัวตารางและข้อมูลอย่างน้อย 1 แถว');
  const head = lines[0].t;
  const sep = head.includes('\t') ? '\t' : head.includes(';') && !head.includes(',') ? ';' : ',';
  const keys = splitLine(head, sep).map((k) => k.toLowerCase());
  return lines.slice(1).map((l) => {
    const cells = splitLine(l.t, sep);
    return Object.fromEntries([...keys.map((k, i) => [k, cells[i]]), ['_label', `บรรทัด ${l.no}`]]);
  });
}

export function parseJson(data) {
  const list = Array.isArray(data) ? data : data?.deals;
  if (!Array.isArray(list)) throw new Error('JSON ต้องเป็นรายการดีล [ {...} ] หรือ { "deals": [ ... ] }');
  return list.map((r, i) => ({ ...Object.fromEntries(Object.entries(r ?? {}).map(([k, v]) => [k.toLowerCase(), v])), _label: `รายการที่ ${i + 1}` }));
}

// rows → closed trades { open, close, volume, profit } + opens (for R_lot) + max open positions per symbol and side (deals mode only)
export function toTrades(rows) {
  if (!rows.length) throw new Error('ไม่พบแถวดีลในไฟล์');
  for (const k of REQUIRED) if (!rows.some((r) => r[k] !== undefined && r[k] !== '')) throw new Error(`ไม่มีช่อง ${k} · หัวตารางต้องมี ${REQUIRED.join(',')} (direction,swap,commission ไม่บังคับ)`);
  const dealsMode = rows.some((r) => r.direction !== undefined && r.direction !== '');
  let skipped = 0;
  const deals = [];
  for (const r of rows) {
    const type = String(r.type ?? '').trim().toLowerCase();
    if (type !== 'buy' && type !== 'sell') { skipped++; continue; }
    const d = {
      label: r._label,
      time: toTime(r.time, r._label),
      symbol: String(r.symbol ?? '').trim(),
      type,
      volume: toNumber(r.volume, r._label, 'volume', { positive: true }),
      // net P/L of a deal = profit + swap + commission (MT5 history columns)
      net: toNumber(r.profit, r._label, 'profit') + toNumber(r.swap, r._label, 'swap', { optional: true }) + toNumber(r.commission, r._label, 'commission', { optional: true }),
    };
    if (!d.symbol) throw new Error(`${r._label}: ช่อง symbol ว่าง`);
    if (dealsMode) {
      d.dir = String(r.direction ?? '').trim().toLowerCase();
      if (d.dir === 'out by') d.dir = 'out';
      if (d.dir !== 'in' && d.dir !== 'out') throw new Error(`${r._label}: ช่อง direction ต้องเป็น in หรือ out (ได้ ${JSON.stringify(r.direction)}) · ดีล in/out ที่กลับทิศยังไม่รองรับ`);
    }
    deals.push(d);
  }
  deals.sort((a, b) => a.time - b.time);
  const trades = [];
  const opens = [];
  const maxOpen = {};
  let orphanOuts = 0;
  if (!dealsMode) {
    for (const d of deals) trades.push({ open: null, close: d.time, volume: d.volume, profit: d.net });
  } else {
    const queue = {};
    for (const d of deals) {
      // position side: an in deal opens the side of its type, an out deal closes the opposite side
      const side = d.dir === 'in' ? d.type : d.type === 'buy' ? 'sell' : 'buy';
      const key = `${d.symbol}|${side}`;
      const q = (queue[key] ??= []);
      if (d.dir === 'in') {
        q.push({ t: d.time, vol: d.volume });
        opens.push({ t: d.time, vol: d.volume });
        maxOpen[key] = Math.max(maxOpen[key] ?? 0, q.length);
        continue;
      }
      if (!q.length) orphanOuts++;
      const open = q.length ? q[0].t : null;
      let left = d.volume;
      while (left > 1e-9 && q.length) {
        const take = Math.min(left, q[0].vol);
        q[0].vol -= take;
        left -= take;
        if (q[0].vol <= 1e-9) q.shift();
      }
      trades.push({ open, close: d.time, volume: d.volume, profit: d.net });
    }
  }
  if (!trades.length) throw new Error('ไม่มีไม้ที่ปิดแล้วให้คำนวณ (แถว buy/sell ที่เป็นดีล out หรือไม้ที่ปิดแล้ว)');
  return { trades, opens: dealsMode ? opens : null, maxOpen: dealsMode ? maxOpen : null, skipped, orphanOuts, dealsMode };
}

// R_lot = mean lot of the next position opened after a losing close ÷ after a winning close (martingale check, research copytrade-stats ข้อ 2)
function lotRatio(trades, opens) {
  const after = { win: [], loss: [] };
  let j = 0;
  trades.forEach((tr, i) => {
    let next;
    if (opens) {
      while (j < opens.length && opens[j].t <= tr.close) j++;
      next = opens[j]?.vol;
    } else next = trades[i + 1]?.volume;
    if (tr.profit !== 0 && next !== undefined) after[tr.profit > 0 ? 'win' : 'loss'].push(next);
  });
  const enough = after.win.length >= LIMITS.minLotSamples && after.loss.length >= LIMITS.minLotSamples;
  return { ratio: enough ? mean(after.loss) / mean(after.win) : null, afterLoss: after.loss.length, afterWin: after.win.length };
}

export function analyse(parsed, balance = null) {
  const { trades, opens, maxOpen } = parsed;
  const p = trades.map((t) => t.profit);
  const n = p.length;
  const wins = p.filter((x) => x > 0);
  const losses = p.filter((x) => x < 0);
  const grossWin = wins.reduce((s, x) => s + x, 0);
  const grossLoss = -losses.reduce((s, x) => s + x, 0);
  const avgWin = wins.length ? grossWin / wins.length : null;
  const avgLoss = losses.length ? grossLoss / losses.length : null;
  const m = mean(p);
  const s = n > 1 ? sd(p) : null;
  // t = x̄ / (s / √n), H0 mean profit per trade = 0 (Student's t-test)
  const t = s ? m / (s / Math.sqrt(n)) : null;
  // max drawdown = largest (running peak − cumulative closed P/L), peak starts at 0 (MQL5 docs, environment_state/statistics)
  let cum = 0, peak = 0, dd = 0, ddPeak = 0;
  for (const x of p) {
    cum += x;
    if (cum > peak) peak = cum;
    if (peak - cum > dd) { dd = peak - cum; ddPeak = peak; }
  }
  const holds = (sel) => trades.filter((tr) => tr.open !== null && sel(tr.profit)).map((tr) => tr.close - tr.open);
  const holdWin = holds((x) => x > 0);
  const holdLoss = holds((x) => x < 0);
  const gridEntry = maxOpen && Object.entries(maxOpen).sort((a, b) => b[1] - a[1])[0];
  const lots = trades.map((tr) => tr.volume);
  return {
    trades: n,
    wins: wins.length,
    losses: losses.length,
    winRate: wins.length / n,
    winRate95: wilson(wins.length, n),
    meanProfit: m,
    tStat: t,
    // profit factor = gross profit ÷ gross loss (MQL5 docs, environment_state/statistics)
    profitFactor: grossLoss ? grossWin / grossLoss : grossWin ? Infinity : null,
    // payoff ratio = average win ÷ |average loss| (research copytrade-stats ข้อ 2)
    payoff: avgWin !== null && avgLoss ? avgWin / avgLoss : null,
    netProfit: cum,
    maxDrawdown: dd,
    // drawdown % = drawdown ÷ (starting balance + peak before it), computed here, needs --balance
    maxDrawdownPct: balance ? (dd / (balance + ddPeak)) * 100 : null,
    // recovery factor = net profit ÷ max drawdown (MQL5 docs, environment_state/statistics)
    recoveryFactor: dd ? cum / dd : null,
    // worst single loss ÷ average loss (research copytrade-stats ข้อ 2)
    worstLossRatio: avgLoss ? -Math.min(...losses) / avgLoss : null,
    lot: lotRatio(trades, opens),
    lotMaxToMedian: Math.max(...lots) / median(lots),
    maxOpen: gridEntry ? { symbol: gridEntry[0].replace('|', ' '), count: gridEntry[1] } : null,
    // H = average hold of losing trades ÷ winning trades (research copytrade-stats ข้อ 2)
    holdRatio: holdWin.length && holdLoss.length && mean(holdWin) > 0 ? mean(holdLoss) / mean(holdWin) : null,
    skipped: parsed.skipped,
    orphanOuts: parsed.orphanOuts,
    dealsMode: parsed.dealsMode,
  };
}

const f2 = (x) => (x === null ? '-' : x === Infinity ? 'ไม่มีไม้ขาดทุน' : x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const START = 'ค่าตั้งต้น ยังไม่ได้วัด';

// hard = fails a hard rule in copy-trade-check (drop before scoring) · warn = needs a closer look
export function flags(r) {
  const out = [];
  if (r.lot.ratio !== null && r.lot.ratio >= LIMITS.rLot) out.push({ hard: true, text: `สงสัย martingale: lot หลังไม้แพ้ใหญ่กว่าหลังไม้ชนะ ${f2(r.lot.ratio)} เท่า (เกณฑ์ ${LIMITS.rLot} · ${START})` });
  if (r.maxOpen && r.maxOpen.count >= LIMITS.grid) out.push({ hard: true, text: `สงสัย grid: เปิดซ้อนกันสูงสุด ${r.maxOpen.count} ไม้ใน ${r.maxOpen.symbol} (เกณฑ์ ${LIMITS.grid} · ${START})` });
  if (r.profitFactor !== null && r.profitFactor < 1) out.push({ hard: false, text: `ขาดทุนรวม: profit factor ${f2(r.profitFactor)} ต่ำกว่า 1` });
  if (r.payoff !== null && r.payoff < LIMITS.payoff) out.push({ hard: false, text: `กำไรเล็กขาดทุนใหญ่: ไม้กำไรเฉลี่ยเป็น ${f2(r.payoff)} เท่าของไม้ขาดทุนเฉลี่ย (เกณฑ์ ${LIMITS.payoff} · ${START}) · win rate ต้องเกิน ${pct(1 / (1 + r.payoff))} จึงจะเท่าทุน` });
  if (r.worstLossRatio !== null && r.worstLossRatio >= LIMITS.worstLoss) out.push({ hard: false, text: `ขาดทุนก้อนใหญ่ผิดปกติ: ไม้ที่แย่สุดเป็น ${f2(r.worstLossRatio)} เท่าของขาดทุนเฉลี่ย (เกณฑ์ ${LIMITS.worstLoss} · ${START})` });
  if (r.holdRatio !== null && r.holdRatio >= LIMITS.holdRatio) out.push({ hard: false, text: `ไม่ค่อยตัดขาดทุน: ถือไม้ขาดทุนนานกว่าไม้กำไร ${f2(r.holdRatio)} เท่า (เกณฑ์ ${LIMITS.holdRatio} · ${START})` });
  return out;
}

export function enoughData(r) {
  if (r.trades < LIMITS.minTrades) return { ok: false, text: `ข้อมูลไม่พอสรุป: มี ${r.trades} ไม้ น้อยกว่า ${LIMITS.minTrades} (${START})` };
  if (r.tStat === null || r.tStat < LIMITS.minT) return { ok: false, text: `ยังแยกฝีมือจากโชคไม่ได้: t = ${f2(r.tStat)} ต่ำกว่า ${LIMITS.minT} (ถ้าเลือกจากผู้ให้สัญญาณหลายคน ใช้ 3)` };
  return { ok: true, text: `ข้อมูลพอเห็นภาพ: ${r.trades} ไม้ · t = ${f2(r.tStat)} · ผลในอดีตไม่รับประกันอนาคต` };
}

export function report(r) {
  const na = r.dealsMode ? 'คำนวณไม่ได้' : 'คำนวณไม่ได้ (ไม่มีช่อง direction)';
  const fl = flags(r);
  const data = enoughData(r);
  const rows = [
    ['จำนวนไม้ที่ปิดแล้ว', `${r.trades} (กำไร ${r.wins} · ขาดทุน ${r.losses})`, ''],
    ['win rate', `${pct(r.winRate)} (ช่วง 95%: ${pct(r.winRate95[0])}–${pct(r.winRate95[1])})`, 'ช่วงกว้าง = ข้อมูลยังน้อย'],
    ['กำไรเฉลี่ยต่อไม้', `${f2(r.meanProfit)} (t = ${f2(r.tStat)})`, `t ต่ำกว่า ${LIMITS.minT} = ยังแยกจากโชคไม่ได้`],
    ['profit factor', f2(r.profitFactor), 'กำไรรวม ÷ ขาดทุนรวม'],
    ['payoff ratio', f2(r.payoff), 'กำไรเฉลี่ย ÷ ขาดทุนเฉลี่ย'],
    ['max drawdown', `${f2(r.maxDrawdown)}${r.maxDrawdownPct !== null ? ` (${r.maxDrawdownPct.toFixed(1)}%)` : ''}`, 'จากกำไรสะสมของไม้ที่ปิด'],
    ['recovery factor', f2(r.recoveryFactor), 'กำไรสุทธิ ÷ max drawdown'],
    ['ขาดทุนแย่สุด ÷ ขาดทุนเฉลี่ย', f2(r.worstLossRatio), ''],
    ['R_lot', r.lot.ratio === null ? `ไม่พอคำนวณ (หลังแพ้ ${r.lot.afterLoss} · หลังชนะ ${r.lot.afterWin} ต้องมีอย่างละ ${LIMITS.minLotSamples})` : f2(r.lot.ratio), 'lot หลังไม้แพ้ ÷ หลังไม้ชนะ · จับ martingale'],
    ['lot สูงสุด ÷ lot มัธยฐาน', f2(r.lotMaxToMedian), 'ข้อมูลประกอบ ใหญ่มาก = เพิ่ม lot เป็นช่วง ๆ'],
    ['เปิดซ้อนสูงสุดต่อ symbol และทิศ', r.maxOpen ? `${r.maxOpen.count} (${r.maxOpen.symbol})` : na, 'จับ grid'],
    ['เวลาถือไม้ขาดทุน ÷ ไม้กำไร', r.holdRatio === null ? na : f2(r.holdRatio), ''],
  ];
  const hard = fl.filter((x) => x.hard);
  const verdict = [
    hard.length ? `ตกกฎเหล็ก ${hard.length} ข้อ ตัดทิ้งก่อนให้คะแนน` : fl.length ? `ธงเตือน ${fl.length} ข้อ` : 'ไม่พบธงเตือนจากประวัติที่ปิดแล้ว',
    data.text,
    'ผู้ใช้ตัดสิน',
  ].join(' · ');
  return [
    `ตรวจประวัติผู้ให้สัญญาณ · รูปแบบ ${r.dealsMode ? 'ดีล in/out' : '1 แถว = 1 ไม้ที่ปิดแล้ว'}${r.skipped ? ` · ข้าม ${r.skipped} แถวที่ไม่ใช่ buy/sell` : ''}${r.orphanOuts ? ` · ดีล out ที่ไม่มี in ก่อนหน้า ${r.orphanOuts} แถว (คัดประวัติมาไม่ครบ)` : ''}`,
    '',
    '| ตัวเลข | ค่า | อ่านอย่างไร |',
    '|---|---|---|',
    ...rows.map((x) => `| ${x.join(' | ')} |`),
    '',
    ...(fl.length ? ['ธงเตือน:', ...fl.map((x) => `- ${x.hard ? '[กฎเหล็ก] ' : ''}${x.text}`), ''] : []),
    'หมายเหตุ: คิดจากไม้ที่ปิดแล้ว ขาดทุนที่ยังค้างอยู่ (floating) ไม่อยู่ในตัวเลขนี้ · ดู equity drawdown บนหน้าสัญญาณประกอบ',
    '',
    `**ผล:** ${verdict}`,
  ].join('\n');
}

export function check(rows, balance = null) {
  const r = analyse(toTrades(rows), balance);
  return { ...r, flags: flags(r), enoughData: enoughData(r) };
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b, e = 0.001) => a !== null && Math.abs(a - b) < e;
  const H = 3600e3;
  const closed = (profits, vol = 0.1) => profits.map((p, i) => ({ time: new Date(Date.UTC(2024, 0, 1) + i * H).toISOString(), symbol: 'EURUSD', type: 'buy', volume: Array.isArray(vol) ? vol[i] : vol, profit: p }));
  // side = side of the position · an out deal of a buy position has type sell, as in MT5
  const deal = (h, dir, volume, profit = 0, symbol = 'EURUSD', side = 'buy') => ({ time: new Date(Date.UTC(2024, 0, 1) + h * H).toISOString(), symbol, type: dir === 'in' ? side : side === 'buy' ? 'sell' : 'buy', direction: dir, volume, profit });

  // Wilson 60/100 by hand: (0.619208 ± 0.097922) / 1.038416 = 0.50199 – 0.69060
  const w = wilson(60, 100);
  t('Wilson 60/100', near(w[0], 0.50199, 1e-4) && near(w[1], 0.69060, 1e-4));

  // little data, by hand: profits 10 −5 20 −10 15 −5 → mean 4.1667 · sd √(770.833/5) = 12.4164 · t = 0.8220 · PF 45/20 = 2.25 · payoff 15/6.667 = 2.25
  // cumulative 10 5 25 15 30 25 → max DD 10 · recovery 25/10 = 2.5 · worst loss 10 ÷ avg loss 6.667 = 1.5
  let r = check(closed([10, -5, 20, -10, 15, -5]));
  t('น้อย n', r.trades === 6 && r.wins === 3 && near(r.winRate, 0.5));
  t('น้อย mean', near(r.meanProfit, 4.16667));
  t('น้อย t', near(r.tStat, 0.8220));
  t('น้อย PF', near(r.profitFactor, 2.25));
  t('น้อย payoff', near(r.payoff, 2.25));
  t('น้อย DD', near(r.maxDrawdown, 10) && near(r.recoveryFactor, 2.5));
  t('น้อย worst/avg', near(r.worstLossRatio, 1.5));
  t('น้อย สรุปไม่ได้', !r.enoughData.ok && r.enoughData.text.includes('ไม่พอสรุป'));
  t('น้อย R_lot ไม่พอ', r.lot.ratio === null);

  // normal: (+10, −5) × 20 → mean 2.5 · sd 7.5 × √(40/39) = 7.5955 · t = 2.5 × √40 / 7.5955 = 2.0817 · PF 2 · DD 5 · R_lot 1 · no flags
  r = check(closed(Array.from({ length: 40 }, (_, i) => (i % 2 ? -5 : 10))));
  t('ปกติ t', near(r.tStat, 2.0817));
  t('ปกติ PF payoff DD', near(r.profitFactor, 2) && near(r.payoff, 2) && near(r.maxDrawdown, 5));
  t('ปกติ R_lot 1', near(r.lot.ratio, 1) && r.lot.afterWin === 20 && r.lot.afterLoss === 19);
  t('ปกติ ไม่มีธง พอสรุป', r.flags.length === 0 && r.enoughData.ok);

  // martingale deals: 6 rounds of open 0.1 → −10, open 0.2 → −20, open 0.4 → +40
  // after a loss the next lot is 0.2 or 0.4 (mean 0.3, 12 samples) · after a win 0.1 (5 samples) → R_lot = 3
  const mart = [];
  let h = 0;
  for (let c = 0; c < 6; c++) for (const [v, p] of [[0.1, -10], [0.2, -20], [0.4, 40]]) { mart.push(deal(h++, 'in', v), deal(h++, 'out', v, p)); }
  r = check(mart);
  t('martingale R_lot 3', near(r.lot.ratio, 3) && r.lot.afterLoss === 12 && r.lot.afterWin === 5);
  t('martingale ธงกฎเหล็ก', r.flags.some((x) => x.hard && x.text.includes('martingale')));
  t('martingale lot max/median', near(r.lotMaxToMedian, 2));
  t('martingale ไม่ใช่ grid', r.maxOpen.count === 1);

  // grid: 5 opens on EURUSD and 2 on USDJPY before any close → max 5 on EURUSD
  const grid = [0, 1, 2, 3, 4].map((i) => deal(i, 'in', 0.01)).concat([deal(5, 'in', 0.01, 0, 'USDJPY'), deal(6, 'in', 0.01, 0, 'USDJPY'), deal(7, 'out', 0.05, 5), deal(8, 'out', 0.02, 1, 'USDJPY')]);
  r = check(grid);
  t('grid 5 EURUSD', r.maxOpen.symbol === 'EURUSD buy' && r.maxOpen.count === 5);
  t('grid ธงกฎเหล็ก', r.flags.some((x) => x.hard && x.text.includes('grid')));
  t('grid ปิด 2 ไม้', r.trades === 2);

  // hedge: 3 buys and 3 sells open together on EURUSD → 3 per side, not 6 → no grid flag
  const hedge = [0, 1, 2].map((i) => deal(i, 'in', 0.1, 0, 'EURUSD', 'buy')).concat([3, 4, 5].map((i) => deal(i, 'in', 0.1, 0, 'EURUSD', 'sell')), [6, 7, 8].map((i) => deal(i, 'out', 0.1, 1, 'EURUSD', 'buy')), [9, 10, 11].map((i) => deal(i, 'out', 0.1, 1, 'EURUSD', 'sell')));
  r = check(hedge);
  t('hedge นับแยกทิศ', r.maxOpen.count === 3 && r.trades === 6 && !r.flags.some((x) => x.text.includes('grid')));

  // nested opens close FIFO: opens at 0 h and 1 h · win closes at 10 h (hold 10) · loss closes at 12 h (hold 11) → H = 1.1 · LIFO would give 12 / 9
  r = check([deal(0, 'in', 0.1), deal(1, 'in', 0.1), deal(10, 'out', 0.1, 5), deal(12, 'out', 0.1, -5)]);
  t('FIFO เวลาถือ', near(r.holdRatio, 11 / 10));

  // first trade loses: cumulative −5 −2 → peak stays 0 → DD 5 (a −∞ start would give 0)
  r = check(closed([-5, 3]));
  t('DD ไม้แรกขาดทุน', near(r.maxDrawdown, 5));

  // R_lot exactly at the limit 1.5: wins use lot 1.5 (follow a loss), losses use lot 1 (follow a win) → 1.5 / 1 → hard flag
  r = check(closed(Array.from({ length: 12 }, (_, i) => (i % 2 ? -5 : 5)), Array.from({ length: 12 }, (_, i) => (i % 2 ? 1 : 1.5))));
  t('R_lot เท่าเกณฑ์พอดี', r.lot.ratio === 1.5 && r.flags.some((x) => x.hard && x.text.includes('martingale')));

  // enough trades but t between 1 and 2: (+10, −6) × 20 → mean 2 · sd 8 × √(40/39) = 8.1010 · t = 2 × √40 / 8.1010 = 1.5614 → not enough data
  r = check(closed(Array.from({ length: 40 }, (_, i) => (i % 2 ? -6 : 10))));
  t('t ระหว่าง 1 กับ 2', r.trades === 40 && near(r.tStat, 1.5614) && !r.enoughData.ok && r.enoughData.text.includes('แยกฝีมือ'));

  // holding time: win held 1 h, loss held 3 h → ratio 3 (flag at 2)
  r = check([deal(0, 'in', 0.1), deal(1, 'out', 0.1, 5), deal(2, 'in', 0.1), deal(5, 'out', 0.1, -5)]);
  t('ถือไม้ขาดทุน 3 เท่า', near(r.holdRatio, 3) && r.flags.some((x) => x.text.includes('ตัดขาดทุน')));

  // worst loss: nine −1 and one −50 → average 5.9 → 50 / 5.9 = 8.47 · payoff 1 / 5.9 = 0.169 → both flags
  r = check(closed([...Array(9).fill(-1), -50, 1]));
  t('ขาดทุนก้อนใหญ่', near(r.worstLossRatio, 8.4746) && r.flags.some((x) => x.text.includes('ก้อนใหญ่')));
  t('payoff ต่ำ', near(r.payoff, 0.16949) && r.flags.some((x) => x.text.includes('กำไรเล็ก')));

  // drawdown with balance: cumulative 10 6 3 11 −1 4 → DD 12 from peak 11 → 12 / (100 + 11) = 10.81%
  r = check(closed([10, -4, -3, 8, -12, 5]), 100);
  t('DD 12', near(r.maxDrawdown, 12) && near(r.maxDrawdownPct, 10.8108));

  // CSV: comment line, tab separator, MT time format, swap and balance row
  const rows = parseCsv('# ตัวอย่าง\ntime\tsymbol\ttype\tvolume\tswap\tprofit\n2024.01.02 10:00\t\tbalance\t0\t0\t1000\n2024.01.02 11:00\tEURUSD\tBuy\t0.10\t-0.50\t10.50\n');
  r = check(rows);
  t('CSV แท็บ ข้าม balance', r.skipped === 1 && r.trades === 1 && near(r.netProfit, 10));
  t('CSV ป้ายบรรทัด', rows[1]._label === 'บรรทัด 4');

  // input errors name the field and never pass
  const throwsWith = (fn, ...words) => { try { fn(); return false; } catch (e) { return words.every((x) => e.message.includes(x)); } };
  t('ไม่มี profit', throwsWith(() => check([{ time: '2024-01-01', symbol: 'X', type: 'buy', volume: 1 }]), 'profit'));
  t('volume ข้อความ', throwsWith(() => check(parseCsv('time,symbol,type,volume,profit\n2024-01-01,X,buy,abc,1')), 'volume', 'บรรทัด 2'));
  t('volume ศูนย์', throwsWith(() => check(closed([1], 0)), 'volume'));
  t('ทศนิยมจุลภาค', throwsWith(() => check(parseCsv('time;symbol;type;volume;profit\n2024-01-01;X;buy;0,10;1')), 'volume'));
  t('เวลาผิด', throwsWith(() => check([{ time: 'เมื่อวาน', symbol: 'X', type: 'buy', volume: 1, profit: 1 }]), 'time'));
  t('direction ผิด', throwsWith(() => check([deal(0, 'in/out', 0.1)]), 'direction'));
  t('ไฟล์ว่าง', throwsWith(() => parseCsv('time,symbol\n'), 'หัวตาราง'));
  t('JSON ผิดรูป', throwsWith(() => parseJson({ rows: [] }), 'deals'));

  // CLI: missing file and broken JSON stop with exit 1, Thai message, no stack trace
  const self = fileURLToPath(import.meta.url);
  const run = (file) => spawnSync(process.execPath, [self, file], { encoding: 'utf8' });
  let c = run(join(tmpdir(), 'signal-check-no-such-file.csv'));
  t('CLI ไม่พบไฟล์', c.status === 1 && c.stderr.includes('ไม่พบไฟล์') && !/\n\s+at /.test(c.stderr));
  const badFile = join(mkdtempSync(join(tmpdir(), 'signal-check-')), 'bad.json');
  writeFileSync(badFile, '{ "deals": [ ');
  c = run(badFile);
  t('CLI JSON พัง', c.status === 1 && c.stderr.includes('JSON') && !/\n\s+at /.test(c.stderr));

  console.log(`self-test: ${ok} ผ่าน ${bad} ล้ม`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--balance');
  if (!file) { console.error('ใช้: node signal-check.mjs <ไฟล์.csv|ไฟล์.json> [--balance 10000] [--json] | --self-test'); process.exit(2); }
  try {
    const bi = args.indexOf('--balance');
    const balance = bi >= 0 ? toNumber(args[bi + 1], 'ตัวเลือก --balance', 'balance', { positive: true }) : null;
    const text = readFileSync(file, 'utf8');
    const rows = /\.json$/i.test(file) ? parseJson(JSON.parse(text)) : parseCsv(text);
    const r = check(rows, balance);
    console.log(args.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`ผิดพลาด: ${e instanceof SyntaxError ? `ไฟล์ ${file} ไม่ใช่ JSON ที่ถูกต้อง (${e.message})` : e.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : e.message}`);
    process.exit(1);
  }
}
