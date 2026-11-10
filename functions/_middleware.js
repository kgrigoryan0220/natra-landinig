// Cloudflare Pages Function: Markdown for AI agents.
// When a client asks for Markdown (Accept: text/markdown, e.g. an AI agent), the page is answered
// with its Markdown twin (/index.md, /support.md, …). Browsers keep getting HTML.
// Only the page routes listed in dist/_routes.json reach this function; files are served directly.

const TWINS = {
  '/': '/index.md',
  '/index.html': '/index.md',
  '/support': '/support.md',
  '/support.html': '/support.md',
  '/privacy': '/privacy.md',
  '/privacy.html': '/privacy.md',
  '/terms': '/terms.md',
  '/terms.html': '/terms.md',
};

// Quality of a media type in an Accept header (0 when absent).
function quality(accept, type) {
  let best = 0;
  for (const part of accept.split(',')) {
    const [range, ...params] = part.trim().toLowerCase().split(';').map((x) => x.trim());
    if (range !== type) continue;
    const q = params.find((p) => p.startsWith('q='));
    best = Math.max(best, q ? parseFloat(q.slice(2)) || 0 : 1);
  }
  return best;
}

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const twin = TWINS[url.pathname.replace(/(.)\/$/, '$1')];
  if (!twin || (request.method !== 'GET' && request.method !== 'HEAD')) return next();

  const accept = request.headers.get('Accept') || '';
  const wantsMarkdown = quality(accept, 'text/markdown') > 0 && quality(accept, 'text/markdown') >= quality(accept, 'text/html');

  if (wantsMarkdown) {
    const asset = await env.ASSETS.fetch(new URL(twin, url.origin));
    if (asset.ok) {
      const text = await asset.text();
      const page = url.pathname.replace(/\.html$/, '').replace(/^\/index$/, '/');
      return new Response(request.method === 'HEAD' ? null : text, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept',
          Link: `<${url.origin}${page}>; rel="canonical"`,
          'X-Markdown-Tokens': String(Math.ceil(text.length / 4)),
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }
  }

  const response = await next();
  const out = new Response(response.body, response);
  out.headers.append('Vary', 'Accept');
  return out;
}
