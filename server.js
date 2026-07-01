import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const PORT = parseInt(process.env.PORT || "3000", 10);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

function setCspHeaders(res) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://www.googletagmanager.com",
    "frame-src 'none'",
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);
}

const server = createServer(async (req, res) => {
  setCspHeaders(res);

  const url = req.url.split("?")[0];
  const filePath = url === "/" ? "index.html" : url.slice(1);

  try {
    const fullPath = join(__dirname, filePath);
    const data = await readFile(fullPath);
    const ext = extname(fullPath).toLowerCase();
    res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.writeHead(200);
    res.end(data);
  } catch {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`smolp running on http://localhost:${PORT}`);
});
