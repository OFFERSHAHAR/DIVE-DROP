@echo off
chcp 65001 >nul
title Install Dependencies
cd /d "%~dp0"
echo Installing Python packages...
pip install -r requirements.txt
echo.
echo Pulling Ollama model (first time only)...
ollama pull qwen3.5:latest
echo.
echo Done! Run הפעל.bat to start.
pause