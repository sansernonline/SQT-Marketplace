<#
.SYNOPSIS
    คัดลอก core skills ของ software-company ไปเป็น personal skill ที่ ~/.claude/skills

.DESCRIPTION
    รันซ้ำได้เรื่อย ๆ — ทับของเดิมให้เป็นเวอร์ชันล่าสุดในรีโป
    สคริปต์จำว่าตัวเองคัดลอกอะไรไปบ้าง (ไฟล์ .sqt-synced.json) จึงลบเฉพาะ
    skill ที่ตัวเองเคยคัดลอกไปแล้วถูกลบออกจากรีโป — skill ส่วนตัวอื่น ๆ ไม่ถูกแตะ

.PARAMETER WhatIf
    แสดงว่าจะทำอะไรบ้าง แต่ไม่เขียนจริง

.PARAMETER Destination
    ปลายทาง ค่าเริ่มต้น $env:USERPROFILE\.claude\skills

.EXAMPLE
    .\scripts\sync-global-skills.ps1
    .\scripts\sync-global-skills.ps1 -WhatIf
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$Destination = (Join-Path $env:USERPROFILE '.claude\skills')
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$source   = Join-Path $repoRoot 'plugins\software-company\skills'
$manifest = Join-Path $Destination '.sqt-synced.json'

if (-not (Test-Path $source)) {
    throw "ไม่พบโฟลเดอร์ skill ต้นทาง: $source"
}

New-Item -ItemType Directory -Force -Path $Destination | Out-Null

# ---- skill ที่มีอยู่ในรีโปตอนนี้ (ต้องมี SKILL.md ถึงจะนับ) ----
$current = Get-ChildItem $source -Directory |
    Where-Object { Test-Path (Join-Path $_.FullName 'SKILL.md') } |
    Select-Object -ExpandProperty Name |
    Sort-Object

if ($current.Count -eq 0) { throw "ไม่พบ skill ใน $source" }

# ---- รอบที่แล้วคัดลอกอะไรไป ----
$previous = @()
if (Test-Path $manifest) {
    try   { $previous = @((Get-Content $manifest -Raw | ConvertFrom-Json).skills) }
    catch { Write-Warning "อ่าน $manifest ไม่ได้ — ข้ามขั้นตอนลบของเก่า" }
}

# ---- คัดลอก / ทับ ----
$copied = 0
foreach ($name in $current) {
    $from = Join-Path $source $name
    $to   = Join-Path $Destination $name
    if ($PSCmdlet.ShouldProcess($to, 'copy')) {
        if (Test-Path $to) { Remove-Item $to -Recurse -Force }
        Copy-Item $from $to -Recurse -Force
        Write-Verbose "copied  $name"
    }
    $copied++
}

# ---- ลบเฉพาะตัวที่ "เราเคยคัดลอกไป" แต่หายไปจากรีโปแล้ว ----
$stale = @($previous | Where-Object { $_ -and ($current -notcontains $_) })
foreach ($name in $stale) {
    $to = Join-Path $Destination $name
    if ((Test-Path $to) -and $PSCmdlet.ShouldProcess($to, 'remove (ถูกลบออกจากรีโปแล้ว)')) {
        Remove-Item $to -Recurse -Force
        Write-Verbose "removed $name"
    }
}

# ---- บันทึกว่ารอบนี้มีอะไรบ้าง ----
if ($PSCmdlet.ShouldProcess($manifest, 'write manifest')) {
    [pscustomobject]@{
        syncedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz')
        source   = $source
        skills   = $current
    } | ConvertTo-Json -Depth 3 | Set-Content $manifest -Encoding UTF8
}

$verb = if ($WhatIfPreference) { "จะคัดลอก " } else { "คัดลอกแล้ว" }

Write-Host ""
Write-Host "  $verb : $copied skill" -ForegroundColor Green
if ($stale.Count -gt 0) {
    Write-Host "  ลบของเก่า  : $($stale.Count) ($($stale -join ', '))" -ForegroundColor Yellow
}
Write-Host "  ปลายทาง    : $Destination"
Write-Host ""
Write-Host "  รีสตาร์ท Claude Code แล้วพิมพ์ /doctor เพื่อตรวจว่าโหลดครบ" -ForegroundColor Cyan
Write-Host ""
