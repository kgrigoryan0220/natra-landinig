// Cuts the screen out of a framed phone mockup (the 976×2000 exports used in the case study)
// and saves it as a raw screenshot slot.
// Usage: npm run crop-framed -- <framed-image> <slot>
//   e.g. npm run crop-framed -- ~/Desktop/natra_night/screenshots/raw2/en/home.webp home
// Raw screen captures (no frame) need no cropping: copy them to src/assets/screenshots/<slot>.png.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [input, slot] = process.argv.slice(2);
if (!input || !slot) {
  console.error('Usage: npm run crop-framed -- <framed-image> <slot>   (slots: home, chart-wheel, ask-verdict, compatibility)');
  process.exit(1);
}
const meta = await sharp(input).metadata();
// Screen area measured on the 976×2000 frame: x 41–935, y 34–1966. Scaled for other sizes.
const sx = meta.width / 976, sy = meta.height / 2000;
const box = { left: Math.round(41 * sx), top: Math.round(34 * sy), width: Math.round(894 * sx), height: Math.round(1932 * sy) };
const out = path.join(ROOT, 'src/assets/screenshots', `${slot}.png`);
await sharp(input).extract(box).png().toFile(out);
console.log(`Saved ${path.relative(ROOT, out)} (${box.width}×${box.height})`);
