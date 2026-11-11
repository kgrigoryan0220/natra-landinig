// Everything the owner may need to change lives in this file.
// After editing, run `npm run build`.

export default {
  // Public address of the site, without a trailing slash.
  // Replace when the domain is bought, e.g. "https://natra.app".
  SITE_URL: 'https://natra-astrology.app',

  // Support and legal contact shown on every page.
  email: 'astrologyapp@outlook.com',
  copyright: '© 2026 Artur Arzumanian',
  author: 'Artur Arzumanian',

  // Apple App Store ID, used by the Smart App Banner and structured data.
  appleAppId: '6812511817',

  // Store links. While `url` is null the button shows "Coming soon" and is not clickable.
  // When the app is live:
  //   1. paste the store URL into `url`;
  //   2. download the official badge (Apple Marketing Tools / Google Play Badges),
  //      put the SVG or PNG into src/assets/badges/ and write its file name into `badge`.
  // Without a badge the button becomes an active text link in the site style.
  stores: {
    appStore: {
      url: null, // e.g. 'https://apps.apple.com/app/id6812511817'
      badge: null, // e.g. 'app-store-badge-en.svg'
    },
    googlePlay: {
      url: null, // e.g. 'https://play.google.com/store/apps/details?id=…'
      badge: null, // e.g. 'google-play-badge-en.png'
    },
  },

  // Store rating, shown above "What you can count on" once the app has real ratings.
  // Leave null until then. Never put made-up numbers here.
  rating: null, // e.g. { value: '4.8', label: 'on the App Store' }

  // Languages. Each one needs content/<code>/site.json and content/<code>/legal/*.md.
  // The default language is served from the root (/privacy), others from /<code>/ (/ru/privacy).
  defaultLocale: 'en',
  locales: ['en'],
};
