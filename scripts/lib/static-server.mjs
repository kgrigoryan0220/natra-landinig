// Minimal static server with clean URLs (/privacy -> privacy.html) and 404.html,
// matching how Cloudflare Pages serves dist/. Used by screenshot/check scripts.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json',
};

export function startServer(root, port = 0) {
  const server = http.createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const candidates = urlPath.endsWith('/') ? [urlPath + 'index.html'] : [urlPath, urlPath + '.html', urlPath + '/index.html'];
    for (const c of candidates) {
      const file = path.join(root, path.normalize(c).replace(/^(\.\.[/\\])+/, ''));
      if (!file.startsWith(root)) break;
      try {
        const st = await fs.stat(file);
        if (!st.isFile()) continue;
        res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
        return res.end(await fs.readFile(file));
      } catch {}
    }
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(await fs.readFile(path.join(root, '404.html')));
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}
