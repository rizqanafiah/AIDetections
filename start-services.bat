@echo off
REM Deepfake Detection System - Quick Start Script
REM This script helps start all services

echo.
echo =====================================
echo Deepfake Detection System - Quick Start
echo =====================================
echo.

set /p choice="Choose an option: (1) Install Dependencies, (2) Start All Services, (3) Check Services: "

if "%choice%"=="1" (
    echo.
    echo Installing Backend Dependencies...
    cd backend
    call npm install
    cd ..
    
    echo.
    echo Installing Image Service Dependencies...
    cd microservices\image
    python -m pip install -r requirements.txt
    cd ..\..
    
    echo.
    echo Installing Audio Service Dependencies...
    cd microservices\audio
    python -m pip install -r requirements.txt
    cd ..\..
    
    echo.
    echo ✓ All dependencies installed!
    echo Run 'npm start-all' to start services
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting all services...
    echo.
    
    if not exist "backend\.env" (
        echo Creating backend .env file...
        copy backend\.env.example backend\.env
    )
    
    echo.
    echo Please run these commands in separate terminals:
    echo.
    echo Terminal 1 - Image Service:
    echo   cd microservices\image
    echo   python main.py
    echo.
    echo Terminal 2 - Audio Service:
    echo   cd microservices\audio
    echo   python main.py
    echo.
    echo Terminal 3 - Backend:
    echo   cd backend
    echo   npm run dev
    echo.
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Checking services...
    echo.
    
    echo Checking Backend (http://localhost:5000/api/health)...
    powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5000/api/health' | ConvertTo-Json; Write-Host '✓ Backend is running' -ForegroundColor Green } catch { Write-Host '✗ Backend is not running' -ForegroundColor Red }"
    
    echo.
    echo Checking Image Service (http://localhost:5001/health)...
    powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5001/health' | ConvertTo-Json; Write-Host '✓ Image Service is running' -ForegroundColor Green } catch { Write-Host '✗ Image Service is not running' -ForegroundColor Red }"
    
    echo.
    echo Checking Audio Service (http://localhost:5002/health)...
    powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5002/health' | ConvertTo-Json; Write-Host '✓ Audio Service is running' -ForegroundColor Green } catch { Write-Host '✗ Audio Service is not running' -ForegroundColor Red }"
    
    echo.
    goto end
)

:end
echo.
pause
