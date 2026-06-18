@echo off
chcp 65001 >nul
title AGENT HUB GURU

echo.
echo  =============================================
echo   AGENT HUB GURU -- allon Agent System
echo  =============================================
echo.
echo  URLs:
echo    http://localhost:5000          -- Main UI
echo    http://localhost:5000/embed    -- Chat Widget
echo    http://localhost:5000/guide    -- Guide
echo.

ollama --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Ollama not found. Install from https://ollama.ai
    pause
    exit /b 1
)

cd /d "%~dp0"
set PYTHONIOENCODING=utf-8

if "%TELEGRAM_TOKEN%"=="" (
    echo  NOTE: Telegram bot not started. Set TELEGRAM_TOKEN to enable.
    echo        Example: set TELEGRAM_TOKEN=12345:ABC...
) else (
    echo  Starting Telegram bot...
    start "Telegram Bot" python telegram_bot.py
)

echo  Starting web server...
start "" "http://localhost:5000"
python server.py

pause