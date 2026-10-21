#!/usr/bin/env bash
# ติดตั้งกฎประจำตัวลง ~/.claude/ — รันครั้งเดียวต่อเครื่อง
# ใช้:  bash scripts/install/install-global-rules.sh
set -euo pipefail

src="$(cd "$(dirname "$0")" && pwd)/CLAUDE.global.md"
dest="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
file="$dest/CLAUDE.md"

mkdir -p "$dest"

if [ -f "$file" ]; then
  backup="$dest/CLAUDE.md.bak-$(date +%Y-%m-%d-%H%M%S)"
  cp "$file" "$backup"
  echo "สำรองไฟล์เดิมไว้ที่ $backup"
fi

cp "$src" "$file"
echo "ติดตั้งแล้ว -> $file"
node "$(cd "$(dirname "$0")" && pwd)/set-skill-budget.mjs" || echo "ตั้งงบรายการ skill ไม่สำเร็จ (ต้องมี node) — รัน node scripts/install/set-skill-budget.mjs เอง"
echo "เปิด Claude Code ใหม่ หรือพิมพ์ /memory เพื่อตรวจ"
