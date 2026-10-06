#!/usr/bin/env bash
# ติดตั้งกฎประจำตัวลง ~/.claude/ — รันครั้งเดียวต่อเครื่อง
# ใช้:  bash scripts/install-global-rules.sh
set -euo pipefail

src="$(cd "$(dirname "$0")" && pwd)/CLAUDE.global.md"
dest="$HOME/.claude"
file="$dest/CLAUDE.md"

mkdir -p "$dest"

if [ -f "$file" ]; then
  backup="$dest/CLAUDE.md.bak-$(date +%Y-%m-%d-%H%M%S)"
  cp "$file" "$backup"
  echo "สำรองไฟล์เดิมไว้ที่ $backup"
fi

cp "$src" "$file"
echo "ติดตั้งแล้ว -> $file"
echo "เปิด Claude Code ใหม่ หรือพิมพ์ /memory เพื่อตรวจ"
