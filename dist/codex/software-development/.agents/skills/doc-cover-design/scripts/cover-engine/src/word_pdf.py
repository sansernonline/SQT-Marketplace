"""Open each docx in real Word (COM), embed fonts, re-save, export PDF, then rasterise for checking.

    build/pdf/<p>-srs-cover-sample.pdf
    build/qa/<p>-80-1.png, -80-2.png   (pdftoppm -r 80, pages 1-2: the pages to look at)
    build/qa/<p>-150-1.png             (page 1 at 150 dpi: compared with covers/<p>-srs.png by calibrate.py)
"""
import shutil
import subprocess
from pathlib import Path

import pythoncom
import win32com.client

ROOT = Path(__file__).resolve().parents[1]
PDF, QA = ROOT / "build" / "pdf", ROOT / "build" / "qa"
WD_EXPORT_PDF, WD_OPTIMIZE_PRINT = 17, 0


def export(docx_files):
    PDF.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    pythoncom.CoInitialize()
    word = win32com.client.DispatchEx("Word.Application")   # own instance, never the user's open Word
    word.Visible, word.DisplayAlerts = False, 0
    pdfs = []
    try:
        for f in docx_files:
            d = word.Documents.Open(str(f), ReadOnly=False, AddToRecentFiles=False)
            d.EmbedTrueTypeFonts = True        # file opens the same on a PC without the cover fonts
            d.SaveSubsetFonts = False          # full fonts, so the reader can still edit the title
            d.Save()
            pdf = PDF / (f.stem + ".pdf")
            d.ExportAsFixedFormat(str(pdf), WD_EXPORT_PDF, OptimizeFor=WD_OPTIMIZE_PRINT)
            d.Close(False)
            pdfs.append(pdf)
    finally:
        word.Quit()
    for pdf in pdfs:
        key = pdf.stem.removesuffix("-srs-cover-sample")
        subprocess.run(["pdftoppm", "-png", "-r", "80", "-f", "1", "-l", "2", str(pdf), str(QA / f"{key}-80")], check=True)
        subprocess.run(["pdftoppm", "-png", "-r", "150", "-f", "1", "-l", "1", "-singlefile", str(pdf), str(QA / f"{key}-150-1")], check=True)
        for n in (1, 2):   # pdftoppm pads page numbers by page count; normalise names
            for cand in QA.glob(f"{key}-80-*{n}.png"):
                if cand.name != f"{key}-80-{n}.png":
                    shutil.move(cand, QA / f"{key}-80-{n}.png")
    return pdfs


def sheet(projects=("litenet", "swipeos", "telex")):
    """build/qa/word-pages.png: Word's own pages 1-2 for each project, side by side (the thing to look at)."""
    from PIL import Image
    pages = [Image.open(QA / f"{p}-80-{n}.png").convert("RGB") for p in projects for n in (1, 2)]
    w, h, gap = pages[0].width, pages[0].height, 24
    out = Image.new("RGB", (len(pages) * (w + gap) + gap, h + 2 * gap), "#E9E9E6")
    for i, im in enumerate(pages):
        out.paste(im.resize((w, h)), (gap + i * (w + gap), gap))
    out.save(QA / "word-pages.png")
    return QA / "word-pages.png"


if __name__ == "__main__":
    for p in export(sorted((ROOT / "docx").glob("*-srs-cover-sample.docx"))):
        print("pdf", p.name)
