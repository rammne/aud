// Production server: serves the built site (dist/) plus the content API.
//   npm run build && EDITOR_PASSWORD=your-secret npm start
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apiMiddleware } from "./server/api.js";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist");
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    apiMiddleware(req, res, () => {
      const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = path.join(DIST, pathname);
      if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(DIST, "index.html"); // SPA fallback (/content)
      }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
  })
  .listen(PORT, () => console.log(`Site running on http://localhost:${PORT}  (editor: /content)`));
