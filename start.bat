@echo off
setlocal
title SkillProof - Enterprise Verification Platform
color 0B

echo ===================================================================
echo     SKILLPROOF: ENTERPRISE SKILL VERIFICATION PLATFORM
echo     "Don't Just Claim Your Skills. Prove Them."
echo ===================================================================
echo.

cd /d "%~dp0"

REM Try launching Node server if available, or SkillProofServer.exe
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [SERVER] Starting SkillProof Server with Node.js on port 5000...
    start "SkillProof Server" node server.js
    timeout /t 2 /nobreak >nul
    start http://localhost:5000/
    echo [READY] SkillProof is running at http://localhost:5000/
    pause
    exit /b 0
)

REM Fallback to SkillProofServer.exe compiled from Server.cs
if not exist "SkillProofServer.exe" (
    echo [BUILD] Compiling SkillProofServer.exe using C# Compiler...
    if exist "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" (
        "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /target:exe /out:SkillProofServer.exe /optimize+ Server.cs
    ) else if exist "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" (
        "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" /target:exe /out:SkillProofServer.exe /optimize+ Server.cs
    )
)

echo [SERVER] Starting SkillProof Standalone Server on port 5000...
start "SkillProof Server" "SkillProofServer.exe"

timeout /t 2 /nobreak >nul
start http://localhost:5000/

echo.
echo [READY] SkillProof is running at http://localhost:5000/
echo [READY] Keep the server console open while using the platform.
echo.
pause
