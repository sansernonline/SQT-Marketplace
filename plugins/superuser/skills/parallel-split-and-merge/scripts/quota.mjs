#!/usr/bin/env node
// โควตาของแต่ละบัญชี LLM สำหรับแจกงานข้ามบัญชี · อ่านจากช่องทางในเครื่องเท่านั้น ไม่อ่าน credential ไม่เรียก API เอง
//   node quota.mjs record                 ให้ status line ของ Claude Code เรียก: อ่าน JSON ทาง stdin (ช่อง rate_limits) แล้วจดลง ~/.claude/superuser/quota/<บัญชี>.json
//   node quota.mjs snapshot [--out <ไฟล์>] รวมโควตาทุกบัญชี (ไฟล์ที่ record จดไว้ + session ของ Codex) เป็น quota.json ให้ plan.mjs --quota
// ชื่อบัญชี = ตัวแปร SQT_ACCOUNT หรือชื่อโฟลเดอร์ของ CLAUDE_CONFIG_DIR / CODEX_HOME หรือ "default"
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const QUOTA_DIR = join(homedir(), ".claude", "superuser", "quota");

// ชื่อโฟลเดอร์สุดท้าย · แยกเองเพราะ basename บน Linux ไม่แยก path ที่ใช้ \ ของ Windows
const lastPart = (dir) => dir.replace(/[\\/]+$/, "").split(/[\\/]/).pop();

export function accountName(env = process.env, tool = "claude") {
  if (env.SQT_ACCOUNT) return env.SQT_ACCOUNT;
  const dir = tool === "codex" ? env.CODEX_HOME : env.CLAUDE_CONFIG_DIR;
  // ไม่ตั้งตัวแปร = โฟลเดอร์ตั้งต้นของเครื่องมือ (~/.claude หรือ ~/.codex) ชื่อจึงตรงกับ hook และแม่แบบ accounts.json
  return dir ? lastPart(dir) : tool === "codex" ? ".codex" : ".claude";
}

const iso = (sec) => (sec ? new Date(sec * 1000).toISOString() : null);

// ข้อมูล status line → บันทึกโควตา (ช่องตามเอกสาร code.claude.com/docs/en/statusline · ตรวจ 2026-10-27) · ไม่มีช่อง = แผนที่ไม่มีขีดจำกัดหรือยังไม่ได้ response แรก
export function fromStatusLine(input, env = process.env, now = new Date()) {
  const rl = input?.rate_limits;
  if (!rl) return null;
  const win = (w) => (w ? { used: Number(w.used_percentage ?? 0), reset: iso(w.resets_at) } : null);
  return { account: accountName(env, "claude"), tool: "claude", at: now.toISOString(), five_hour: win(rl.five_hour), week: win(rl.seven_day) };
}

// event token_count ใน session ของ Codex (rate_limits.primary/secondary · used_percent · window_minutes · resets_at) · ตรวจกับไฟล์จริงในเครื่อง 2026-10-27
export function fromCodexLine(line, account) {
  const d = JSON.parse(line), rl = d?.payload?.rate_limits ?? d?.payload?.info?.rate_limits;
  if (!rl) return null;
  const wins = [rl.primary, rl.secondary].filter(Boolean).map((w) => ({ used: Number(w.used_percent ?? 0), reset: iso(w.resets_at), minutes: w.window_minutes ?? null }));
  const short = wins.filter((w) => w.minutes && w.minutes <= 600).sort((a, b) => a.minutes - b.minutes)[0] ?? null;
  const long = wins.filter((w) => !w.minutes || w.minutes > 600).sort((a, b) => (b.minutes ?? 0) - (a.minutes ?? 0))[0] ?? null;
  return { account, tool: "codex", at: d.timestamp ?? null, five_hour: short, week: long, plan: rl.plan_type ?? null };
}

function newestCodex(home, account) {
  const root = join(home, "sessions");
  if (!existsSync(root)) return null;
  const files = readdirSync(root, { recursive: true }).filter((f) => String(f).endsWith(".jsonl")).map((f) => join(root, String(f)))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs).slice(0, 20);
  for (const f of files) {
    const lines = readFileSync(f, "utf8").split("\n").filter((l) => l.includes('"rate_limits"'));
    for (const l of lines.reverse()) { try { const q = fromCodexLine(l, account); if (q) return q; } catch { /* บรรทัดเสีย ข้ามไป */ } }
  }
  return null;
}

export function snapshot({ quotaDir = QUOTA_DIR, codexHomes = [process.env.CODEX_HOME ?? join(homedir(), ".codex")] } = {}) {
  const accounts = [];
  if (existsSync(quotaDir)) for (const f of readdirSync(quotaDir).filter((x) => x.endsWith(".json"))) {
    try { accounts.push(JSON.parse(readFileSync(join(quotaDir, f), "utf8"))); } catch { /* ไฟล์เสีย ข้ามไป */ }
  }
  for (const home of codexHomes) {
    const q = newestCodex(home, process.env.SQT_ACCOUNT && codexHomes.length === 1 ? process.env.SQT_ACCOUNT : lastPart(home));
    if (q && !accounts.some((a) => a.account === q.account)) accounts.push(q);
  }
  return { at: new Date().toISOString(), accounts };
}

// รวมโควตาเข้ากับรายการบัญชีของแผน (ผูกด้วย name = account) · รอบที่เลยเวลารีเซ็ตไปแล้วถือว่าเต็มใหม่ · ถึงขีดรายสัปดาห์แล้วโควตาเป็น 0 จนกว่าจะรีเซ็ต
export function applyQuota(accounts, snap, now = new Date()) {
  const hours = (isoTime) => (isoTime ? (Date.parse(isoTime) - now.getTime()) / 3600000 : null);
  return accounts.map((a) => {
    const q = snap?.accounts?.find((x) => x.account === a.name);
    if (!q) return a;
    const five = q.five_hour && hours(q.five_hour.reset) > 0 ? q.five_hour : null;
    const week = q.week && hours(q.week.reset) > 0 ? q.week : null;
    if (week && week.used >= 100) return { ...a, remaining_k: 0, reset_in_hours: hours(week.reset), quota_at: q.at };
    if (!five) return { ...a, quota_at: q.at };
    // ใช้ส่วนที่เหลือน้อยกว่าระหว่างรอบ 5 ชม. กับรอบยาว · รอบยาวใกล้เต็มแล้ว รอบ 5 ชม. ที่ยังว่างก็ใช้ได้ไม่เต็ม
    const share = Math.max(0, Math.min(1 - five.used / 100, week ? 1 - week.used / 100 : 1));
    return { ...a, remaining_k: a.cap_k * share, reset_in_hours: hours(five.reset), quota_at: q.at };
  });
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === "record") {
    let text = "";
    for await (const chunk of process.stdin) text += chunk;
    let input = null;
    try { input = JSON.parse(text); } catch { /* status line ส่งข้อมูลเสีย ไม่จดอะไร */ }
    const q = fromStatusLine(input);
    if (q) { mkdirSync(QUOTA_DIR, { recursive: true }); writeFileSync(join(QUOTA_DIR, `${q.account.replace(/[^\w.-]/g, "_")}.json`), JSON.stringify(q)); }
    // พิมพ์บรรทัดสั้นให้ status line แสดง
    console.log(q?.five_hour ? `${q.account} · 5 ชม. ${Math.round(q.five_hour.used)}%${q.week ? ` · สัปดาห์ ${Math.round(q.week.used)}%` : ""}` : "");
    return;
  }
  if (cmd === "snapshot") {
    const out = rest[rest.indexOf("--out") + 1];
    const snap = snapshot();
    if (rest.includes("--out") && out) { writeFileSync(out, JSON.stringify(snap, null, 2)); console.log(`เขียน ${out} · ${snap.accounts.length} บัญชี`); }
    else console.log(JSON.stringify(snap, null, 2));
    return;
  }
  console.error("ใช้: node quota.mjs record (ให้ status line เรียก) · node quota.mjs snapshot [--out quota.json]");
  process.exit(1);
}

if (process.argv[1]?.endsWith("quota.mjs")) main().catch((e) => { console.error(e.message); process.exit(1); });
