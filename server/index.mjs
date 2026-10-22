import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { handleAdminRequest } from "./api.mjs";

const DIST = path.join(process.cwd(), "dist");
const PORT = Number(process.env.PORT || 8080);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function safeFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const relative = decoded === "/" ? "/index.html" : decoded;
  const file = path.normalize(path.join(DIST, relative));
  if (!file.startsWith(DIST)) return null;
  return file;
}

const server = createServer(async (req, res) => {
  try {
    const handled = await handleAdminRequest(req, res);
    if (handled) return;

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405);
      res.end();
      return;
    }

    let file = safeFile(req.url || "/");
    if (!file || !existsSync(file) || statSync(file).isDirectory()) {
      file = path.join(DIST, "index.html");
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    createReadStream(file).pipe(res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end("error");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`MiK listening on ${PORT}`);
});
