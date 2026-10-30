# ResolveNow Startup Script
$ErrorActionPreference = "Continue"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  ResolveNow - Launching Microservices and Web Client" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$env:DB_PASSWORD = "Kousik@123"
$baseDir = $PSScriptRoot

# 1. Start Eureka Server
Write-Host "[1/7] Starting Eureka Service Discovery (:8761)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\backend\eureka-server" -ArgumentList '/k', 'title ResolveNow - Eureka Server (:8761) && mvn spring-boot:run' -WindowStyle Normal

# Wait for Eureka to listen on 8761
Write-Host "Waiting for Eureka Server to bind to port 8761..." -ForegroundColor Gray
$eurekaReady = $false
for ($i = 0; $i -lt 45; $i++) {
    Start-Sleep -Seconds 2
    $conn = Get-NetTCPConnection -LocalPort 8761 -ErrorAction SilentlyContinue
    if ($conn) {
        $eurekaReady = $true
        Write-Host "Eureka Server is ACTIVE on port 8761!" -ForegroundColor Green
        break
    }
}

if (-not $eurekaReady) {
    Write-Host "Proceeding with launching remaining services..." -ForegroundColor Yellow
}

# 2. Start API Gateway
Write-Host "[2/7] Starting Spring Cloud API Gateway (:8080)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\backend\api-gateway" -ArgumentList '/k', 'title ResolveNow - API Gateway (:8080) && mvn spring-boot:run' -WindowStyle Normal

Start-Sleep -Seconds 3

# 3. Start Auth Service
Write-Host "[3/7] Starting Auth Microservice (:8081)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\backend\auth-service" -ArgumentList '/k', 'title ResolveNow - Auth Service (:8081) && set DB_PASSWORD=Kousik@123 && mvn spring-boot:run' -WindowStyle Normal

# 4. Start Complaint Service
Write-Host "[4/7] Starting Complaint Microservice (:8082)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\backend\complaint-service" -ArgumentList '/k', 'title ResolveNow - Complaint Service (:8082) && set DB_PASSWORD=Kousik@123 && mvn spring-boot:run' -WindowStyle Normal

# 5. Start Assignment Service
Write-Host "[5/7] Starting Assignment Microservice (:8083)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\backend\assignment-service" -ArgumentList '/k', 'title ResolveNow - Assignment Service (:8083) && set DB_PASSWORD=Kousik@123 && mvn spring-boot:run' -WindowStyle Normal

# 6. Start Notification Service
Write-Host "[6/7] Starting Notification Microservice (:8084)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\backend\notification-service" -ArgumentList '/k', 'title ResolveNow - Notification Service (:8084) && set DB_PASSWORD=Kousik@123 && mvn spring-boot:run' -WindowStyle Normal

Start-Sleep -Seconds 3

# 7. Start Frontend Web Client
Write-Host "[7/7] Starting React 19 Frontend Web Client (:5173)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -WorkingDirectory "$baseDir\frontend\resolvenow-web" -ArgumentList '/k', 'title ResolveNow - Frontend Web (:5173) && npm run dev' -WindowStyle Normal

Write-Host "===================================================" -ForegroundColor Green
Write-Host "  All services launched successfully in separate consoles!" -ForegroundColor Green
Write-Host "  - Web Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  - API Gateway:   http://localhost:8080" -ForegroundColor White
Write-Host "  - Eureka Server: http://localhost:8761" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green
