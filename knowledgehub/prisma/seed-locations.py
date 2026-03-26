"""
Seed KnowledgeHub location tables from IN_villages_Pin.xlsx
672K villages, ~800 districts, 36 states, ~7K sub-districts, ~1.5L pincodes

Usage: E:/Python/python.exe prisma/seed-locations.py
"""

import openpyxl
import psycopg2
import sys
import time
from collections import defaultdict

DB_URL = "postgresql://postgres:5432@localhost:5432/knowledgehub"
XLSX_PATH = "C:/Users/CHIST/Downloads/IN_villages_Pin.xlsx"

def generate_cuid():
    """Simple cuid-like ID"""
    import random, string, time as t
    ts = hex(int(t.time() * 1000))[2:]
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
    return f"c{ts}{rand}"

def main():
    print("Loading Excel file...")
    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True)
    ws = wb['Sheet1']

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # Track unique entities
    states = {}       # state_code -> id
    districts = {}    # district_code -> id
    blocks = {}       # sub_district_code -> id
    pincodes = {}     # pincode -> id

    # First pass: collect unique states, districts, blocks, pincodes
    print("Scanning 672K rows for unique entities...")
    row_count = 0
    state_data = {}
    district_data = {}
    block_data = {}
    pincode_data = {}
    village_batch = []

    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row[1]:  # skip empty rows
            continue

        sno, state_code, state_name, dist_code, dist_name, subdist_code, subdist_name, vill_code, vill_name, pin, local_body = row[:11]

        state_code = int(state_code) if state_code else None
        dist_code = int(dist_code) if dist_code else None
        subdist_code = int(subdist_code) if subdist_code else None
        vill_code = int(vill_code) if vill_code else None
        pin = str(int(pin)) if pin else None

        if state_code and state_code not in state_data:
            state_data[state_code] = str(state_name).strip() if state_name else ''

        if dist_code and dist_code not in district_data:
            district_data[dist_code] = {
                'name': str(dist_name).strip() if dist_name else '',
                'state_code': state_code,
            }

        if subdist_code and subdist_code not in block_data:
            block_data[subdist_code] = {
                'name': str(subdist_name).strip() if subdist_name else '',
                'dist_code': dist_code,
            }

        if pin and pin not in pincode_data:
            pincode_data[pin] = {
                'dist_code': dist_code,
                'state': str(state_name).strip() if state_name else '',
                'district': str(dist_name).strip() if dist_name else '',
            }

        village_batch.append((vill_code, str(vill_name).strip() if vill_name else '', subdist_code, pin, local_body))

        row_count += 1
        if row_count % 100000 == 0:
            print(f"  Scanned {row_count} rows...")

    wb.close()

    print(f"\nUnique counts:")
    print(f"  States: {len(state_data)}")
    print(f"  Districts: {len(district_data)}")
    print(f"  Sub-Districts (Blocks): {len(block_data)}")
    print(f"  Pincodes: {len(pincode_data)}")
    print(f"  Villages: {len(village_batch)}")

    # Insert States
    print("\nInserting states...")
    # State code to 2-letter mapping (common ones)
    state_codes_2letter = {
        1:'JK',2:'HP',3:'PB',4:'CG',5:'UT',6:'HR',7:'DL',8:'RJ',9:'UP',10:'BR',
        11:'SK',12:'AR',13:'NL',14:'MN',15:'MZ',16:'TR',17:'ML',18:'AS',19:'WB',20:'JH',
        21:'OD',22:'CG',23:'MP',24:'GJ',25:'DD',26:'DN',27:'MH',28:'AP',29:'KA',30:'GA',
        31:'LK',32:'KL',33:'TN',34:'PY',35:'AN',36:'TS',37:'LA',38:'LD'
    }

    for sc, sname in state_data.items():
        sid = generate_cuid()
        code2 = state_codes_2letter.get(sc, f"S{sc}")
        stype = 'union_territory' if sc in [4,7,25,26,31,34,35,37,38] else 'state'
        cur.execute(
            'INSERT INTO "State" (id, code, name, type, "censuscode", "lgdCode") VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (code) DO NOTHING',
            (sid, code2, sname, stype, str(sc), str(sc))
        )
        states[sc] = sid
    conn.commit()
    print(f"  Inserted {len(states)} states")

    # Get actual state IDs (in case ON CONFLICT skipped some)
    cur.execute('SELECT id, "censuscode" FROM "State"')
    for row in cur.fetchall():
        cc = int(row[1]) if row[1] else None
        if cc:
            states[cc] = row[0]

    # Insert Districts
    print("Inserting districts...")
    batch = []
    for dc, dinfo in district_data.items():
        did = generate_cuid()
        sid = states.get(dinfo['state_code'])
        if not sid:
            continue
        batch.append((did, sid, f"D{dc}", dinfo['name'], str(dc), str(dc)))
        districts[dc] = did

    for i in range(0, len(batch), 500):
        chunk = batch[i:i+500]
        args = ','.join(cur.mogrify("(%s,%s,%s,%s,%s,%s)", x).decode() for x in chunk)
        cur.execute(f'INSERT INTO "District" (id, "stateId", code, name, "censuscode", "lgdCode") VALUES {args} ON CONFLICT (code) DO NOTHING')
    conn.commit()
    print(f"  Inserted {len(districts)} districts")

    # Get actual district IDs
    cur.execute('SELECT id, "censuscode" FROM "District"')
    for row in cur.fetchall():
        cc = int(row[1]) if row[1] else None
        if cc:
            districts[cc] = row[0]

    # Insert Blocks (Sub-Districts)
    print("Inserting blocks/sub-districts...")
    batch = []
    for bc, binfo in block_data.items():
        bid = generate_cuid()
        did = districts.get(binfo['dist_code'])
        if not did:
            continue
        batch.append((bid, did, binfo['name'], 'sub_district', str(bc)))
        blocks[bc] = bid

    for i in range(0, len(batch), 500):
        chunk = batch[i:i+500]
        args = ','.join(cur.mogrify("(%s,%s,%s,%s,%s)", x).decode() for x in chunk)
        cur.execute(f'INSERT INTO "Block" (id, "districtId", name, type, "lgdCode") VALUES {args}')
    conn.commit()
    print(f"  Inserted {len(blocks)} blocks")

    # Insert Pincodes
    print("Inserting pincodes...")
    batch = []
    for pin, pinfo in pincode_data.items():
        pid = generate_cuid()
        did = districts.get(pinfo['dist_code'])
        batch.append((pid, pin, did, pinfo['state'], pinfo['district']))
        pincodes[pin] = pid

    for i in range(0, len(batch), 500):
        chunk = batch[i:i+500]
        args = ','.join(cur.mogrify("(%s,%s,%s,%s,%s)", x).decode() for x in chunk)
        cur.execute(f'INSERT INTO "Pincode" (id, pincode, "districtId", state, district) VALUES {args} ON CONFLICT (pincode) DO NOTHING')
    conn.commit()
    print(f"  Inserted {len(pincodes)} pincodes")

    # Insert Villages in batches
    print("Inserting villages (this will take a few minutes)...")
    batch = []
    inserted = 0
    skipped = 0
    seen_codes = set()

    for vill_code, vill_name, subdist_code, pin, local_body in village_batch:
        bid = blocks.get(subdist_code)
        if not bid:
            skipped += 1
            continue

        # Skip duplicate village codes
        code_str = str(vill_code) if vill_code else None
        if code_str and code_str in seen_codes:
            skipped += 1
            continue
        if code_str:
            seen_codes.add(code_str)

        vid = generate_cuid()
        batch.append((vid, bid, code_str, vill_name or '', pin or ''))

        if len(batch) >= 1000:
            args = ','.join(cur.mogrify("(%s,%s,%s,%s,%s)", x).decode() for x in batch)
            try:
                cur.execute(f'INSERT INTO "Village" (id, "blockId", code, name, "nearestTown") VALUES {args} ON CONFLICT (code) DO NOTHING')
                conn.commit()
            except Exception as e:
                conn.rollback()
                # Insert one by one on error
                for item in batch:
                    try:
                        cur.execute('INSERT INTO "Village" (id, "blockId", code, name, "nearestTown") VALUES (%s,%s,%s,%s,%s) ON CONFLICT (code) DO NOTHING', item)
                        conn.commit()
                    except:
                        conn.rollback()
            inserted += len(batch)
            batch = []
            if inserted % 50000 == 0:
                print(f"  Inserted {inserted} villages...")

    # Final batch
    if batch:
        args = ','.join(cur.mogrify("(%s,%s,%s,%s,%s)", x).decode() for x in batch)
        try:
            cur.execute(f'INSERT INTO "Village" (id, "blockId", code, name, "nearestTown") VALUES {args} ON CONFLICT (code) DO NOTHING')
            conn.commit()
        except:
            conn.rollback()
        inserted += len(batch)

    print(f"  Inserted {inserted} villages, skipped {skipped}")

    # Print final counts
    print("\n✅ Location seed complete!")
    cur.execute('SELECT count(*) FROM "State"'); print(f"  States:     {cur.fetchone()[0]}")
    cur.execute('SELECT count(*) FROM "District"'); print(f"  Districts:  {cur.fetchone()[0]}")
    cur.execute('SELECT count(*) FROM "Block"'); print(f"  Blocks:     {cur.fetchone()[0]}")
    cur.execute('SELECT count(*) FROM "Pincode"'); print(f"  Pincodes:   {cur.fetchone()[0]}")
    cur.execute('SELECT count(*) FROM "Village"'); print(f"  Villages:   {cur.fetchone()[0]}")

    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
