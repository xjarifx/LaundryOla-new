@echo off
:: LaundryOla Local Development Startup Script for Windows

echo 🚀 Starting LaundryOla Local Development Environment...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found

:: Check if MySQL is accessible
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL command not found. Please ensure MySQL is installed and in PATH.
)

:: Start backend
echo 🔧 Starting backend server...
cd server
if not exist ".env" (
    echo ⚠️  Backend .env file not found. Creating from template...
    copy .env.example .env
    echo 🔧 Please edit server\.env with your database credentials
    echo Press any key to continue after editing .env file...
    pause
)

echo Starting backend in new window...
start "LaundryOla Backend" cmd /k "npm run dev"

:: Wait for backend to start
timeout /t 3

:: Start frontend
echo 🎨 Starting frontend server...
cd ..\client
echo Starting frontend in new window...
start "LaundryOla Frontend" cmd /k "npm run dev"

echo.
echo 🎉 LaundryOla is starting!
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend API: http://localhost:5000/api
echo 📖 API Docs: See client\API-TESTING-GUIDE.md
echo.
echo Servers are running in separate windows.
echo Close the command windows to stop the servers.
echo.
pause
