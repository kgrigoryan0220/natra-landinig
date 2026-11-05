# 30 — Сайт Natra: лендинг, Privacy, Terms, Support

Дата: 2026-11-05. Репозиторий: `kgrigoryan0220/natra-landinig`, ветка `claude/new-session-zy2pvy`.

## Итог

- Готовы все пять страниц: `/`, `/privacy`, `/terms`, `/support`, `/404`. Язык — английский, структура готова к локалям `/ru/` и другим.
- Сборка одной командой `npm run build`, результат — папка `dist/` (1,6 МБ). Локально всё открывается через `npx serve dist`.
- Lighthouse, главная, мобильный режим: **Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100**.
- Privacy и Terms на сайте совпадают с `.md` слово в слово: это проверяет `npm run check`, исходные файлы скопированы побайтно.
- Без cookies, аналитики, трекеров и сторонних скриптов. Шрифты лежат в проекте, внешних запросов нет.
- **Не хватает одного файла — иконки приложения.** Пока стоит временная заглушка: фиолетовое кольцо со звездой. Иконка пришла в чат как картинка без файла. Нужно положить `natra_icon_1024.png` в `src/assets/icon/app-icon.png` и пересобрать сайт.

## Скриншоты

Все в `reports/30-site/`, по одному на каждую страницу в двух ширинах: десктоп 1440 и телефон 390.

| Страница | Десктоп 1440 | Телефон 390 |
|---|---|---|
| Лендинг | ![](30-site/home-desktop-1440.png) | ![](30-site/home-mobile-390.png) |
| Privacy | ![](30-site/privacy-desktop-1440.png) | ![](30-site/privacy-mobile-390.png) |
| Terms | ![](30-site/terms-desktop-1440.png) | ![](30-site/terms-mobile-390.png) |
| Support | ![](30-site/support-desktop-1440.png) | ![](30-site/support-mobile-390.png) |
| 404 | ![](30-site/404-desktop-1440.png) | ![](30-site/404-mobile-390.png) |

Картинка для соцсетей (Open Graph / Twitter, 1200×630): ![](../src/assets/og/og-image.png)

## Стек и почему

- **Чистый HTML/CSS и собственный скрипт сборки на Node.js** (`scripts/build.mjs`) без фреймворка. Страниц пять, и все они простые. Astro или Eleventy добавили бы десятки зависимостей и свои правила, а здесь сборка читается за десять минут.
- Два пакета: `marked` (документы из `.md` → HTML) и `sharp` (скриншоты в AVIF и WebP в нескольких размерах плюс JPEG как запасной вариант, favicon и иконки).
- Весь JavaScript на сайте — около 40 строк для кнопки «Copy email» на странице поддержки.
- Анимация одна: медленный дрейф звёздной пыли (слой сдвигается за 260 секунд, только через `transform`). При `prefers-reduced-motion` она выключается.
- Шрифты те же, что в приложении (по `pubspec.yaml`): **Cormorant Garamond** для заголовков, **DM Sans** для текста, **DM Mono** для дат и данных. Это файлы woff2 с латиницей, лицензии OFL лежат рядом.
- Палитра из кейс-стади: Night `#0B0B10`, Surface `#13121B`, Stroke `#322F50`, Lavender `#9B8FFF`, Peach `#FFD5C5`, Gold `#C8AB84`. Зелёный, жёлтый и красный встречаются только там, где есть оценка: вердикт «YES · 78%» и разметка недели.
- Заголовки безопасности в `dist/_headers`: CSP только `'self'`, `X-Frame-Options` и другие. Их понимают Cloudflare Pages и Netlify.

## Тексты лендинга (en) — на вычитку

Все тексты лежат в одном файле: `content/en/site.json`. Ниже то же самое, собрано из него скриптом.

#### Meta
- **Title:** Natra — Birth Chart, Horoscope & Love Compatibility
- **Description:** Natra is personal astrology built on your birth chart: a daily horoscope about you, love compatibility, a portrait of who you are and clear answers to yes-or-no questions. Coming to iPhone and Android.

#### 1. Hero
- Eyebrow: Birth chart · Horoscope · Compatibility
- H1: Natra
- Promise: A personal astrologer that explains, not scares.
- Lead: Your date, time and place of birth become your birth chart. Natra turns it into clear daily hints, a portrait of who you are, love compatibility and answers to the questions on your mind.
- Buttons: «Coming soon · App Store», «Coming soon · Google Play» (screen readers: «Coming soon to the App Store», «Coming soon to Google Play»)

#### 2. Ask the chart
- Eyebrow: Ask the chart
- H2: Ask a question. Get a clear answer.
- Lead: Will this relationship work out? Should you take the job? Type a yes-or-no question. Natra casts the chart of the minute you ask and reads it for you: a verdict, how confident the reading is, what it means in plain words and the key factors behind it.
- Step 01 — **Your question.** One concrete thing: a person, an offer, a move. Ask it so it can be answered yes or no. Data line: `“Will this opportunity work out for me?”`
- Step 02 — **The chart of the moment.** The chart is cast for the date, time and place where you ask. That moment is where the answer comes from. Data line: `17 MAY 2026 · 14:30 · NEW YORK`
- Step 03 — **The significators.** Natra finds the planets that stand for you and for what you asked about, then reads their dignity, combustion and aspects. Data line: `DIGNITY · COMBUSTION · ASPECTS`
- Step 04 — **The verdict.** Yes, no, maybe or not yet, with a confidence score, a short reading, what to do next and the factors that shaped it. Data line: `YES · 78%`
- Footnote: The same question within 24 hours gets the same answer. Some topics, like health or death, are not for the chart.

#### 3. Three layers
- Eyebrow: Three layers
- H2: Start with today. Go as deep as you like.
- Lead: Everything in Natra comes from one calculation: your birth chart. You decide how far to read.
- 01 · Today — **A daily ritual.** A short hint on Home every day. With Natra Pro, open the full forecast — mood, relationships, work, money and your best hours — look ahead with the week view and see which transits are active. Tags: Hint of the day · This week · Transits
- 02 · Your chart — **Your birth chart, explained simply.** The wheel of your natal chart and a card for every planet and point: the sign, the house and what it says about you, in everyday words. Start with your Sun, Moon and Rising. Tags: Chart wheel · Big three · Every placement
- 03 · Deeper — **When you want the whole story.** The full portrait — your main themes, love, work, talents and shadow side. Compatibility with the people in your life. And questions to the chart when you need a clear answer. Tags: Full portrait · Compatibility · Questions

#### 4. Love compatibility
- Eyebrow: Love compatibility
- H2: Chart to chart, not sign to sign.
- Lead: Add your partner's birth details and see how your two charts meet. This is synastry: your charts read together, not just two zodiac signs side by side.
- **Your match.** One percentage with a short summary of you as a pair.
- **Areas and dimensions.** Emotional connection, love and romance, communication and a shared future — where the bond is strong and where it has room to grow.
- **Your partner's chart.** Their details in one place, and their full chart a tap away.

#### 5. FAQ
- Eyebrow: Questions
- H2: Before you start
- **What do I need to start?** Your date of birth, and ideally the time and place. The time is optional, but with it Natra can work out your Rising sign and houses.
- **What is free and what is paid?** Your chart and a short daily hint come at no cost. Natra Pro, a subscription, unlocks the full daily forecast, the week view and transits. The full portrait, compatibility reports and packs of questions are one-time purchases. Prices are shown in the app before you buy.
- **Is this a prediction?** No. Natra is for reflection and entertainment. It shows what your chart describes and leaves the decisions to you. It is not medical, legal or financial advice.
- **What happens to my data?** Your birth details are used to calculate your chart and readings. Your data is not sold and not used for advertising, and you can delete your account in the app at any time. The details are in the Privacy Policy.
- Link: More answers on the Support page →

#### 6. Closing
- H2: Your chart, read in plain words.
- Text: Natra is coming to iPhone and Android.

#### Footer
- Privacy · Terms · Support · astrologyapp@outlook.com
- For entertainment and self-reflection. Not medical, legal or financial advice.
- © 2026 Artur Arzumanian

#### Image alt texts
- Home: Natra Home screen: today's guidance, a colour-coded week and planets in motion.
- Chart: Natra chart screen: a natal chart wheel for 12 Oct 1994, 14:42, Berlin, and a card for Sun in Gemini in the 9th house.
- Ask: Natra answer screen: the question “Will this opportunity work out for me?”, a YES verdict with 78% confidence, the reading and key factors.
- Compatibility: Natra compatibility screen: You + Alex, a 78% match, areas of connection and compatibility dimensions.

#### Support page
- **Title:** Support — Natra astrology app
- **Description:** Help with Natra: contact support, cancel a subscription, restore purchases, edit birth details, delete your account, refunds and how questions to the chart work.
- H1: How can we help?
- Lead: Write to us about anything: a bug, a purchase, your account or your data. Tell us which phone you use and what happened; a screenshot helps.
- Buttons: Copy email · Open in mail app
- **How do I cancel my subscription?**
  Subscriptions are managed by Apple or Google, so you cancel them in your store account, not inside Natra.
  **iPhone:** open Settings → [your name] → Subscriptions, choose Natra and tap Cancel Subscription.
  **Android:** open Google Play, tap your profile icon, then Payments & subscriptions → Subscriptions, choose Natra and tap Cancel subscription.
  Cancel at least 24 hours before the current period ends to avoid the next charge. Deleting the app does not cancel a subscription, and neither does deleting your Natra account.
- **How do I restore my purchases?**
  Sign in to the same Natra account you used when you bought, open Profile and tap Restore purchases. On a new phone, use the same Apple ID or Google account as before.
- **How do I change my birth details?**
  Open Profile and edit your birth details there: date, time and place of birth. Your chart and readings are based on these details.
- **How do I delete my account?**
  Open Profile → Delete account. This permanently removes your Natra account and the data linked to it: birth details, portrait, compatibility reports, questions and answers. Question credits and compatibility reports are deleted too and cannot be restored. Deletion cannot be undone.
  Deleting your account does not cancel an active subscription — cancel it in your store account first. Purchases made through Apple or Google stay in your store account.
- **How do questions to the chart work?**
  Ask about one concrete thing in a yes-or-no form. Natra casts the chart of the moment and place you ask and answers yes, no, maybe or not yet, with a confidence score and the key factors.
  If you ask the same question again within 24 hours, you get the same answer: the chart of the moment does not change because you ask twice.
  The chart does not answer questions about death, health and similar topics. For those, please talk to a qualified professional.
- **Can I get a refund?**
  All payments go through Apple or Google, so refunds are handled by them under their rules:
  - **App Store:** [request a refund from Apple](https://support.apple.com/en-us/118223) - **Google Play:** [request a refund from Google](https://support.google.com/googleplay/answer/2479637)
  If something went wrong with a purchase, write to us as well — we will help you sort it out.
- **Where is my data and who can see it?**
  Your account, birth details and readings are stored on our servers and with the providers that help us run Natra; they process data only for us. Your data is not sold and not used for advertising. The full list of what is collected, where it is stored and your rights is in the [Privacy Policy](/privacy).
- Disclaimer: Natra is for entertainment and self-reflection. If you are in crisis or need professional help, contact qualified local services.

#### 404
- This page isn't in the chart. The link may be old or mistyped. Buttons: Go to the home page · Contact support
## Скриншоты приложения: что взято и что заменить

Исходники пришли в чат: пять экспортов 976×2000, уже в рамке телефона. Экраны из рамок я вырезал (894×1932): теперь рамка рисуется в CSS, и сырые кадры из `raw2/` можно подкладывать одним файлом с тем же именем.

| Слот (`src/assets/screenshots/`) | Источник | Где на сайте | Заменить после пересъёмки |
|---|---|---|---|
| `home.png` | Home: Today's guidance, This week, Planets in motion | Hero, левый телефон | Да, плановая замена. На кадре есть кнопка «Read full forecast»: если в текущей версии она ведёт за пейвол, лучше взять кадр без неё |
| `chart-wheel.png` | Your chart: колесо, карточка Sun · Gemini | Hero, центр; картинка для соцсетей | **Да, в первую очередь.** На исходнике была ссылка «Ask AI →», которой в приложении нет. Я закрасил её цветом карточки, а новый кадр её снимет совсем |
| `ask-verdict.png` | Ask: вердикт YES 78 %, The reading, Key factors | Hero, правый; блок «Ask the chart»; картинка для соцсетей | Да, если экран вердикта изменился |
| `compatibility.png` | You + Alex: 78 % match, сферы и измерения | Блок «Love compatibility» | Да, если экран изменился |

**Не использованы:**
- «Your Full Portrait / The Sage / The Jester»: архетипов в нынешнем портрете нет, это прямо сказано в задании.
- Кадров «построение карты», «экран вопроса» (ввод) и «короткий портрет: Солнце / Луна / Асцендент» в присланных файлах не было. Когда появятся, их можно добавить новыми слотами: строка в `SCREEN_SLOTS` в `scripts/build.mjs` и вызов `phone(...)` в `src/templates/pages.mjs`.

После замены выполните `npm run build`, а для картинки соцсетей ещё и `npm run og`.

## Lighthouse

Lighthouse 12.8.2, headless Chromium, сайт отдавался через `npx serve dist`.

| Страница | Режим | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` | мобильный | **98** | **100** | **100** | **100** |
| `/` | десктоп | 100 | 100 | 100 | 100 |
| `/privacy` | мобильный | 100 | 100 | 100 | 100 |
| `/terms` | мобильный | 100 | 100 | 100 | 100 |
| `/support` | мобильный | 100 | 100 | 100 | 100 |
| `/404` | мобильный | 100 | 100 | 100 | 66 — так задумано: `noindex` |

Главная, мобильный режим: FCP 1,5 с · LCP 2,2–2,3 с · TBT 0 мс · CLS 0. Полный отчёт: `reports/30-site/lighthouse-home-mobile.html`.

Остались два мелких замечания. «Cache policy» появляется потому, что `serve` не читает `_headers`: на Cloudflare ассеты кешируются на год. «Render-blocking» — это один CSS-файл на 6 КБ (gzip). Встроить его в HTML мешает строгий CSP.

## Выкладка — кратко

1. `npm install && npm run build`.
2. Cloudflare → Workers & Pages → Create → Pages → **Upload assets** → перетащить папку `dist`. Другой вариант — **Connect to Git**: build command `npm run build`, output `dist`.
3. Custom domains → добавить домен, затем вписать его в `site.config.mjs` → `SITE_URL`, пересобрать и выложить заново.
4. Вставить ссылки: Privacy → `https://<домен>/privacy`, Terms → `/terms`, Support → `/support`, Marketing / Website → главная, Delete account URL (Google Play) → `/support#delete-account`.

Подробная пошаговая инструкция и таблица «какое поле → какая ссылка» — в `README.md`.

## Проверки

- `npm run check`: Privacy (2172 слова) и Terms (1998 слов) совпадают с `.md`. Проверка независимая: markdown-разметку скрипт вычищает сам, без `marked`, а номера пунктов в нумерованных списках тоже сверяются. Скрипт проверил на порче: подменённое слово и сбитую нумерацию он ловит.
- Кнопка «Copy email» копирует адрес, сообщение «Email copied» озвучивается через `aria-live`. Без доступа к буферу обмена адрес выделяется. Сам адрес — обычный текст, его можно выделить и скопировать вручную.
- В консоли нет ошибок, `id` не повторяются. Первый Tab ведёт на «Skip to content». При `prefers-reduced-motion` анимация выключена.
- На всех страницах есть `title`, `description`, canonical, Open Graph, Twitter-карточка и `apple-itunes-app` (app-id 6812511817). На главной — JSON-LD `MobileApplication` без рейтингов, отзывов и цен. Есть `sitemap.xml` (даты документов взяты из «Last updated») и `robots.txt`.

## Решения, принятые за владельца

1. **Обещание в hero** оставил из кейс-стади: «A personal astrologer that explains, not scares.» Лучше в этом голосе не нашлось.
2. **Блок «Ask the chart»** опирается на формулировки из `us.md`: «yes, no, maybe or not yet», «how confident», «what to do next», «key factors». Третий шаг: «Natra finds the planets that stand for you…» — планеты здесь символы, а не действующие лица. Вердикт выносит Natra и «chart of the moment».
3. **Natra Pro упомянута по имени** в блоке «Today» и в FAQ «What is free and what is paid?»: без этого нечестно описывать, что входит в бесплатную часть. Цен нет. Слова «free» в заголовках нет, оно встречается только в вопросе FAQ.
4. **Что бесплатно.** Фраза «Your chart and a short daily hint come at no cost» опирается на `us.md` (подсказка на Home каждый день, полный прогноз с Pro) и на то, что колесо и Солнце / Луна / Асцендент в задании названы кадрами без замков. **Проверьте это по приложению.**
5. **FAQ поддержки.** Названия пунктов меню взяты из юридических текстов: «Profile → Delete account», «Restore purchases», «edit your profile and birth details». Английской локали приложения у меня не было, поэтому точную подпись кнопки редактирования данных рождения я не знаю. В тексте стоит «Open Profile and edit your birth details there» без названия кнопки. **Сверьте с приложением.**
6. **Пути отмены подписки** — стандартные для iOS и Google Play на ноябрь 2026. Ссылки на возвраты ведут на официальные страницы: Apple — https://support.apple.com/en-us/118223, Google — https://support.google.com/googleplay/answer/2479637.
7. **На что карта не отвечает** — «death, health and similar topics», как в задании. Если в приложении список шире (например, юридические вопросы), его можно дописать в `site.json`.
8. **Кнопки сторов** сделаны в стиле сайта: пунктирная рамка, «COMING SOON · App Store». Логотипов Apple и Google нет. Как подключить официальные значки, написано в README.
9. **На кадре колеса карты закрашена ссылка «Ask AI →»** (см. таблицу скриншотов), потому что такой функции в приложении нет.
10. **Адреса страниц без `.html` и без слеша** (`/privacy`): файлы собираются как `privacy.html`, и Cloudflare Pages, Netlify и `serve` отдают их по чистым адресам. Канонические ссылки сделаны так же.
11. **`dist/` не коммитится**: папку собирает `npm run build` локально или Cloudflare при подключении через GitHub.
12. **Работа в облачной сессии.** Задание писалось под `~/Desktop/natra-site`, но эта сессия работает в облаке с репозиторием `kgrigoryan0220/natra-landinig`. Исходники пришли в чат. Владелец разрешил push в ветку `claude/new-session-zy2pvy` и draft PR. Деплоя и регистраций в сервисах не было. Отчёт и скриншоты лежат в `reports/` этого репозитория, а не в `~/Desktop/natra_night/reports/`: оттуда их можно скопировать.
