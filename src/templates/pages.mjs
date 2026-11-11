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
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
};
const icon = (name, size) => svg(ICONS[name] || '', size);
const SPARK = `<svg class="spark" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0c.5 4.2 3.8 7.5 8 8-4.2.5-7.5 3.8-8 8-.5-4.2-3.8-7.5-8-8 4.2-.5 7.5-3.8 8-8Z"/></svg>`;
const CHEV = `<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg>`;

/* ---------- Landing ---------- */

// The answer screen from the app, drawn in HTML: question, verdict, confidence, reading.
// site.js swaps its content when a question chip is pressed.
function answerPhone(H, ex) {
  return `<figure class="answer" aria-label="${attr(H.demoLabel)}">
              <div class="answer__screen tone-${attr(ex.tone)}" data-answer aria-live="polite">
                <p class="answer__q" data-answer-q>“${esc(ex.q)}”</p>
                <p class="answer__badge" data-answer-verdict>${esc(ex.verdict)}</p>
                <p class="answer__conf"><span>${esc(H.confidenceLabel)}</span><span class="bar"><span class="w-${ex.confidence}" data-answer-bar></span></span><span class="answer__pct" data-answer-pct>${ex.confidence}%</span></p>
                <p class="answer__reading" data-answer-reading>${esc(ex.reading)}</p>
                <p class="answer__label">${esc(H.exampleLabel)}</p>
              </div>
            </figure>`;
}

export function homePage(ctx) {
  const { t, cfg, md } = ctx;
  const L = t.landing;
  const H = L.hero;
  const live = Boolean(cfg.stores.appStore.url || cfg.stores.googlePlay.url);
  const soon = live ? '' : `<p class="soon">${esc(H.soon)}</p>`;

  const hero = `
      <section class="hero" aria-labelledby="hero-title" data-hero>
        <div class="wrap hero__grid">
          <div class="hero__copy">
            <p class="kicker">${esc(H.kicker)}</p>
            <h1 id="hero-title" class="hero__title">${esc(H.title)}</h1>
            <p class="hero__sub">${esc(H.sub)}</p>
            ${storeButtons(ctx)}
            ${soon}
          </div>
          <div class="hero__demo">
            ${answerPhone(H, H.examples[0])}
            <div class="tries" data-tries hidden>
              <p class="micro">${esc(H.tryLabel)}</p>
              <div class="tries__list">
                ${H.examples
                  .map(
                    (e, i) =>
                      `<button type="button" class="try" aria-pressed="${i === 0}" data-verdict="${attr(e.verdict)}" data-tone="${attr(e.tone)}" data-confidence="${e.confidence}" data-reading="${attr(e.reading)}">${esc(e.q)}</button>`
                  )
                  .join('\n                ')}
              </div>
            </div>
          </div>
        </div>
      </section>`;

  const how = `
      <section class="section how" id="how" aria-labelledby="how-title">
        <div class="wrap">
          <h2 id="how-title" class="h2">${esc(L.how.title)}</h2>
          <ol class="how__steps">
            ${L.how.steps
              .map((s, i) => `<li class="how__step"><span class="how__n" aria-hidden="true">${i + 1}</span><h3 class="how__t">${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
              .join('\n            ')}
          </ol>
          <p class="note">${esc(L.how.note)}</p>
        </div>
      </section>`;

  const features = `
      <section class="section" id="inside" aria-labelledby="inside-title">
        <div class="wrap">
          <h2 id="inside-title" class="h2 section__title">${esc(L.features.title)}</h2>
          <div class="rows">
            ${L.features.items
              .map(
                (f) => `<article class="row">
              <div class="row__media">
              ${phone(ctx, f.slot, f.alt, { sizes: '(max-width: 699px) 200px, 260px' })}
              </div>
              <div class="row__copy">
                <h3 class="row__t">${esc(f.title)}</h3>
                <p>${esc(f.text)}</p>
              </div>
            </article>`
              )
              .join('\n            ')}
          </div>
        </div>
      </section>`;

  const rating = cfg.rating && cfg.rating.value ? `<p class="rating"><span aria-hidden="true">★</span> ${esc(cfg.rating.value)} ${esc(cfg.rating.label || '')}</p>` : '';
  const trust = `
      <section class="section" id="trust" aria-labelledby="trust-title">
        <div class="wrap">
          <h2 id="trust-title" class="h2 section__title">${esc(L.trust.title)}</h2>
          ${rating}
          <ul class="trust">
            ${L.trust.items.map((x) => `<li class="trust__item">${SPARK}<h3 class="trust__t">${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('\n            ')}
          </ul>
          <p class="note">${esc(L.trust.note)}</p>
        </div>
      </section>`;

  const faq = `
      <section class="section" id="faq" aria-labelledby="faq-title">
        <div class="wrap wrap--narrow">
          <h2 id="faq-title" class="h2 section__title">${esc(L.faq.title)}</h2>
          <div class="acc" data-accordion>
            ${L.faq.items
              .map(
                (f) => `<details class="acc__item">
              <summary class="acc__q"><span class="acc__row"><span class="acc__label">${esc(f.q)}</span>${CHEV}</span></summary>
              <div class="acc__panel"><div class="acc__inner prose">${md.block(f.a)}</div></div>
            </details>`
              )
              .join('\n            ')}
          </div>
          <p class="more"><a class="arrow-link" href="${attr(ctx.url('/support'))}">${esc(L.faq.more)}</a></p>
        </div>
      </section>`;

  const closing = `
      <section class="section closing" id="get" aria-labelledby="closing-title" data-closing>
        <div class="wrap closing__inner">
          ${SPARK}
          <h2 id="closing-title" class="h2">${esc(L.closing.title)}</h2>
          ${storeButtons(ctx)}
          ${soon}
        </div>
      </section>`;

  return {
    key: 'home',
    path: '/',
    title: L.meta.title,
    description: L.meta.description,
    bodyClass: 'page-home',
    markdown: '/index.md',
    head: jsonLd(ctx),
    body: hero + how + features + trust + faq + closing,
  };
}

const plain = (md) => md.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/\n+/g, ' ').trim();

// Shared structured-data nodes; every page links to them by @id.
function baseGraph(ctx) {
  const { cfg, t, assets } = ctx;
  const site = cfg.SITE_URL;
  const sameAs = [cfg.stores.appStore.url, cfg.stores.googlePlay.url].filter(Boolean);
  return [
    {
      '@type': 'Organization',
      '@id': `${site}/#organization`,
      name: 'Natra',
      url: `${site}/`,
      logo: { '@type': 'ImageObject', url: `${site}/icon-512.png`, width: 512, height: 512 },
      email: cfg.email,
      founder: { '@type': 'Person', name: cfg.author },
      address: { '@type': 'PostalAddress', addressLocality: 'Tbilisi', addressCountry: 'GE' },
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: cfg.email, url: `${site}/support`, availableLanguage: 'English' },
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      name: 'Natra',
      url: `${site}/`,
      description: t.landing.meta.description,
      inLanguage: t.lang,
      publisher: { '@id': `${site}/#organization` },
    },
  ];
}

function faqNode(id, items) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
  };
}

export function ldScript(graph) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

function jsonLd(ctx) {
  const { cfg, t, assets } = ctx;
  const site = cfg.SITE_URL;
  const L = t.landing;
  const sameAs = [cfg.stores.appStore.url, cfg.stores.googlePlay.url].filter(Boolean);
  const screens = ['ask-verdict', 'home', 'chart-wheel', 'compatibility'].map((s) => `${site}/${assets.screens[s].fallback.file}`);
  return ldScript([
    ...baseGraph(ctx),
    {
      '@type': 'WebPage',
      '@id': `${site}/#webpage`,
      url: `${site}/`,
      name: L.meta.title,
      description: L.meta.description,
      isPartOf: { '@id': `${site}/#website` },
      about: { '@id': `${site}/#app` },
      primaryImageOfPage: `${site}/${assets.og.file}`,
      inLanguage: t.lang,
    },
    {
      '@type': 'MobileApplication',
      '@id': `${site}/#app`,
      name: 'Natra',
      alternateName: 'Natra: Birth Chart & Astrology',
      description: t.agents.summary,
      url: `${site}/`,
      image: `${site}/${assets.og.file}`,
      screenshot: screens,
      applicationCategory: 'LifestyleApplication',
      applicationSubCategory: 'Astrology',
      operatingSystem: 'iOS, Android',
      inLanguage: t.lang,
      featureList: t.agents.features,
      keywords: 'birth chart, natal chart, horoscope, daily horoscope, astrology, love compatibility, synastry, horary astrology, transits',
      author: { '@id': `${site}/#organization` },
      publisher: { '@id': `${site}/#organization` },
      ...(sameAs.length ? { sameAs } : {}),
    },
    faqNode(`${site}/#faq`, L.faq.items),
  ]);
}

export function supportLd(ctx) {
  const { cfg, t } = ctx;
  const site = cfg.SITE_URL;
  return ldScript([
    ...baseGraph(ctx),
    { '@type': ['WebPage', 'ContactPage'], '@id': `${site}/support#webpage`, url: `${site}/support`, name: t.support.meta.title, description: t.support.meta.description, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` }, inLanguage: t.lang },
    faqNode(`${site}/support#faq`, t.support.items),
  ]);
}

export function legalLd(ctx, doc) {
  const { cfg, t } = ctx;
  const site = cfg.SITE_URL;
  return ldScript([
    ...baseGraph(ctx),
    { '@type': 'WebPage', '@id': `${site}/${doc.key}#webpage`, url: `${site}/${doc.key}`, name: `${doc.title} — Natra`, description: t.legal[doc.key].description, dateModified: doc.updatedISO, isPartOf: { '@id': `${site}/#website` }, publisher: { '@id': `${site}/#organization` }, inLanguage: t.lang },
  ]);
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
    markdown: `/${doc.key}.md`,
    head: legalLd(ctx, doc),
    body: `
      <div class="wrap legal">
        <p class="legal__meta"><span class="micro">${esc(t.ui.documentLabel)}</span><time class="pill" datetime="${attr(doc.updatedISO)}">${esc(t.ui.updated)} ${esc(doc.updatedShort)}</time></p>
        <details class="card toc">
          <summary><span class="acc__row"><span class="micro">${esc(t.ui.contents)}</span>${CHEV}</span></summary>
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
    markdown: '/support.md',
    head: supportLd(ctx),
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
            <summary class="acc__q"><span class="acc__row"><span class="acc__icon">${icon(f.icon, 18)}</span><span class="acc__label">${esc(f.q)}</span>${CHEV}</span></summary>
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
