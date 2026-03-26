TELANGANA ELECTORAL ROLL PDF DOWNLOADER
=======================================

Downloads all English Mother Roll PDFs from CEO Telangana
(ceotserms2.telangana.gov.in) for the entire state.

Stats: 33 districts, 119 ACs, ~35,878 PDFs (~280 GB total)


SETUP (one-time)
----------------

1. Install Python 3.8+ if not already installed
   https://python.org/downloads

2. Install Tesseract OCR:
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
     (Download installer, add to PATH)
   - Mac: brew install tesseract
   - Linux: sudo apt install tesseract-ocr

3. Install Python packages:
   pip install requests Pillow pytesseract


RUNNING
-------

Basic (downloads to ./telangana_rolls/):
   python download_all.py

Custom output directory:
   python download_all.py --output-dir D:\electoral_rolls

Download only one district (e.g., Hyderabad = district 17):
   python download_all.py --district 17

Download only one AC (e.g., Jubilee Hills = AC 61):
   python download_all.py --district 17 --ac 61


RESUMING
--------

Just re-run the same command. The script automatically skips
already-downloaded PDFs by checking for existing files on disk.


OUTPUT STRUCTURE
----------------

telangana_rolls/
  DIST_01/
    AC_001_1-Sirpur/
      part_0001.pdf
      part_0002.pdf
      ...
    AC_005_5-Asifabad_ST_/
      part_0001.pdf
      ...
  DIST_02/
    ...
  progress.json      (tracks download state)
  download.log       (full log)


ESTIMATED TIME
--------------

~5-8 PDFs per minute (captcha fetch + OCR solve + PDF download)
~35,878 total PDFs
Estimated: 75-120 hours depending on connection speed

Tip: Run it in a screen/tmux session or as a background job:
   nohup python download_all.py &


NOTES
-----

- Captchas are 4-digit numeric codes, solved via Tesseract OCR
  (~70-80% first-attempt accuracy, retries up to 5 times)
- The script creates a fresh HTTP session every 200 downloads
- Stops after 30 consecutive failures (server might be down)
- AC 61 (Jubilee Hills) has an estimated 300 parts since the
  CEO site GridView was broken for that AC; non-existent parts
  will simply fail and be logged
