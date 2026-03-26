@echo off
echo ============================================================
echo  DATAHUB - Import 5.59 Lakh Villages
echo ============================================================
echo.

set PYBIN=E:\Python
if not exist "%PYBIN%\python.exe" (
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        for /f "delims=" %%i in ('where python') do set PYBIN=%%~dpi
    ) else (
        echo Python not found!
        pause
        exit /b 1
    )
)

set /p PGPASS=Enter PostgreSQL password:
echo.

echo Importing villages from PINs folder...
"%PYBIN%\python.exe" "%~dp0import_data.py" --password %PGPASS% --data-dir "%USERPROFILE%\Desktop\PINs"

echo.
echo ============================================================
echo  DONE!
echo ============================================================
pause
