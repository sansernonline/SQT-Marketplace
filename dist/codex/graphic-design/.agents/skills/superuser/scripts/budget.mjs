#!/usr/bin/env node
// บรรทัดแจ้งโควตาในแชต ตอนเริ่มและตอนจบงาน superuser (ผู้ใช้ขอ 2026-11-20)
//   node budget.mjs start --estimate 2100 [--hours 3] [--workers 7] [--pieces 7]
//   node budget.mjs end
// start จดยอดโควตาตอนเริ่มไว้ที่ <team>/log/budget-start.json · end เทียบ % ที่ลดลงจริงกับขนาดถังใน accounts.json
// ตัวเลข token เป็นหน่วยเดียวกับ "ขนาด: Nk" ในใบสั่งงาน (ไม่รวม cache) จึงเทียบกับด่านโควตาได้ตรง
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { accountLeft, estimates, runningTokens } from "../../../hooks/superuser-hook.mjs";
import { accountName } from "../../parallel-split-and-merge/scripts/quota.mjs";

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
const live = (w) => (w && Date.parse(w.reset) > Date.now() ? w : null);   // ถังที่เลยเวลารีเซ็ตแล้ว = ข้อมูลเก่า ไม่ใช้

function quotaLine(left) {
  if (!left) return quotaRaw() && accConf()
    ? "โควตาคงเหลือ: ไม่ทราบ (ไฟล์โควตาไม่มีรอบ 5 ชั่วโมงที่ยังไม่รีเซ็ต · รอ status line จดค่าใหม่)"
    : "โควตาคงเหลือ: ไม่ทราบ (ยังไม่มีไฟล์โควตาจาก status line หรือบัญชีนี้ใน accounts.json · ดู parallel-split-and-merge)";
  const five = `รอบ 5 ชั่วโมง ${fmtK(left.five_left_k ?? left.left_k)} (รีเซ็ต ${clock(left.reset_in_hours)})`;
  const week = left.week_reset_in_hours != null ? ` · รายสัปดาห์ ${fmtK(left.week_left_k ?? left.left_k)} (รีเซ็ต ${clock(left.week_reset_in_hours)})` : "";
  return `โควตาคงเหลือ: ${five}${week} ← ข้อจำกัดหลัก: ${left.limited_by === "week" ? "รายสัปดาห์" : "รอบ 5 ชั่วโมง"}`;
}
// แยกยอดเหลือของแต่ละถัง (accountLeft คืนเฉพาะตัวที่น้อยกว่า)
function leftDetail() {
  const left = accountLeft(), q = quotaRaw(), acc = accConf();
  if (!left || !q || !acc?.cap_k) return left;
  const f = live(q.five_hour), w = live(q.week);
  // ไม่มี week_cap_k → hook คิดถังสัปดาห์เป็นสัดส่วนของ cap_k ใช้แบบเดียวกันให้ตัวเลขตรงกับด่าน
  const five = f ? acc.cap_k * (1 - f.used / 100) : acc.cap_k, week = w ? (acc.week_cap_k ?? acc.cap_k) * (1 - w.used / 100) : null;
  return { ...left, five_left_k: five, week_left_k: left.week_left_k ?? week };
}

if (args[0] === "start") {
  const est = opt("estimate"), pieces = opt("pieces"), workers = opt("workers"), hours = opt("hours");
  const pairs = estimates(readRuns(30)).map(([e, a]) => a / e).sort((x, y) => x - y);
  const ratio = pairs.length >= 3 ? pairs[Math.floor(pairs.length / 2)] : null;
  const left = leftDetail();
  const freeK = left ? Math.max(0, left.left_k - (runningTokens(readRuns(2), new Date(), account) / 1000) * left.safety) : null;
  const adj = est && ratio ? est * ratio : est;
  console.log(quotaLine(left));
  if (est) console.log(`ประมาณการใช้งาน: ~${fmtK(adj)}${hours ? ` · ~${fmtH(hours)}` : ""}${workers ? ` · ลูกทีม ${workers}` : ""}${ratio ? ` (ปรับตามสถิติงานที่ผ่านมา ใช้จริง ${ratio.toFixed(1)} เท่าของค่าประมาณ จาก ${pairs.length} ชิ้น)` : " (ยังมีสถิติไม่ถึง 3 ชิ้น ใช้ค่าประมาณตรง)"}`);
  if (est && freeK != null) {
    const enough = adj * left.safety <= freeK;
    const share = pieces && !enough ? Math.floor(freeK / (adj * left.safety / pieces)) : null;
    const resetAt = clock(left.limited_by === "week" ? left.week_reset_in_hours : left.reset_in_hours);
    console.log(enough ? "ความเพียงพอ: เพียงพอ" : `ความเพียงพอ: ไม่เพียงพอ${share != null ? ` · ดำเนินการได้ ${share} จาก ${pieces} งานในรอบนี้` : ""} · งานที่เหลือจะบันทึกสถานะตาม handoff หัวข้อ 5 แล้วดำเนินการต่อหลังรีเซ็ต ${resetAt}`);
  }
  const q = quotaRaw();
  // อ่านโควตาไม่ได้ = ไม่เขียนทับจุดเริ่มเดิมที่ยังใช้ได้
  if (q) mkdirSync(join(teamDir, "log"), { recursive: true });
  if (q) writeFileSync(join(teamDir, "log", "budget-start.json"), JSON.stringify({ at: new Date().toISOString(), estimate_k: adj ?? null, five_used: q?.five_hour?.used ?? null, five_reset: q?.five_hour?.reset ?? null, week_used: q?.week?.used ?? null }));
} else if (args[0] === "end") {
  let s = null; try { s = JSON.parse(readFileSync(join(teamDir, "log", "budget-start.json"), "utf8")); } catch { /* ไม่มีจุดเริ่ม */ }
  if (!s) { console.log("สรุปการใช้งาน: ไม่ทราบ (ไม่ได้รัน budget.mjs start ตอนเริ่มงาน)"); process.exit(0); }
  const q = quotaRaw(), acc = accConf(), since = Date.parse(s.at);
  const workers = readRuns(2).filter((r) => r.event === "run" && Date.parse(r.ts) >= since).length;
  // ถัง 5 ชม. รีเซ็ตระหว่างงาน → % ที่ลดลงใช้ไม่ได้ · ใช้ถังสัปดาห์ได้เฉพาะเมื่อรู้ขนาดถังสัปดาห์ (week_cap_k) ไม่งั้น "ไม่ทราบ"
  const reset = Boolean(s.five_reset && q?.five_hour?.reset && s.five_reset !== q.five_hour.reset);
  const usedK = !acc?.cap_k || !q ? null
    : !reset && s.five_used != null && q.five_hour ? acc.cap_k * (q.five_hour.used - s.five_used) / 100
    : acc.week_cap_k && s.week_used != null && q.week ? acc.week_cap_k * (q.week.used - s.week_used) / 100 : null;
  const est = s.estimate_k ? ` (ประมาณการ ${fmtK(s.estimate_k)})` : "";
  console.log(`สรุปการใช้งาน: ${usedK == null ? "ไม่ทราบ" : `~${fmtK(Math.max(0, usedK))}`}${est} · ${fmtH((Date.now() - since) / 3600000)} · ลูกทีม ${workers}${reset ? (usedK == null ? " · รอบ 5 ชั่วโมงรีเซ็ตระหว่างงานและไม่รู้ขนาดถังรายสัปดาห์ (week_cap_k)" : " · รอบ 5 ชั่วโมงรีเซ็ตระหว่างงาน คิดจากรายสัปดาห์") : ""}`);
  console.log(quotaLine(leftDetail()));
} else {
  console.log("ใช้: node budget.mjs start --estimate <k> [--hours N] [--workers N] [--pieces N] · node budget.mjs end");
}
