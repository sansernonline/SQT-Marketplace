#!/usr/bin/env node
// บรรทัดแจ้งโควตาในแชต ตอนเริ่มและตอนจบงาน superuser (ผู้ใช้ขอ 2026-11-20)
//   node budget.mjs start --estimate 2100 [--hours 3] [--workers 7] [--pieces 7]
//   node budget.mjs end
//   node budget.mjs status [--json]
// start จดยอดโควตาตอนเริ่มไว้ที่ <team>/log/budget-start.json · end เทียบ % สัปดาห์ที่ใช้จริงกับที่คาด
// ตัวเลข token เป็นหน่วยเดียวกับ "ขนาด: Nk" ในใบสั่งงาน (ไม่รวม cache) จึงเทียบกับด่านโควตาได้ตรง
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { accountLeft, estimates, runningTokens } from "../../../hooks/superuser-hook.mjs";
import { accountName } from "../../handoff/parts/parallel-split-and-merge/scripts/quota.mjs";

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? Number(args[i + 1]) : null; };
const teamDir = [join(process.cwd(), ".claude", "superuser"), join(homedir(), ".claude", "superuser")].find((d) => existsSync(join(d, "log"))) ?? join(homedir(), ".claude", "superuser");
const fmtK = (k) => `${Math.round(k).toLocaleString("en-US")}k`;
const fmtH = (h) => (h == null ? "ไม่ทราบ" : h < 1 ? `${Math.round(h * 60)} นาที` : `${Math.floor(h)} ชั่วโมง${Math.round((h % 1) * 60) ? ` ${Math.round((h % 1) * 60)} นาที` : ""}`);
const clock = (hoursAhead) => {
  if (hoursAhead == null) return "ไม่ทราบ";
  const d = new Date(Date.now() + hoursAhead * 3600000);
  const day = hoursAhead > 20 ? `${d.getDate()}/${d.getMonth() + 1} ` : "";
  return `${day}${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} น.`;
};
const readRuns = (days) => {
  const dir = join(teamDir, "log");
  if (!existsSync(dir)) return [];   // งานแรกของเครื่อง ยังไม่มี log
  return readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().slice(-days)
    .flatMap((d) => { try { return readFileSync(join(dir, d, "runs.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)); } catch { return []; } });
};
// เลือกบัญชีแบบเดียวกับด่านโควตาใน hook (accountName + จับคู่ตามชื่อ) · เครื่องที่มีหลายบัญชีจะได้ไม่ปนกัน
const account = accountName(process.env, "claude");
const quotaRaw = () => {
  try { return JSON.parse(readFileSync(join(homedir(), ".claude", "superuser", "quota", `${account.replace(/[^\w.-]/g, "_")}.json`), "utf8")); } catch { return null; }
};
const accConf = () => { try { return JSON.parse(readFileSync(join(homedir(), ".claude", "superuser", "accounts.json"), "utf8")).accounts?.find((a) => a?.name === account) ?? null; } catch { return null; } };

// ---- คำนวณล้วน (รับ quota + now เข้ามา ไม่อ่านไฟล์) ----
const WEEK_H = 168;
const pad2 = (n) => String(n).padStart(2, "0");
const DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export const hhmm = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
export const fmtDay = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${hhmm(d)}`;
export function fmtDur(h) {
  if (h >= 24) { const t = Math.round(h); return `${Math.floor(t / 24)} วัน ${t % 24} ชม.`; }
  const m = Math.round(h * 60), hh = Math.floor(m / 60);
  return hh ? `${hh} ชม. ${m % 60} น.` : `${m} น.`;
}
const hoursTo = (w, now) => (Date.parse(w.reset) - now.getTime()) / 3600000;
const liveAt = (w, now) => (w && Date.parse(w.reset) > now.getTime() ? w : null);   // ถังที่เลยเวลารีเซ็ตแล้ว = ข้อมูลเก่า ไม่ใช้

export function weekStats(week, now) {
  const hrs = hoursTo(week, now), el = 1 - hrs / WEEK_H, elH = WEEK_H - hrs, used = week.used;
  const pace = el > 0 && used > 0 ? used / (el * 100) : null;
  const runout = pace != null && pace > 1 ? new Date(now.getTime() + ((100 - used) / (used / elH)) * 3600000) : null;
  const left = Math.max(0, 100 - used);
  return { hrs, elapsed: Math.max(0, el * 100), pace, runout, left,
    daily_left: hrs > 0 ? left / (hrs / 24) : null, daily_avg: elH > 0 ? used / (elH / 24) : null };
}

// q = ไฟล์โควตา · est = { k, hours, workers, capK } ถ้ามีจะพิมพ์บรรทัด งานนี้
export function statusLines(q, now, est = null) {
  const five = liveAt(q.five_hour, now), week = liveAt(q.week, now);
  const out = [`โควตา · อ่านจาก Claude Code ${q.at ? hhmm(new Date(q.at)) : "?"}`];
  if (five) out.push(`รอบ 5 ชม.    ใช้ ${Math.round(five.used)}%  · เหลือ ${Math.round(100 - five.used)}% · รีเซ็ต ${hhmm(new Date(five.reset))} (อีก ${fmtDur(hoursTo(five, now))})`);
  let estPct = null;
  if (week) {
    const s = weekStats(week, now);
    out.push(`รายสัปดาห์   ใช้ ${Math.round(week.used)}% · เหลือ ${Math.round(s.left)}% · รีเซ็ต ${fmtDay(new Date(week.reset))} (อีก ${fmtDur(s.hrs)})`);
    if (est?.k && est.capK) estPct = (est.k / est.capK) * 100;
    let pace = `ความเร็ว     เวลาผ่านไป ${Math.round(s.elapsed)}% ของสัปดาห์ ใช้ไป ${Math.round(week.used)}% → `;
    if (s.pace == null) pace += "ยังไม่มีข้อมูลพอ";
    else if (s.runout) pace += `เร็วกว่าเฉลี่ย ${s.pace.toFixed(1)} เท่า · ถ้าเร็วเท่านี้จะหมดราว ${fmtDay(s.runout)} ก่อนรีเซ็ต ~${Math.round(s.hrs - (s.runout - now) / 3600000)} ชม.`;
    else pace += "ช้ากว่าเฉลี่ย";
    if (estPct != null && estPct > s.left) pace += " · งานนี้ทำให้หมดก่อนรีเซ็ต";
    out.push(pace);
    if (s.daily_left != null) out.push(`งบที่เหลือ    ~${Math.round(s.daily_left)}% ต่อวันจนรีเซ็ต${s.daily_avg != null ? ` (ที่ผ่านมาเฉลี่ย ${Math.round(s.daily_avg)}%/วัน)` : ""}`);
  }
  if (est?.k) {
    const pct = estPct != null ? `≈ ${estPct < 10 ? estPct.toFixed(1) : Math.round(estPct)}% ของสัปดาห์` : "≈ ?% ของสัปดาห์ (ยังไม่รู้ขนาดถัง)";
    out.push(`งานนี้        คาด ~${fmtK(est.k)} ${pct}${est.hours ? ` · ~${est.hours} ชม.` : ""}${est.workers ? ` · ลูกทีม ${est.workers}` : ""} (รอยืนยัน)`);
  }
  return out;
}

export function statusJson(q, now) {
  const five = liveAt(q.five_hour, now), week = liveAt(q.week, now), r1 = (n) => (n == null ? null : Math.round(n * 10) / 10);
  const s = week ? weekStats(week, now) : null;
  return {
    five: five ? { used: five.used, left: 100 - five.used, reset: five.reset } : null,
    week: week ? { used: week.used, left: s.left, reset: week.reset, pace: s.pace == null ? null : Math.round(s.pace * 100) / 100,
      runout: s.runout ? s.runout.toISOString() : null, daily_left: r1(s.daily_left), daily_avg: r1(s.daily_avg) } : null,
    context: q.context ?? null, at: q.at ?? null };
}

const noQuota = () => (quotaRaw() && accConf()
  ? "โควตาคงเหลือ: ไม่ทราบ (ไฟล์โควตาไม่มีรอบ 5 ชั่วโมงที่ยังไม่รีเซ็ต · รอ status line จดค่าใหม่)"
  : "โควตาคงเหลือ: ไม่ทราบ (ยังไม่มีไฟล์โควตาจาก status line หรือบัญชีนี้ใน accounts.json · ดู parallel-split-and-merge)");

function main() {
  if (args[0] === "start") {
    const est = opt("estimate"), pieces = opt("pieces"), workers = opt("workers"), hours = opt("hours");
    const pairs = estimates(readRuns(30)).map(([e, a]) => a / e).sort((x, y) => x - y);
    const ratio = pairs.length >= 3 ? pairs[Math.floor(pairs.length / 2)] : null;
    const left = accountLeft(), q = quotaRaw(), now = new Date();
    const freeK = left ? Math.max(0, left.left_k - (runningTokens(readRuns(2), now, account) / 1000) * left.safety) : null;
    const adj = est && ratio ? est * ratio : est;
    const capK = accConf()?.week_cap_k ?? null;
    if (!left || !q) console.log(noQuota());
    else console.log(statusLines(q, now, adj ? { k: adj, hours, workers, capK } : null).join("\n"));
    if (est && freeK != null) {
      const enough = adj * left.safety <= freeK;
      const share = pieces && !enough ? Math.floor(freeK / (adj * left.safety / pieces)) : null;
      const resetAt = clock(left.limited_by === "week" ? left.week_reset_in_hours : left.reset_in_hours);
      console.log(enough ? "ความเพียงพอ: เพียงพอ" : `ความเพียงพอ: ไม่เพียงพอ${share != null ? ` · ดำเนินการได้ ${share} จาก ${pieces} งานในรอบนี้` : ""} · งานที่เหลือจะบันทึกสถานะตาม handoff หัวข้อ 5 แล้วดำเนินการต่อหลังรีเซ็ต ${resetAt}`);
    }
    // อ่านโควตาไม่ได้ = ไม่เขียนทับจุดเริ่มเดิมที่ยังใช้ได้
    if (q) mkdirSync(join(teamDir, "log"), { recursive: true });
    if (q) writeFileSync(join(teamDir, "log", "budget-start.json"), JSON.stringify({ at: now.toISOString(), estimate_k: adj ?? null, est_pct: adj && capK ? (adj / capK) * 100 : null, five_used: q?.five_hour?.used ?? null, five_reset: q?.five_hour?.reset ?? null, week_used: q?.week?.used ?? null, week_reset: q?.week?.reset ?? null }));
  } else if (args[0] === "end") {
    let s = null; try { s = JSON.parse(readFileSync(join(teamDir, "log", "budget-start.json"), "utf8")); } catch { /* ไม่มีจุดเริ่ม */ }
    if (!s) { console.log("สรุปการใช้งาน: ไม่ทราบ (ไม่ได้รัน budget.mjs start ตอนเริ่มงาน)"); process.exit(0); }
    const q = quotaRaw(), now = new Date(), since = Date.parse(s.at);
    if (!q) { console.log(noQuota()); process.exit(0); }
    const workers = readRuns(2).filter((r) => r.event === "run" && Date.parse(r.ts) >= since).length;
    const week = liveAt(q.week, now), five = liveAt(q.five_hour, now);
    // ถังสัปดาห์รีเซ็ตระหว่างงาน (reset ต่างจากตอนเริ่ม) → ส่วนต่างใช้ไม่ได้
    const delta = week && s.week_used != null && (!s.week_reset || s.week_reset === q.week.reset) ? Math.max(0, week.used - s.week_used) : null;
    const ws = week ? weekStats(week, now) : null;
    console.log(`ใช้จริง ${delta == null ? "?" : Math.round(delta * 10) / 10}% ของสัปดาห์ (คาด ${s.est_pct == null ? "?" : Math.round(s.est_pct * 10) / 10}%) · ${fmtH((now - since) / 3600000)} · ลูกทีม ${workers}`);
    console.log(`เหลือ: รอบ 5 ชม. ${five ? Math.round(100 - five.used) : "?"}% · สัปดาห์ ${ws ? Math.round(ws.left) : "?"}% · ความเร็วตอนนี้ ${ws?.pace != null ? ws.pace.toFixed(1) : "?"} เท่า${q.context != null ? ` · context ${Math.round(q.context)}%` : ""}`);
  } else if (args[0] === "status") {
    const q = quotaRaw(), now = new Date(), json = args.includes("--json");
    if (!q) console.log(json ? "null" : noQuota());
    else console.log(json ? JSON.stringify(statusJson(q, now)) : statusLines(q, now).join("\n"));
  } else {
    console.log("ใช้: node budget.mjs start --estimate <k> [--hours N] [--workers N] [--pieces N] · node budget.mjs end · node budget.mjs status [--json]");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
