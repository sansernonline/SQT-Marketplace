"""เรนเดอร์ HTML เป็น PNG กว้าง 1920 px (960 × 2)

python scripts/diagrams/render.py <โฟลเดอร์ PNG> <ไฟล์ html ...>
ต้องมี: pip install playwright && playwright install chromium
"""
import asyncio, os, sys
from playwright.async_api import async_playwright


async def main(outdir, files):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 960, "height": 800}, device_scale_factor=2)
        for f in files:
            await page.goto("file:///" + os.path.abspath(f).replace("\\", "/"))
            await page.evaluate("document.fonts.ready")
            await page.wait_for_timeout(300)
            # รูปแบบ flow ลากเส้นด้วย draw() หลังฟอนต์โหลดเสร็จ
            await page.evaluate("typeof draw === 'function' && draw()")
            await page.wait_for_timeout(100)
            out = os.path.join(outdir, os.path.basename(f)[:-5] + ".png")
            await page.locator("#sheet").screenshot(path=out)
            print(out)
        await browser.close()


if __name__ == "__main__":
    os.makedirs(sys.argv[1], exist_ok=True)
    asyncio.run(main(sys.argv[1], sys.argv[2:]))
