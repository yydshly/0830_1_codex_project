import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('.', import.meta.url));
const host = '127.0.0.1';
const requestedPort = Number.parseInt(process.env.QMREADER_SITE_PORT || '4217', 10);
const port = Number.isFinite(requestedPort) && requestedPort > 0 ? requestedPort : 4217;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl || '/', `http://${host}:${port}`).pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = resolve(siteRoot, relativePath);
  const relativeCandidate = relative(siteRoot, candidate);
  if (!relativeCandidate || relativeCandidate === '..' || relativeCandidate.startsWith(`..${sep}`) || isAbsolute(relativeCandidate)) return null;
  return candidate;
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  process.stdout.write(`QMReader study site: http://${host}:${port}/\n`);
});
