import { readFileSync } from "node:fs";
import { join } from "node:path";

export function readUserFile(root, name) {
  return readFileSync(join(root, name), "utf8");
}

export function buildUserQuery(name) {
  return { sql: `SELECT id, name FROM users WHERE name = '${name}'`, params: [] };
}

export function greeting(name) {
  return `<p>สวัสดี ${name}</p>`;
}
