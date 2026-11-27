#!/usr/bin/env bash
# คัดลอก resources/ ลงโฟลเดอร์ที่รัน · add_dirs แค่เปิดสิทธิ์อ่าน ไม่คัดลอกเข้า cwd ที่เริ่มว่างเสมอ
# security-audit-behaviour หา resources/shop-api ไม่เจอ ตก 6/6 (eval 2026-11-12)
set -euo pipefail
cp -R "$(dirname "$0")/resources" .
