#!/usr/bin/env python3
"""
Import Jubilee Hills Co-Op Housing Society members into DataHub PostgreSQL.
3,092 members → people + people_companies + contact_identifiers

Usage:
    E:\\Python\\python.exe import_jubilee_hills.py --password YOUR_POSTGRES_PASSWORD
"""

import argparse
import csv
import re
import psycopg2
import os

def clean(v):
    if v is None: return None
    s = str(v).strip()
    return s if s and s.lower() != 'none' else None

def parse_name(raw):
    if not raw: return None, None, None
    name = raw.strip()
    # Remove honorifics
    name = re.sub(r'^(Sri|Smt\.?|Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Shri|Late\.?)\s+', '', name, flags=re.IGNORECASE).strip()
    parts = name.split(None, 1)
    first = parts[0] if parts else name
    last = parts[1] if len(parts) > 1 else None
    return name, first, last

def parse_gender(raw):
    if not raw: return None
    g = raw.strip().upper()
    if g in ('M', 'MALE'): return 'Male'
    if g in ('F', 'FEMALE'): return 'Female'
    return raw.strip() or None

def parse_age(raw):
    try:
        a = int(str(raw).strip())
        return a if 0 < a < 150 else None
    except: return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--password', required=True)
    parser.add_argument('--host', default='localhost')
    parser.add_argument('--port', type=int, default=5432)
    parser.add_argument('--data-dir', default=None)
    args = parser.parse_args()

    conn = psycopg2.connect(host=args.host, port=args.port, user='postgres',
                            password=args.password, dbname='datahub')
    cur = conn.cursor()

    # Ensure Jubilee Hills society exists
    cur.execute("SELECT id FROM companies WHERE name = 'Jubilee Hills Co-Operative Housing Society'")
    row = cur.fetchone()
    if row:
        company_id = row[0]
    else:
        cur.execute("""INSERT INTO companies (name, category, sub_category, industry,
                       city, district, state, source)
                       VALUES ('Jubilee Hills Co-Operative Housing Society', 'PRIVATE', 'COOPERATIVE',
                               'Real Estate / Housing Society', 'Hyderabad', 'Hyderabad', 'Telangana',
                               'jubilee_hills_members_csv')
                       RETURNING id""")
        company_id = cur.fetchone()[0]
        conn.commit()
    print(f"Jubilee Hills Society company_id: {company_id}")

    # Clean up any previous partial import
    cur.execute("DELETE FROM contact_identifiers WHERE person_id IN (SELECT id FROM people WHERE source='jubilee_hills_members_csv')")
    cur.execute("DELETE FROM people_companies WHERE source='jubilee_hills_members_csv'")
    cur.execute("DELETE FROM people WHERE source='jubilee_hills_members_csv'")
    conn.commit()
    print("Cleaned up previous partial import (if any)")

    # Find CSV
    data_dir = args.data_dir or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    csv_path = os.path.join(data_dir, 'jubilee_hills_members.csv')
    if not os.path.exists(csv_path):
        csv_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'jubilee_hills_members.csv')

    print(f"Reading: {csv_path}")
    # Headers: S.No, Admission No, Date, Name, Father/Husband Name, Address, Age, Community, Gender
    count = 0
    with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name_raw = clean(row.get('Name'))
            if not name_raw: continue

            full_name, first_name, last_name = parse_name(name_raw)
            father_husband = clean(row.get('Father/Husband Name'))
            address = clean(row.get('Address'))
            age = parse_age(row.get('Age'))
            gender = parse_gender(row.get('Gender'))
            admission_no = clean(row.get('Admission No'))
            admission_date = clean(row.get('Date'))
            community = clean(row.get('Community'))

            # Insert person
            cur.execute("""INSERT INTO people (full_name, first_name, last_name, father_husband_name,
                           address, city, state, age, gender, source, notes)
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                           RETURNING id""",
                        (full_name, first_name, last_name, father_husband,
                         address, 'Hyderabad', 'Telangana', age, gender,
                         'jubilee_hills_members_csv',
                         f"Community: {community}" if community else None))
            person_id = cur.fetchone()[0]

            # Link as member of society
            cur.execute("""INSERT INTO people_companies (person_id, company_id, role, designation,
                           is_current, source)
                           VALUES (%s, %s, 'MEMBER', 'Member', TRUE, 'jubilee_hills_members_csv')""",
                        (person_id, company_id))

            # Membership ID as contact identifier
            if admission_no:
                cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value, platform, source)
                               VALUES (%s, 'MEMBERSHIP', %s, 'Jubilee Hills Co-Op', 'jubilee_hills_members_csv')""",
                            (person_id, admission_no))

            count += 1
            if count % 500 == 0:
                conn.commit()
                print(f"  {count:,} imported...")

    conn.commit()
    print(f"\nDONE: {count:,} Jubilee Hills members imported")

    cur.execute("SELECT COUNT(*) FROM people")
    print(f"  Total people: {cur.fetchone()[0]:,}")
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
