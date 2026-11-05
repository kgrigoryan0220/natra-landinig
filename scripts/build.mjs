// Builds the static site into dist/.  Usage: npm run build
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Marked } from 'marked';

import cfg from '../site.config.mjs';
import { slugify } from './lib/html.mjs';
import { layout } from '../src/templates/layout.mjs';
import { homePage, legalPage, supportPage, notFoundPage } from '../src/templates/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const p = (...a) => path.join(ROOT, ...a);

// Screenshot slots. To replace a screenshot, overwrite src/assets/screenshots/<slot>.png
// (or .jpg / .webp) with a new raw screen capture and rebuild.
export const SCREEN_SLOTS = ['home', 'chart-wheel', 'ask-verdict', 'compatibility'];
const SCREEN_WIDTHS = [240, 360, 480, 600];
const LEGAL_DOCS = ['privacy', 'terms'];

const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
const write = async (rel, data) => {
  const file = path.join(DIST, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
};
const warn = (m) => console.warn(`\x1b[33m!\x1b[0m ${m}`);

async function main() {
  const started = Date.now();
  if (!cfg.locales.includes(cfg.defaultLocale)) throw new Error('defaultLocale must be listed in locales');
  if (/\/$/.test(cfg.SITE_URL)) throw new Error('SITE_URL must not end with "/"');

  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  const assets = {};

  // Fonts + licenses
  for (const f of await fs.readdir(path.join(SRC, 'fonts'))) {
    await fs.copyFile(path.join(SRC, 'fonts', f), path.join(DIST, 'fonts', f)).catch(async () => {
      await fs.mkdir(path.join(DIST, 'fonts'), { recursive: true });
      await fs.copyFile(path.join(SRC, 'fonts', f), path.join(DIST, 'fonts', f));
    });
  }
  assets.preloadFonts = ['fonts/cormorant-garamond-latin-wght-normal.woff2', 'fonts/dm-sans-latin-wght-normal.woff2'];

  // Star dust tiles
  await write('img/stars-a.svg', starsSvg(520, 90, 11, 0.55));
  await write('img/stars-b.svg', starsSvg(640, 46, 29, 0.9));

  // CSS / JS with content hash
  const css = await fs.readFile(path.join(SRC, 'styles/site.css'));
  assets.css = `assets/site.${hash(css)}.css`;
  await write(assets.css, css);
  const js = await fs.readFile(path.join(SRC, 'scripts/site.js'));
  assets.js = `assets/site.${hash(js)}.js`;
  await write(assets.js, js);

  // Icons
  Object.assign(assets, await buildIcons());

  // Screenshots
  assets.screens = {};
  for (const slot of SCREEN_SLOTS) assets.screens[slot] = await buildScreen(slot);

  // Open Graph image
  const ogSrc = p('src/assets/og/og-image.png');
  if (!existsSync(ogSrc)) throw new Error('Missing src/assets/og/og-image.png — run `npm run og` first.');
  const og = await fs.readFile(ogSrc);
  assets.og = { file: `assets/og.${hash(og)}.png`, alt: 'Natra — a personal astrologer that explains, not scares.' };
  await write(assets.og.file, og);

  // Official store badges, if the owner added them
  if (existsSync(p('src/assets/badges'))) {
    for (const f of await fs.readdir(p('src/assets/badges'))) {
      if (!f.startsWith('.') && f !== 'README.txt') await write(`badges/${f}`, await fs.readFile(p('src/assets/badges', f)));
    }
  }

  // Pages
  const sitemap = [];
  const today = new Date().toISOString().slice(0, 10);
  for (const locale of cfg.locales) {
    const t = JSON.parse(await fs.readFile(p('content', locale, 'site.json'), 'utf8'));
    const ctx = makeCtx({ t, locale, assets });

    const pages = [homePage(ctx), supportPage(ctx)];
    const legal = {};
    for (const key of LEGAL_DOCS) {
      legal[key] = await loadLegal(locale, key);
      pages.push(legalPage(ctx, legal[key]));
    }
    if (locale === cfg.defaultLocale) pages.push(notFoundPage(ctx));

    for (const page of pages) {
      const html = layout(ctx, page);
      await write(outFile(locale, page.path), html);
      if (!page.noindex) {
        sitemap.push({
          loc: ctx.url(page.path, { absolute: true }),
          lastmod: legal[page.key]?.updatedISO || today,
        });
      }
    }
  }

  // sitemap.xml, robots.txt, manifest, headers
  await write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
  );
  await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${cfg.SITE_URL}/sitemap.xml\n`);
  await write(
    'site.webmanifest',
    JSON.stringify(
      {
        name: 'Natra',
        short_name: 'Natra',
        start_url: '/',
        display: 'browser',
        background_color: '#0B0B10',
        theme_color: '#0B0B10',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2
    )
  );
  await write('_headers', HEADERS);

  console.log(`Built ${sitemap.length + 1} pages into dist/ in ${((Date.now() - started) / 1000).toFixed(1)}s (SITE_URL=${cfg.SITE_URL})`);
}

/* ---------- helpers ---------- */

function makeCtx({ t, locale, assets }) {
  const url = (pathname, { absolute = false, locale: l = locale } = {}) => {
    const prefix = l === cfg.defaultLocale ? '' : `/${l}`;
    let out = pathname === '/' ? `${prefix}/` : `${prefix}${pathname}`;
    return absolute ? `${cfg.SITE_URL}${out}` : out;
  };
  const marked = new Marked({ gfm: true });
  const md = {
    // Markdown for short texts in site.json. Root-relative links get the locale prefix.
    block: (text) => marked.parse(text).replace(/href="(\/[^"]*)"/g, (_, h) => `href="${url(h)}"`),
  };
  return { t, cfg, assets, locale, url, md };
}

function outFile(locale, pathname) {
  const dir = locale === cfg.defaultLocale ? '' : `${locale}/`;
  if (pathname === '/') return `${dir}index.html`;
  return `${dir}${pathname.slice(1)}.html`;
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

async function loadLegal(locale, key) {
  const file = p('content', locale, 'legal', `${key}.md`);
  const src = await fs.readFile(file, 'utf8');

  const h1 = src.match(/^#\s+(.+)$/m);
  if (!h1) throw new Error(`${file}: no "# Title" line`);
  const title = h1[1].replace(/\s+[—-]\s+Natra\s*$/, '').trim();

  // "Last updated" comes from the document text itself.
  const m = src.match(/\*\*Last updated:\*\*\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) throw new Error(`${file}: cannot find "**Last updated:** Month D, YYYY"`);
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month < 0) throw new Error(`${file}: unknown month "${m[1]}"`);
  const updatedISO = `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  const updatedShort = `${m[2]} ${m[1].slice(0, 3).toUpperCase()} ${m[3]}`;

  const marked = new Marked({ gfm: true });
  let html = marked.parse(src);

  // Anchors for headings, scrollable wrapper for tables. Text is not changed.
  const used = new Set();
  const headings = [];
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    let id = slugify(inner) || 'section';
    while (used.has(id)) id += '-x';
    used.add(id);
    if (level === '2') headings.push({ id, html: inner });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  // On phones each table row is shown as a card; data-label carries the column name.
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, (_, inner) => {
    const labels = [...(inner.match(/<thead>[\s\S]*?<\/thead>/)?.[0] || '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, '').replace(/"/g, '&quot;')
    );
    const body = inner.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, cells) => {
      let i = 0;
      return `<tr>${cells.replace(/<td([^>]*)>/g, (m0, a) => `<td${a} data-label="${labels[i++] ?? ''}">`)}</tr>`;
    });
    return `<div class="table-wrap" role="region" aria-label="Table" tabindex="0"><table>${body}</table></div>`;
  });

  return { key, title, updatedISO, updatedShort, html, headings };
}

async function readScreenSource(slot) {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const f = p('src/assets/screenshots', `${slot}.${ext}`);
    if (existsSync(f)) return { file: f, buf: await fs.readFile(f) };
  }
  throw new Error(`Missing screenshot src/assets/screenshots/${slot}.png`);
}

async function buildScreen(slot) {
  const { file, buf } = await readScreenSource(slot);
  const meta = await sharp(buf).metadata();
  const ratio = meta.height / meta.width;
  if (Math.abs(ratio - 1932 / 894) > 0.08) {
    warn(`${path.basename(file)} is ${meta.width}×${meta.height}; expected a phone screen (about 9:19.5). Is it still inside a frame? See "npm run crop-framed".`);
  }
  const h = hash(buf);
  const out = { width: 0, height: 0, variants: { avif: [], webp: [] }, fallback: null };
  for (const w of SCREEN_WIDTHS) {
    const width = Math.min(w, meta.width);
    const height = Math.round(width * ratio);
    const base = sharp(buf).resize(width);
    const avif = `assets/screens/${slot}-${width}.${h}.avif`;
    const webp = `assets/screens/${slot}-${width}.${h}.webp`;
    await write(avif, await base.clone().avif({ quality: 55, effort: 4 }).toBuffer());
    await write(webp, await base.clone().webp({ quality: 80 }).toBuffer());
    out.variants.avif.push({ file: avif, width });
    out.variants.webp.push({ file: webp, width });
    if (w === 480) {
      out.width = width;
      out.height = height;
      out.fallback = { file: `assets/screens/${slot}-${width}.${h}.jpg` };
      await write(out.fallback.file, await base.clone().flatten({ background: '#0B0B10' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer());
    }
  }
  return out;
}

async function buildIcons() {
  let src = p('src/assets/icon/app-icon.png');
  let buf;
  if (existsSync(src)) {
    buf = await fs.readFile(src);
  } else {
    warn('src/assets/icon/app-icon.png not found — using a temporary placeholder icon.');
    buf = await sharp(Buffer.from(PLACEHOLDER_ICON)).png().toBuffer();
  }
  const png = (size) => sharp(buf).resize(size, size).png().toBuffer();
  const icon64 = await png(64);
  const icon64File = `assets/icon-64.${hash(icon64)}.png`;
  await write(icon64File, icon64);
  await write('apple-touch-icon.png', await png(180));
  await write('icon-192.png', await png(192));
  await write('icon-512.png', await png(512));
  await write('favicon-32.png', await png(32));
  await write('favicon.ico', icoFromPng(await png(32), 32));
  return { icon64: icon64File };
}

// ICO container with one embedded PNG (supported by all current browsers).
function icoFromPng(pngBuf, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngBuf.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, pngBuf]);
}

// Deterministic star field tile.
function starsSvg(size, count, seed, maxOpacity) {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const dots = Array.from({ length: count }, () => {
    const x = (rnd() * size).toFixed(1);
    const y = (rnd() * size).toFixed(1);
    const r = (0.4 + rnd() * rnd() * 1.2).toFixed(2);
    const o = (0.15 + rnd() * (maxOpacity - 0.15)).toFixed(2);
    const c = rnd() > 0.75 ? '#c3bcff' : '#ffffff';
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity="${o}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${dots}</svg>`;
}

const PLACEHOLDER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<defs><radialGradient id="g" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#3a2c7a"/><stop offset="1" stop-color="#0b0b10"/></radialGradient></defs>
<rect width="1024" height="1024" fill="url(#g)"/>
<circle cx="512" cy="512" r="400" fill="none" stroke="#c3bcff" stroke-width="18"/>
<path d="M512 250c14 140 122 248 262 262-140 14-248 122-262 262-14-140-122-248-262-262 140-14 248-122 262-262Z" fill="#fff"/>
</svg>`;

const HEADERS = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=2592000
`;

main().catch((e) => {
  console.error(`\x1b[31m✗\x1b[0m ${e.message}`);
  process.exit(1);
});
