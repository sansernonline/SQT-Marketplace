import { readdirSync, lstatSync, unlinkSync } from "node:fs";
import { join } from "node:path";
const a = process.argv.slice(2), get = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const dir = get("--dir"), daysS = get("--days"), dry = a.includes("--dry-run");
if (!dir || !daysS || !/^[1-9]\d*$/.test(daysS)) { console.error("usage: --dir <d> --days <N> [--dry-run]"); process.exit(2); }
const cut = Date.now() - Number(daysS) * 86400000, hits = [];
const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) {
  const p = join(d, e.name);
  if (e.isSymbolicLink()) continue;
  if (e.isDirectory()) { if (e.name !== "keep") walk(p); continue; }
  if (e.isFile() && e.name.endsWith(".log") && lstatSync(p).mtimeMs < cut) hits.push(p);
} };
walk(dir);
for (const p of hits) { if (dry) console.log(p); else unlinkSync(p); }
console.log(`${dry ? "would delete" : "deleted"} ${hits.length}`);
