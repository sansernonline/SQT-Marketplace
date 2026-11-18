// Existing verify script. Feature map: home, cart, checkout.
import { chromium } from 'playwright';
const checks = [
  ['home shows title', '/', '[data-testid=title]', 'Shop'],
  ['cart total is 370', '/cart', '[data-testid=total]', '370'],
  ['checkout has pay button', '/checkout', '[data-testid=pay]', 'Pay'],
];
const b = await chromium.launch(); const p = await b.newPage(); let fail = 0;
for (const [name, path, sel, want] of checks) {
  await p.goto('http://localhost:3000' + path);
  const got = (await p.textContent(sel)) ?? '';
  console.log(got.includes(want) ? 'PASS' : 'FAIL', name, 'expected', want, 'got', got); if (!got.includes(want)) fail++;
}
await b.close(); process.exit(fail ? 1 : 0);
