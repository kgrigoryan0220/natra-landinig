// Full-page screenshots of all pages at 1440 px and 390 px into reports/30-site/.
// Usage: npm run build && npm run shots
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadChromium } from './lib/browser.mjs';
import { startServer } from './lib/static-server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'reports/30-site');
const PAGES = [['home', '/'], ['privacy', '/privacy'], ['terms', '/terms'], ['support', '/support'], ['404', '/404']];
const VIEWPORTS = [['desktop-1440', 1440, 900], ['mobile-390', 390, 844]];

await fs.mkdir(OUT, { recursive: true });
const server = await startServer(path.join(ROOT, 'dist'));
const base = `http://127.0.0.1:${server.address().port}`;
const chromium = await loadChromium();
const browser = await chromium.launch();
for (const [vname, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  for (const [name, url] of PAGES) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Load lazy images before a full-page capture.
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager';
      await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    });
    const file = path.join(OUT, `${name}-${vname}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('saved', path.relative(ROOT, file));
  }
  await page.close();
}
await browser.close();
server.close();
