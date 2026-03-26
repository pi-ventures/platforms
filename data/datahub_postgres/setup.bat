@echo off
echo ============================================================
echo  DATAHUB - PostgreSQL Setup
echo ============================================================
echo.

:: Check if psql exists
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL is not installed or not in PATH.
    echo.
    echo Download from: https://www.postgresql.org/download/windows/
    echo Use the installer from EDB (EnterpriseDB).
    echo During install, keep defaults and remember your password.
    echo.
    pause
    exit /b 1
)

echo PostgreSQL found.
echo.

:: Create database
set /p PGPASS=Enter your PostgreSQL password (set during install):
echo.
echo Creating database 'datahub'...
set PGPASSWORD=%PGPASS%
psql -U postgres -c "CREATE DATABASE datahub;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Database created.
) else (
    echo Database may already exist, continuing...
)

echo.
echo Running schema migration...
psql -U postgres -d datahub -f "%~dp0001_schema.sql"

echo.
echo Seeding initial data...
psql -U postgres -d datahub -f "%~dp0002_seed_companies.sql"

echo.
echo ============================================================
echo  DONE! Database 'datahub' is ready.
echo  Connect with: psql -U postgres -d datahub
echo ============================================================
pause
