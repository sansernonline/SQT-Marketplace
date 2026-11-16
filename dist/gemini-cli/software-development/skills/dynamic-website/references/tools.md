# Choosing tools · dynamic-website

Open when deciding between GSAP, CSS scroll-driven animation, View Transitions and scroll-snap, or when you need more GSAP depth.

| Need | GSAP 3 (+ Observer · ScrollTrigger · SplitText) | CSS scroll-driven (`animation-timeline`) | View Transitions (same-document) | CSS scroll-snap |
|---|---|---|---|---|
| Status 2026-10 | 3.15.0 on cdnjs · every plugin free since 3.13 (2025-04) | MDN "Limited availability" · Chrome/Edge 115+ · Safari 26+ · Firefox behind a flag (Interop 2026) | Baseline Newly available · Firefox 144 · Chrome 111 · Safari 18 | 97% supported · Chrome 69 · Safari 11 · Firefox 68 |
| Choose when | Chapters that overlap in time · camera/3D rig · capturing wheel and swipe · splitting words | Progress bar · parallax · reveal in a normal scrolling page — must look fine even when it does not run | Switching a route or state where old and new DOM exist together (list → detail · theme · chapter switch with no 3D) | Chapter-style site with no JS · want the browser to handle scrolling itself |
| Do not use for | Simple reveals that CSS + IO already do | Things that must work on Firefox today with no fallback · scroll-jacking (cannot be done) | Continuous scroll-linked effects · 3D camera | Chapters with a scrolling list inside (snap will fight) · overlapping exit/enter timelines |
| reduced motion | `T()` + `gsap.matchMedia()` | kill-switch `@media (prefers-reduced-motion)` | `::view-transition-group(*){animation:none}` | turn off `scroll-behavior:smooth` |

- `@starting-style` (Baseline 2024-08) for transitions when appearing from `display:none` · Lenis 1.3.x (MIT) if you want smooth scrolling — drive it with `gsap.ticker` so there is only one rAF loop, and `respectReducedMotion:true` (the default)
- Load GSAP from cdnjs for the mockup · for real delivery, self-host the files in `vendor/` (the site must open without depending on a CDN that is down)
- If you need deeper GSAP API than this page gives (pin and scrub of ScrollTrigger · nested timelines · Flip · MorphSVG) → open the maker's official skill at github.com/greensock/gsap-skills (MIT) and read only the file of the plugin you use, do not load the whole set into context · the rules on this page (reduced motion · passive · budget) still outrank their advice
