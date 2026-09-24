<#
.SYNOPSIS
    ติดตั้ง SQT-Marketplace เข้า Claude Code และ Cowork จากเครื่องนี้

.DESCRIPTION
    รันซ้ำได้เรื่อย ๆ — ถ้าลงไว้แล้วจะข้าม ไม่ลงซ้ำ
    อ่านชื่อ marketplace และรายชื่อ plugin จาก .claude-plugin/marketplace.json เอง
    ไม่ได้ hardcode ไว้ เพิ่ม plugin ใหม่ในรีโปแล้วรันสคริปต์นี้ซ้ำได้เลย

    ทำสองทาง แล้วแต่ว่าเครื่องนี้มีอะไร
      1) ถ้ามีคำสั่ง claude อยู่ใน PATH  — ใช้ claude plugin ... ซึ่งเป็นทางที่เป็นทางการ
      2) ถ้าไม่มี                        — เขียนลง settings.json ให้เอง (ผลลัพธ์เดียวกัน)

    Claude Code กับ Cowork บนเครื่องเดียวกันใช้ไฟล์ตั้งค่าชุดเดียวกัน
    ลงครั้งเดียวจึงเห็นทั้งสองที่ แต่ต้องปิดแล้วเปิดใหม่ทั้งคู่

.PARAMETER Plugins
    ชื่อ plugin ที่จะติดตั้ง คั่นด้วยจุลภาค ค่าเริ่มต้นคือ software-company ตัวเดียว
    ใส่ * หรือใช้ -All เพื่อเอาทั้งหมด

.PARAMETER All
    ติดตั้งทุก plugin ที่ประกาศไว้ใน marketplace.json

.PARAMETER Scope
    user (ค่าเริ่มต้น) = ใช้ได้ทุกโปรเจกต์บนเครื่องนี้
    project           = ผูกกับโปรเจกต์ที่อยู่ตอนนี้ commit ขึ้น git ให้ทีมได้
    local             = เฉพาะเครื่องนี้ ไม่ขึ้น git

.PARAMETER SkipValidate
    ข้ามการตรวจ validate-marketplace.mjs ก่อนติดตั้ง

.PARAMETER WhatIf
    แสดงว่าจะทำอะไรบ้าง แต่ไม่เขียนจริง — รันอันนี้ก่อนเสมอตอนใช้ครั้งแรก

.EXAMPLE
    .\scripts\install-marketplace.ps1 -WhatIf
    .\scripts\install-marketplace.ps1
    .\scripts\install-marketplace.ps1 -All
    .\scripts\install-marketplace.ps1 -Plugins software-company,software-company-healthcare
    .\scripts\install-marketplace.ps1 -Scope project
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string[]]$Plugins = @('software-company'),
    [switch]$All,
    [ValidateSet('user','project','local')]
    [string]$Scope = 'user',
    [switch]$SkipValidate
)

$ErrorActionPreference = 'Stop'

$repoRoot    = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $repoRoot '.claude-plugin\marketplace.json'

if (-not (Test-Path $manifestPath)) {
    throw "ไม่พบ $manifestPath — สคริปต์นี้ต้องอยู่ในโฟลเดอร์ scripts\ ของ marketplace"
}

$mk = Get-Content $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$marketName = $mk.name
if ([string]::IsNullOrWhiteSpace($marketName)) { throw "marketplace.json ไม่มีค่า name" }

$available = @($mk.plugins | ForEach-Object { $_.name })
if ($available.Count -eq 0) { throw "marketplace.json ไม่มี plugin สักตัว" }

# ---- เลือกว่าจะลงตัวไหน ----
if ($All -or $Plugins -contains '*') {
    $want = $available
} else {
    $want = @($Plugins)
    $unknown = @($want | Where-Object { $available -notcontains $_ })
    if ($unknown.Count -gt 0) {
        throw "ไม่รู้จัก plugin: $($unknown -join ', ')`nที่มีให้เลือก: $($available -join ', ')"
    }
}

# ---- ตรวจก่อนติดตั้ง ----
$validator = Join-Path $repoRoot 'scripts\validate-marketplace.mjs'
if (-not $SkipValidate -and (Test-Path $validator) -and (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  ตรวจ marketplace ก่อน..." -ForegroundColor Cyan
    & node $validator | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "validate-marketplace.mjs เจอ error — แก้ก่อนติดตั้ง หรือใช้ -SkipValidate ถ้าจงใจ"
    }
}

$claude = Get-Command claude -ErrorAction SilentlyContinue
$mode   = if ($claude) { 'cli' } else { 'settings' }

Write-Host ""
Write-Host "  marketplace : $marketName" -ForegroundColor Green
Write-Host "  ที่อยู่       : $repoRoot"
Write-Host "  จะติดตั้ง    : $($want -join ', ')"
Write-Host "  ขอบเขต      : $Scope"
Write-Host "  วิธี         : $(if ($mode -eq 'cli') { 'คำสั่ง claude' } else { 'เขียน settings.json เอง (ไม่พบคำสั่ง claude ใน PATH)' })"
Write-Host ""

$installed = @()
$skipped   = @()

if ($mode -eq 'cli') {
    # ---- ทาง 1: ใช้คำสั่ง claude ----
    $known = @()
    try { $known = @((& claude plugin marketplace list 2>$null) -split "`n") } catch { }
    $alreadyAdded = @($known | Where-Object { $_ -match [regex]::Escape($marketName) }).Count -gt 0

    if ($alreadyAdded) {
        Write-Host "  marketplace ลงทะเบียนไว้แล้ว — ข้าม" -ForegroundColor DarkGray
    } elseif ($PSCmdlet.ShouldProcess($marketName, 'claude plugin marketplace add')) {
        & claude plugin marketplace add "$repoRoot" | Out-Host
        if ($LASTEXITCODE -ne 0) { throw "claude plugin marketplace add ล้มเหลว" }
    }

    foreach ($p in $want) {
        $ref = "$p@$marketName"
        if ($PSCmdlet.ShouldProcess($ref, "claude plugin install --scope $Scope")) {
            & claude plugin install $ref --scope $Scope --yes | Out-Host
            if ($LASTEXITCODE -eq 0) { $installed += $ref } else { $skipped += $ref }
        } else {
            $installed += $ref
        }
    }
}
else {
    # ---- ทาง 2: เขียน settings.json เอง ----
    $settingsPath = switch ($Scope) {
        'user'    { Join-Path $env:USERPROFILE '.claude\settings.json' }
        'project' { Join-Path (Get-Location) '.claude\settings.json' }
        'local'   { Join-Path (Get-Location) '.claude\settings.local.json' }
    }

    $settings = [pscustomobject]@{}
    if (Test-Path $settingsPath) {
        $raw = Get-Content $settingsPath -Raw -Encoding UTF8
        if (-not [string]::IsNullOrWhiteSpace($raw)) {
            try { $settings = $raw | ConvertFrom-Json }
            catch { throw "$settingsPath ไม่ใช่ JSON ที่อ่านได้ — แก้ไฟล์ก่อน สคริปต์จะไม่ทับให้" }
        }
    }

    # หา node ลูก ถ้ายังไม่มีก็สร้าง — ต้องเช็กด้วย Properties[$key] ไม่ใช่ .Name.Contains()
    # เพราะ object เปล่า ๆ จะได้ .Name เป็น null แล้วเรียก .Contains() ไม่ได้
    function Get-OrAddNode([object]$obj, [string]$key) {
        if ($null -eq $obj.PSObject.Properties[$key]) {
            $obj | Add-Member -NotePropertyName $key -NotePropertyValue ([pscustomobject]@{}) -Force
        }
        return $obj.$key
    }
    function Set-Node([object]$obj, [string]$key, [object]$value) {
        $obj | Add-Member -NotePropertyName $key -NotePropertyValue $value -Force
    }

    $markets = Get-OrAddNode $settings 'extraKnownMarketplaces'
    Set-Node $markets $marketName ([pscustomobject]@{
        source = [pscustomobject]@{
            source = 'directory'
            path   = $repoRoot
        }
    })

    $enabled = Get-OrAddNode $settings 'enabledPlugins'
    foreach ($p in $want) {
        Set-Node $enabled "$p@$marketName" $true
        $installed += "$p@$marketName"
    }

    $dir = Split-Path -Parent $settingsPath
    if ($PSCmdlet.ShouldProcess($settingsPath, 'write settings')) {
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        if (Test-Path $settingsPath) {
            Copy-Item $settingsPath "$settingsPath.bak" -Force
        }
        $settings | ConvertTo-Json -Depth 20 | Set-Content $settingsPath -Encoding UTF8
    }
    Write-Host "  เขียนลง     : $settingsPath" -ForegroundColor DarkGray
    if (Test-Path "$settingsPath.bak") { Write-Host "  สำรองเดิมไว้ : $settingsPath.bak" -ForegroundColor DarkGray }
}

# ---- สรุป ----
$verb = if ($WhatIfPreference) { 'จะติดตั้ง' } else { 'ติดตั้งแล้ว' }
Write-Host ""
Write-Host "  $verb : $($installed.Count) plugin" -ForegroundColor Green
foreach ($i in $installed) { Write-Host "     $i" }
if ($skipped.Count -gt 0) {
    Write-Host "  ล้มเหลว  : $($skipped -join ', ')" -ForegroundColor Red
}
Write-Host ""
Write-Host "  ขั้นต่อไป" -ForegroundColor Cyan
Write-Host "     1. ปิดแล้วเปิด Claude Code ใหม่ แล้วพิมพ์ /doctor เพื่อดูว่าโหลดครบ"
Write-Host "     2. ปิดแล้วเปิดแอป Cowork ใหม่ แล้วเปิดแชตใหม่ — skill จะขึ้นเป็น <plugin>:<skill>"
Write-Host "     3. อัปเดตรอบหน้า: claude plugin marketplace update $marketName"
Write-Host ""
