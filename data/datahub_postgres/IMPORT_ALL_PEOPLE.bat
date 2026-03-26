@echo off
echo ============================================================
echo  DATAHUB - Import People Data
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

:: Install dependencies
echo Installing dependencies...
"%PYBIN%\python.exe" -m pip install psycopg2-binary openpyxl --quiet 2>nul
echo.

set /p PGPASS=Enter PostgreSQL password:
echo.

:: Copy scripts to E:\DataHub
copy /Y "%~dp0import_jci.py" "E:\DataHub\" >nul 2>nul
copy /Y "%~dp0import_jubilee_hills.py" "E:\DataHub\" >nul 2>nul
copy /Y "%~dp0import_electoral.py" "E:\DataHub\" >nul 2>nul

echo [1/3] Importing JCI Banjara members (86)...
"%PYBIN%\python.exe" "%~dp0import_jci.py" --password %PGPASS% --data-dir "%USERPROFILE%\Desktop"
echo.

echo [2/3] Importing Jubilee Hills Society members (3,092)...
"%PYBIN%\python.exe" "%~dp0import_jubilee_hills.py" --password %PGPASS% --data-dir "%USERPROFILE%\Desktop"
echo.

echo [3/3] Importing Electoral Roll voters (922)...
"%PYBIN%\python.exe" "%~dp0import_electoral.py" --password %PGPASS% --data-dir "%USERPROFILE%\Desktop"
echo.

echo ============================================================
echo  ALL PEOPLE IMPORTED!
echo ============================================================
pause
