// Page bodies. All visible text comes from content/<locale>/site.json or the legal .md files.
// Components mirror the Natra app design (the ".mx" redesign: Cormorant / DM Sans / DM Mono).
import { esc, attr } from '../../scripts/lib/html.mjs';
import { storeButtons, phone } from './layout.mjs';

/* ---------- Icons (stroke, currentColor) ---------- */

const svg = (body, size = 20) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const ICONS = {
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
  restore: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4.5v4h4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z"/>',
  refund: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4.5v4h-4M12 8v8M9.5 10.2c0-1 1.1-1.7 2.5-1.7s2.5.7 2.5 1.7-1 1.5-2.5 1.8-2.5.8-2.5 1.8 1.1 1.7 2.5 1.7 2.5-.7 2.5-1.7"/>',
  shield: '<path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6l-7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
  romance: '<circle cx="12" cy="14" r="6"/><path d="m9.5 4 2.5 3 2.5-3"/>',
  talk: '<path d="M5 5.5h14v10H10l-4 3.5v-3.5H5v-10Z"/>',
  future: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
};
const icon = (name, size) => svg(ICONS[name] || '', size);
const SPARK = `<svg class="spark" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0c.5 4.2 3.8 7.5 8 8-4.2.5-7.5 3.8-8 8-.5-4.2-3.8-7.5-8-8 4.2-.5 7.5-3.8 8-8Z"/></svg>`;
const SUN = `<svg class="pc-sym" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>`;
const CHEV = `<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg>`;

/* ---------- Landing ---------- */

export function homePage(ctx) {
  const { t, md } = ctx;
  const L = t.landing;

  const hero = `
      <section class="hero" aria-labelledby="hero-title">
        <div class="wrap hero__grid">
          <div class="hero__copy">
            <p class="micro">${esc(L.hero.eyebrow)}</p>
            <h1 id="hero-title" class="hero__title">${esc(L.hero.title)}</h1>
            <p class="hero__promise">${esc(L.hero.promise)}</p>
            <p class="hero__lead">${esc(L.hero.lead)}</p>
            ${storeButtons(ctx)}
          </div>
          <div class="hero__phones" role="group" aria-label="${attr(L.hero.phonesLabel)}">
            ${phone(ctx, 'home', L.layers.homeAlt, { eager: true, sizes: '(min-width: 1024px) 180px, 26vw', cls: 'phone--side phone--left' })}
            ${phone(ctx, 'chart-wheel', L.layers.chartAlt, { eager: true, priority: true, sizes: '(min-width: 1024px) 255px, 38vw', cls: 'phone--center' })}
            ${phone(ctx, 'compatibility', L.compatibility.screenAlt, { eager: true, sizes: '(min-width: 1024px) 180px, 26vw', cls: 'phone--side phone--right' })}
          </div>
        </div>
      </section>`;

  /* Ask the chart: four steps, each with the app component it produces */
  const A = L.ask.demo;
  const stepDemos = [
    `<div class="chips" aria-hidden="true">${A.chips.map((c) => `<span class="q-chip">${esc(c)}</span>`).join('')}</div>`,
    `<div class="plate cast" aria-hidden="true"><div><p class="micro">${esc(A.castLabel)}</p><p class="cast__date">${esc(A.castDate)}</p><p class="cast__place">${esc(A.castPlace)}</p></div>${castWheel()}</div>`,
    `<div class="factors" aria-hidden="true">${A.factors
      .map((f) => `<div class="plate factor"><span class="factor__ic is-${attr(f.tone)}">${f.tone === 'good' ? '✦' : '!'}</span><span>${esc(f.text)}</span></div>`)
      .join('')}</div>`,
    `<div class="verdict" aria-hidden="true"><span class="verdict__badge">${esc(A.verdict)}</span><span class="conf"><span class="conf__lbl">${esc(A.confidenceLabel)}</span><span class="bar bar--good"><span class="w-${A.confidence}"></span></span><span class="conf__pct">${A.confidence}%</span></span></div>`,
  ];
  const steps = L.ask.steps
    .map(
      (s, i) => `
              <li class="card step">
                <p class="step__num">${String(i + 1).padStart(2, '0')}</p>
                <h3 class="step__title">${esc(s.title)}</h3>
                <p class="step__text">${esc(s.text)}</p>
                <div class="step__demo">${stepDemos[i]}</div>
              </li>`
    )
    .join('');

  const ask = `
      <section class="section" id="ask" aria-labelledby="ask-title">
        <div class="wrap">
          <div class="section__head">
            <p class="micro">${esc(L.ask.eyebrow)}</p>
            <h2 id="ask-title" class="h2">${esc(L.ask.title)}</h2>
            <p class="lead">${esc(L.ask.lead)}</p>
          </div>
          <div class="ask__grid">
            <ol class="steps">${steps}
            </ol>
            <div class="ask__phone">
              ${phone(ctx, 'ask-verdict', L.ask.screenAlt, { sizes: '300px' })}
            </div>
          </div>
          <p class="footnote">${esc(L.ask.footnote)}</p>
        </div>
      </section>`;

  /* Three layers, each topped by a live copy of its app component */
  const [today, chart, deeper] = L.layers.items;
  const layerDemos = [
    `<div class="guidance">
                <p class="micro">${esc(today.demo.label)}</p>
                <p class="guidance__text">${esc(today.demo.text)}</p>
                <p class="guidance__src">${esc(today.demo.sourcePrefix)} <em>${esc(today.demo.source)}</em></p>
              </div>
              ${weekStrip(today.demo.weekLegend)}
              <div class="plate transit"><span class="transit__bar"></span><span class="transit__info"><b>${esc(today.demo.transit.title)}</b><i>${esc(today.demo.transit.text)}</i></span><span class="badge">${esc(today.demo.transit.badge)}</span></div>`,
    `<div class="plate pcard">
                <div class="pcard__head">${SUN}<span class="pcard__label">${esc(chart.demo.label)}</span><span class="pcard__house">${esc(chart.demo.house)}</span></div>
                <p class="pcard__name">${esc(chart.demo.title)}</p>
                <p class="pcard__body">${esc(chart.demo.text)}</p>
              </div>`,
    `<div class="mcards">${deeper.demo.matches
      .map(
        (m) => `<div class="plate mcard"><span class="mcard__left"><b>${esc(m.title)}</b><i>${esc(m.details)}</i></span><span class="mcard__right"><b>${m.score}%</b><i>${esc(deeper.demo.scoreLabel)}</i></span>${CHEV}</div>`
      )
      .join('')}</div>`,
  ];
  const layers = `
      <section class="section" id="inside" aria-labelledby="inside-title">
        <div class="wrap">
          <div class="section__head">
            <p class="micro">${esc(L.layers.eyebrow)}</p>
            <h2 id="inside-title" class="h2">${esc(L.layers.title)}</h2>
            <p class="lead">${esc(L.layers.lead)}</p>
          </div>
          <ol class="layers">
            ${L.layers.items
              .map(
                (it, i) => `<li class="card layer">
              <div class="layer__demo" aria-hidden="true">
              ${layerDemos[i]}
              </div>
              <p class="micro micro--muted">${esc(it.label)}</p>
              <h3 class="h3">${esc(it.title)}</h3>
              <p class="layer__text">${esc(it.text)}</p>
              <ul class="tags">${it.tags.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
            </li>`
              )
              .join('\n            ')}
          </ol>
        </div>
      </section>`;

  /* Compatibility: text on one side, the report built from app components on the other */
  const C = L.compatibility.demo;
  const compat = `
      <section class="section" id="compatibility" aria-labelledby="compat-title">
        <div class="wrap compat">
          <div class="compat__copy">
            <p class="micro">${esc(L.compatibility.eyebrow)}</p>
            <h2 id="compat-title" class="h2">${esc(L.compatibility.title)}</h2>
            <p class="lead">${esc(L.compatibility.lead)}</p>
            <ul class="points">
              ${L.compatibility.points
                .map((p) => `<li>${SPARK}<div><h3 class="point__title">${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`)
                .join('\n              ')}
            </ul>
          </div>
          <div class="card report" aria-hidden="true">
            <div class="report__score">
              <div class="ring w-${C.score}"><div class="ring__inner"><b>${C.score}%</b><i>${esc(C.scoreLabel)}</i></div></div>
              <p class="report__headline">${esc(C.headline)}</p>
              <p class="report__summary">${esc(C.summary)}</p>
            </div>
            <p class="micro">${esc(C.partnerLabel)}</p>
            <div class="plate partner"><span><b>${esc(C.partnerName)}</b><i>${esc(C.partnerDetails)}</i></span><span class="partner__link">${esc(C.partnerLink)} →</span></div>
            <p class="micro">${esc(C.areasLabel)}</p>
            <div class="areas">${C.areas.map((a) => `<span class="area">${esc(a)}</span>`).join('')}</div>
            <p class="micro">${esc(C.dimsLabel)}</p>
            <div class="dims">${C.dims
              .map((d) => `<div class="plate dim">${icon(d.key, 18)}<b>${esc(d.title)}</b><span class="bar"><span class="w-${d.pct}"></span></span><i>${d.pct}%</i></div>`)
              .join('')}</div>
          </div>
        </div>
      </section>`;

  const faq = `
      <section class="section" id="faq" aria-labelledby="faq-title">
        <div class="wrap wrap--narrow">
          <div class="section__head">
            <p class="micro">${esc(L.faq.eyebrow)}</p>
            <h2 id="faq-title" class="h2">${esc(L.faq.title)}</h2>
          </div>
          <div class="acc" data-accordion>
            ${L.faq.items
              .map(
                (f) => `<details class="acc__item">
              <summary class="acc__q"><span class="acc__label">${esc(f.q)}</span>${CHEV}</summary>
              <div class="acc__panel"><div class="acc__inner prose">${md.block(f.a)}</div></div>
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
            ${SPARK}
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

function weekStrip(legend) {
  const days = [
    ['26', 'Tue', 'fav'],
    ['27', 'Wed', 'neu'],
    ['28', 'Thu', 'today'],
    ['29', 'Fri', 'fav'],
    ['30', 'Sat', 'cau'],
    ['31', 'Sun', 'neu'],
    ['01', 'Mon', 'fav'],
  ];
  return `<div class="week">${days.map(([n, d, s]) => `<span class="day is-${s}"><b>${n}</b><i>${d}</i></span>`).join('')}</div>
              <p class="legend"><span><i class="dot dot--fav"></i>${esc(legend[0])}</span><span><i class="dot dot--neu"></i>${esc(legend[1])}</span><span><i class="dot dot--cau"></i>${esc(legend[2])}</span></p>`;
}

function castWheel() {
  return `<svg class="cast__wheel" viewBox="0 0 48 48" focusable="false"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="24" cy="4" r="1.6" fill="currentColor"/><circle cx="44" cy="24" r="1.6" fill="currentColor"/><circle cx="24" cy="44" r="1.6" fill="currentColor"/><circle cx="4" cy="24" r="1.6" fill="currentColor"/></svg>`;
}

/* ---------- Legal (Privacy, Terms) ---------- */

export function legalPage(ctx, doc) {
  const { t } = ctx;
  const toc = doc.headings.map((h) => `<li><a href="#${attr(h.id)}">${h.html}</a></li>`).join('');
  return {
    key: doc.key,
    path: `/${doc.key}`,
    title: `${doc.title} — Natra`,
    description: t.legal[doc.key].description,
    bodyClass: 'page-legal',
    body: `
      <div class="wrap legal">
        <p class="legal__meta"><span class="micro">${esc(t.ui.documentLabel)}</span><time class="pill" datetime="${attr(doc.updatedISO)}">${esc(t.ui.updated)} ${esc(doc.updatedShort)}</time></p>
        <details class="card toc">
          <summary><span class="micro">${esc(t.ui.contents)}</span>${CHEV}</summary>
          <ol>${toc}</ol>
        </details>
        <article class="prose prose--legal" data-legal-doc="${attr(doc.key)}">
${doc.html}
        </article>
        <p class="legal__top"><a class="arrow-link arrow-link--up" href="#main">${esc(t.ui.backToTop)}</a></p>
      </div>`,
  };
}

/* ---------- Support ---------- */

export function supportPage(ctx) {
  const { t, cfg, md } = ctx;
  const S = t.support;
  return {
    key: 'support',
    path: '/support',
    title: S.meta.title,
    description: S.meta.description,
    bodyClass: 'page-support',
    body: `
      <div class="wrap wrap--narrow support">
        <p class="micro">${esc(S.eyebrow)}</p>
        <h1 class="h1">${esc(S.title)}</h1>
        <p class="lead">${esc(S.lead)}</p>

        <div class="card contact" data-copy-root>
          <div class="contact__head">${icon('mail', 22)}<p class="micro micro--muted">${esc(S.emailLabel)}</p></div>
          <p class="contact__email"><span id="support-email" data-copy-source>${esc(cfg.email)}</span></p>
          <div class="contact__actions">
            <button type="button" class="btn btn--primary" data-copy-button data-copied="${attr(S.copied)}" data-failed="${attr(S.copyFailed)}">${esc(S.copy)}</button>
            <a class="btn" href="mailto:${attr(cfg.email)}">${esc(S.mailto)}</a>
          </div>
          <p class="contact__status" role="status" aria-live="polite" data-copy-status></p>
        </div>

        <h2 class="h2 support__faq-title">${esc(S.faqTitle)}</h2>
        <div class="acc acc--icons" data-accordion>
          ${S.items
            .map(
              (f) => `<details class="acc__item" id="${attr(f.id)}">
            <summary class="acc__q"><span class="acc__icon">${icon(f.icon, 18)}</span><span class="acc__label">${esc(f.q)}</span>${CHEV}</summary>
            <div class="acc__panel"><div class="acc__inner prose">${md.block(f.a)}</div></div>
          </details>`
            )
            .join('\n          ')}
        </div>
        <p class="footnote support__disclaimer">${esc(S.disclaimer)}</p>
      </div>`,
  };
}

/* ---------- 404 ---------- */

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
        <div class="notfound__void" aria-hidden="true"><span>${esc(N.code)}</span></div>
        <h1 class="h1">${esc(N.title)}</h1>
        <p class="lead">${esc(N.text)}</p>
        <p class="notfound__actions">
          <a class="btn btn--primary" href="${attr(url('/'))}">${esc(N.home)}</a>
          <a class="btn" href="${attr(url('/support'))}">${esc(N.support)}</a>
        </p>
      </div>`,
  };
}
