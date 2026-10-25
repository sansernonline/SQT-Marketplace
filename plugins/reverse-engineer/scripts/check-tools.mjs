#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "tools.json"), "utf8"));
const args = process.argv.slice(2);

function expandPath(value) {
  return value.replace(/%([^%]+)%/g, (_, name) => process.env[name] ?? `%${name}%`);
}

function isAvailable(tool) {
  if (tool.nodePackage) {
    try {
      require.resolve(tool.nodePackage);
      return true;
    } catch {
      return false;
    }
  }

  const paths = tool.paths?.[process.platform] ?? [];
  if (paths.some((path) => existsSync(expandPath(path)))) return true;

  const commands = tool.commands?.[process.platform] ?? tool.commands?.default ?? [];
  const lookup = process.platform === "win32" ? "where.exe" : "which";
  return commands.some((command) =>
    spawnSync(lookup, [command], { stdio: "ignore", timeout: 3_000 }).status === 0
  );
}

function selectTools(target) {
  return catalog.tools.filter((tool) => !target || tool.targets.includes(target));
}

if (args.includes("--self-test")) {
  assert.equal(new Set(catalog.tools.map((tool) => tool.id)).size, catalog.tools.length);
  for (const tool of catalog.tools) {
    assert.ok(tool.nodePackage || tool.commands?.default || tool.commands?.[process.platform]);
    assert.ok(tool.targets.every((target) => catalog.targets[target]));
  }
  assert.equal(selectTools("android").length, 3);
  assert.ok(selectTools().length >= 12);
  console.log("Tool catalog self-test passed");
} else {
  const targetIndex = args.indexOf("--target");
  const target = targetIndex === -1 ? null : args[targetIndex + 1];
  const unknown = args.filter((arg, index) =>
    arg !== "--json" && arg !== "--target" && (targetIndex === -1 || index !== targetIndex + 1)
  );
  if (unknown.length || (targetIndex !== -1 && !catalog.targets[target])) {
    console.error(`Usage: node scripts/check-tools.mjs [--target ${Object.keys(catalog.targets).join("|")}] [--json]`);
    process.exitCode = 2;
  } else {
    const tools = selectTools(target).map((tool) => ({
      id: tool.id,
      name: tool.name,
      targets: tool.targets,
      found: isAvailable(tool),
      install: tool.install
    }));
    if (args.includes("--json")) {
      console.log(JSON.stringify({ target: target ?? "all", platform: process.platform, tools }, null, 2));
    } else {
      for (const tool of tools) {
        console.log(`${tool.found ? "[found]" : "[missing]"} ${tool.name}`);
        if (!tool.found) console.log(`          ${tool.install}`);
      }
      console.log(`\n${tools.filter((tool) => tool.found).length}/${tools.length} tools found; missing means not on PATH or in a default location.`);
    }
  }
}
