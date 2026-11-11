# Natra — сайт

Статический сайт приложения Natra: лендинг, Privacy Policy, Terms of Use, Support и страница 404.
Без сервера, cookies и рекламных трекеров. Единственный внешний скрипт — Cloudflare Web Analytics (без cookies, вставляется самим Cloudflare на живом домене). Шрифты лежат в проекте.

| Адрес | Страница | Файл в `dist/` |
|---|---|---|
| `/` | Лендинг | `index.html` |
| `/privacy` | Privacy Policy | `privacy.html` |
| `/terms` | Terms of Use | `terms.html` |
| `/support` | Поддержка: почта и FAQ | `support.html` |
| `/404` и любой несуществующий адрес | «Не найдено» | `404.html` |

## Быстрый старт

Нужен Node.js 18 или новее.

```bash
npm install
```

```bash
npm run build
```

```bash
npm run preview
```

После `npm run preview` сайт открывается на http://localhost:4321. Вместо этого можно запустить `npx serve dist`.

## Команды

| Команда | Что делает |
|---|---|
| `npm run build` | Собирает сайт в папку `dist/` |
| `npm run check` | Проверяет, что тексты Privacy и Terms на сайте совпадают с `.md` слово в слово (запускать после `build`) |
| `npm run preview` | Показывает `dist/` локально |
| `npx wrangler pages dev dist` | Показывает сайт локально вместе с функцией Markdown для агентов (как на Cloudflare). Проверка: `curl -H "Accept: text/markdown" http://localhost:8788/` |
| `npm run og` | Перерисовывает картинку для соцсетей 1200×630. Нужен Playwright |
| `npm run shots` | Снимает все страницы в ширинах 1440 и 390 в `reports/30-site/`. Нужен Playwright |
| `npm run qa` | Проверяет вёрстку всех страниц на ширинах 360–1440 (горизонтальная прокрутка, вылезающие элементы, мелкие кнопки, незагруженные картинки) и снимает их в `reports/qa/`. Для Safari-движка: `npm run qa -- --browsers=webkit,chromium`. Нужен Playwright |
| `npm run crop-framed -- <файл> <слот>` | Вырезает голый экран из скриншота в рамке (сайту не нужно) |

Для `og` и `shots` нужен Playwright: `npm i -D playwright && npx playwright install chromium`. Для обычной сборки он не нужен.

## Где что менять

| Что | Где |
|---|---|
| Адрес сайта (`SITE_URL`), почта, копирайт, ID в App Store | `site.config.mjs` |
| Ссылки на сторы и официальные значки | `site.config.mjs` → `stores`; файлы значков — в `src/assets/badges/` |
| Все тексты лендинга, поддержки и 404 | `content/en/site.json` |
| Рейтинг в сторах над блоком доверия (только настоящий, после релиза) | `site.config.mjs` → `rating` |
| Privacy Policy и Terms of Use | `content/en/legal/privacy.md`, `content/en/legal/terms.md` |
| Скриншоты | `src/assets/screenshots/` |
| Иконка приложения (favicon и иконки) | `src/assets/icon/app-icon.png` |
| Картинка для соцсетей | `src/assets/og/og-image.png` (её делает `npm run og`) |
| Стили | `src/styles/site.css` |
| Вёрстка | `src/templates/` |

После любой правки выполните `npm run build` и снова выложите сайт.

### Обновить Privacy или Terms
1. Замените `content/en/legal/privacy.md` или `terms.md` новым файлом. Имя файла оставьте прежним.
2. Выполните `npm run build` и `npm run check`.
3. Дата «Updated» и `lastmod` в `sitemap.xml` берутся из строки `**Last updated:** Month D, YYYY` в самом документе. Если строки нет, сборка остановится с ошибкой.

### Заменить скриншот
Каждый скриншот — один файл, его имя и есть слот:

| Слот | Где показывается |
|---|---|
| `compatibility.png` | Главная, ряд «Love compatibility» и картинка для соцсетей |
| `home.png` | Главная, ряд «A daily horoscope» |
| `chart-wheel.png` | Главная, ряд «Your birth chart» |
| `ask-verdict.png` | Картинка для соцсетей (`npm run og`) и разметка Schema.org |

Пример ответа в первом экране — не картинка, а вёрстка: вопрос, вердикт, уверенность и чтение. Четыре примера и их тексты лежат в `content/en/site.json` → `landing.hero.examples`; чипы под телефоном переключают их.

- Сайт показывает снимки **как есть, в вашей рамке iPhone** — своей рамки не рисует. Кладите экспорт в рамке (1470×3000, прозрачный фон вокруг) поверх файла с тем же именем, например `src/assets/screenshots/home.png`. Подходят `.png` и `.webp` (у `.jpg` нет прозрачности).
- Телефон с примером ответа в первом экране собран из пустой рамки `src/assets/frames/iphone.png` (та же рамка с прозрачным экраном), под которой лежит вёрстка ответа.
- `npm run crop-framed` (вырезать экран из рамки) теперь нужен только для сторов и других мест, где нужен голый экран.

После замены выполните `npm run build`. При желании перерисуйте картинку для соцсетей: `npm run og`.

### Иконка
Положите иконку приложения 1024×1024 (`assets/icon/natra_icon_1024.png` из проекта приложения) в `src/assets/icon/app-icon.png` и пересоберите сайт. Из неё получатся `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` и логотип в шапке. Пока файла нет, сборка ставит временную заглушку и пишет об этом предупреждение.

### Когда приложение выйдет в сторах
1. В `site.config.mjs` впишите ссылки в `stores.appStore.url` и `stores.googlePlay.url`.
2. Скачайте официальные значки:
   - Apple: https://tools.applemarketingtools.com/ → «Download on the App Store», чёрный;
   - Google: https://play.google.com/intl/en_us/badges/.

   Положите их в `src/assets/badges/` и впишите имена файлов в `badge`.
3. `npm run build`. Кнопки «Coming soon» станут активными ссылками со значками.

Smart App Banner (`<meta name="apple-itunes-app" content="app-id=6812511817">`) уже стоит на каждой странице и заработает сам, когда приложение появится в App Store.

### Добавить язык (например, русский)
1. Скопируйте `content/en/` в `content/ru/` и переведите `site.json` и документы.
2. В `site.config.mjs` допишите `'ru'` в `locales`.
3. `npm run build`. Страницы появятся по адресам `/ru/`, `/ru/privacy`, `/ru/terms`, `/ru/support`, а теги `hreflang` и `sitemap.xml` обновятся сами.

---

## Как выложить на Cloudflare Pages

Cloudflare Pages бесплатно раздаёт статические сайты. Файл `dist/_headers` он подхватывает сам: там заголовки безопасности (CSP без сторонних источников) и кеширование.

### Вариант А. Загрузить папку вручную (проще всего)
1. `npm install && npm run build`. Получится папка `dist/`.
2. Откройте https://dash.cloudflare.com, при необходимости создайте бесплатный аккаунт.
3. **Workers & Pages** → **Create** → вкладка **Pages** → **Upload assets** (Direct Upload).
4. Введите имя проекта, например `natra`. Сайт сразу получит адрес `https://natra.pages.dev`.
5. Перетащите в окно папку `dist` целиком и нажмите **Deploy site**.
6. Чтобы обновить сайт: пересоберите его и в проекте нажмите **Create deployment** → снова загрузите `dist`.

### Вариант Б. Через GitHub (обновляется сам после каждого коммита)
1. Залейте этот репозиторий на GitHub.
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → выберите репозиторий.
3. Настройки сборки:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: `NODE_VERSION` = `22`
4. **Save and Deploy**. Дальше каждый push в основную ветку выкладывается автоматически.

Playwright при этой сборке не нужен: картинка для соцсетей уже лежит в репозитории.

### Подключить свой домен
1. Купите домен у любого регистратора или прямо в Cloudflare (**Domain Registration**).
2. В проекте Pages: **Custom domains** → **Set up a custom domain** → введите домен (например, `natra.app`) → **Continue**.
3. Если домен обслуживается в Cloudflare, DNS-запись создастся сама. Если домен у другого регистратора, проще всего перенести его DNS в Cloudflare: **Add a site**, затем сменить NS-серверы у регистратора на те, что покажет Cloudflare. Для поддомена (`www.natra.app`) хватит CNAME-записи на `natra.pages.dev`.
4. Подождите, пока статус станет **Active**. HTTPS включится автоматически.
5. **Важно:** впишите домен в `site.config.mjs` → `SITE_URL: 'https://natra.app'`, выполните `npm run build` и выложите сайт заново. Иначе canonical, Open Graph, `sitemap.xml` и `robots.txt` будут указывать на `example.com`.

Другие хостинги тоже подойдут. Netlify понимает `_headers` и адреса без `.html` из коробки. На GitHub Pages и Vercel загружайте ту же папку `dist/` (на Vercel включите `cleanUrls`).

---

## Какие ссылки куда вставить

Ниже `<домен>` — ваш домен, например `natra.app`.

| Куда | Поле | Ссылка |
|---|---|---|
| **App Store Connect** → App Information | Privacy Policy URL | `https://<домен>/privacy` |
| App Store Connect → страница версии | Support URL | `https://<домен>/support` |
| App Store Connect → страница версии | Marketing URL | `https://<домен>/` |
| App Store Connect → описание (конец текста) | Terms of Use (EULA) и Privacy Policy для подписок | `https://<домен>/terms`, `https://<домен>/privacy` |
| **Google Play Console** → Policy → App content → Privacy policy | Privacy policy | `https://<домен>/privacy` |
| Google Play Console → Store presence → Store settings → Contact details | Website | `https://<домен>/` |
| Google Play Console → App content → Data safety → удаление аккаунта | Delete account URL | `https://<домен>/support#delete-account` |
| **RevenueCat** → Paywalls → настройки пейвола | Privacy Policy / Terms of Service | `https://<домен>/privacy`, `https://<домен>/terms` |
| **Приложение** (профиль, пейвол, экран входа) | Privacy, Terms, Support | `https://<домен>/privacy`, `https://<домен>/terms`, `https://<домен>/support` |

Почта поддержки для всех форм: `astrologyapp@outlook.com`.

---

## Устройство проекта

```
site.config.mjs           SITE_URL, почта, сторы, языки
content/en/site.json      все тексты сайта
content/en/legal/*.md     документы (дословно)
src/templates/            вёрстка страниц
src/styles/site.css       стили
src/scripts/site.js       кнопка «Copy email» (единственный JS)
src/fonts/                Cormorant Garamond, DM Sans, DM Mono (woff2) + лицензии OFL
src/assets/               скриншоты, иконка, картинка для соцсетей, значки сторов
scripts/build.mjs         сборка
scripts/check-legal.mjs   сверка документов с .md
reports/                  отчёт и скриншоты страниц
```

Сборка написана на чистом Node.js и использует два пакета: `marked` (markdown → HTML) и `sharp` (картинки в AVIF/WebP/JPEG и иконки). Фреймворка нет: на сайте пять страниц, а простой скрипт проще поддерживать и понять.

Шрифты распространяются по лицензии SIL Open Font License 1.1, тексты лицензий лежат рядом с файлами шрифтов в `src/fonts/` и `dist/fonts/`.

---

## Поисковики и ИИ-ассистенты (Gemini, ChatGPT, Claude, Perplexity)

### Что уже сделано на сайте
| Что | Где | Зачем |
|---|---|---|
| `robots.txt` с явным разрешением для Googlebot, Google-Extended (Gemini), Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Applebot и других | `/robots.txt` (генерирует `scripts/lib/agents.mjs`) | Ботам ассистентов можно читать и цитировать сайт |
| `llms.txt`: короткая «визитка» для языковых моделей — что такое Natra, факты, когда её уместно предлагать, функции, ограничения, ссылки | `/llms.txt` | Стандарт llmstxt.org, его читают агенты |
| `llms-full.txt`: все тексты сайта одним файлом | `/llms-full.txt` | Полный контекст без вёрстки |
| Markdown-копии страниц: `/index.md`, `/support.md`, `/privacy.md`, `/terms.md` | ссылка `rel="alternate" type="text/markdown"` на каждой странице | Агенты читают их без HTML-шума; заголовок `Link: rel=canonical` ведёт на основную страницу |
| Markdown по запросу (content negotiation): если агент присылает `Accept: text/markdown`, по обычному адресу (`/`, `/support`, `/privacy`, `/terms`) он получает Markdown-версию вместо HTML | `functions/_middleware.js` (Cloudflare Pages Function), маршруты в `dist/_routes.json` | Так агенты получают чистый текст без лишних запросов. Браузеры по-прежнему получают HTML. Функция запускается только на четырёх адресах страниц, файлы отдаются напрямую |
| Content Signals в `robots.txt`: `search=yes, ai-input=yes, ai-train=yes` | `/robots.txt` | Явное разрешение использовать сайт в поиске, в ответах ИИ и для обучения моделей. Lighthouse считает эту строку «неизвестной директивой» (SEO 92 вместо 100), поисковики её просто игнорируют |
| Разметка Schema.org одним графом: Organization, WebSite, WebPage, MobileApplication (функции, скриншоты, категория, ключевые слова), FAQPage на главной и в Support, ContactPage, даты документов | `<script type="application/ld+json">` | Google и ассистенты понимают, что это приложение, кто его делает и что оно умеет |
| `meta robots`: `max-snippet:-1, max-image-preview:large` | все страницы | Разрешает длинные цитаты и крупные превью |

Тексты для агентов лежат в `content/en/site.json` → `agents` и `landing.facts` (факты «Natra at a glance» попадают только в `llms.txt` и `/index.md`, на странице их нет). Меняйте их там: `llms.txt`, Markdown-копии и разметка пересоберутся сами.

**Важно.** Gemini опирается на индекс Google, ChatGPT и Copilot — в основном на индекс Bing. Поэтому главное — чтобы сайт попал в эти индексы. Это делается один раз, вручную:

### 1. Google Search Console (для Google и Gemini)
1. https://search.google.com/search-console → **Add property** → тип **Domain** → `natra-astrology.app`.
2. Подтвердите владение. Для домена в Cloudflare Google предложит сделать это автоматически, иначе добавьте TXT-запись в **Cloudflare → DNS**.
3. **Sitemaps** → `https://natra-astrology.app/sitemap.xml` → **Submit**.
4. **URL inspection** → вставьте `https://natra-astrology.app/` → **Request indexing**. То же для `/support`.

### 2. Bing Webmaster Tools (для ChatGPT search, Copilot, DuckDuckGo)
1. https://www.bing.com/webmasters → **Import from Google Search Console** (один клик после шага 1) или **Add site** вручную.
2. Убедитесь, что sitemap добавлен: `https://natra-astrology.app/sitemap.xml`.

### 3. Настройки Cloudflare для домена `natra-astrology.app`
- **Security → Bots** (или **AI Crawl Control**): переключатель **Block AI bots** должен быть выключен, а боты ассистентов разрешены. Иначе Cloudflare будет отдавать им ошибку, несмотря на `robots.txt`.
- Там же: **Manage robots.txt** (managed robots.txt от Cloudflare) выключен, чтобы использовался наш `robots.txt`.
- **Caching → Configuration → Crawler Hints** → включить. Cloudflare сам сообщает Bing и другим поисковикам об изменениях на сайте (IndexNow).
- **Email Address Obfuscation** (раздел **Scrape Shield**, в новом интерфейсе — **Security → Settings**) → выключить. Иначе Cloudflare заменяет почту в коде страниц на `[email protected]`, и поисковики, ИИ-агенты и все, кто читает страницу без JavaScript, не видят адрес поддержки. На сайте стоит защита `<!--email_off-->`, но лучше выключить и саму настройку.
- **Web Analytics** (**Analytics & Logs → Web Analytics**, или **Workers & Pages → natra-landinig → Metrics**) → оставить включённой автоматическую установку. Это статистика без cookies: просмотры страниц, источники переходов (Google, Bing, ChatGPT и т. д.), страны, устройства, скорость загрузки. Cloudflare сам вставляет её скрипт на живом домене; в CSP (`_headers`) разрешены `static.cloudflareinsights.com` и `cloudflareinsights.com`. Чтобы отказаться от аналитики, выключите её в Cloudflare и уберите эти два адреса из CSP в `scripts/build.mjs`.
- Если Google или Bing пишут, что не могут скачать страницу: **Security → Events** — посмотрите, нет ли блокировок для `Googlebot` или `bingbot`, и какая настройка их вызвала (Bot Fight Mode, AI bots, WAF).

### 4. Когда приложение выйдет
- Впишите ссылки сторов в `site.config.mjs` → `stores`. Они автоматически попадут в разметку (`sameAs`), в `llms.txt` и на кнопки. Ассистенты охотнее советуют приложения, которые можно скачать прямо сейчас.
- Страницы в App Store и Google Play тоже читают и Google, и ассистенты, поэтому текст стора (`natra-aso`) работает на ту же цель.

### 5. Упоминания на других сайтах
Ассистенты чаще советуют то, что обсуждают в разных местах: обзоры, каталоги приложений, Product Hunt, тематические сообщества. Это уже не код сайта, но сильнее всего влияет на рекомендации. Гарантий, что Gemini или ChatGPT начнут предлагать Natra, никто дать не может: сайт сделан так, чтобы им было максимально просто это делать.

Если вы не хотите, чтобы тексты сайта использовались для обучения моделей, поставьте `ai-train=no` в строке `Content-Signal` в `scripts/lib/agents.mjs`, уберите из `AI_AGENTS` строки `GPTBot`, `Google-Extended`, `Applebot-Extended` и `CCBot` и допишите для них `Disallow: /`. Поиск и ответы ассистентов от этого не пострадают.

**Cloudflare → AI Crawl Control → Diagnostics:** кнопку «Cloudflare managed robots.txt» не включайте. Управляемый robots.txt Cloudflare по умолчанию ставит `ai-train=no` и закрывает часть ИИ-ботов, то есть перекрывает наш. Content Signals и Markdown Negotiation уже сделаны в коде сайта.
