DATAHUB — PostgreSQL Setup
==========================

STEP 1: Install PostgreSQL
--------------------------
Download from: https://www.postgresql.org/download/windows/
Use the EDB installer. During install:
  - Keep default port 5432
  - Set a password (remember it)
  - Keep pgAdmin checked (gives you a GUI)

After install, open Command Prompt and verify:
  psql --version


STEP 2: Create Database & Schema
---------------------------------
Double-click setup.bat (in this folder)
  - It will ask for your PostgreSQL password
  - Creates the 'datahub' database
  - Runs the schema (8 tables)
  - Seeds Indian Railways + India Post


STEP 3: Import Data
--------------------
  pip install psycopg2-binary openpyxl
  python import_data.py --password YOUR_PASSWORD --data-dir "C:\Users\CHIST\Desktop"

This imports:
  - 5.96 lakh villages/towns from "India Village list.csv"
  - 12,913 railway stations from the Railways xlsx
  - 14,820 post offices from the PIN Cross-Reference


STEP 4: Connect
----------------
Command line:   psql -U postgres -d datahub
pgAdmin:        Open pgAdmin → Servers → PostgreSQL → datahub
Python:         psycopg2.connect(dbname='datahub', user='postgres', password='...')


FILES
-----
001_schema.sql      → 8 tables, all indexes
002_seed_companies.sql → Indian Railways + India Post
import_data.py      → Bulk data importer (villages, stations, POs)
setup.bat           → One-click database creation
