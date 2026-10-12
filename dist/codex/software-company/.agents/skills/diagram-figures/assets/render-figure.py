"""
เรนเดอร์ภาพ HTML ออกเป็น PNG — ของ skill `diagram-figures`

ติดตั้งครั้งเดียว:
    pip install playwright
    playwright install chromium

ใช้:
    python render-figure.py figure-template.html figure.png 2
    python render-figure.py "figure-flow.html#accent=E10613&dark" fig-dark.png 2   # สีหลัก + พื้นเข้ม
                            ^ไฟล์ HTML       ^ไฟล์ออก  ^ตัวคูณความละเอียด

ตัวคูณ 2 = ภาพคมพอสำหรับสไลด์และงานพิมพ์ · 1 = เบลอเมื่อซูม อย่าใช้
ถ่ายเฉพาะกล่อง .sheet ไม่เอาพื้นที่ว่างรอบนอก
"""
import sys, asyncio
from pathlib import Path
from playwright.async_api import async_playwright


async def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "figure.png"
    scale = float(sys.argv[3]) if len(sys.argv) > 3 else 2

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(device_scale_factor=scale)
        page.on("console", lambda m: print("console:", m.text))   # เห็นคำเตือนเรื่อง id ที่หาไม่เจอ
        path, _, frag = src.partition("#")          # figure-flow.html#accent=E10613&dark
        url = Path(path).resolve().as_uri() + ("#" + frag if frag else "")
        await page.goto(url)
        await page.wait_for_timeout(300)               # ให้สคริปต์ลากเส้นหลังโหลดฟอนต์เสร็จ
        target = await page.query_selector(".sheet")
        if target is None:
            raise SystemExit("ไม่พบ .sheet ในไฟล์ HTML")
        await target.screenshot(path=out)
        await browser.close()
    print("เขียนไฟล์แล้ว", out)


asyncio.run(main())
