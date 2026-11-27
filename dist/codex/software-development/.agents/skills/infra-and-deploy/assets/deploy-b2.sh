#!/usr/bin/env bash
# แม่แบบ deploy เว็บ static ขึ้น Backblaze B2 ด้วย b2 CLI · skill backblaze-b2
# ใช้: B2_BUCKET=... B2_KEY_ID=... B2_APPLICATION_KEY=... bash deploy-b2.sh [โฟลเดอร์ build=dist] [prefix ปลายทาง=ว่าง]
# ตัวแปรเสริม: KEEP_DAYS (ค่าเริ่มต้น 30) · ALLOW_DELETE=1 · ALLOW_SOURCEMAPS=1
# ยังไม่ได้รันกับ b2 จริง · b2 CLI ไม่มี dry-run ในเอกสาร ให้ลองกับ bucket ทดสอบก่อน
set -euo pipefail

BUILD_DIR="${1:-dist}"
PREFIX="${2:-}"

# ชื่อคำสั่ง authorize และตัวแปร env ของ key ยังไม่ได้ตรวจกับเอกสาร
# ให้ตรวจ `b2 --help` ของรุ่นที่ติดตั้ง แล้วเติมใน authorize() และเปลี่ยนเป็น 1
AUTHORIZE_FILLED=0

authorize() {
  # TODO(เจ้าของโปรเจกต์): เติมคำสั่ง authorize ของ b2 รุ่นที่ติดตั้ง โดยใช้ $B2_KEY_ID และ $B2_APPLICATION_KEY
  # ห้ามพิมพ์ค่า key ออก log
  :
}

require_env() {
  local missing=()
  for name in B2_BUCKET B2_KEY_ID B2_APPLICATION_KEY; do
    [ -n "${!name:-}" ] || missing+=("$name")
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    echo "ขาดตัวแปร env: ${missing[*]}" >&2
    exit 1
  fi
}

require_build_dir() {
  if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR")" ]; then
    echo "โฟลเดอร์ build ไม่มีหรือว่าง: $BUILD_DIR" >&2
    exit 1
  fi
}

# ไฟล์ลับหลุดขึ้น bucket สาธารณะ = ใครก็โหลดได้ จึงหยุดก่อน sync
block_secret_files() {
  local patterns=(-name '.env*' -o -name '*.pem' -o -name '*.key' -o -name '*.pfx' -o -name 'id_rsa*' -o -name 'credentials*' -o -path '*/.git/*')
  [ "${ALLOW_SOURCEMAPS:-}" = "1" ] || patterns+=(-o -name '*.map')
  local found
  found="$(find "$BUILD_DIR" -type f \( "${patterns[@]}" \))"
  if [ -n "$found" ]; then
    echo "พบไฟล์ที่ไม่ควรขึ้น bucket:" >&2
    echo "$found" >&2
    echo "(source map อนุญาตได้ด้วย ALLOW_SOURCEMAPS=1)" >&2
    exit 1
  fi
}

require_env
require_build_dir
block_secret_files

if [ "$AUTHORIZE_FILLED" != "1" ]; then
  echo "ยังไม่ได้เติม authorize() ในสคริปต์นี้ · ตรวจ b2 --help แล้วเติม และตั้ง AUTHORIZE_FILLED=1" >&2
  exit 1
fi
authorize

sync_args=(--keep-days "${KEEP_DAYS:-30}" --replace-newer)
if [ "${ALLOW_DELETE:-}" = "1" ]; then
  echo "คำเตือน: --delete จะลบไฟล์ปลายทางที่ไม่อยู่ในต้นทาง และลบเวอร์ชันเก่าของไฟล์ที่อัปเดตด้วย ย้อนกลับไม่ได้" >&2
  sync_args+=(--delete)
fi

b2 sync "${sync_args[@]}" "$BUILD_DIR" "b2://$B2_BUCKET/$PREFIX"

echo "sync จบแล้ว"
echo "ยังต้องทำเอง: ตรวจว่าเว็บตอบ HTTP 200 และ purge แคช CDN (เช่น Cloudflare)"
