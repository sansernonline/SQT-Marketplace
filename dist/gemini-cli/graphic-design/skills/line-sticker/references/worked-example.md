## Worked example

Task: a dessert shop makes a set of 8 static stickers from an existing cartoon cat · Do: list 8 situations, draw all 8 images at 370 × 320 with a transparent background, make `main.png` 240 × 240 and `tab.png` 96 × 74, then run `python scripts/sticker_check.py sticker-set --kind static` · Result: if one image is 371 × 320, the script answers `ไม่ผ่าน: 03.png: 371×320 ...`. Fix it and rerun until it shows `ผ่านทุกข้อ`
