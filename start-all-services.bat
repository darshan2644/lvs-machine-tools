@echo off
echo Starting LVS Machine Tools - Main Application and Admin Panel
echo.

echo Starting main backend server...
start "Main Backend" cmd /k "cd /d \"c:\machine and tools website\backend\" && npm start"

timeout /t 3

echo Starting admin panel...
start "Admin Panel" cmd /k "cd /d \"c:\machine and tools website\lvs-admin-panel\" && npm run dev"

timeout /t 3

echo Starting main frontend...
start "Main Frontend" cmd /k "cd /d \"c:\machine and tools website\" && npm run dev"

echo.
echo All services are starting:
echo - Main Backend: http://localhost:5000
echo - Admin Panel: http://localhost:5173 (or similar port)
echo - Main Frontend: http://localhost:5174 (or similar port)
echo.
echo Check the opened command windows for any errors.
echo Press any key to exit this script...
pause > nul