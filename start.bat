@echo off
echo ======================================
echo   DrugTox-AI Platform Startup
echo ======================================
echo.

echo Starting DrugTox-AI Platform...
echo.

echo [1/2] Starting Backend Server (Flask)...
start "DrugTox-Backend" cmd /k "cd /d "%~dp0backend" && python app.py"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend Server (React)...
start "DrugTox-Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ======================================
echo   Platform Started Successfully!
echo ======================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window when done.
pause