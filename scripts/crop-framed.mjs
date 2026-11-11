// Cuts the screen out of a framed phone mockup and saves it as a screenshot slot.
// Usage: npm run crop-framed -- <framed-image> <slot>
//   e.g. npm run crop-framed -- ~/Desktop/natra_night/screenshots/raw2/en-framed/05-home-a.png home
// The screen edge is found automatically: the scan walks in from each side of the image,
// past the transparent margin and the frame, to the first pixel after the black inner bezel.
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

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => {
  const i = (y * W + x) * 4;
  return { lum: (data[i] + data[i + 1] + data[i + 2]) / 3, a: data[i + 3] };
};
const BLACK = 3;

// Walk from `start` in `step` direction along a line; return the first content pixel after the black bezel.
function edge(len, at, start, step) {
  let i = start;
  while (i >= 0 && i < len && at(i).a === 0) i += step; // transparent margin
  let sawBlack = 0;
  for (; i >= 0 && i < len; i += step) {
    const p = at(i);
    if (p.lum <= BLACK) sawBlack++;
    else if (sawBlack >= 3) return i; // first pixel after the inner black bezel
  }
  throw new Error('Could not find the screen edge. Is this a framed screenshot?');
}

const midY = Math.floor(H / 2);
const quarterX = Math.floor(W / 4); // away from the Dynamic Island
const left = edge(W, (x) => px(x, midY), 0, 1);
const right = edge(W, (x) => px(x, midY), W - 1, -1);
const top = edge(H, (y) => px(quarterX, y), 0, 1);
const bottom = edge(H, (y) => px(quarterX, y), H - 1, -1);
const box = { left, top, width: right - left + 1, height: bottom - top + 1 };

const out = path.join(ROOT, 'src/assets/screenshots', `${slot}.png`);
await sharp(input).extract(box).flatten({ background: '#0a0a0f' }).png().toFile(out);
console.log(`Saved ${path.relative(ROOT, out)} (${box.width}×${box.height}, from ${W}×${H} at ${left},${top})`);
