// Loads Playwright (only needed for `npm run og` and `npm run shots`, not for the build).
import { createRequire } from 'node:module';

export async function loadChromium() {
  const require = createRequire(import.meta.url);
  try {
    return require('playwright').chromium;
  } catch {
    try {
      return (await import('playwright')).chromium;
    } catch {
      throw new Error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
    }
  }
}
