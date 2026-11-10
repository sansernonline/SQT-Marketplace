// tidy-notes: ย้ายไฟล์โน้ต Markdown ที่ตั้งชื่อมั่วให้เป็น YYYY-MM-DD-<หัวเรื่อง>.md
import { parseArgs } from "@std/cli/parse-args";
import { walk } from "@std/fs/walk";

const args = parseArgs(Deno.args, { boolean: ["dry-run", "help"], string: ["dir"], default: { dir: "." } });
if (args.help) {
  console.log("tidy-notes [--dir <folder>] [--dry-run]");
  Deno.exit(0);
}
for await (const e of walk(args.dir, { exts: [".md"], includeDirs: false })) {
  const text = await Deno.readTextFile(e.path);
  const title = (text.match(/^#\s+(.+)$/m)?.[1] ?? "untitled").trim().toLowerCase().replace(/\s+/g, "-");
  const date = (await Deno.stat(e.path)).mtime?.toISOString().slice(0, 10) ?? "0000-00-00";
  const target = `${e.path.slice(0, e.path.length - e.name.length)}${date}-${title}.md`;
  if (target === e.path) continue;
  console.log(`${e.path} -> ${target}`);
  if (!args["dry-run"]) await Deno.rename(e.path, target);
}
