@echo off
echo ============================================================
echo  DATAHUB - Complete PostgreSQL Setup
echo ============================================================
echo.

:: Set paths to E: drive installations
set PGBIN=E:\PostgreSQL\bin
set PYBIN=E:\Python

:: Verify PostgreSQL
if not exist "%PGBIN%\psql.exe" (
    echo ERROR: psql.exe not found at %PGBIN%\psql.exe
    echo.
    echo Checking other common locations...
    where psql >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Found psql in PATH, using that instead.
        set PGBIN=
    ) else (
        echo PostgreSQL not found. Please check E:\PostgreSQL\bin exists.
        pause
        exit /b 1
    )
)

:: Verify Python
if not exist "%PYBIN%\python.exe" (
    echo WARNING: python.exe not found at %PYBIN%\python.exe
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Found python in PATH, using that instead.
        set PYBIN=
    ) else (
        echo Python not found. Skipping data import step.
        set PYBIN=SKIP
    )
)

echo.
echo Found PostgreSQL and Python. Let's go!
echo.

:: Get password
set /p PGPASS=Enter your PostgreSQL password:
set PGPASSWORD=%PGPASS%
echo.

:: ── Step 1: Create database ──
echo [1/4] Creating database 'datahub'...
if defined PGBIN (
    "%PGBIN%\psql.exe" -U postgres -c "CREATE DATABASE datahub;" 2>nul
) else (
    psql -U postgres -c "CREATE DATABASE datahub;" 2>nul
)
if %ERRORLEVEL% EQU 0 (
    echo   Database created successfully.
) else (
    echo   Database already exists, continuing...
)

:: ── Step 2: Run schema ──
echo.
echo [2/4] Creating tables (8 tables with indexes)...
if defined PGBIN (
    "%PGBIN%\psql.exe" -U postgres -d datahub -f "%~dp0001_schema.sql"
) else (
    psql -U postgres -d datahub -f "%~dp0001_schema.sql"
)

:: ── Step 3: Seed companies ──
echo.
echo [3/4] Seeding Indian Railways + India Post...
if defined PGBIN (
    "%PGBIN%\psql.exe" -U postgres -d datahub -f "%~dp0002_seed_companies.sql"
) else (
    psql -U postgres -d datahub -f "%~dp0002_seed_companies.sql"
)

:: ── Step 4: Import data ──
echo.
echo [4/4] Importing data (villages, railways, post offices)...
if "%PYBIN%"=="SKIP" (
    echo   Skipping - Python not found.
    echo   Run manually: python import_data.py --password YOUR_PASSWORD --data-dir "%USERPROFILE%\Desktop"
    goto :DONE
)

:: Install Python dependencies
echo   Installing Python dependencies...
if defined PYBIN (
    "%PYBIN%\python.exe" -m pip install psycopg2-binary openpyxl --quiet 2>nul
    "%PYBIN%\python.exe" "%~dp0import_data.py" --password %PGPASS% --data-dir "%USERPROFILE%\Desktop"
) else (
    python -m pip install psycopg2-binary openpyxl --quiet 2>nul
    python "%~dp0import_data.py" --password %PGPASS% --data-dir "%USERPROFILE%\Desktop"
)

:DONE
echo.
echo ============================================================
echo  ALL DONE! Your DataHub database is ready.
echo.
echo  Connect anytime with:
if defined PGBIN (
    echo    "%PGBIN%\psql.exe" -U postgres -d datahub
) else (
    echo    psql -U postgres -d datahub
)
echo ============================================================
pause
