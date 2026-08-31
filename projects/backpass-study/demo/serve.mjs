import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2] || process.env.PORT || 4173);
const host = "127.0.0.1";
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
};

function resolveRequestPath(url = "/") {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const target = resolve(root, relative);
  const rootPrefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return target.startsWith(rootPrefix) ? target : null;
}

const server = createServer((request, response) => {
  const target = resolveRequestPath(request.url);
  if (!target || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[extname(target)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(target).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Backpass study demo: http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
