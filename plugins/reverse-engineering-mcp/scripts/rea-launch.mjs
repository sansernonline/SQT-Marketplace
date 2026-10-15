#!/usr/bin/env node
// เปิด REA MCP server (stdio) ด้วยรุ่นที่ล็อกไว้ — .mcp.json ของ plugin เรียกไฟล์นี้ด้วย node
//
//   node rea-launch.mjs           เปิด server (Claude Code เรียกเอง)
//   node rea-launch.mjs --print   พิมพ์คำสั่ง โฟลเดอร์ที่ใช้รัน (cwd) และ env ที่เพิ่ม แล้วออก ไม่ดาวน์โหลด ไม่รันอะไร
//
// ทำไมไม่เรียก npx ตรง ๆ ใน .mcp.json: บน Windows npx เป็นไฟล์ .cmd ซึ่ง spawn แบบไม่ผ่าน shell ไม่ได้
// (REA เองให้ห่อด้วย cmd.exe /d /c) แต่ .mcp.json ของ plugin มีไฟล์เดียวใช้ทุกระบบ
// ไฟล์นี้จึงหา npx-cli.js ที่มากับ node แล้วรันด้วย node ตรง ๆ (shell: false) ทุกระบบ
// stdout เป็นช่องของ MCP — ข้อความทุกอย่างของไฟล์นี้ออกทาง stderr เท่านั้น (ยกเว้น --print)
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// รุ่นที่ล็อกไว้ — ที่เดียวในโค้ด · ขึ้นรุ่นต้องแก้ skill ตามด้วย (validate-marketplace ตรวจว่าตรงกัน)
export const REA_PACKAGE = "rea-agents@6.5.0";
const ARGS = ["-y", REA_PACKAGE, "mcp"];

// env ที่เพิ่มให้ npx:
// - registry ทางการเสมอ ไม่ใช้ registry ที่ .npmrc ของโปรเจกต์หรือเครื่องตั้งไว้
// - ปิด install script ของ dependency (เช่น frida ที่โหลด binding native) → tool Frida ใช้ไม่ได้ ตั้งใจให้เป็นแบบนั้น
export const EXTRA_ENV = {
  npm_config_registry: "https://registry.npmjs.org/",
  npm_config_ignore_scripts: "true",
};

// rea-agents 6.5.0 ต้องการ Node ^22.19.0 || ^24.11.0 || >=26 (package.json "engines")
export function nodeSupported(version) {
  const [major, minor] = version.replace(/^v/, "").split(".").map(Number);
  return (major === 22 && minor >= 19) || (major === 24 && minor >= 11) || major >= 26;
}

// npx-cli.js ที่ติดมากับ node: Windows อยู่ข้าง node.exe · macOS/Linux อยู่ใน <prefix>/lib
export function findNpxCli(execPath = process.execPath) {
  const dir = dirname(execPath);
  return [
    join(dir, "node_modules", "npm", "bin", "npx-cli.js"),
    join(dir, "..", "lib", "node_modules", "npm", "bin", "npx-cli.js"),
  ].find((p) => existsSync(p));
}

// รันจากโฟลเดอร์ข้อมูลของ plugin หรือโฟลเดอร์ชั่วคราว ไม่ใช่โฟลเดอร์โปรเจกต์
// เพื่อไม่ให้ npx อ่าน .npmrc หรือ package.json ของโปรเจกต์ที่อาจมาจากคนอื่น
export function workDir(env = process.env) {
  return env.CLAUDE_PLUGIN_DATA || tmpdir();
}

export function plan(platform = process.platform, execPath = process.execPath, env = process.env) {
  const cwd = workDir(env);
  const cli = findNpxCli(execPath);
  if (cli) return { command: execPath, args: [cli, ...ARGS], cwd };
  // ไม่เจอ npx-cli.js (เช่น node จาก nvm-windows หรือ volta) → ใช้ npx บน PATH
  // Windows ต้องผ่าน cmd.exe ด้วย path เต็ม (ไม่ให้ไปเจอ cmd.exe ปลอมในโฟลเดอร์ปัจจุบัน) · argument เป็นค่าคงที่ทั้งหมด
  if (platform === "win32") {
    const cmd = join(env.SystemRoot ?? "C:\Windows", "System32", "cmd.exe");
    return { command: cmd, args: ["/d", "/s", "/c", "npx", ...ARGS], cwd };
  }
  return { command: "npx", args: ARGS, cwd };
}

function main() {
  const { command, args, cwd } = plan();
  if (process.argv.includes("--print")) {
    console.log(JSON.stringify({ node: process.version, supported: nodeSupported(process.version), command, args, cwd, env: EXTRA_ENV }));
    return;
  }
  if (!nodeSupported(process.version)) {
    console.error(`[reverse-engineering-mcp] Node ${process.version} ใช้กับ ${REA_PACKAGE} ไม่ได้ — ต้อง 22.19+ · 24.11+ หรือ 26+`);
    process.exit(1);
  }
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...EXTRA_ENV },
    stdio: "inherit",
    shell: false,
    windowsHide: true,
  });
  child.on("error", (e) => {
    console.error(`[reverse-engineering-mcp] เปิด ${REA_PACKAGE} ไม่ได้: ${e.message}`);
    process.exit(1);
  });
  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
  child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
