import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";

export function readUserFile(root, name) {
  const base = resolve(root), p = resolve(base, String(name));
  if (p !== base && !p.startsWith(base + sep)) throw new Error("path นอกโฟลเดอร์ที่อนุญาต");
  return readFileSync(p, "utf8");
}

export function buildUserQuery(name) {
  return { sql: "SELECT id, name FROM users WHERE name = ?", params: [String(name)] };
}

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export function greeting(name) {
  return `<p>สวัสดี ${String(name).replace(/[&<>"']/g, (c) => ESC[c])}</p>`;
}
