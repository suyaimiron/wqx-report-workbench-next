@echo off
cd /d "%~dp0"
echo Starting WQX report workbench at http://localhost:3000/
echo Keep this window open while using the website.
if exist ".next" (
  echo Clearing old Next.js cache...
  rmdir /s /q ".next"
)
npm.cmd run dev
pause
