# Natra — сайт

Статический сайт приложения Natra: лендинг, Privacy Policy, Terms of Use, Support и страница 404.
Без сервера, cookies, аналитики и сторонних скриптов. Шрифты лежат в проекте, внешних запросов нет.

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
| `npm run og` | Перерисовывает картинку для соцсетей 1200×630. Нужен Playwright |
| `npm run shots` | Снимает все страницы в ширинах 1440 и 390 в `reports/30-site/`. Нужен Playwright |
| `npm run crop-framed -- <файл> <слот>` | Вырезает экран из скриншота в рамке телефона |

Для `og` и `shots` нужен Playwright: `npm i -D playwright && npx playwright install chromium`. Для обычной сборки он не нужен.

## Где что менять

| Что | Где |
|---|---|
| Адрес сайта (`SITE_URL`), почта, копирайт, ID в App Store | `site.config.mjs` |
| Ссылки на сторы и официальные значки | `site.config.mjs` → `stores`; файлы значков — в `src/assets/badges/` |
| Все тексты лендинга, поддержки и 404 | `content/en/site.json` |
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
| `home.png` | Hero (левый телефон) |
| `chart-wheel.png` | Hero (центральный телефон) и картинка для соцсетей |
| `compatibility.png` | Hero (правый телефон) |
| `ask-verdict.png` | Блок «Ask the chart» и картинка для соцсетей |

Остальные «экраны» на лендинге — не картинки, а вёрстка: живые копии компонентов приложения (вопросы, вердикт, карточка дня, неделя, совместимость). Их тексты лежат в `content/en/site.json` → `demo`.

- **Сырой снимок экрана** без рамки (например, из `raw2/`): скопируйте его поверх файла с тем же именем, например `src/assets/screenshots/home.png`. Подходят `.png`, `.jpg` и `.webp`. Рамку телефона и «островок» сайт дорисует сам.
- **Снимок уже в рамке** (как экспорт 976×2000 из кейс-стади): сначала вырежьте экран командой `npm run crop-framed -- путь/к/файлу.webp home`.

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
