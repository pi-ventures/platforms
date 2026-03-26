#!/usr/bin/env python3
"""
Bulk downloader for Telangana Electoral Roll PDFs from CEO Telangana.
Downloads English Mother Roll PDFs for all 119 ACs (~35,878 parts).

Usage:
    python download_all.py [--output-dir OUTPUT_DIR]

Requirements:
    pip install requests Pillow pytesseract
    Also install Tesseract OCR: https://github.com/tesseract-ocr/tesseract

Resume:
    Just re-run the script. It skips already-downloaded PDFs automatically.
"""

import requests
import re
import json
import time
import os
import sys
import argparse
import urllib3
from PIL import Image
import pytesseract
import io
import logging
from pathlib import Path

urllib3.disable_warnings()

BASE = 'https://ceotserms2.telangana.gov.in/ts_erolls/'
MAX_CAPTCHA_RETRIES = 5
DELAY_BETWEEN_DOWNLOADS = 0.5
MAX_CONSECUTIVE_FAILURES = 30

# Setup logging
log = logging.getLogger('downloader')

def setup_logging(output_dir):
    log.setLevel(logging.INFO)
    fmt = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    sh = logging.StreamHandler()
    sh.setFormatter(fmt)
    log.addHandler(sh)
    fh = logging.FileHandler(os.path.join(output_dir, 'download.log'))
    fh.setFormatter(fmt)
    log.addHandler(fh)

def get_form_fields(html):
    fields = {}
    for name in ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION']:
        m = re.search(rf'id="{name}".*?value="([^"]*)"', html, re.DOTALL)
        if m:
            fields[name] = m.group(1)
        else:
            fields[name] = ''
    return fields

def solve_captcha(session):
    """Fetch and OCR the CEO Telangana captcha (4 numeric digits)."""
    captcha_url = BASE + 'Captcha.aspx'
    r = session.get(captcha_url, timeout=15)
    img = Image.open(io.BytesIO(r.content))

    strategies = [
        # Direct
        lambda im: pytesseract.image_to_string(
            im, config='--psm 7 -c tessedit_char_whitelist=0123456789').strip(),
        # Grayscale + threshold
        lambda im: pytesseract.image_to_string(
            im.convert('L').point(lambda x: 0 if x < 128 else 255),
            config='--psm 7 -c tessedit_char_whitelist=0123456789').strip(),
        # 3x resize
        lambda im: pytesseract.image_to_string(
            im.resize((im.width * 3, im.height * 3), Image.LANCZOS),
            config='--psm 7 -c tessedit_char_whitelist=0123456789').strip(),
        # Grayscale + resize + threshold
        lambda im: pytesseract.image_to_string(
            im.convert('L').resize((im.width * 3, im.height * 3), Image.LANCZOS)
               .point(lambda x: 0 if x < 100 else 255),
            config='--psm 7 -c tessedit_char_whitelist=0123456789').strip(),
    ]

    for strat in strategies:
        try:
            text = strat(img)
            digits = ''.join(c for c in text if c.isdigit())
            if len(digits) == 4:
                return digits
        except Exception:
            pass

    # Fallback: return best partial match
    for strat in strategies:
        try:
            text = strat(img)
            digits = ''.join(c for c in text if c.isdigit())
            if len(digits) >= 3:
                return digits[:4] if len(digits) > 4 else digits
        except Exception:
            pass
    return ''

def make_popup_url(dist_id, ac_id, part_num):
    return (f"{BASE}Popuppage.aspx?partNumber={part_num}"
            f"&roll=EnglishMotherRoll"
            f"&districtName=DIST_{dist_id:02d}"
            f"&acname=AC_{ac_id:03d}"
            f"&acnameeng=A{ac_id}"
            f"&acno={ac_id}"
            f"&acnameurdu={ac_id:03d}")

def new_session():
    s = requests.Session()
    s.verify = False
    s.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                       'AppleWebKit/537.36 (KHTML, like Gecko) '
                       'Chrome/120.0.0.0 Safari/537.36'
    })
    return s

def download_pdf(session, dist_id, ac_id, part_num, output_path):
    """Download a single PDF with captcha solving. Returns True on success."""
    popup_url = make_popup_url(dist_id, ac_id, part_num)

    for attempt in range(MAX_CAPTCHA_RETRIES):
        try:
            r = session.get(popup_url, timeout=30)
            if r.status_code != 200:
                log.warning(f"Popup page returned {r.status_code}")
                return False

            fields = get_form_fields(r.text)
            captcha_text = solve_captcha(session)

            if len(captcha_text) < 3:
                continue

            data = {
                '__VIEWSTATE': fields['__VIEWSTATE'],
                '__VIEWSTATEGENERATOR': fields['__VIEWSTATEGENERATOR'],
                '__EVENTVALIDATION': fields['__EVENTVALIDATION'],
                'txtVerificationCode': captcha_text,
                'btnSubmit': 'Submit',
            }

            r2 = session.post(popup_url, data=data, timeout=120)

            if 'application/pdf' in r2.headers.get('Content-Type', ''):
                if len(r2.content) > 1000:
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    with open(output_path, 'wb') as f:
                        f.write(r2.content)
                    return True
                else:
                    log.warning(f"PDF too small ({len(r2.content)}b) - part may not exist")
                    return False

        except requests.exceptions.Timeout:
            log.warning(f"Timeout on attempt {attempt + 1}")
            time.sleep(2)
        except Exception as e:
            log.error(f"Error on attempt {attempt + 1}: {e}")
            time.sleep(1)

    return False

def sanitize_name(name):
    return re.sub(r'[^\w\-]', '_', name.replace(' ', '_'))

def main():
    parser = argparse.ArgumentParser(description='Download Telangana Electoral Roll PDFs')
    parser.add_argument('--output-dir', default='./telangana_rolls',
                        help='Directory to save PDFs (default: ./telangana_rolls)')
    parser.add_argument('--district', type=int, default=None,
                        help='Download only this district number')
    parser.add_argument('--ac', type=int, default=None,
                        help='Download only this AC number')
    args = parser.parse_args()

    output_dir = os.path.abspath(args.output_dir)
    os.makedirs(output_dir, exist_ok=True)
    setup_logging(output_dir)

    # Load manifest (bundled alongside this script)
    manifest_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 'telangana_manifest.json')
    with open(manifest_path) as f:
        manifest = json.load(f)

    # Progress file
    progress_file = os.path.join(output_dir, 'progress.json')
    if os.path.exists(progress_file):
        with open(progress_file) as f:
            progress = json.load(f)
    else:
        progress = {'downloaded': 0, 'failed': 0, 'failed_list': []}

    # Filter by district/AC if specified
    if args.district:
        manifest = {k: v for k, v in manifest.items() if int(k) == args.district}
    if args.ac:
        for d in manifest.values():
            d['acs'] = {k: v for k, v in d['acs'].items() if int(k) == args.ac}

    total_parts = sum(a['parts'] for d in manifest.values() for a in d['acs'].values())
    log.info(f"Total PDFs to download: {total_parts}")

    session = new_session()
    count = 0
    downloaded = progress['downloaded']
    failed = progress['failed']
    consecutive_failures = 0

    for dist_id_str in sorted(manifest.keys(), key=int):
        dist_id = int(dist_id_str)
        dist_data = manifest[dist_id_str]
        dist_name = dist_data['name']

        for ac_id_str in sorted(dist_data['acs'].keys(), key=int):
            ac_id = int(ac_id_str)
            ac_data = dist_data['acs'][ac_id_str]
            ac_name = ac_data['name']
            num_parts = ac_data['parts']

            if num_parts == 0:
                continue

            ac_dir_name = f"AC_{ac_id:03d}_{sanitize_name(ac_name)}"
            log.info(f"District {dist_id} ({dist_name}), AC {ac_id} ({ac_name}): {num_parts} parts")

            for part in range(1, num_parts + 1):
                output_path = os.path.join(
                    output_dir, f"DIST_{dist_id:02d}", ac_dir_name,
                    f"part_{part:04d}.pdf")

                # Skip if already exists
                if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                    continue

                count += 1
                ok = download_pdf(session, dist_id, ac_id, part, output_path)

                if ok:
                    downloaded += 1
                    consecutive_failures = 0
                    if downloaded % 10 == 0:
                        log.info(f"  Downloaded: {downloaded}/{total_parts} "
                                 f"({downloaded * 100 // total_parts}%)")
                else:
                    failed += 1
                    consecutive_failures += 1
                    progress['failed_list'].append(
                        {'dist': dist_id, 'ac': ac_id, 'part': part})

                    if consecutive_failures >= MAX_CONSECUTIVE_FAILURES:
                        log.error(f"Too many consecutive failures "
                                  f"({consecutive_failures}). Stopping.")
                        progress['downloaded'] = downloaded
                        progress['failed'] = failed
                        with open(progress_file, 'w') as f:
                            json.dump(progress, f, indent=2)
                        sys.exit(1)

                # Save progress every 50 downloads
                if count % 50 == 0:
                    progress['downloaded'] = downloaded
                    progress['failed'] = failed
                    with open(progress_file, 'w') as f:
                        json.dump(progress, f, indent=2)

                time.sleep(DELAY_BETWEEN_DOWNLOADS)

                # Fresh session every 200 downloads
                if count % 200 == 0:
                    session = new_session()

    progress['downloaded'] = downloaded
    progress['failed'] = failed
    with open(progress_file, 'w') as f:
        json.dump(progress, f, indent=2)

    log.info(f"\nDONE! Downloaded: {downloaded}, Failed: {failed}")
    log.info(f"Output: {output_dir}")

if __name__ == '__main__':
    main()
