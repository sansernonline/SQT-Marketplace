"""One command: python src/build_all.py  (from the cover-engine folder). Regenerates everything.

1 fonts.py     only when COVER_INSTALL_FONTS is set (asks the user first: installs fonts for this Windows user)
2 capture.py   real Telex mockup screens (skips shots that exist)
3 render.py    9 covers + sets + print twin + 300 dpi backgrounds + layout json + checks.json (stops on a failed check)
4 docx_build   3 SRS samples with brandkit (cover page + body page)
5 word_pdf     real Word: embed fonts, save, PDF, pdftoppm pages 1-2
6 calibrate    Word vs preview text offsets; rebuild 4-5 until within 1 px (max 3 rounds)
7 word_pdf.sheet  build/qa/word-pages.png (Word pages 1-2 of the 3 SRS samples)
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import calibrate, capture, docx_build, fonts, render, word_pdf  # noqa: E402,E401


def main():
    if os.environ.get("COVER_INSTALL_FONTS"):   # fonts are already installed; opt in to reinstall
        fonts.main()
    capture.main(capture.screens_from_projects())
    if not render.main():
        raise SystemExit("cover checks failed: see covers/checks.json")
    for rnd in range(1, 4):
        word_pdf.export(docx_build.main())
        worst = calibrate.main()
        print(f"round {rnd}: largest Word vs preview offset {worst} px")
        if worst <= 1:
            break
    word_pdf.sheet()
    print("done: covers/ bg/ docx/ build/pdf/ build/qa/")


if __name__ == "__main__":
    main()
