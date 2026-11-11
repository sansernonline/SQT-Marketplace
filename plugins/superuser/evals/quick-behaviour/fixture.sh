#!/usr/bin/env bash
# โปรเจกต์ Node เล็ก 1 ฟังก์ชันที่มีบั๊ก + test ที่ล้ม · ไม่ต้องติดตั้งแพ็กเกจ (ใช้ node:assert)
set -euo pipefail
mkdir -p src test
cat > package.json <<'EOF'
{ "name": "shop-demo", "version": "1.0.0", "private": true, "scripts": { "test": "node test/discount.test.js" } }
EOF
cat > src/discount.js <<'EOF'
// คืนราคาหลังหักส่วนลด · percent เป็นเลข 0-100 เช่น 10 = 10%
function applyDiscount(price, percent) {
  return price - price * percent;
}

module.exports = { applyDiscount };
EOF
cat > test/discount.test.js <<'EOF'
const assert = require("node:assert");
const { applyDiscount } = require("../src/discount");

assert.strictEqual(applyDiscount(200, 10), 180);
assert.strictEqual(applyDiscount(99, 0), 99);
assert.strictEqual(applyDiscount(50, 100), 0);
console.log("ok 3/3");
EOF
