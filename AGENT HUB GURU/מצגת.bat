@echo off
chcp 65001 >nul
title AGENT HUB GURU - Presentation
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
echo Starting server...
start "" "http://localhost:5000/static/landing.html"
python server.py
pause