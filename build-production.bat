@echo off
REM MedToXAi Production Build Script for Windows

echo ========================================
echo  Building MedToXAi for Production
echo ========================================

REM Check if we're in the correct directory
if not exist "render.yaml" (
    echo Error: render.yaml not found. Please run this script from the project root.
    exit /b 1
)

echo.
echo Step 1: Installing Backend Dependencies
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install backend dependencies
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..

echo.
echo Step 2: Installing Frontend Dependencies
cd frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    exit /b 1
)
echo [OK] Frontend dependencies installed

echo.
echo Step 3: Building Frontend for Production
call npm run build
if errorlevel 1 (
    echo Failed to build frontend
    exit /b 1
)
echo [OK] Frontend built successfully
cd ..

echo.
echo ========================================
echo  Production build complete!
echo ========================================
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Deploy on Render using the Blueprint (render.yaml)
echo 3. Set environment variables in Render dashboard
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
