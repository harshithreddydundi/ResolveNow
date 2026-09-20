@echo off
echo ===================================================
echo   ResolveNow - Building Enterprise Microservices
echo ===================================================

echo [1/2] Building Backend Java Microservices...
cd /d "%~dp0backend"
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed!
    exit /b %errorlevel%
)

echo [2/2] Building Frontend Web Application...
cd /d "%~dp0frontend\resolvenow-web"
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    exit /b %errorlevel%
)

echo ===================================================
echo   BUILD SUCCESSFUL! All services and web ready.
echo ===================================================
pause
