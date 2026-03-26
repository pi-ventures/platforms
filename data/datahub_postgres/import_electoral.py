#!/usr/bin/env python3
"""
Import Jubilee Hills electoral roll (Part 1) voters into DataHub PostgreSQL.
922 voters → people + contact_identifiers (EPIC)

Usage:
    E:\Python\python.exe import_electoral.py --password YOUR_POSTGRES_PASSWORD
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

    # Find CSV
    data_dir = args.data_dir or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    csv_path = os.path.join(data_dir, 'electoral_roll_jubilee_hills_part1.csv')
    if not os.path.exists(csv_path):
        csv_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'electoral_roll_jubilee_hills_part1.csv')

    print(f"Reading: {csv_path}")

    # Clean up any previous partial import
    cur.execute("DELETE FROM contact_identifiers WHERE person_id IN (SELECT id FROM people WHERE source='electoral_roll_jubilee_hills')")
    cur.execute("DELETE FROM people WHERE source='electoral_roll_jubilee_hills'")
    conn.commit()
    print("Cleaned up previous partial import (if any)")

    # Headers: S.No, EPIC Number, Name, Relation Type, Relation Name, House Number, Age, Gender, Page
    count = 0
    with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name_raw = clean(row.get('Name'))
            if not name_raw: continue

            full_name, first_name, last_name = parse_name(name_raw)
            epic = clean(row.get('EPIC Number'))
            relation_type = clean(row.get('Relation Type'))
            relation_name = clean(row.get('Relation Name'))
            house_no = clean(row.get('House Number'))
            age = parse_age(row.get('Age'))
            gender = parse_gender(row.get('Gender'))

            # Build father/husband name from relation
            father_husband = None
            if relation_type and relation_name:
                father_husband = relation_name

            # Insert person
            cur.execute("""INSERT INTO people (full_name, first_name, last_name, father_husband_name,
                           epic_number, age, gender, address, city, district, state, source, source_detail)
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                           RETURNING id""",
                        (full_name, first_name, last_name, father_husband,
                         epic, age, gender,
                         f"House No: {house_no}" if house_no else None,
                         'Hyderabad', 'Hyderabad', 'Telangana',
                         'electoral_roll_jubilee_hills',
                         f"AC 61 Jubilee Hills, Part 1, Page {row.get('Page', '')}"))
            person_id = cur.fetchone()[0]

            # EPIC as contact identifier
            if epic:
                cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value,
                               platform, is_primary, source)
                               VALUES (%s, 'EPIC', %s, 'CEO Telangana', TRUE, 'electoral_roll_jubilee_hills')""",
                            (person_id, epic))

            count += 1
            if count % 200 == 0:
                conn.commit()
                print(f"  {count:,} imported...")

    conn.commit()
    print(f"\nDONE: {count:,} voters imported")

    cur.execute("SELECT COUNT(*) FROM people")
    print(f"  Total people: {cur.fetchone()[0]:,}")
    cur.execute("SELECT COUNT(*) FROM contact_identifiers WHERE id_type='EPIC'")
    print(f"  Total EPIC identifiers: {cur.fetchone()[0]:,}")
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
