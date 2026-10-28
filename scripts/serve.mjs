// Zero-dependency local preview of public/ at http://localhost:4173/hairline_matters_demo/
// Does not apply public/_headers; that file is read by Cloudflare at deploy time.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const port = Number(process.env.PORT) || 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.svg': 'image/svg+xml',
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path === '/' || path === '/hairline_matters_demo') {
    res.writeHead(302, { Location: '/hairline_matters_demo/' }).end();
    return;
  }
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(root, path));
  if (!file.startsWith(root) || path.split('/').some((s) => s.startsWith('_'))) {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream';
    // Byte ranges let the browser seek video (scroll scrub), as Cloudflare does.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range) {
      const start = range[1] ? Number(range[1]) : body.length - Number(range[2]);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${body.length}`,
        'Accept-Ranges': 'bytes',
      }).end(body.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes' }).end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] }).end(await readFile(join(root, 'hairline_matters_demo', '404.html')));
  }
}).listen(port, () => console.log(`http://localhost:${port}/hairline_matters_demo/`));
