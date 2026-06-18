@echo off
title Self-Evolving Agent v6 - Gateway
color 0A
cls

echo ==========================================
echo   Agent v6 - Multi-User Gateway
echo ==========================================
echo.


echo [0/5] Ollama Model Server...
if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
  start "Ollama Model Server" /min "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve
  timeout /t 5 /nobreak >nul
)

echo [1/5] Flask Server...
start "Flask Server" cmd /k "cd /d %~dp0 && python agent_server.py"
timeout /t 3 /nobreak >nul

echo [2/5] n8n...
start "n8n" cmd /k "set N8N_PROTOCOL=https&& set N8N_HOST=unallowable-lustrelessly-pok.ngrok-free.dev&& set WEBHOOK_URL=https://unallowable-lustrelessly-pok.ngrok-free.dev&& npx n8n"
timeout /t 8 /nobreak >nul

echo [3/5] Gateway Proxy...
start "Agent Gateway" cmd /k "cd /d %~dp0 && node gateway_proxy.js"
timeout /t 2 /nobreak >nul

echo [4/5] ngrok...
start "ngrok" cmd /k "cd /d %~dp0 && ngrok http --domain=unallowable-lustrelessly-pok.ngrok-free.dev 8080"

echo.
echo ==========================================
echo   הכל פועל
echo   Flask  -- http://127.0.0.1:5000
echo   n8n    -- http://127.0.0.1:5678
echo   Gateway -- http://127.0.0.1:8080
echo   App    -- https://unallowable-lustrelessly-pok.ngrok-free.dev/app
echo ==========================================
echo.
pause
