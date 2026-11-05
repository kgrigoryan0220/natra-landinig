// Verifies that the Privacy Policy and Terms of Use on the built site match the source .md word for word.
// Usage: npm run build && npm run check
//
// The two sides are reduced to plain word sequences independently:
//  - .md: markdown syntax is stripped (#, **, table pipes, bullets, link URLs, rules); list numbers are kept;
//  - .html: text of <article data-legal-doc> is extracted; <ol> numbers are rebuilt from start/order.
// Then the sequences must be identical, including punctuation and typographic quotes.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import cfg from '../site.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = ['privacy', 'terms'];

function mdWords(src) {
  const out = [];
  for (let line of src.split(/\r?\n/)) {
    if (/^\s*---+\s*$/.test(line)) continue; // horizontal rule
    if (/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line)) continue; // table separator
    line = line.replace(/^\s*#{1,6}\s+/, ''); // heading marks
    line = line.replace(/^\s*[-*+]\s+/, ''); // bullet
    if (/^\s*\|/.test(line)) line = line.replace(/\|/g, ' '); // table cells
    line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // [text](url)
    line = line.replace(/\*\*/g, ''); // bold
    out.push(line);
  }
  return out.join(' ').split(/\s+/).filter(Boolean);
}

const BLOCK = new Set(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'tr', 'br', 'hr', 'div', 'ul', 'ol', 'table', 'thead', 'tbody', 'blockquote']);

function htmlWords(article) {
  const parts = [];
  const walk = (node) => {
    if (node.nodeType === 3) {
      parts.push(node.text);
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.rawTagName?.toLowerCase();
    if (BLOCK.has(tag)) parts.push(' ');
    if (tag === 'ol') {
      let n = parseInt(node.getAttribute('start') || '1', 10);
      for (const child of node.childNodes) {
        if (child.nodeType === 1 && child.rawTagName.toLowerCase() === 'li') {
          parts.push(` ${n++}. `);
          walk(child);
        } else walk(child);
      }
    } else {
      node.childNodes.forEach(walk);
    }
    if (BLOCK.has(tag)) parts.push(' ');
  };
  walk(article);
  return parts.join('').replace(/ /g, ' ').split(/\s+/).filter(Boolean);
}

let failed = false;
for (const locale of cfg.locales) {
  for (const key of DOCS) {
    const mdFile = path.join(ROOT, 'content', locale, 'legal', `${key}.md`);
    const htmlFile = path.join(ROOT, 'dist', locale === cfg.defaultLocale ? '' : locale, `${key}.html`);
    const md = mdWords(await fs.readFile(mdFile, 'utf8'));
    const root = parse(await fs.readFile(htmlFile, 'utf8'));
    const article = root.querySelector(`article[data-legal-doc="${key}"]`);
    if (!article) {
      console.error(`✗ ${path.relative(ROOT, htmlFile)}: no <article data-legal-doc="${key}">`);
      failed = true;
      continue;
    }
    const html = htmlWords(article);
    const n = Math.max(md.length, html.length);
    let i = 0;
    while (i < n && md[i] === html[i]) i++;
    const label = `${path.relative(ROOT, mdFile)} ↔ ${path.relative(ROOT, htmlFile)}`;
    if (i === n) {
      console.log(`✓ ${label}: identical (${md.length} words)`);
    } else {
      failed = true;
      console.error(`✗ ${label}: first difference at word ${i + 1}`);
      console.error(`  md:   …${md.slice(Math.max(0, i - 6), i + 6).join(' ')}…`);
      console.error(`  html: …${html.slice(Math.max(0, i - 6), i + 6).join(' ')}…`);
    }
  }
}
process.exit(failed ? 1 : 0);
