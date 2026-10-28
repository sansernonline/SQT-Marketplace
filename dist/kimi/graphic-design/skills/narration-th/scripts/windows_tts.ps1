# windows_tts.ps1 - synthesize Thai speech per job with a Windows OneCore voice (e.g. Microsoft Pattara).
# Nothing to install. System.Speech cannot see OneCore voices; WinRT Windows.Media.SpeechSynthesis can.
# Called by tts_cues.py:
#   powershell -NoProfile -ExecutionPolicy Bypass -File windows_tts.ps1 -Jobs jobs.json -OutDir dir [-Voice Pattara]
# jobs.json (UTF-8): [{"id": "...", "text": "..."}] -> writes <OutDir>\<id>.wav (16 kHz mono PCM)
# Kept ASCII-only: Windows PowerShell 5.1 reads a BOM-less script file as ANSI.
param([string]$Jobs, [string]$OutDir, [string]$Voice = "")
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$type) {
    $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op))
    $t.Wait(-1) | Out-Null
    $t.Result
}

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$match = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices |
    Where-Object { $_.Language -eq 'th-TH' -and $_.DisplayName -like "*$Voice*" } | Select-Object -First 1
if (-not $match) { throw "No th-TH voice matching '$Voice'. Settings > Time & language > Speech > Add voices." }
$synth.Voice = $match

# PowerShell 5.1 ConvertFrom-Json emits a JSON array as ONE object; do not wrap it in @() or the loop runs once
$list = [IO.File]::ReadAllText($Jobs, [Text.Encoding]::UTF8) | ConvertFrom-Json
foreach ($job in $list) {
    $stream = Await ($synth.SynthesizeTextToStreamAsync($job.text)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
    $size = [uint32]$stream.Size
    $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
    $null = Await ($reader.LoadAsync($size)) ([uint32])
    $bytes = New-Object byte[] $size
    $reader.ReadBytes($bytes)
    [IO.File]::WriteAllBytes((Join-Path $OutDir "$($job.id).wav"), $bytes)
}
"voice: $($match.DisplayName) ($($list.Count) jobs)"
