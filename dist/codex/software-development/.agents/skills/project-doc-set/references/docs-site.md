# เว็บเอกสาร (docs site)

เลือกตัวสร้างเว็บเอกสารเมื่อคู่มือหรือเอกสารนักพัฒนาต้องขึ้นเว็บ ค้นหาได้ และมีหลายรุ่น · ใช้คู่กับ `SKILL.md` ข้อ 1 (เอกสารอยู่ไหน) และแม่แบบใน [`writer-templates.md`](writer-templates.md)
ข้อเท็จจริงตรวจ 2026-10-23 จากเอกสารทางการ · npm · PyPI · GitHub และการทดสอบจริง (ตาราง "ที่มา")
ตัวย่อ: Application Programming Interface (API) · Software Development Kit (SDK) · Architecture Decision Record (ADR) · SIL Open Font License (OFL) · Software as a Service (SaaS) · user interface (UI)

## 1 · ต้องมีเว็บเอกสารไหม

| สถานการณ์ | ใช้ |
|---|---|
| คนนอกทีมอ่านบ่อย (API สาธารณะ · SDK · คู่มือที่อัปเดตทุกรุ่น) · ต้องค้นหา · มีหลายรุ่นพร้อมกัน | เว็บเอกสาร (ไฟล์นี้) |
| ทีมอ่านเอง | `README.md` + `docs/*.md` บน GitHub พอ |
| ลูกค้าเซ็นรับ | `.docx` ตาม `SKILL.md` ข้อ 2.1 · เว็บเอกสารไม่แทนเอกสารส่งมอบ |

## 2 · เทียบ 4 ตัว

| | MkDocs Material | Docusaurus | Starlight | VitePress |
|---|---|---|---|---|
| ต้องมี | Python | Node · React | Node · Astro | Node · Vue |
| รุ่นล่าสุด | 9.7.7 | 3.10.2 | 0.42.6 (ยังไม่ถึง 1.0) | 1.6.4 · รุ่น 2.0 ยังเป็น alpha |
| ค้นหาในตัว | มี · lunr.js + lunr-languages (ตั้ง `lang: th` ได้) | ไม่มี · ตัวทางการคือ Algolia DocSearch · ค้นในเครื่องใช้ปลั๊กอินชุมชน | มี · Pagefind เปิดเองไม่ต้องตั้ง | มี · MiniSearch (`provider: 'local'`) หรือ Algolia |
| หลายรุ่น (versioning) | ผ่าน `mike` ซึ่งเป็นเครื่องมือภายนอก | ในตัว `docusaurus docs:version` | ปลั๊กอินชุมชน `starlight-versions` | ไม่มี · issue #109 ยังเปิด |
| หลายภาษา (i18n) | แปล UI ได้ (มี `th`) · เว็บหลายภาษา = โปรเจกต์ละภาษา + ตัวเลือกภาษา | ในตัว | ในตัว · มี UI ภาษาไทยมาให้ | ในตัว |
| licence | MIT | MIT | MIT | MIT |

MkDocs Material: ผู้สร้างประกาศว่าดูแลเฉพาะจุดวิกฤตถึง 5 พ.ค. 2027 และให้ย้ายไป Zensical (รุ่น 0.0.71 · สถานะ Alpha · MIT) · โปรเจกต์ใหม่ที่ต้องอยู่หลายปีให้เขียนเรื่องนี้ลง ADR
เลือกเร็ว: ทีม Python → MkDocs Material (วางแผนย้าย) · ต้องหลายรุ่นในตัว → Docusaurus · อยากได้เว็บเบา ตั้งค่าน้อย → Starlight · ทีม Vue → VitePress

## 3 · ค้นหาภาษาไทย ทดสอบจริง

ภาษาไทยไม่เว้นวรรคระหว่างคำ ตัวค้นหาที่แยกคำด้วยช่องว่างจะหาคำกลางประโยคไม่เจอ · ทดสอบ 2026-10-23 ด้วยหน้าไทย 2 หน้า ค้น 9 คำ: ภาษี · กำกับ · สต็อก · สินค้า · ร้านค้า · ภาษีมูลค่าเพิ่ม · อิเล็กทรอนิกส์ · ตัดสต็อก · ทะเบียน

| ตัวค้นหา (รุ่นที่ทดสอบ) | ใช้ใน | เอกสารบอกเรื่องไทย | เจอ |
|---|---|---|---|
| Pagefind 1.5.2 (สร้าง index แล้วค้นในเบราว์เซอร์) | Starlight | มี `th` · ไม่มี stemming · หัวข้อตัดคำพูดถึงแค่จีน ญี่ปุ่น เกาหลี | 6/9 · พลาด กำกับ · ทะเบียน · ภาษีมูลค่าเพิ่ม |
| lunr 2.3.9 + lunr-languages 1.23.0 `th` (ตัดคำด้วย wordcut · ทดสอบใน Node ไม่ใช่ในธีม) | MkDocs Material · ปลั๊กอิน `@easyops-cn/docusaurus-search-local` (รับทุกภาษาของ lunr-languages) | Material รับ `lang: th` | 6/9 · พลาด ร้านค้า · ตัดสต็อก · ภาษีมูลค่าเพิ่ม |
| MiniSearch 7.2.0 ค่าตั้งต้น (prefix + fuzzy แบบ VitePress) | VitePress | VitePress ตัดคำด้วย `Intl.Segmenter` เฉพาะจีนกับญี่ปุ่น | 0/9 |
| MiniSearch + `tokenize` ที่ใช้ `Intl.Segmenter('th', { granularity: 'word' })` | VitePress (`options.miniSearch.options.tokenize`) | ตั้ง `tokenize` เองได้ | 9/9 (ทดสอบใน Node 22 · ยังไม่ได้ทดสอบใน VitePress ทั้งเว็บ) |
| Algolia DocSearch | Docusaurus · Starlight · VitePress | ตารางภาษาของ Algolia: Thai segmentation "Not supported" | ไม่ได้ทดสอบ |

- ผลขึ้นกับคำศัพท์ของโปรเจกต์ → ก่อนส่ง ค้นคำจริง 20 คำ แล้วจดผลใน README ของเว็บเอกสาร
- DocSearch ฟรีเฉพาะเอกสารเทคนิคและบล็อกเทคนิคที่เปิดสาธารณะ เว็บต้องพร้อมใช้งานจริงและไม่มีเนื้อหาที่ไม่ใช่เทคนิค

## 4 · ที่วาง

| | GitHub Pages | Cloudflare |
|---|---|---|
| ราคา | ฟรี · บัญชีฟรีต้องใช้ repo public | Pages มีแผนฟรี · Workers static assets: คำขอไฟล์ static ฟรีไม่จำกัด |
| ขีดจำกัด | เว็บ ≤ 1 GB · bandwidth 100 GB/เดือน (soft) · build 10 ครั้ง/ชม. (soft · ไม่นับ build ผ่าน GitHub Actions) · deploy เกิน 10 นาทีล้ม | Pages แผนฟรี: 500 build/เดือน · build ทีละ 1 · ไม่เกิน 20 นาที · 20,000 ไฟล์ · ไฟล์ละ ≤ 25 MiB |
| เงื่อนไข | ห้ามใช้เป็นโฮสต์ฟรีของธุรกิจออนไลน์หรือ SaaS · เว็บเป็นสาธารณะแม้ repo เป็น private | หน้า Pages บอกให้โปรเจกต์ใหม่เริ่มที่ Workers |

เอกสารที่ห้ามคนนอกเห็นไม่ขึ้นเว็บสาธารณะ เก็บเป็น `docs/*.md` ใน repo (วิธีจำกัดสิทธิ์ผู้อ่านของแต่ละเจ้ายังไม่ได้ตรวจ)

## 5 · ฟอนต์ไทย

- ใช้ฟอนต์เดียวกับแอป: `Inter` + `Noto Sans Thai` (`web-app-design` → `references/tokens.md`) · ตัวเลือกอื่นใน Google Fonts ที่มีอักษรไทยและเป็น OFL: Sarabun · IBM Plex Sans Thai · Anuphan
- โหลดผ่าน Google Fonts CSS2 API ใส่ `display=swap` · API แยกบล็อก `/* thai */` ด้วย `unicode-range: U+0E01-0E5B …` ให้เอง เบราว์เซอร์จึงโหลดเฉพาะส่วนที่หน้าใช้ (ดูจาก CSS ที่ API ส่งกลับ 2026-10-23)
- line-height ของภาษาไทยบวก 0.1 จากค่าของอังกฤษ (`ui-craft` ข้อ 2)
- ตั้งฟอนต์ตามช่องที่ธีมเปิดให้ · ชื่อตัวตั้งค่าและตัวแปร CSS ของแต่ละธีมยังไม่ได้ตรวจ

## 6 · เนื้อหาอยู่ใน repo ข้างโค้ด

- ต้นฉบับของเว็บเอกสารอยู่ในโฟลเดอร์โค้ด `<project-name>/docs/` พร้อมไฟล์ตั้งค่าของตัวสร้าง (ผังแบบ A ของ `project-bootstrap` ข้อ 1) · โค้ดกับคู่มือเปลี่ยนใน pull request เดียวกัน
- โปรเจกต์แบบ B: `.docx` ส่งมอบ · ADR · runbook · BUILD-PLAN ยังอยู่ `docs/` ที่ราก · เว็บเอกสารรับแค่ของที่คนนอกอ่าน (คู่มือ · tutorial · API reference · release notes) · เนื้อหาเดียวกันห้ามอยู่ 2 ที่
- build ใน Continuous Integration (CI) ทุก pull request และ deploy เมื่อ merge (`cicd-and-release`)
- ข้อยกเว้นของรากประกาศใน README ของโฟลเดอร์โค้ด (`SKILL.md` ข้อ 1)

## ที่มา

| เรื่อง | URL หรือหลักฐาน (2026-10-23) |
|---|---|
| MkDocs Material | https://squidfunk.github.io/mkdocs-material/ (สถานะ · Zensical) · .../plugins/search/ · .../setup/changing-the-language/ · .../setup/setting-up-versioning/ |
| Docusaurus | https://docusaurus.io/docs/search · https://docusaurus.io/docs/versioning · https://docusaurus.io/docs/i18n/introduction |
| Starlight | https://starlight.astro.build/guides/site-search/ · .../guides/i18n/ · .../resources/plugins/ |
| VitePress | https://vitepress.dev/reference/default-theme-search · https://vitepress.dev/guide/i18n · https://github.com/vuejs/vitepress/issues/109 |
| Pagefind | https://pagefind.app/docs/multilingual/ |
| lunr-languages | https://github.com/MihaiValentin/lunr-languages (ไฟล์ `lunr.th.js` ใช้ wordcut) |
| MiniSearch | https://lucaong.github.io/minisearch/types/MiniSearch.Options.html |
| Algolia | https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/supported-languages/ · https://docsearch.algolia.com/docs/who-can-apply/ |
| ปลั๊กอินค้นในเครื่องของ Docusaurus | https://github.com/easyops-cn/docusaurus-search-local |
| รุ่นและ licence | registry.npmjs.org · pypi.org · api.github.com (Zensical: GitHub = MIT · PyPI = Alpha) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits · .../creating-a-github-pages-site |
| Cloudflare | https://developers.cloudflare.com/pages/platform/limits/ · https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ |
| Google Fonts | https://developers.google.com/fonts/docs/css2 · `METADATA.pb` ใน https://github.com/google/fonts · CSS จริงจาก fonts.googleapis.com |
| ทดสอบค้นไทย | Pagefind ผ่าน `npx pagefind@1.5.2` + เบราว์เซอร์ · lunr และ MiniSearch ผ่าน Node 22 · หน้าทดสอบ 2 หน้า คำค้น 9 คำในข้อ 3 |
