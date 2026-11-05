// Page bodies. All visible text comes from content/<locale>/site.json or the legal .md files.
import { esc, attr } from '../../scripts/lib/html.mjs';
import { storeButtons, phone } from './layout.mjs';

const STAR = `<svg class="star" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0c.5 4.2 3.8 7.5 8 8-4.2.5-7.5 3.8-8 8-.5-4.2-3.8-7.5-8-8 4.2-.5 7.5-3.8 8-8Z"/></svg>`;

/* ---------------- Landing ---------------- */

export function homePage(ctx) {
  const { t, md } = ctx;
  const L = t.landing;

  const hero = `
      <section class="hero" aria-labelledby="hero-title">
        <div class="wrap hero__grid">
          <div class="hero__copy">
            <p class="eyebrow">${esc(L.hero.eyebrow)}</p>
            <h1 id="hero-title" class="hero__title">${esc(L.hero.title)}</h1>
            <p class="hero__promise">${esc(L.hero.promise)}</p>
            <p class="hero__lead">${esc(L.hero.lead)}</p>
            ${storeButtons(ctx)}
          </div>
          <div class="hero__phones" role="group" aria-label="${attr(L.hero.phonesLabel)}">
            ${phone(ctx, 'home', L.layers.homeAlt, { eager: true, sizes: '(min-width: 1024px) 180px, 26vw', cls: 'phone--side phone--left' })}
            ${phone(ctx, 'chart-wheel', L.layers.chartAlt, { eager: true, priority: true, sizes: '(min-width: 1024px) 255px, 38vw', cls: 'phone--center' })}
            ${phone(ctx, 'ask-verdict', L.ask.screenAlt, { eager: true, sizes: '(min-width: 1024px) 180px, 26vw', cls: 'phone--side phone--right' })}
          </div>
        </div>
      </section>`;

  const steps = L.ask.steps
    .map(
      (s, i) => `
              <li class="step">
                <span class="step__num">${String(i + 1).padStart(2, '0')}</span>
                <div class="step__body">
                  <h3 class="step__title">${esc(s.title)}</h3>
                  <p>${esc(s.text)}</p>
                  <p class="step__data step__data--${attr(s.dataStyle)}">${esc(s.data)}</p>
                </div>
              </li>`
    )
    .join('');

  const ask = `
      <section class="section" id="ask" aria-labelledby="ask-title">
        <div class="wrap">
          <div class="panel panel--split">
            <div class="panel__copy">
              <p class="eyebrow">${esc(L.ask.eyebrow)}</p>
              <h2 id="ask-title" class="h2">${esc(L.ask.title)}</h2>
              <p class="lead">${esc(L.ask.lead)}</p>
              <ol class="steps">${steps}
              </ol>
              <p class="footnote">${esc(L.ask.footnote)}</p>
            </div>
            <div class="panel__media">
              ${phone(ctx, 'ask-verdict', L.ask.screenAlt, { sizes: '300px' })}
            </div>
          </div>
        </div>
      </section>`;

  const art = [weekStrip(), miniWheel(), ring(78)];
  const layers = `
      <section class="section" id="inside" aria-labelledby="inside-title">
        <div class="wrap">
          <div class="section__head">
            <p class="eyebrow">${esc(L.layers.eyebrow)}</p>
            <h2 id="inside-title" class="h2">${esc(L.layers.title)}</h2>
            <p class="lead">${esc(L.layers.lead)}</p>
          </div>
          <ol class="layers">
            ${L.layers.items
              .map(
                (it, i) => `<li class="card layer">
              <div class="layer__art" aria-hidden="true">${art[i]}</div>
              <p class="label">${esc(it.label)}</p>
              <h3 class="h3">${esc(it.title)}</h3>
              <p>${esc(it.text)}</p>
              <ul class="tags">${it.tags.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
            </li>`
              )
              .join('\n            ')}
          </ol>
        </div>
      </section>`;

  const compat = `
      <section class="section" id="compatibility" aria-labelledby="compat-title">
        <div class="wrap">
          <div class="panel panel--split panel--reverse">
            <div class="panel__copy">
              <p class="eyebrow">${esc(L.compatibility.eyebrow)}</p>
              <h2 id="compat-title" class="h2">${esc(L.compatibility.title)}</h2>
              <p class="lead">${esc(L.compatibility.lead)}</p>
              <ul class="points">
                ${L.compatibility.points
                  .map((p) => `<li>${STAR}<div><h3 class="point__title">${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`)
                  .join('\n                ')}
              </ul>
            </div>
            <div class="panel__media">
              ${phone(ctx, 'compatibility', L.compatibility.screenAlt, { sizes: '300px' })}
            </div>
          </div>
        </div>
      </section>`;

  const faq = `
      <section class="section" id="faq" aria-labelledby="faq-title">
        <div class="wrap wrap--narrow">
          <div class="section__head">
            <p class="eyebrow">${esc(L.faq.eyebrow)}</p>
            <h2 id="faq-title" class="h2">${esc(L.faq.title)}</h2>
          </div>
          <div class="faq">
            ${L.faq.items
              .map(
                (f) => `<details class="faq__item">
              <summary><span>${esc(f.q)}</span></summary>
              <div class="faq__a prose">${md.block(f.a)}</div>
            </details>`
              )
              .join('\n            ')}
          </div>
          <p class="more"><a class="arrow-link" href="${attr(ctx.url('/support'))}">${esc(L.faq.more)}</a></p>
        </div>
      </section>`;

  const closing = `
      <section class="section closing" aria-labelledby="closing-title">
        <div class="wrap">
          <div class="closing__inner">
            <h2 id="closing-title" class="h2">${esc(L.closing.title)}</h2>
            <p class="lead">${esc(L.closing.text)}</p>
            ${storeButtons(ctx)}
          </div>
        </div>
      </section>`;

  return {
    key: 'home',
    path: '/',
    title: L.meta.title,
    description: L.meta.description,
    bodyClass: 'page-home',
    head: `<script type="application/ld+json">${jsonLd(ctx)}</script>`,
    body: hero + ask + layers + compat + faq + closing,
  };
}

function jsonLd(ctx) {
  const { cfg, t, assets } = ctx;
  const sameAs = [cfg.stores.appStore.url, cfg.stores.googlePlay.url].filter(Boolean);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Natra',
    alternateName: 'Natra: Birth Chart & Astrology',
    description: t.landing.meta.description,
    url: ctx.url('/', { absolute: true }),
    image: `${cfg.SITE_URL}/${assets.og.file}`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'iOS, Android',
    inLanguage: t.lang,
    author: { '@type': 'Person', name: cfg.author },
    publisher: { '@type': 'Person', name: cfg.author },
    ...(sameAs.length ? { sameAs } : {}),
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/* Small decorative illustrations for the three layers (aria-hidden). */
function weekStrip() {
  const days = [
    ['26', 'TUE', 'good'],
    ['27', 'WED', 'neutral'],
    ['28', 'THU', 'today'],
    ['29', 'FRI', 'good'],
    ['30', 'SAT', 'caution'],
    ['31', 'SUN', 'neutral'],
    ['01', 'MON', 'good'],
  ];
  return `<div class="week">${days
    .map(([d, w, s]) => `<span class="week__day is-${s}"><b>${d}</b><i>${w}</i></span>`)
    .join('')}</div>`;
}

function miniWheel() {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const x1 = 60 + Math.cos(a) * 44, y1 = 60 + Math.sin(a) * 44;
    const x2 = 60 + Math.cos(a) * 54, y2 = 60 + Math.sin(a) * 54;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join('');
  return `<svg class="wheel" viewBox="0 0 120 120" focusable="false">
    <circle cx="60" cy="60" r="54" class="wheel__ring"/><circle cx="60" cy="60" r="44" class="wheel__ring"/>
    <g class="wheel__ticks">${ticks}</g>
    <line x1="6" y1="60" x2="114" y2="60" class="wheel__axis"/><line x1="60" y1="6" x2="60" y2="114" class="wheel__axis"/>
    <path d="M35 44 L78 34 L86 74 L44 80 Z" class="wheel__aspects"/>
    <circle cx="35" cy="44" r="3" class="p1"/><circle cx="78" cy="34" r="3" class="p2"/><circle cx="86" cy="74" r="3" class="p3"/><circle cx="44" cy="80" r="3" class="p4"/>
  </svg>`;
}

function ring(pct) {
  const c = 2 * Math.PI * 40;
  return `<svg class="ring" viewBox="0 0 100 100" focusable="false">
    <circle cx="50" cy="50" r="40" class="ring__track"/>
    <circle cx="50" cy="50" r="40" class="ring__value" stroke-dasharray="${((c * pct) / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 50 50)"/>
    <text x="50" y="52" class="ring__num">${pct}%</text><text x="50" y="66" class="ring__cap">match</text>
  </svg>`;
}

/* ---------------- Legal (Privacy, Terms) ---------------- */

export function legalPage(ctx, doc) {
  const { t } = ctx;
  const toc = doc.headings
    .map((h) => `<li><a href="#${attr(h.id)}">${h.html}</a></li>`)
    .join('');
  return {
    key: doc.key,
    path: `/${doc.key}`,
    title: `${doc.title} — Natra`,
    description: t.legal[doc.key].description,
    bodyClass: 'page-legal',
    body: `
      <div class="wrap legal">
        <p class="eyebrow legal__meta">${esc(t.ui.documentLabel)} · <time datetime="${attr(doc.updatedISO)}">${esc(t.ui.updated)} ${esc(doc.updatedShort)}</time></p>
        <details class="toc">
          <summary>${esc(t.ui.contents)}</summary>
          <ol>${toc}</ol>
        </details>
        <article class="prose prose--legal" data-legal-doc="${attr(doc.key)}">
${doc.html}
        </article>
        <p class="legal__top"><a class="arrow-link arrow-link--up" href="#main">${esc(t.ui.backToTop)}</a></p>
      </div>`,
  };
}

/* ---------------- Support ---------------- */

export function supportPage(ctx) {
  const { t, cfg, md, assets } = ctx;
  const S = t.support;
  return {
    key: 'support',
    path: '/support',
    title: S.meta.title,
    description: S.meta.description,
    bodyClass: 'page-support',
    scripts: `<script src="/${assets.js}" defer></script>`,
    body: `
      <div class="wrap wrap--narrow support">
        <p class="eyebrow">${esc(S.eyebrow)}</p>
        <h1 class="h1">${esc(S.title)}</h1>
        <p class="lead">${esc(S.lead)}</p>

        <div class="card contact" data-copy-root>
          <p class="label">${esc(S.emailLabel)}</p>
          <p class="contact__email"><span id="support-email" data-copy-source>${esc(cfg.email)}</span></p>
          <div class="contact__actions">
            <button type="button" class="btn btn--primary" data-copy-button data-copied="${attr(S.copied)}" data-failed="${attr(S.copyFailed)}">${esc(S.copy)}</button>
            <a class="btn" href="mailto:${attr(cfg.email)}">${esc(S.mailto)}</a>
          </div>
          <p class="contact__status" role="status" aria-live="polite" data-copy-status></p>
        </div>

        <h2 class="h2 support__faq-title">${esc(S.faqTitle)}</h2>
        <ul class="support__toc">
          ${S.items.map((f) => `<li><a href="#${attr(f.id)}">${esc(f.q)}</a></li>`).join('\n          ')}
        </ul>
        <div class="support__list">
          ${S.items
            .map(
              (f) => `<section class="card qa" id="${attr(f.id)}" aria-labelledby="${attr(f.id)}-q">
            <h3 class="h3" id="${attr(f.id)}-q">${esc(f.q)}</h3>
            <div class="prose">${md.block(f.a)}</div>
          </section>`
            )
            .join('\n          ')}
        </div>
        <p class="footnote support__disclaimer">${esc(S.disclaimer)}</p>
      </div>`,
  };
}

/* ---------------- 404 ---------------- */

export function notFoundPage(ctx) {
  const { t, url } = ctx;
  const N = t.notFound;
  return {
    key: '404',
    path: '/404',
    title: N.meta.title,
    description: N.meta.description,
    noindex: true,
    bodyClass: 'page-404',
    body: `
      <div class="wrap notfound">
        <p class="notfound__code" aria-hidden="true">${esc(N.code)}</p>
        <h1 class="h1">${esc(N.title)}</h1>
        <p class="lead">${esc(N.text)}</p>
        <p class="notfound__actions">
          <a class="btn btn--primary" href="${attr(url('/'))}">${esc(N.home)}</a>
          <a class="btn" href="${attr(url('/support'))}">${esc(N.support)}</a>
        </p>
      </div>`,
  };
}
