# from diagram-figures/assets/mermaid-engine
"""Colours, fonts and sizes for every generated figure. Change them here only.
ACCENT and SECOND come from the project's doc-theme; the values below are an example (a violet/cyan app)."""

ACCENT = "#7C3AED"   # brand purple
SECOND = "#22D3EE"   # brand cyan
PAPER = "#FFFFFF"
INK = "#333B4A"      # labels
MUTED = "#6B7280"    # secondary text (4.8:1 on white)
BORDER = "#E2E6EE"   # normal box border
FRAME = "#CBD3DE"    # alt / loop frames
LIFELINE = "#C9D0DC"

STATUS = {           # (text and border, fill)
    "error": ("#B91C1C", "#FDE8E8"),
    "ok":    ("#047857", "#E3F6EE"),
    "warn":  ("#B45309", "#FEF3DC"),
}

FONT = "'Noto Sans Thai','IBM Plex Sans Thai',Tahoma,'Segoe UI',sans-serif"
# Fonts used only to measure text width, same family the browser picks first on this PC
MEASURE_FONTS = {
    False: ["C:/Windows/Fonts/NotoSansThai-Regular.ttf", "C:/Windows/Fonts/IBMPlexSansThai-Regular.ttf",
            "C:/Windows/Fonts/tahoma.ttf"],
    True:  ["C:/Windows/Fonts/NotoSansThai-Bold.ttf", "C:/Windows/Fonts/IBMPlexSansThai-Bold.ttf",
            "C:/Windows/Fonts/tahomabd.ttf"],
}

SHEET_W = 1240       # A4 portrait figure width
MARGIN = 40
FS = 13              # body font size
LH = 1.5             # line height factor
LINE_W = 2
BOX_R = 10           # box corner radius (small boxes and bars use half their height)
WIRE_R = 12          # wire elbow radius (shrinks on short segments)
FOCUS_R = 14         # focus card corner radius
TAG_R = 6            # label tag corner radius
LINE_MIX = 0.45      # lifeline colour of the focus lane = accent mixed this far toward white

# direction A "light premium" (2026-10-11): gradient wires, dark focus card, white tags, dot-grid panel
WIRE_A = "#7C3AED"   # wire colour at the left edge of the sheet
WIRE_B = "#0891B2"   # wire colour at the right edge (teal, darker than SECOND so it reads on white)
FOCUS_BG = "#16161C" # the one focus card (sequence: core / back-end lane)
FOCUS_INK = "#FFFFFF"
FOCUS_SUB = "#A7A7B8"
TAG_LINE = "#DDD3FB" # white label tags
TAG_INK = "#4C1D95"
PANEL = "#FBFBFE"    # soft panel behind the figure
PANEL_LINE = "#EEEEF5"
DOT = "#DCDCE8"
DOT_STEP = 22
