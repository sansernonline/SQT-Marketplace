#!/usr/bin/env node
// PreToolUse hook — tool ของ REA ที่รันโค้ดเป้าหมาย แตะ process ที่กำลังรัน แก้อุปกรณ์ Android หรืออ่านของที่กำลังรันอยู่ ต้องให้ผู้ใช้กดยืนยันทุกครั้ง
// ตอบ "ask" → Claude Code ขึ้นหน้าถาม (โหมด auto ก็ต้องถาม) · tool อื่นของ REA ออกเงียบ ๆ ให้ไปตามสิทธิ์ปกติ
// รายชื่อมาจาก src/contracts/toolEffects.ts ของ rea-agents 6.5.0 (ธง executesForeignCode · mutatesDevice · mutatesTarget ที่แตะ process จริง)
// บวก tool ที่อ่านหน้าเว็บ แอป หรืออุปกรณ์ที่กำลังรันอยู่ (READS_LIVE) ซึ่งไม่มีธงแต่เห็นข้อมูลสดของผู้ใช้
// รายละเอียดและเลขบรรทัด → skills/reverse-engineer-anything/references/tool-permissions.md · ขึ้นรุ่น REA ต้องเทียบรายชื่อใหม่
// matcher ใน hooks.json จับทั้งชื่อจาก plugin (mcp__plugin_reverse-engineering-mcp_rea__) และ REA ที่ลงทะเบียนเองชื่อ rea (mcp__rea__)
//
//   node ask-before-run.mjs --self-test   ตรวจว่าตอบถูกโดยไม่ต้องมี Claude Code
import { readFileSync } from "node:fs";

export const RUNS_TARGET = [
  "cutter_command", "gdb_console", "start_rizin_debug_session", "rizin_debug_command", "close_rizin_debug_session",
  "close_gdb_session", "execute_rizin_command", "load_frida_script", "resume_frida_session", "instrument_with_frida",
  "capture_native_ui_scenario", "observe_native_calls", "capture_browser_scenario", "capture_electron_scenario",
  "capture_process_scenario",
];
export const CHANGES_DEVICE = [
  "push_adb_file", "install_adb_package", "uninstall_adb_package", "start_adb_app", "start_adb_activity", "stop_adb_app",
];
export const TOUCHES_LIVE_PROCESS = ["start_frida_session", "unload_frida_script", "close_frida_session", "observe_web_execution"];
export const READS_LIVE = [
  "observe_web_session", "inspect_web_page", "inspect_electron_page", "capture_web_screenshot",
  "pull_adb_file", "pull_adb_package", "read_adb_logcat", "collect_adb_bugreport", "capture_adb_screen",
];

const GROUPS = [["run", RUNS_TARGET], ["device", CHANGES_DEVICE], ["live", TOUCHES_LIVE_PROCESS], ["read", READS_LIVE]];

const REASON = {
  run: "tool นี้รันโค้ดของเป้าหมายจริงบนเครื่องนี้ (ใช้สิทธิ์ผู้ใช้เต็ม ไม่มี sandbox) · เป้าหมายที่ไม่รู้ที่มาให้ตอบ no · server ของ plugin นี้รันบนเครื่องเสมอ ถ้าต้องรันเป้าหมายแบบนั้นให้ติดตั้ง rea-agents@6.5.0 แยกใน docker-sandbox แล้วรันใน container",
  device: "tool นี้แก้อุปกรณ์ Android ที่ต่ออยู่ (ติดตั้ง ลบ ส่งไฟล์ เปิดหรือปิดแอป) · ยืนยันว่าเป็นเครื่องทดสอบของคุณเอง",
  live: "tool นี้เกาะหรือเปลี่ยนสถานะ process หรือหน้าเว็บที่กำลังรันอยู่ · ยืนยันว่าเป็นของคุณและพร้อมให้แตะ",
  read: "tool นี้อ่านข้อมูลสดจากหน้าเว็บ แอป Electron หรืออุปกรณ์ Android ที่กำลังใช้อยู่ (หน้าจอ log ไฟล์ แพ็กเกจ ทราฟฟิก) ซึ่งอาจมีข้อมูลส่วนตัว · ยืนยันว่าอนุญาตให้อ่าน",
};

const ask = (reason) => ({
  hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason: `[reverse-engineering-mcp] ${reason}` },
});

export function decide(toolName = "") {
  const tool = String(toolName).split("__").pop();
  const kind = GROUPS.find(([, list]) => list.includes(tool))?.[0];
  return kind ? ask(`${tool}: ${REASON[kind]}`) : null;
}

// อ่าน input ของ hook · ไม่ใช่ JSON หรือไม่มี tool_name ที่เป็นข้อความ → ถามไว้ก่อน ดีกว่าปล่อยผ่าน
export function decideFromInput(raw) {
  let name;
  try {
    name = JSON.parse(raw)?.tool_name;
  } catch {
    name = undefined;
  }
  if (typeof name !== "string" || !name) return ask("อ่านชื่อ tool ไม่ได้ จึงขอให้ยืนยันก่อน");
  return decide(name);
}

function selfTest() {
  const prefixes = ["mcp__plugin_reverse-engineering-mcp_rea__", "mcp__rea__"];
  const cases = [];
  for (const p of prefixes) {
    for (const [, list] of GROUPS) for (const t of list) cases.push([() => decide(p + t), "ask", p + t]);
    for (const t of ["analyze_javascript_application", "open_binary", "set_comment", "annotate_native_function"]) {
      cases.push([() => decide(p + t), null, p + t]);
    }
  }
  cases.push([() => decide("Bash"), null, "Bash"]);
  for (const raw of ["", "not json", "{}", '{"tool_name":42}', '{"tool_name":""}', "null"]) {
    cases.push([() => decideFromInput(raw), "ask", `input ${JSON.stringify(raw)}`]);
  }
  cases.push([() => decideFromInput('{"tool_name":"mcp__rea__open_binary"}'), null, "input open_binary"]);
  cases.push([() => decideFromInput('{"tool_name":"mcp__rea__gdb_console"}'), "ask", "input gdb_console"]);

  const bad = cases.filter(([run, want]) => (run()?.hookSpecificOutput.permissionDecision ?? null) !== want).map((c) => c[2]);
  const total = GROUPS.reduce((n, [, list]) => n + list.length, 0);
  const unique = new Set(GROUPS.flatMap(([, list]) => list)).size;
  const EXPECTED = 25 + 9; // 15 รันเป้าหมาย + 6 แก้อุปกรณ์ + 4 แตะ process + 9 อ่านของที่รันอยู่
  if (total !== EXPECTED) bad.push(`จำนวน tool ${total} ไม่ใช่ ${EXPECTED}`);
  if (unique !== total) bad.push(`มีชื่อซ้ำข้ามกลุ่ม (${total - unique})`);
  console.log(bad.length ? `❌ ${bad.join(", ")}` : `✅ self-test ${cases.length}/${cases.length} · ถาม ${total} tool`);
  process.exit(bad.length ? 1 : 0);
}

if (process.argv.includes("--self-test")) selfTest();
else {
  let raw = "";
  try {
    raw = readFileSync(0, "utf8");
  } catch {
    raw = "";
  }
  const out = decideFromInput(raw);
  if (out) process.stdout.write(JSON.stringify(out));
  process.exit(0);
}
