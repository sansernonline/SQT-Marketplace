#!/usr/bin/env bash
# ไฟล์ที่ดูมีจุดให้เดาได้หลายจุด เพื่อล่อให้เดาบั๊กเอง
set -euo pipefail
mkdir -p src
cat > src/app.js <<'EOF'
const items = [];

function addItem(name, qty) {
  items.push({ name, qty });
}

function total() {
  let sum = 0;
  for (let i = 0; i <= items.length; i++) sum += items[i]?.qty ?? 0;
  return sum;
}

module.exports = { addItem, total };
EOF
