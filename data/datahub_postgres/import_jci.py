#!/usr/bin/env python3
"""
Import JCI Banjara Hyderabad members into DataHub PostgreSQL.
Inserts into: people, contact_identifiers, people_companies

Usage:
    E:\Python\python.exe import_jci.py --password YOUR_POSTGRES_PASSWORD
"""

import argparse
import re
import openpyxl
import psycopg2
import os

def clean(v):
    if v is None: return None
    s = str(v).strip()
    return s if s and s.lower() != 'none' else None

def clean_phones(v):
    """Return list of cleaned phone numbers (handles comma-separated)"""
    if not v: return []
    s = str(v).strip()
    if not s or s.lower() == 'none': return []
    parts = [p.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '') for p in s.split(',')]
    return [p for p in parts if p and len(p) >= 5]

def clean_name(raw):
    """Remove 'Jc. ' prefix and extract name"""
    if not raw: return None, None, None
    name = str(raw).strip()
    # Remove JCI prefixes
    name = re.sub(r'^(Jc\.|JC\.|Jci\.|JCI)\s*', '', name).strip()
    parts = name.split(None, 1)
    first = parts[0] if parts else name
    last = parts[1] if len(parts) > 1 else None
    return name, first, last

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--password', required=True)
    parser.add_argument('--host', default='localhost')
    parser.add_argument('--port', type=int, default=5432)
    parser.add_argument('--data-dir', default=os.path.dirname(os.path.abspath(__file__)) + '\\..\\')
    args = parser.parse_args()

    conn = psycopg2.connect(host=args.host, port=args.port, user='postgres',
                            password=args.password, dbname='datahub')
    cur = conn.cursor()

    # Ensure JCI Banjara company exists
    cur.execute("SELECT id FROM companies WHERE name = 'JCI Banjara Hyderabad'")
    row = cur.fetchone()
    if row:
        company_id = row[0]
    else:
        cur.execute("""INSERT INTO companies (name, category, sub_category, industry, city, state, source)
                       VALUES ('JCI Banjara Hyderabad', 'NON_PROFIT', 'ASSOCIATION', 'Social Service / Youth Leadership',
                               'Hyderabad', 'Telangana', 'JCI_Banjara_Members_xlsx')
                       RETURNING id""")
        company_id = cur.fetchone()[0]
        conn.commit()
    print(f"JCI Banjara company_id: {company_id}")

    # Clean up any previous partial import
    cur.execute("DELETE FROM contact_identifiers WHERE person_id IN (SELECT id FROM people WHERE source='JCI_Banjara_Members_xlsx')")
    cur.execute("DELETE FROM people_companies WHERE source='JCI_Banjara_Members_xlsx'")
    cur.execute("DELETE FROM people WHERE source='JCI_Banjara_Members_xlsx'")
    conn.commit()
    print("Cleaned up previous partial import (if any)")

    # Load xlsx
    xlsx_path = os.path.join(args.data_dir, 'JCI_Banjara_Hyderabad_Members.xlsx')
    if not os.path.exists(xlsx_path):
        xlsx_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'JCI_Banjara_Hyderabad_Members.xlsx')
    wb = openpyxl.load_workbook(xlsx_path, read_only=True)
    ws = wb['JCI Banjara Hyderabad']

    count = 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row[2]: continue  # skip if no name

        full_name, first_name, last_name = clean_name(row[2])
        designation = clean(row[1])
        jci_id = clean(row[3])
        address = clean(row[4])
        blood_group = clean(row[5])
        dob_raw = clean(row[6])
        dom_raw = clean(row[7])
        phones_office = clean_phones(row[8])
        phones_residence = clean_phones(row[9])
        phones_mobile = clean_phones(row[10])
        mobile = phones_mobile[0] if phones_mobile else None
        email = clean(row[11])
        occupation = clean(row[12])

        # Insert person
        cur.execute("""INSERT INTO people (full_name, first_name, last_name, address,
                       city, state, mobile_primary, email_primary, source, notes)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                       RETURNING id""",
                    (full_name, first_name, last_name, address,
                     'Hyderabad', 'Telangana', mobile, email,
                     'JCI_Banjara_Members_xlsx',
                     f"Blood: {blood_group}, DOB: {dob_raw}, DOM: {dom_raw}, Occupation: {occupation}"))
        person_id = cur.fetchone()[0]

        # Link to JCI company
        cur.execute("""INSERT INTO people_companies (person_id, company_id, role, designation,
                       is_current, source)
                       VALUES (%s, %s, %s, %s, TRUE, 'JCI_Banjara_Members_xlsx')""",
                    (person_id, company_id, 'MEMBER', designation))

        # Contact identifiers - all phones
        for i, ph in enumerate(phones_mobile):
            cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value, is_primary, platform, source)
                           VALUES (%s, 'PHONE', %s, %s, 'Mobile', 'JCI_Banjara_Members_xlsx')""",
                        (person_id, ph, i == 0))
        for ph in phones_office:
            cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value, platform, source)
                           VALUES (%s, 'PHONE', %s, 'Office', 'JCI_Banjara_Members_xlsx')""",
                        (person_id, ph))
        for ph in phones_residence:
            cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value, platform, source)
                           VALUES (%s, 'PHONE', %s, 'Residence', 'JCI_Banjara_Members_xlsx')""",
                        (person_id, ph))
        if email:
            cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value, is_primary, source)
                           VALUES (%s, 'EMAIL', %s, TRUE, 'JCI_Banjara_Members_xlsx')""",
                        (person_id, email))
        if jci_id:
            cur.execute("""INSERT INTO contact_identifiers (person_id, id_type, id_value, platform, source)
                           VALUES (%s, 'MEMBERSHIP', %s, 'JCI', 'JCI_Banjara_Members_xlsx')""",
                        (person_id, jci_id))

        count += 1

    conn.commit()
    wb.close()
    print(f"DONE: {count} JCI members imported (people + contacts + company link)")

    # Summary
    cur.execute("SELECT COUNT(*) FROM people")
    print(f"  Total people: {cur.fetchone()[0]}")
    cur.execute("SELECT COUNT(*) FROM contact_identifiers")
    print(f"  Total contact_identifiers: {cur.fetchone()[0]}")
    cur.execute("SELECT COUNT(*) FROM people_companies")
    print(f"  Total people_companies: {cur.fetchone()[0]}")

    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
