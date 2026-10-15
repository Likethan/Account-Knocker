@echo off
echo ===================================================
echo   ACCOUNT KNOCKER - AI DIGITAL SAFETY ASSISTANT
echo ===================================================
echo.
echo Starting FastAPI Backend Server on port 8000...
start cmd /k "cd backend && python -m uvicorn app.main:app --port 8000 --reload"

echo Starting Vite Frontend Client on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   System launched successfully!
echo   - Frontend Client: http://localhost:5173
echo   - Backend Server: http://localhost:8000
echo   - Swagger API Docs: http://localhost:8000/docs
echo ===================================================
pause
