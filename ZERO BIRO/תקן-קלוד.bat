@echo off
chcp 65001 >nul
title Fix Claude VM disk
setlocal

set "BASE=%APPDATA%\Claude\vm_bundles"
set "DIR=%BASE%\claudevm.bundle"
set "F=%DIR%\rootfs.vhdx"

echo ============================================================
echo  Fixing Claude virtual disk (uncompress / unencrypt / sparse)
echo ============================================================
echo.
echo Target file:
echo   %F%
echo.

if not exist "%F%" (
  echo [X] File not found. Is Claude installed for this user?
  echo     Check this folder manually: %BASE%
  echo.
  pause
  exit /b 1
)

echo [1/4] Removing NTFS compression from the bundle folder...
compact /u /s:"%BASE%" >nul 2>&1

echo [2/4] Decompressing the disk file (this can take a few minutes)...
compact /u "%F%"

echo [3/4] Removing encryption attribute (if any)...
cipher /d "%F%" >nul 2>&1

echo [4/4] Clearing sparse flag (if set)...
fsutil sparse setflag "%F%" 0 >nul 2>&1

echo.
echo Verifying file attributes:
compact "%F%"
echo.
echo ============================================================
echo  DONE.
echo  1) Close Claude completely (right-click tray icon - Quit).
echo  2) Open Claude again.
echo  If the error still appears, run this file again as
echo  Administrator (right-click - Run as administrator).
echo ============================================================
echo.
pause
