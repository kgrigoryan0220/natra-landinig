// Renders the Open Graph / Twitter card (1200×630) into src/assets/og/og-image.png.
// Usage: npm run og   (needs Playwright; run again after replacing screenshots)
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs/promises';
import { loadChromium } from './lib/browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const u = (rel) => pathToFileURL(path.join(ROOT, rel)).href;
const shot = async (slot) => {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const rel = `src/assets/screenshots/${slot}.${ext}`;
    try { await fs.access(path.join(ROOT, rel)); return u(rel); } catch {}
  }
  throw new Error(`missing screenshot ${slot}`);
};

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:C;src:url(${u('src/fonts/cormorant-garamond-latin-wght-normal.woff2')});font-weight:300 700}
@font-face{font-family:C;font-style:italic;src:url(${u('src/fonts/cormorant-garamond-latin-wght-italic.woff2')});font-weight:300 700}
@font-face{font-family:S;src:url(${u('src/fonts/dm-sans-latin-wght-normal.woff2')});font-weight:100 1000}
@font-face{font-family:M;src:url(${u('src/fonts/dm-mono-latin-400-normal.woff2')})}
*{box-sizing:border-box}html,body{margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;color:#F1EFF8;font-family:S;
background:radial-gradient(700px 420px at 92% -10%,rgba(94,62,243,.42),transparent 70%),radial-gradient(500px 360px at -5% 110%,rgba(94,62,243,.16),transparent 70%),#0A0A0F}
.stars{position:absolute;inset:0}
.copy{position:absolute;left:84px;top:130px;width:600px}
.eyebrow{font:400 19px S;color:#B9B5CC;margin:0 0 22px}
h1{font:600 76px/1.02 C;margin:0 0 26px;letter-spacing:-.005em}
p.promise{font:italic 300 46px/1.15 C;color:#F0EEF8;margin:0 0 30px}
p.sub{font:400 22px/1.5 S;color:#B9B5CC;margin:0;max-width:520px}
.phone{position:absolute;padding:9px;border-radius:44px/44px;background:#0c0c12;box-shadow:0 0 0 1px rgba(255,255,255,.04),0 0 0 3px rgba(155,143,255,.08),0 30px 80px -20px #000,0 0 120px -20px rgba(94,62,243,.5)}
.phone div{position:relative;overflow:hidden;border-radius:36px}
.phone div::after{content:'';position:absolute;left:33.9%;top:1.3%;width:32.2%;height:4.4%;border-radius:99px;background:#000}
.phone img{display:block;width:100%}
.p1{width:270px;left:850px;top:70px;z-index:2}
.p2{width:236px;left:705px;top:150px;opacity:.9}
</style></head><body>
<svg class="stars" width="1200" height="630">${Array.from({length:120},(_, i)=>{const x=(i*997)%1200,y=(i*571)%630,r=((i*37)%10)/10+0.3,o=((i*53)%60)/100+0.1;return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity="${o}"/>`}).join('')}</svg>
<div class="copy">
  <p class="eyebrow">Natra · astrology from your own birth chart</p>
  <h1>Ask a question.<br>Get a clear answer.</h1>
  <p class="sub">Yes, no, maybe or not yet — read from the chart of the moment you ask, with the reasons in plain words.</p>
</div>
<div class="phone p2"><div><img src="${await shot('compatibility')}"></div></div>
<div class="phone p1"><div><img src="${await shot('ask-verdict')}"></div></div>
</body></html>`;

const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const tmp = path.join(ROOT, 'src/assets/og/.og.html');
await fs.mkdir(path.dirname(tmp), { recursive: true });
await fs.writeFile(tmp, html);
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(ROOT, 'src/assets/og/og-image.png') });
await browser.close();
await fs.rm(tmp);
console.log('Wrote src/assets/og/og-image.png (1200×630)');
