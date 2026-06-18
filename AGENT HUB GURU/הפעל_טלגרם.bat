@echo off
chcp 65001 >nul
title AGENT HUB GURU - Telegram Bot
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8

if "%TELEGRAM_TOKEN%"=="" (
    echo.
    echo  ==========================================
    echo   הגדר את הטוקן לפני הרצה:
    echo   set TELEGRAM_TOKEN=12345:ABC-your-token
    echo  ==========================================
    echo.
    set /p TELEGRAM_TOKEN=הכנס טוקן: 
)
python telegram_bot.py
pause