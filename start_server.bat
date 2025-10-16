@echo off
echo Starting DrugTox-AI Dashboard...
echo.
cd /d "c:\Users\GAURAV PATIL\Downloads\drugtox_ai_artifacts\dashboard\backend"
echo Changed to directory: %CD%
echo.
echo Starting Flask server...
python run.py
pause