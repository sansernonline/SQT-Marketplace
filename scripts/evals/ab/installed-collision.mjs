// ตรวจว่า plugin ที่กำลังจะวัดมีสำเนาที่ติดตั้งและเปิดอยู่ในเครื่องหรือไม่
// ถ้ามี คำอธิบาย skill ของสำเนานั้นอาจถูกให้คะแนนแทนฉบับใน working tree โดยไม่รู้ตัว (แนวจาก expo-skill-eval ดู 2026-11-10)
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };

// คืนรายการ { id, version, enabled } ของสำเนาที่ติดตั้งและชื่อ plugin ตรงกัน
export function installedCopies(plugin, home = join(homedir(), ".claude")) {
  const installed = readJson(join(home, "plugins", "installed_plugins.json"));
  const settings = readJson(join(home, "settings.json")) ?? {};
  const enabledMap = settings.enabledPlugins ?? {};
  const ids = Object.keys(installed?.plugins ?? {}).filter((id) => id.split("@")[0] === plugin);
  return ids.map((id) => ({
    id,
    version: installed.plugins[id]?.[0]?.version ?? "?",
    enabled: enabledMap[id] !== false,   // ไม่ระบุ = ถือว่าเปิด
  }));
}

export const activeCopies = (plugin, home) => installedCopies(plugin, home).filter((c) => c.enabled);

export function collisionMessage(plugin, copies) {
  if (!copies.length) return "";
  const list = copies.map((c) => `${c.id}@${c.version}`).join(", ");
  return `plugin ${plugin} ติดตั้งและเปิดอยู่ในเครื่อง (${list}) · ปิดก่อนรัน: claude plugin disable ${copies[0].id} · แล้วเปิดคืนหลังรันเสร็จ · หรือยืนยันว่าตัวรันไม่โหลดสำเนานี้ แล้วใส่ --allow-installed`;
}

export const hasHome = (home) => existsSync(join(home, "plugins", "installed_plugins.json"));
