#!/usr/bin/env node
// ตัวเรียก status line ของ superuser · คัดลอกไปไว้ที่ ~/.claude/superuser/statusline.mjs แล้วตั้งใน ~/.claude/settings.json:
//   "statusLine": { "type": "command", "command": "node \"<home>/.claude/superuser/statusline.mjs\"", "refreshInterval": 60 }
// path ของ plugin เปลี่ยนทุกรุ่น ตัวเรียกนี้จึงหา hooks/statusline.mjs ในรุ่นใหม่สุดที่ติดตั้งไว้เอง ไม่ต้องแก้ settings ทุกครั้งที่อัปเดต
// หาไม่เจอ (ยังไม่ได้ติดตั้ง superuser รุ่นที่มีไฟล์นี้) → แสดงแค่ model · โฟลเดอร์
import { readdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const plugins = join(homedir(), ".claude", "plugins");
const cache = join(plugins, "cache", "sqt-marketplace", "superuser");
const ver = (v) => v.split(".").map(Number);
const byVer = (a, b) => { const [x, y] = [ver(a), ver(b)]; return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
const versions = existsSync(cache) ? readdirSync(cache).filter((v) => /^\d+\.\d+\.\d+$/.test(v)).sort(byVer).reverse() : [];
const candidates = [
  ...versions.map((v) => join(cache, v, "hooks", "statusline.mjs")),
  join(plugins, "marketplaces", "sqt-marketplace", "plugins", "superuser", "hooks", "statusline.mjs"),
];
const found = candidates.find((p) => existsSync(p));

if (found) {
  const { main } = await import(pathToFileURL(found).href);
  await main();
} else {
  let text = "";
  for await (const chunk of process.stdin) text += chunk;
  let input = {};
  try { input = JSON.parse(text) ?? {}; } catch { /* ข้อมูลเสีย */ }
  const dir = String(input.workspace?.current_dir ?? input.cwd ?? "").split(/[\\/]/).filter(Boolean).at(-1);
  console.log([input.model?.display_name, dir].filter(Boolean).join(" · "));
}
