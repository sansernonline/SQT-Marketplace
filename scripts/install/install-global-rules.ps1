# ติดตั้งกฎประจำตัวลง ~/.claude/ — รันครั้งเดียวต่อเครื่อง
# ใช้ (จากรากของ repo):  powershell -ExecutionPolicy Bypass -File .\scripts\install\install-global-rules.ps1

$ErrorActionPreference = "Stop"
$src  = Join-Path $PSScriptRoot "CLAUDE.global.md"
$dest = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$file = Join-Path $dest "CLAUDE.md"

New-Item -ItemType Directory -Force -Path $dest | Out-Null

if (Test-Path $file) {
    $backup = Join-Path $dest ("CLAUDE.md.bak-" + (Get-Date -Format "yyyy-MM-dd-HHmmss"))
    Copy-Item $file $backup
    Write-Host "สำรองไฟล์เดิมไว้ที่ $backup"
}

Copy-Item $src $file -Force
Write-Host "ติดตั้งแล้ว -> $file"
node (Join-Path $PSScriptRoot "set-skill-budget.mjs")
if ($LASTEXITCODE -ne 0) { Write-Host "ตั้งงบรายการ skill ไม่สำเร็จ (ต้องมี node) — รัน node scripts\install\set-skill-budget.mjs เอง" }
Write-Host "เปิด Claude Code ใหม่ หรือพิมพ์ /memory เพื่อตรวจ"
