#!/usr/bin/env bash
# วาง resources/landing.html ลงโฟลเดอร์ที่รัน · add_dirs แค่เปิดสิทธิ์อ่าน ไม่คัดลอกเข้า cwd ที่เริ่มว่างเสมอ (code.claude.com/docs/en/plugin-evals ตรวจ 2026-11-09)
set -euo pipefail
mkdir -p resources
cp "$(dirname "$0")/resources/landing.html" resources/landing.html
