// Shared page shell: <head>, header, footer, background.
import { esc, attr } from '../../scripts/lib/html.mjs';

export function layout(ctx, page) {
  const { t, cfg, assets, url } = ctx;
  const canonical = url(page.path, { absolute: true });
  const ogImage = `${cfg.SITE_URL}/${assets.og.file}`;
  const alternates =
    cfg.locales.length > 1
      ? cfg.locales
          .map((l) => `<link rel="alternate" hreflang="${l}" href="${attr(url(page.path, { absolute: true, locale: l }))}">`)
          .join('\n    ') +
        `\n    <link rel="alternate" hreflang="x-default" href="${attr(url(page.path, { absolute: true, locale: cfg.defaultLocale }))}">`
      : '';

  return `<!doctype html>
<html lang="${attr(t.lang)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${esc(page.title)}</title>
    <meta name="description" content="${attr(page.description)}">
    ${page.noindex ? '<meta name="robots" content="noindex">' : `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <link rel="canonical" href="${attr(canonical)}">${page.markdown ? `
    <link rel="alternate" type="text/markdown" href="${attr(page.markdown)}">` : ''}`}
    ${alternates}
    <meta name="apple-itunes-app" content="app-id=${attr(cfg.appleAppId)}">
    <meta name="theme-color" content="#0A0A0F">
    <meta name="color-scheme" content="dark">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Natra">
    <meta property="og:locale" content="${attr(t.ogLocale)}">
    <meta property="og:title" content="${attr(page.title)}">
    <meta property="og:description" content="${attr(page.description)}">
    <meta property="og:url" content="${attr(canonical)}">
    <meta property="og:image" content="${attr(ogImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${attr(assets.og.alt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(page.title)}">
    <meta name="twitter:description" content="${attr(page.description)}">
    <meta name="twitter:image" content="${attr(ogImage)}">
    <meta name="twitter:image:alt" content="${attr(assets.og.alt)}">
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    ${assets.preloadFonts.map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin>`).join('\n    ')}
    <link rel="stylesheet" href="/${assets.css}">
    ${page.head || ''}
  </head>
  <body class="${attr(page.bodyClass || '')}">
    <a class="skip" href="#main">${esc(t.ui.skip)}</a>
    <div class="sky" aria-hidden="true"><div class="sky__dust"></div></div>
    ${header(ctx, page)}
    <main id="main" tabindex="-1">
${page.body}
    </main>
    ${footer(ctx)}
    <script src="/${assets.js}" defer></script>
  </body>
</html>
`;
}

function header(ctx, page) {
  const { t, url, assets } = ctx;
  const onHome = page.key === 'home';
  const anchor = (id) => (onHome ? `#${id}` : `${url('/')}#${id}`);
  const links = [
    [anchor('ask'), t.ui.nav.ask, false],
    [anchor('inside'), t.ui.nav.layers, false],
    [anchor('compatibility'), t.ui.nav.compatibility, false],
    [anchor('faq'), t.ui.nav.faq, false],
    [url('/support'), t.ui.nav.support, page.key === 'support'],
  ];
  const link = ([href, label, current], cls = '') =>
    `<a${cls ? ` class="${cls}"` : ''} href="${attr(href)}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  return `<header class="site-header">
      <div class="wrap site-header__inner">
        <a class="brand" href="${attr(url('/'))}" aria-label="${attr(t.ui.homeLabel)}">
          <img class="brand__icon" src="/${assets.icon64}" width="32" height="32" alt="">
          <span class="brand__name">Natra</span>
        </a>
        <nav class="site-nav" aria-label="${attr(t.ui.nav.label)}">
          ${links.filter((l, i) => i !== 3).map((l) => link(l)).join('\n          ')}
        </nav>
        <details class="menu" data-menu>
          <summary class="menu__btn" aria-label="${attr(t.ui.menu)}"><span class="acc__row"><svg class="menu__ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false"><path class="menu__l1" d="M4 8h16"/><path class="menu__l2" d="M4 16h16"/></svg></span></summary>
          <nav class="menu__panel" aria-label="${attr(t.ui.nav.label)}">
            ${links.map((l) => link(l, 'menu__link')).join('\n            ')}
          </nav>
        </details>
      </div>
    </header>`;
}

function footer(ctx) {
  const { t, cfg, url, assets } = ctx;
  return `<footer class="site-footer">
      <div class="wrap site-footer__inner">
        <div class="site-footer__brand">
          <img class="brand__icon" src="/${assets.icon64}" width="32" height="32" alt="" loading="lazy">
          <span class="brand__name">Natra</span>
        </div>
        <ul class="site-footer__links">
          <li><a href="${attr(url('/privacy'))}">${esc(t.footer.privacy)}</a></li>
          <li><a href="${attr(url('/terms'))}">${esc(t.footer.terms)}</a></li>
          <li><a href="${attr(url('/support'))}">${esc(t.footer.support)}</a></li>
          <li><a href="mailto:${attr(cfg.email)}">${esc(cfg.email)}</a></li>
        </ul>
        <p class="site-footer__disclaimer">${esc(t.footer.disclaimer)}</p>
        <p class="site-footer__copy">${esc(cfg.copyright)}</p>
      </div>
    </footer>`;
}

// Store buttons. Inactive "Coming soon" until a URL is set in site.config.mjs.
export function storeButtons(ctx, { compact = false } = {}) {
  const { t, cfg } = ctx;
  const items = [
    { s: cfg.stores.appStore, name: t.ui.appStore, full: t.ui.appStoreFull, link: t.ui.appStoreLink },
    { s: cfg.stores.googlePlay, name: t.ui.googlePlay, full: t.ui.googlePlayFull, link: t.ui.googlePlayLink },
  ];
  const html = items
    .map(({ s, name, full, link }) => {
      if (s.url && s.badge) {
        return `<li><a class="store-badge" href="${attr(s.url)}"><img src="/badges/${attr(s.badge)}" alt="${attr(link)}" height="48"></a></li>`;
      }
      if (s.url) {
        return `<li><a class="store" href="${attr(s.url)}"><span class="store__kicker">${esc(link.replace(name, '').trim())}</span><span class="store__name">${esc(name)}</span></a></li>`;
      }
      return `<li><span class="store is-soon"><span class="store__kicker" aria-hidden="true">${esc(t.ui.storeSoon)}</span><span class="store__name" aria-hidden="true">${esc(name)}</span><span class="sr-only">${esc(full)}</span></span></li>`;
    })
    .join('');
  return `<ul class="stores${compact ? ' stores--compact' : ''}" aria-label="${attr(t.ui.storesLabel)}">${html}</ul>`;
}

// A phone frame drawn in CSS around a raw screenshot.
export function phone(ctx, slot, alt, { eager = false, priority = false, sizes, cls = '' } = {}) {
  const img = ctx.assets.screens[slot];
  if (!img) throw new Error(`Missing screenshot slot "${slot}"`);
  const srcset = (fmt) => img.variants[fmt].map((v) => `/${v.file} ${v.width}w`).join(', ');
  return `<figure class="phone ${attr(cls)}">
          <div class="phone__screen">
            <picture>
              <source type="image/avif" srcset="${srcset('avif')}" sizes="${attr(sizes)}">
              <source type="image/webp" srcset="${srcset('webp')}" sizes="${attr(sizes)}">
              <img src="/${img.fallback.file}" width="${img.width}" height="${img.height}" alt="${attr(alt)}"${
                eager ? '' : ' loading="lazy"'
              } decoding="async"${priority ? ' fetchpriority="high"' : ''}>
            </picture>
          </div>
        </figure>`;
}
