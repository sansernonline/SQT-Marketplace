#!/usr/bin/env node
// indicators.mjs - SMA, EMA, RSI (Wilder), MACD, volume ratio and RSI/MACD hit rate from a price CSV (Node stdlib only)
// Usage: node indicators.mjs <file.csv> [--bars 10] [--json]   |   node indicators.mjs --self-test
// CSV header: date,close[,volume] · oldest row first · data comes from the user or a market-data plugin; nothing is downloaded
// EMA and Wilder averages start from the simple average of the first n values, so the first ~100 bars can differ from a
// charting app; give 250+ bars and compare the last values only.
import { readFileSync } from 'node:fs';

// SKILL.md "Choosing RSI or MACD": both are starting values, not yet measured
const MIN_SIGNALS = 30;
const HIT_BARS = 10;
// Platform defaults named in SKILL.md "Default parameters"
const RSI_LOW = 30, RSI_HIGH = 70;

export const sma = (xs, n) => xs.map((_, i) => (i < n - 1 ? null : xs.slice(i - n + 1, i + 1).reduce((s, x) => s + x, 0) / n));

// seeds with the SMA of the first n values that are not null
export function ema(xs, n) {
  const k = 2 / (n + 1);
  const out = xs.map(() => null);
  const start = xs.findIndex((x) => x !== null);
  if (start < 0 || xs.length - start < n) return out;
  let e = xs.slice(start, start + n).reduce((s, x) => s + x, 0) / n;
  out[start + n - 1] = e;
  for (let i = start + n; i < xs.length; i++) out[i] = e = xs[i] * k + e * (1 - k);
  return out;
}

// Wilder RSI: first average gain/loss = simple mean of n changes, then avg = (prev x (n-1) + now) / n
export function rsi(closes, n = 14) {
  const out = closes.map(() => null);
  if (closes.length <= n) return out;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = closes[i] - closes[i - 1]; d > 0 ? (g += d) : (l -= d); }
  g /= n; l /= n;
  const val = () => (l === 0 ? (g === 0 ? 50 : 100) : 100 - 100 / (1 + g / l));
  out[n] = val();
  for (let i = n + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    g = (g * (n - 1) + Math.max(d, 0)) / n;
    l = (l * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = val();
  }
  return out;
}

export function macd(closes, fast = 12, slow = 26, sig = 9) {
  const f = ema(closes, fast), s = ema(closes, slow);
  const line = closes.map((_, i) => (f[i] === null || s[i] === null ? null : f[i] - s[i]));
  const signal = ema(line, sig);
  return { line, signal, hist: line.map((m, i) => (m === null || signal[i] === null ? null : m - signal[i])) };
}

// Wilson score interval, same formula as copy-trade-check/scripts/signal-check.mjs (z = 1.96 -> 95%)
export function wilson(k, n, z = 1.96) {
  if (n === 0) return [0, 1];
  const p = k / n;
  const centre = p + (z * z) / (2 * n);
  const half = (z / (2 * n)) * Math.sqrt(4 * n * p * (1 - p) + z * z);
  const d = 1 + (z * z) / n;
  return [(centre - half) / d, (centre + half) / d];
}

// signals = [{ i, dir: +1 up / -1 down }] -> hit when the close `bars` later is beyond the signal close in that direction
export function hitRate(closes, signals, bars = HIT_BARS) {
  const counted = signals.filter((s) => s.i + bars < closes.length);
  const hits = counted.filter((s) => (closes[s.i + bars] - closes[s.i]) * s.dir > 0).length;
  return { n: counted.length, hits, rate: counted.length ? hits / counted.length : null, ci: wilson(hits, counted.length) };
}

// RSI: crossing up through 30 = up signal, crossing down through 70 = down signal
export const rsiSignals = (r) => r.flatMap((v, i) => {
  const p = r[i - 1];
  if (i === 0 || v === null || p === null) return [];
  if (p < RSI_LOW && v >= RSI_LOW) return [{ i, dir: 1 }];
  if (p > RSI_HIGH && v <= RSI_HIGH) return [{ i, dir: -1 }];
  return [];
});

// MACD: line crossing above signal = up, below = down
export const macdSignals = ({ hist }) => hist.flatMap((h, i) => {
  const p = hist[i - 1];
  if (i === 0 || h === null || p === null) return [];
  if (p <= 0 && h > 0) return [{ i, dir: 1 }];
  if (p >= 0 && h < 0) return [{ i, dir: -1 }];
  return [];
});

// P11 rule: choose only when both have enough signals and the 95% intervals do not overlap
export function choose(a, b) {
  const enough = (x) => x.n >= MIN_SIGNALS;
  if (!enough(a.stat) && !enough(b.stat)) return `ข้อมูลไม่พอ (สัญญาณน้อยกว่า ${MIN_SIGNALS} ทั้งคู่) · อ่าน RSI 14 ตามค่าตั้งต้นของแพลตฟอร์ม และบอกว่ายังไม่ได้วัดว่าตัวไหนแม่นกว่า`;
  if (!enough(a.stat) || !enough(b.stat)) {
    const [ok, short] = enough(a.stat) ? [a, b] : [b, a];
    return `${short.name} ข้อมูลไม่พอ (${short.stat.n} สัญญาณ) · ใช้ ${ok.name} ได้ตัวเดียว${ok.stat.rate > 0.5 ? '' : ' แต่ hit rate ไม่เกิน 50% อย่าใช้เป็นเหตุผลเข้า'}`;
  }
  const [hi, lo] = a.stat.rate >= b.stat.rate ? [a, b] : [b, a];
  if (hi.stat.ci[0] <= lo.stat.ci[1]) return `ยังแยกไม่ออก: ช่วง 95% ของ ${a.name} กับ ${b.name} ทับกัน · อ่านทั้งสองตัว ไม่เลือก`;
  return `ใช้ ${hi.name} (ช่วง 95% ไม่ทับกับ ${lo.name})${hi.stat.rate > 0.5 ? '' : ' · แต่ hit rate ไม่เกิน 50% อย่าใช้เป็นเหตุผลเข้า'}`;
}

export function parse(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
  const head = lines.shift()?.toLowerCase().split(',').map((h) => h.trim()) ?? [];
  const ci = head.indexOf('close'), vi = head.indexOf('volume');
  if (ci < 0) throw new Error('ไม่มีคอลัมน์ close ในหัวตาราง · หัวต้องเป็น date,close,volume (volume ไม่บังคับ)');
  const rows = lines.map((l, k) => {
    const c = l.split(',');
    const close = Number(c[ci]), volume = vi < 0 || !String(c[vi] ?? '').trim() ? null : Number(c[vi]);  // ช่อง volume ว่าง = ไม่มีข้อมูล ไม่ใช่ 0
    if (!Number.isFinite(close) || close <= 0) throw new Error(`แถว ${k + 2}: close ต้องเป็นตัวเลขมากกว่า 0 ไม่มีจุลภาคคั่นหลักพัน (ได้ ${JSON.stringify(c[ci])})`);
    if (volume !== null && (!Number.isFinite(volume) || volume < 0)) throw new Error(`แถว ${k + 2}: volume ต้องเป็นตัวเลขไม่ติดลบ (ได้ ${JSON.stringify(c[vi])})`);
    return { date: c[head.indexOf('date')] ?? String(k), close, volume };
  });
  if (rows.length < 35) throw new Error(`มี ${rows.length} แท่ง · ต้องมีอย่างน้อย 35 แท่งจึงคิด MACD ได้ (แนะนำ 250+)`);
  return rows;
}

export function analyze(rows, bars = HIT_BARS) {
  const closes = rows.map((r) => r.close);
  const last = (xs) => xs.at(-1);
  const r = rsi(closes), m = macd(closes);
  const vols = rows.map((x) => x.volume);
  const hasVol = vols.every((v) => v !== null);
  const vAvg = hasVol ? sma(vols, 20) : null;
  const rsiStat = { name: 'RSI 14', stat: hitRate(closes, rsiSignals(r), bars) };
  const macdStat = { name: 'MACD 12-26-9', stat: hitRate(closes, macdSignals(m), bars) };
  return {
    bars: rows.length, lastDate: last(rows).date, close: last(closes),
    sma50: last(sma(closes, 50)), sma200: last(sma(closes, 200)), ema10: last(ema(closes, 10)), ema20: last(ema(closes, 20)),
    rsi14: last(r), macd: last(m.line), signal: last(m.signal), hist: last(m.hist),
    volumeRatio: hasVol && last(vAvg) ? last(vols) / last(vAvg) : null,
    hitBars: bars, rsiHit: rsiStat.stat, macdHit: macdStat.stat, choice: choose(rsiStat, macdStat),
  };
}

const f = (n, d = 2) => (n === null || n === undefined ? '-' : n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
const pct = (x) => `${f(x * 100, 1)}%`;

export function report(a) {
  const hit = (s) => (s.n ? `${pct(s.rate)} (${s.hits}/${s.n}) · ช่วง 95% ${pct(s.ci[0])}–${pct(s.ci[1])}` : 'ไม่มีสัญญาณ');
  return [
    `${a.bars} แท่ง · ล่าสุด ${a.lastDate} ปิด ${f(a.close)}`,
    '',
    '| ตัวชี้วัด | ค่าล่าสุด |',
    '|---|---|',
    `| SMA 50 / 200 | ${f(a.sma50)} / ${a.sma200 === null ? 'ไม่ถึง 200 แท่ง' : f(a.sma200)} |`,
    `| EMA 10 / 20 | ${f(a.ema10)} / ${f(a.ema20)} |`,
    `| RSI 14 (Wilder) | ${f(a.rsi14, 1)} |`,
    `| MACD / signal / hist | ${f(a.macd, 3)} / ${f(a.signal, 3)} / ${f(a.hist, 3)} |`,
    `| วอลุ่มวันล่าสุด ÷ เฉลี่ย 20 วัน | ${a.volumeRatio === null ? 'ไม่มีข้อมูล volume (คอลัมน์ไม่มีหรือช่องว่าง)' : `${f(a.volumeRatio)} เท่า`} |`,
    '',
    `Hit rate (ปิด ${a.hitBars} แท่งหลังสัญญาณไปทางที่สัญญาณบอก):`,
    `- RSI 14 ตัด 30 ขึ้น / 70 ลง: ${hit(a.rsiHit)}`,
    `- MACD ตัด signal: ${hit(a.macdHit)}`,
    '',
    `**ผล:** ${a.choice}`,
    '',
    'ข้อมูลทั่วไป ไม่ใช่คำแนะนำการลงทุน · ผู้ใช้ตัดสิน',
  ].join('\n');
}

function selfTest() {
  let ok = 0, bad = 0;
  const t = (name, cond) => { cond ? ok++ : (bad++, console.error('ล้ม:', name)); };
  const near = (a, b, e = 1e-6) => a !== null && Math.abs(a - b) < e;
  t('SMA 3 ของ 1..5', JSON.stringify(sma([1, 2, 3, 4, 5], 3)) === JSON.stringify([null, null, 2, 3, 4]));
  // EMA 3 (k = 0.5) seed SMA(1,2,3) = 2 -> 4x0.5 + 2x0.5 = 3 -> 5x0.5 + 3x0.5 = 4
  const e = ema([1, 2, 3, 4, 5], 3);
  t('EMA 3 คิดมือ', e[2] === 2 && e[3] === 3 && e[4] === 4);
  t('EMA ข้าม null หัวแถว', near(ema([null, 1, 2, 3, 4], 3)[3], 2));
  // RSI 2 by hand: closes 1,2,1,2 -> changes +1,-1,+1 · seed g=0.5 l=0.5 -> 50 · then g=(0.5+1)/2=0.75, l=0.25 -> 100-100/4 = 75
  const r = rsi([1, 2, 1, 2], 2);
  t('RSI 2 คิดมือ', r[1] === null && near(r[2], 50) && near(r[3], 75));
  t('RSI ขึ้นล้วน = 100', near(rsi([1, 2, 3, 4, 5, 6], 3).at(-1), 100));
  t('RSI ราคาคงที่ = 50', near(rsi([5, 5, 5, 5, 5], 3).at(-1), 50));
  // MACD of a constant series is 0
  const flat = Array(60).fill(10);
  t('MACD ราคาคงที่ = 0', near(macd(flat).line.at(-1), 0) && near(macd(flat).signal.at(-1), 0));
  // straight line +1 a bar: EMA lags by (n-1)/2 -> MACD = 12.5 - 5.5 = 7 once both settle
  const line = Array.from({ length: 300 }, (_, i) => 100 + i);
  t('MACD เส้นตรง = 7', near(macd(line).line.at(-1), 7, 1e-6));
  // hit rate: up signal at 0 then price 10 bars later higher = hit; down signal at 1 -> also higher = miss
  const closes = Array.from({ length: 20 }, (_, i) => 10 + i);
  const h = hitRate(closes, [{ i: 0, dir: 1 }, { i: 1, dir: -1 }, { i: 15, dir: 1 }], 10);
  t('hit rate นับเฉพาะที่มีแท่งพอ', h.n === 2 && h.hits === 1 && h.rate === 0.5);
  t('Wilson 4/10 ตรงค่า trade-stats', near(wilson(4, 10)[0], 0.16818, 1e-4) && near(wilson(4, 10)[1], 0.68733, 1e-4));
  t('signal RSI ตัด 30 ขึ้น', JSON.stringify(rsiSignals([null, 25, 35, 75, 65])) === JSON.stringify([{ i: 2, dir: 1 }, { i: 4, dir: -1 }]));
  // choice rule: 60% vs 50% with 30 signals each -> intervals overlap -> do not choose (old 5-point rule would have chosen)
  const mk = (name, hits, n) => ({ name, stat: { n, hits, rate: hits / n, ci: wilson(hits, n) } });
  t('ต่าง 10 จุดที่ 30 สัญญาณ = ยังแยกไม่ออก', choose(mk('A', 18, 30), mk('B', 15, 30)).includes('ยังแยกไม่ออก'));
  t('ต่างมากที่ 200 สัญญาณ = เลือก', choose(mk('A', 140, 200), mk('B', 90, 200)).startsWith('ใช้ A'));
  t('น้อยกว่า 30 ทั้งคู่', choose(mk('A', 10, 20), mk('B', 5, 10)).includes('ข้อมูลไม่พอ'));
  t('ตัวเดียวพอ', choose(mk('A', 20, 30), mk('B', 5, 10)).includes('ใช้ A ได้ตัวเดียว'));
  const throws = (txt, word) => { try { parse(txt); return false; } catch (err) { return err.message.includes(word); } };
  t('ไม่มี close error', throws('date,price\n1,2', 'close'));
  t('close ไม่ใช่เลข error', throws('date,close\n2026-01-01,abc', 'แถว 2'));
  t('แท่งน้อยไป error', throws('date,close\n2026-01-01,10', '35'));
  const csv = 'date,close,volume\n' + line.map((c, i) => `${i},${c},1000`).join('\n');
  const a = analyze(parse(csv));
  t('analyze ครบ', near(a.sma50, 374.5) && near(a.volumeRatio, 1) && near(a.rsi14, 100));
  const noVol = analyze(parse('date,close,volume\n' + line.map((c, i) => `${i},${c},${i % 2 ? '' : 1000}`).join('\n')));
  t('volume ช่องว่างไม่ถูกอ่านเป็น 0', noVol.volumeRatio === null && report(noVol).includes('ไม่มีข้อมูล volume'));
  console.log(`self-test ${ok}/${ok + bad} ผ่าน`);
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else {
  const file = args.find((x, i) => !x.startsWith('--') && args[i - 1] !== '--bars');
  if (!file) { console.error('ใช้: node indicators.mjs <ไฟล์.csv> [--bars 10] [--json] | --self-test'); process.exit(2); }
  try {
    const bi = args.indexOf('--bars');
    const bars = bi < 0 ? HIT_BARS : Number(args[bi + 1]);
    if (!Number.isInteger(bars) || bars < 1) throw new Error(`--bars ต้องเป็นจำนวนเต็มตั้งแต่ 1 (ได้ ${args[bi + 1]})`);
    const a = analyze(parse(readFileSync(file, 'utf8')), bars);
    console.log(args.includes('--json') ? JSON.stringify(a, null, 2) : report(a));
  } catch (err) {
    console.error(`ผิดพลาด: ${err.code === 'ENOENT' ? `ไม่พบไฟล์ ${file}` : err.message}`);
    process.exit(1);
  }
}
