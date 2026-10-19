@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo ============================================================
echo   SQT-Marketplace  build-dist  ทุก plugin  (validate - sync-docs - sync-file-map - build-targets)
echo ============================================================
echo.
echo [1/4] validate-marketplace ...
call node scripts\check\validate-marketplace.mjs
if errorlevel 1 (
  echo.
  echo *** validate ไม่ผ่าน หยุด ไม่ build ต่อ แก้ error ด้านบนก่อน ***
  echo.
  pause
  exit /b 1
)
echo.
echo [2/4] sync-docs ...
call node scripts\sync\sync-docs.mjs
if errorlevel 1 (
  echo.
  echo *** sync-docs ล้มเหลว หยุด ***
  echo.
  pause
  exit /b 1
)
echo.
echo [3/4] sync-file-map ...
call node scripts\sync\sync-file-map.mjs
if errorlevel 1 (
  echo.
  echo *** sync-file-map ล้มเหลว เพิ่มคำอธิบายไทยใน scripts\sync\file-map-th.json ***
  echo.
  pause
  exit /b 1
)
echo.
echo [4/4] build-targets ...
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
