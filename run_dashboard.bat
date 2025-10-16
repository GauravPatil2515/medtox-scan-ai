@echo off
REM DrugTox-AI Dashboard Launcher
REM =============================

echo 🧬 DrugTox-AI Enhanced Dashboard
echo ================================
echo.

cd backend

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install/update requirements
echo Installing requirements...
pip install -r requirements.txt

REM Run the application
echo.
echo Starting dashboard...
python run.py

pause