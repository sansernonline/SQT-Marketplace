# Sources · dynamic-website

## Sources (checked 2026-10-22)

The reference is the website ai4ba.ai-cie.com (public code read 2026-10-22 · no licence stated → every recipe is rewritten in our own form, keeping only the ideas and the author's Thai sentences inside «…» marks).

| Topic | Source |
|---|---|
| Structure · recipes · rules · anti-patterns | The website ai4ba.ai-cie.com (index.html · css/styles.css · js/app.js · js/fx.js · js/neural.js · js/net3d.js) public code read · no licence stated · the vendor/ that the site uses was not downloaded (`ยังไม่ได้ตรวจ` not yet checked) |
| GSAP free | README gsap@3.15.0 on cdn.jsdelivr.net and gsap.com/pricing "Now Free!" — free including every plugin, commercial use allowed · free since 3.13.0 (npm 2025-04-30) · the full licence (Standard "No Charge" GSAP License · effective 2025-04-30 · last revised 2025-05-30) was read from the copy web.archive.org/web/20261017164627/https://gsap.com/standard-license because gsap.com returned a maintenance page for some pages · the text prohibits only "Prohibited Uses", meaning use in a no-code visual animation builder that competes with Webflow · the short explanation on the same page also says you may not charge end users, which contradicts the text and the pricing page, so the text governs · checked 2026-10-26 · npm gsap@3.15.0 states a license pointing to gsap.com/standard-license and has no LICENSE file in the package |
| GSAP CDN | cdnjs.com/libraries/gsap 3.15.0 (2026-04-13) · `gsap.min.js` · plugins in the same folder (`Observer.min.js` `ScrollTrigger.min.js` `SplitText.min.js` — checked 2026-10-26: all 4 files returned HTTP 200 at `cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/<name>.min.js` · api.cdnjs.com/libraries/gsap states version 3.15.0 and licence "Standard 'No Charge' GreenSock License") |
| CSS scroll-driven | developer.mozilla.org animation-timeline · drweb.de |
| View Transitions | web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available (2025-10-16) |
| `@starting-style` · scroll-snap | developer.mozilla.org/@starting-style · caniuse.com/css-snappoints |
| Lenis | github.com/darkroomengineering/lenis (MIT · 1.3.x) |
| Observer · SplitText | gsap.com/docs/v3/Plugins/Observer · Codrops "7 Must-Know GSAP Animation Tips" (2025-09-03) · Osmo masked text reveal |
| Accessibility | WCAG 2.3.3 w3.org/WAI/WCAG21/Understanding/animation-from-interactions · Heilmann 2019 (focus after scrolling) · developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners |
| Performance | web.dev/articles/animations-guide (transform/opacity · use will-change sparingly) · cost of blur and backdrop-filter: blog.openreplay.com · f22labs.com (community articles, not benchmarks) · effect of scroll-jacking on INP (`ยังไม่ได้ตรวจ` not yet checked) |
| Thai fonts | fontsource.org · fonts.google.com · github.com/line/seed |
| External skills referenced | github.com/greensock/gsap-skills (MIT · per a report compared 2026-10-22 · file content `ยังไม่ได้ตรวจ` not yet checked) · github.com/vercel-labs/web-interface-guidelines (MIT · checked 2026-10-23) |
