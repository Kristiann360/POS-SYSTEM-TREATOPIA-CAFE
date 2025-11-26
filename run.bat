@echo off
title ITPM System

:: Start backend in a new window
start cmd /k "cd server && node index.js"

:: Wait 2 seconds to let server start
timeout /t 2 /nobreak >nul

:: Open frontend HTML in default browser
start "" "client\login.html"

echo ITPM system started!
pause

@echo off
echo Stopping any running Node servers on port 4000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do taskkill /F /PID %%a

echo Starting backend server...
start cmd /k "cd server && node index.js"

timeout /t 2

echo Starting frontend server...
start cmd /k "cd client && npx http-server -c-1 -o login.html"

echo All servers started!
pause
