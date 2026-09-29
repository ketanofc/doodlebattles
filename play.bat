@echo off
title DOODLE BATTLES Launcher
echo ===================================================
echo           DOODLE BATTLES - STARTING GAME
echo ===================================================
echo Opening your browser to http://localhost:8000 ...
start "" "http://localhost:8000"
python -m http.server 8000
if %errorlevel% neq 0 (
    echo Python server failed, trying npx serve...
    npx serve -l 8000 .
)
pause
