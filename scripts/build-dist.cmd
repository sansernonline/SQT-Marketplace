@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo ============================================================
echo   SQT-Marketplace  build-dist  ทุก plugin  (validate - plugin validate - sync-docs - sync-file-map - build-targets)
echo ============================================================
echo.
echo [1/5] validate-marketplace ...
call node scripts\check\validate-marketplace.mjs
if errorlevel 1 (
  echo.
  echo *** validate ไม่ผ่าน หยุด ไม่ build ต่อ แก้ error ด้านบนก่อน ***
  echo.
  pause
  exit /b 1
)
echo.
echo [2/5] claude plugin validate --strict (ตัวตรวจทางการ ข้ามถ้าเครื่องไม่มี Claude Code) ...
set PLUGIN_FAIL=
where claude >nul 2>nul
if errorlevel 1 (
  echo   ไม่พบคำสั่ง claude ข้ามขั้นนี้
) else (
  call claude plugin validate --strict . >nul || set PLUGIN_FAIL=marketplace
  for /d %%p in (plugins\*) do call claude plugin validate --strict "%%p" >nul || set PLUGIN_FAIL=%%p
)
if defined PLUGIN_FAIL (
  echo.
  echo *** claude plugin validate ไม่ผ่านที่ %PLUGIN_FAIL% รัน claude plugin validate --strict ^<path^> ดูรายละเอียด ***
  echo.
  pause
  exit /b 1
)
echo.
echo [3/5] sync-docs ...
call node scripts\sync\sync-docs.mjs
if errorlevel 1 (
  echo.
  echo *** sync-docs ล้มเหลว หยุด ***
  echo.
  pause
  exit /b 1
)
echo.
echo [4/5] sync-file-map ...
call node scripts\sync\sync-file-map.mjs
if errorlevel 1 (
  echo.
  echo *** sync-file-map ล้มเหลว เพิ่มคำอธิบายไทยใน scripts\sync\file-map-th.json ***
  echo.
  pause
  exit /b 1
)
echo.
echo [5/5] build-targets ...
call node scripts\build\build-targets.mjs
if errorlevel 1 (
  echo.
  echo *** build ล้มเหลว ดู error ด้านบน ***
  echo.
  pause
  exit /b 1
)
echo.
echo ============================================================
echo   เสร็จ dist\ ถูกสร้างใหม่ครบทุก plugin แล้ว - สรุปอยู่ใน dist\README.md
echo ============================================================
echo.
pause
