// Visual QA: renders every page at several widths, reports layout problems and saves screenshots.
// Usage: npm run build && npm run qa [-- --browsers=chromium,webkit]
// Output: reports/qa/<browser>-<page>-<width>.png and a summary in the console.
import path from 'node:path';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { startServer } from './lib/static-server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'reports/qa');
const PAGES = [['home', '/'], ['support', '/support'], ['privacy', '/privacy'], ['terms', '/terms'], ['404', '/404']];
const WIDTHS = [360, 390, 768, 1024, 1280, 1440];
const arg = process.argv.find((a) => a.startsWith('--browsers='));
const BROWSERS = arg ? arg.split('=')[1].split(',') : ['chromium'];

const require = createRequire(import.meta.url);
const pw = require('playwright');

await fs.mkdir(OUT, { recursive: true });
const server = await startServer(path.join(ROOT, 'dist'));
const base = `http://127.0.0.1:${server.address().port}`;
let problems = 0;

for (const bname of BROWSERS) {
  const browser = await pw[bname].launch();
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (const [name, url] of PAGES) {
      await page.goto(base + url, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
        window.scrollTo(0, 0);
      });
      const report = await page.evaluate((mobile) => {
        const out = [];
        const vw = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth}px > ${vw}px`);
        const inScroller = (el) => {
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
          }
          return false;
        };
        const seen = new Set();
        for (const el of document.querySelectorAll('main *, header *, footer *')) {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if ((r.right > vw + 1 || r.left < -1) && !inScroller(el)) {
            const key = el.tagName + '.' + el.className;
            if (!seen.has(key)) {
              seen.add(key);
              out.push(`outside viewport: <${el.tagName.toLowerCase()} class="${el.className}"> ${Math.round(r.left)}..${Math.round(r.right)}`);
            }
          }
          // text clipped inside its own box
          const cs = getComputedStyle(el);
          if (!el.closest('.sr-only') && el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 2 && cs.overflowX !== 'visible' && cs.display !== 'inline') {
            out.push(`clipped text: <${el.tagName.toLowerCase()} class="${el.className}"> "${el.textContent.trim().slice(0, 40)}"`);
          }
        }
        if (mobile) {
          for (const el of document.querySelectorAll('a, button, summary')) {
            const r = el.getBoundingClientRect();
            if (!r.width) continue;
            if (r.height < 32 && getComputedStyle(el).display !== 'inline') out.push(`small tap target (${Math.round(r.width)}×${Math.round(r.height)}): "${el.textContent.trim().slice(0, 30)}"`);
          }
        }
        for (const img of document.images) if (!img.complete || !img.naturalWidth) out.push(`image not loaded: ${img.currentSrc || img.src}`);
        return out;
      }, width < 700);
      const file = path.join(OUT, `${bname}-${name}-${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const all = [...report, ...errors.map((e) => 'console: ' + e)];
      problems += all.length;
      console.log(`${all.length ? '✗' : '✓'} ${bname} ${name} ${width}px${all.length ? '\n    ' + all.join('\n    ') : ''}`);
    }
    await page.close();
  }
  await browser.close();
}
server.close();
console.log(problems ? `\n${problems} problem(s) found` : '\nNo layout problems found');
