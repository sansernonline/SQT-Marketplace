// EXAMPLE DATA (LiteNet · Telex · SwipeOS) — replace with your project; logos go in cover-engine/assets/<project>/
// Project data only. Layout code lives in cover.js. Paths are relative to src/web/.
// Facts: titles from each project's docx/README (read-only), dates = the docs' own dates, ISO format for all 3.
//   LiteNet 2026-10-15 (revision table v0.3 in LITENET-{BRD,SRS,ARCH}-v0.3) · Telex 2026-10-11 (TLX cover table)
//   SwipeOS 2026-10-13 (docs/README.md "อัปเดตล่าสุด" + SRS cover)
// Round 2 final (base Z): version lives in exactly one place per cover, always live Word text (pill, tab, badge).
// series = the X series line above the title; the doc id lives there, so it left the meta row.
const SURVEY = "../../assets/";
window.PROJECTS = {
  litenet: {
    code: "LITENET", idea: "tile", defaultTheme: "dark",
    fonts: { title: "'IBM Plex Sans Thai'", latin: "'IBM Plex Sans Thai'", mono: "'IBM Plex Mono'" },
    series: "LiteNet Document Series",
    meta: [["วันที่", () => "2026-10-15"]],
    tag: v => `ฉบับร่าง ${v}`,                       // Thailand Digital Outlook 2025 pill tag
    promise: "เครือข่ายส่วนตัวแบบ mesh ที่ตั้งบนเซิร์ฟเวอร์ของคุณเอง",
    docs: {
      BRD:  { ver: "0.3", th: ["เอกสารความต้องการ", "ทางธุรกิจ"], en: "Business Requirements Document" },
      SRS:  { ver: "0.3", th: ["ข้อกำหนดความต้องการ", "ซอฟต์แวร์"], en: "Software Requirements Specification" },
      ARCH: { ver: "0.3", th: ["สถาปัตยกรรมระบบ"], en: "System Architecture" }
    },
    // field below the text, by doc family (Y's colour per volume, kept to the 3 brand tokens) + joined tiles by doc
    fieldOf: { BRD: "lime", SRS: "ink", ARCH: "paper" }, joined: { BRD: 2, SRS: 6, ARCH: 11 },
    fields: {
      lime:  { bg: "#B8FF2C", a: "#0A0A0A", b: "#EDEDED", sideA: "#3F7A00", sideB: "#7DB31A", line: "#8FD11F" },
      ink:   { bg: "#0A0A0A", a: "#EDEDED", b: "#B8FF2C", sideA: "#5E5E5E", sideB: "#4F7012", line: "#333333" },
      paper: { bg: "#EDEDED", a: "#0A0A0A", b: "#3F7A00", sideA: "#8A8A8A", sideB: "#A9C98A", line: "#C4C4C4" },
      print: { bg: "#F7F7F5", a: "#0A0A0A", b: "#3F7A00", sideA: "#9A9A9A", sideB: "#A9C98A", line: "#C4C4C4" }
    },
    themes: {
      dark:  { bg: "#0A0A0A", ink: "#EDEDED", ink2: "#D4D4D4", muted: "#A3A3A3", line: "#333333", a: "#EDEDED", b: "#B8FF2C",
               sideA: "#5E5E5E", sideB: "#4F7012", pillInk: "#0A0A0A",
               logo: SURVEY + "litenet/litenet-wordmark.svg" },
      print: { bg: "#F7F7F5", ink: "#0A0A0A", ink2: "#262626", muted: "#555555", line: "#C4C4C4", a: "#0A0A0A", b: "#3F7A00",
               sideA: "#9A9A9A", sideB: "#A9C98A", pillInk: "#FFFFFF", field: "print",
               logo: SURVEY + "litenet/litenet-wordmark-light.svg" }
    }
  },
  telex: {
    code: "TLX", idea: "shot", defaultTheme: "paper",
    fonts: { title: "'Space Grotesk'", latin: "'Space Grotesk'", mono: "'JetBrains Mono'" },
    series: "Telex Document Series",
    meta: [["DATE", () => "2026-10-11"], ["SCREEN", (d, doc) => doc.screen]],
    tag: v => `v${v} · DRAFT`,                        // O'Reilly edition flag, as a tab hanging from the top edge
    product: "Telex — Terminal for Windows",
    promise: "SSH, Telnet, RDP, VNC, SFTP, serial and X11 in one Windows app.",
    docs: {
      // crop: [scale of the 1440x900 screen, screen x, screen y] at the crop's top-left (method B numbers)
      BRD:  { ver: "0.3", en: ["Business Requirements", "Document"], screen: "01-main-window", crop: [1.2, 0, 0], band: "light" },
      SRS:  { ver: "0.3", en: ["Software Requirements", "Specification"], screen: "01-main-window", crop: [2.0, 284, 0], band: "mid" },
      ARCH: { ver: "0.4", en: ["Architecture"], screen: "04-multi-exec-split", crop: [1.2, 60, 0], band: "deep" }
    },
    // band colour by doc, all from Telex's violet: violet-200 / the logo violet-700 / violet-950
    // cursor = a violet that passes 4.5:1 on its own band (on the dark bands a lighter violet tint)
    bands: {
      light: { band: "#DDD6FE", onBand: "#14121F", onBand2: "#4C1D95", cursor: "#6D28D9" },
      mid:   { band: "#6D28D9", onBand: "#FFFFFF", onBand2: "#EDE9FE", cursor: "#DDD6FE" },
      deep:  { band: "#2E1065", onBand: "#FFFFFF", onBand2: "#DDD6FE", cursor: "#A78BFA" }
    },
    themes: {
      paper: { bg: "#F3F1EC", ink: "#14121F", ink2: "#14121F", muted: "#4A4658", line: "#14121F", accent: "#6D28D9",
               logo: SURVEY + "telex/telex-logo-light.svg" }
    }
  },
  swipeos: {
    code: "SWIPEOS", idea: "grid", defaultTheme: "light",
    fonts: { title: "'Anuphan'", latin: "'Space Grotesk'", mono: "'JetBrains Mono'" },
    series: "SwipeOS Document Series",
    meta: [["สถานะ", () => "DRAFT"], ["วันที่", () => "2026-10-13"]],
    tagline: "Gesture to Command",
    promise: "ท่ามือหน้าเว็บแคม กลายเป็นคีย์ลัด ทำงานออฟไลน์ ไม่ส่งภาพออกนอกเครื่อง",
    // MediaPipe hand landmarks 0-20 and bones, copied from the product mockup (SWIPEOS-mockup.html, setup step,
    // "open palm facing the camera", 400x300 preview space). Every pictogram is posed from these bone lengths.
    hand: [[290, 160], [272, 150], [260, 137], [252, 124], [246, 113], [277, 122], [274, 103], [272, 91], [271, 80],
           [290, 119], [290, 98], [290, 85], [290, 73], [302, 122], [305, 103], [307, 91], [308, 81], [312, 129],
           [318, 115], [321, 105], [323, 96]],
    bones: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13],
            [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]],
    docs: {
      // no = row in the docs table of docs/README.md (PLAN 1, BRD 2, SRS 3, ARCH 4, FSD 5, TESTPLAN 6, MAN 7):
      // the series number picks the highlighted tile G<no>, so up to 12 documents each get their own tile
      BRD:  { no: 2, ver: "0.2", th: ["เอกสารความต้องการทางธุรกิจ"], en: "Business Requirements Document (BRD)" },
      SRS:  { no: 3, ver: "0.3", th: ["เอกสารข้อกำหนดซอฟต์แวร์"], en: "Software Requirements Specification (SRS)" },
      ARCH: { no: 4, ver: "0.6", th: ["สถาปัตยกรรมระบบ"], en: "Architecture" }
    },
    themes: {
      light: { bg: "#F2F6F3", ink: "#08170E", ink2: "#08170E", muted: "#4A5A50", line: "#C9D6CD", a: "#8DBFA2", b: "#0B7A3E",
               pillInk: "#FFFFFF", logo: SURVEY + "swipeos/swipeos-logo-light.svg" }
    }
  }
};
