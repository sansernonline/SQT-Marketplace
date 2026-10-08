<#
  SQT project sandbox — run from the project root:  .\.sandbox\sandbox.ps1 <command>
  up [-Isolated] [-Locked] [-Browser]   build and start (mount mode by default)
  exec "<command>"           run a command inside, no terminal (for agents)
  shell                      open an interactive shell inside
  claude                     run Claude Code inside without permission prompts
  sync                       isolated mode: copy changes out as a patch to _to_delete\sandbox\
  status | list              this sandbox | every SQT sandbox on the machine
  stop | stop-all            stop this sandbox | stop every SQT sandbox (frees memory, keeps everything)
  reset | destroy            wipe volumes | wipe volumes and the project image
  base                       rebuild the shared base image sqt-sandbox-base:1

  Stack name is sandbox-agent-<project>-<date>, fixed on first 'up' and kept in
  .sandbox\.name-<project> so later commands and teardown always find the same one.
#>
param(
  [Parameter(Position = 0)]
  [ValidateSet('up', 'exec', 'shell', 'claude', 'sync', 'status', 'list', 'stop', 'stop-all', 'reset', 'destroy', 'base')]
  [string]$Command = 'status',
  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]]$Rest,
  [string]$Name,
  [switch]$Isolated,
  [switch]$Locked,
  [switch]$Browser,
  [int]$AppPort = 3000,
  [int]$BrowserPort = 7900
)
# Native tools (docker) write progress to stderr. Windows PowerShell 5.1 turns that into errors,
# so failures are detected from exit codes ($LASTEXITCODE) instead of the error stream.
$ErrorActionPreference = 'Continue'
$here = $PSScriptRoot
$projectDir = Split-Path $here -Parent
if (-not $Name) {
  $Name = ((Split-Path $projectDir -Leaf).ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
}
$env:SANDBOX_NAME = $Name
# The stack name marks a sandbox as agent-made and carries the date it was first created.
# It is fixed once and stored, so stop / reset / destroy keep finding the same stack across days.
$nameFile = Join-Path $here ".name-$Name"
if (Test-Path $nameFile) {
  $Full = (Get-Content $nameFile -Raw).Trim()
}
else {
  # name file lost? recover it from an existing sandbox before making a new name
  $Full = docker ps -a --filter "label=sqt.project=$Name" --format '{{.Label "com.docker.compose.project"}}' | Select-Object -First 1
  if ($Full) { Set-Content -Path $nameFile -Value $Full -NoNewline }
}
if (-not $Full -and $Command -eq 'up') {
  $Full = "sandbox-agent-$Name-$(Get-Date -Format 'yyyyMMdd')"
  Set-Content -Path $nameFile -Value $Full -NoNewline
}
if (-not $Full) { $Full = "sandbox-agent-$Name" }  # best-effort label before the first 'up'
$env:SANDBOX_FULL = $Full
$env:SANDBOX_CREATED = if ($Full -match '-(\d{8})$') { $Matches[1] } else { 'unknown' }
function Get-FreePort([int]$start) {
  # First port from $start that nothing on this machine is listening on.
  foreach ($port in $start..($start + 50)) {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    try { $listener.Start(); $listener.Stop(); return $port } catch { }
  }
  throw "no free port between $start and $($start + 50)"
}
if ($Command -eq 'up') {
  $AppPort = Get-FreePort $AppPort
  if ($Browser) { $BrowserPort = Get-FreePort $BrowserPort }
}
$env:APP_PORT = "$AppPort"
$env:BROWSER_VIEW_PORT = "$BrowserPort"
$baseImage = 'sqt-sandbox-base:1'
$modeFile = Join-Path $here ".mode-$Name"

function Get-ComposeFiles {
  $files = @('-f', (Join-Path $here 'compose.yaml'))
  $mode = if (Test-Path $modeFile) { Get-Content $modeFile -Raw } else { '' }
  if ($mode -match 'isolated') { $files += @('-f', (Join-Path $here 'compose.isolated.yaml')) }
  if ($mode -match 'locked') { $files += @('-f', (Join-Path $here 'compose.locked.yaml')) }
  if ($mode -match 'browser') { $files += @('-f', (Join-Path $here 'compose.browser.yaml')) }
  return $files
}
function Invoke-Compose {
  $files = Get-ComposeFiles
  & docker compose -p "$Full" @files @args
  if ($LASTEXITCODE -ne 0) { throw "docker compose $($args -join ' ') failed ($LASTEXITCODE)" }
}

function Build-Base {
  & docker build -t $baseImage -f (Join-Path $here 'base.Dockerfile') $here
  if ($LASTEXITCODE -ne 0) { throw "base image build failed ($LASTEXITCODE)" }
}

$copyIn = @'
set -e
if [ ! -f /work/.git/sandbox-base ]; then
  rsync -a --exclude node_modules --exclude bin --exclude obj --exclude .sandbox --exclude _to_delete /src/ /work/
  cd /work
  [ -d .git ] || git init -q
  git config --global --add safe.directory /work
  git add -A
  git -c user.name=sandbox -c user.email=sandbox@local commit -q --allow-empty -m sandbox-base
  git rev-parse HEAD > .git/sandbox-base
fi
'@

switch ($Command) {
  'up' {
    if (-not (docker images -q $baseImage)) { Write-Host "building shared base image $baseImage (first time only)"; Build-Base }
    $mode = @(); if ($Isolated) { $mode += 'isolated' }; if ($Locked) { $mode += 'locked' }; if ($Browser) { $mode += 'browser' }
    Set-Content -Path $modeFile -Value ($mode -join ',') -NoNewline
    Invoke-Compose up -d --build
    if ($Isolated) { Invoke-Compose exec -T dev bash -lc $copyIn }
    if ($Locked) { Invoke-Compose exec -T -u root dev /usr/local/bin/init-firewall.sh }
    Write-Host "sandbox $Full ready · mode: $(if ($mode) { $mode -join ',' } else { 'mount' }) · app: http://127.0.0.1:$AppPort"
    if ($Browser) { Write-Host "watch the browser: http://127.0.0.1:$BrowserPort" }
  }
  'exec' { Invoke-Compose exec -T dev bash -lc ($Rest -join ' ') }
  'shell' { Invoke-Compose exec dev bash -l }
  'claude' { Invoke-Compose exec dev claude --dangerously-skip-permissions @Rest }
  'sync' {
    $out = Join-Path $projectDir '_to_delete\sandbox'
    New-Item -ItemType Directory -Force -Path $out | Out-Null
    # no double quotes inside: Windows PowerShell 5.1 mangles them when calling docker
    Invoke-Compose exec -T dev bash -lc 'cd /work && git add -A && base=$(cat .git/sandbox-base) && git diff --binary --cached $base > /tmp/sandbox.patch && echo changed files: $(git diff --cached --name-only $base | wc -l)'
    $patch = Join-Path $out "$Name.patch"
    Invoke-Compose cp dev:/tmp/sandbox.patch $patch
    Write-Host "patch: $patch"
    Write-Host "review, then apply on the host:  git apply `"$patch`""
  }
  'status' { Invoke-Compose ps }
  'list' { docker ps -a --filter 'label=sqt.sandbox=true' --format 'table {{.Names}}\t{{.Status}}\t{{.Label "sqt.created"}}' }
  'stop' { Invoke-Compose stop }
  'stop-all' {
    $ids = docker ps -q --filter 'label=sqt.sandbox=true'
    if ($ids) { docker stop $ids | Out-Null; Write-Host "stopped $(@($ids).Count) container(s)" } else { Write-Host 'nothing running' }
  }
  'base' { Build-Base }
  'reset' { Invoke-Compose down -v; Remove-Item $modeFile, $nameFile -ErrorAction SilentlyContinue }
  'destroy' { Invoke-Compose down -v --rmi local; Remove-Item $modeFile, $nameFile -ErrorAction SilentlyContinue }
}
