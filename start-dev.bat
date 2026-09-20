set DB_PASSWORD=Kousik@123
echo ===================================================
echo   ResolveNow - Starting Microservices Dev Mesh
echo   PostgreSQL Password: %DB_PASSWORD%
echo ===================================================

echo [1/7] Launching Eureka Discovery Server (:8761)...
start "ResolveNow - Eureka Server (:8761)" cmd /k "cd /d %~dp0backend\eureka-server && mvn spring-boot:run"
ping 127.0.0.1 -n 12 >nul

echo [2/7] Launching API Gateway (:8080)...
start "ResolveNow - API Gateway (:8080)" cmd /k "cd /d %~dp0backend\api-gateway && mvn spring-boot:run"
ping 127.0.0.1 -n 6 >nul

echo [3/7] Launching Auth Service (:8081)...
start "ResolveNow - Auth Service (:8081)" cmd /k "cd /d %~dp0backend\auth-service && mvn spring-boot:run"

echo [4/7] Launching Complaint Service (:8082)...
start "ResolveNow - Complaint Service (:8082)" cmd /k "cd /d %~dp0backend\complaint-service && mvn spring-boot:run"

echo [5/7] Launching Assignment Service (:8083)...
start "ResolveNow - Assignment Service (:8083)" cmd /k "cd /d %~dp0backend\assignment-service && mvn spring-boot:run"

echo [6/7] Launching Notification Service (:8084)...
start "ResolveNow - Notification Service (:8084)" cmd /k "cd /d %~dp0backend\notification-service && mvn spring-boot:run"

ping 127.0.0.1 -n 6 >nul
echo [7/7] Launching Frontend Web Client (:5173)...
start "ResolveNow - Web Frontend" cmd /k "cd /d %~dp0frontend\resolvenow-web && npm run dev"

echo ===================================================
echo   All 6 Microservices and Frontend launched!
echo   Frontend: http://localhost:5173
echo   Eureka:   http://localhost:8761
echo   Gateway:  http://localhost:8080
echo ===================================================
