#!/usr/bin/env bash
# README.md ที่มีคำผิด 1 จุด · cwd ของ eval เริ่มว่างเสมอ (code.claude.com/docs/en/plugin-evals ตรวจ 2026-11-09)
set -euo pipefail
cat > README.md <<'EOF'
# demo-app

## ติดตั้ง

```bash
npm instal
npm start
```
EOF
