// Tiny zero-dependency API used by the /content editor.
//   GET  /api/content          -> saved content JSON (public)
//   GET  /api/check            -> 200 if the password header is valid
//   PUT  /api/content          -> save content JSON      (password required)
//   POST /api/upload?name=x.png-> save an image          (password required)
//   GET  /uploads/<file>       -> serve an uploaded image
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

const MAX_JSON = 1024 * 1024; // 1 MB
const MAX_IMAGE = 8 * 1024 * 1024; // 8 MB
const IMAGE_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const PASSWORD = process.env.EDITOR_PASSWORD || "party123";
if (!process.env.EDITOR_PASSWORD) {
  console.warn('[content] EDITOR_PASSWORD is not set — using the default "party123". Set it before going live.');
}

function authorized(req) {
  const given = String(req.headers["x-editor-password"] || "");
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}

function send(res, status, body, headers = {}) {
  const isObj = body !== null && typeof body === "object" && !Buffer.isBuffer(body);
  res.writeHead(status, { "Content-Type": isObj ? "application/json" : "text/plain", ...headers });
  res.end(isObj ? JSON.stringify(body) : body);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error("Too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Connect-style middleware. Calls next() for anything that is not ours. */
export async function apiMiddleware(req, res, next) {
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname;

  try {
    if (req.method === "GET" && p.startsWith("/uploads/")) {
      const file = path.basename(decodeURIComponent(p));
      const type = IMAGE_TYPES[path.extname(file).toLowerCase()];
      const full = path.join(UPLOAD_DIR, file);
      if (!type || !fs.existsSync(full)) return send(res, 404, "Not found");
      const headers = { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" };
      // SVGs can contain scripts, so lock them down when opened directly.
      if (type === "image/svg+xml") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'";
      res.writeHead(200, headers);
      return fs.createReadStream(full).pipe(res);
    }

    if (!p.startsWith("/api/")) return next();

    if (p === "/api/content" && req.method === "GET") {
      if (!fs.existsSync(CONTENT_FILE)) return send(res, 200, {});
      return send(res, 200, fs.readFileSync(CONTENT_FILE, "utf8"), { "Content-Type": "application/json", "Cache-Control": "no-store" });
    }

    if (p === "/api/check" && req.method === "GET") {
      return authorized(req) ? send(res, 200, { ok: true }) : send(res, 401, { error: "Wrong password" });
    }

    if (p === "/api/content" && req.method === "PUT") {
      if (!authorized(req)) return send(res, 401, { error: "Wrong password" });
      const raw = await readBody(req, MAX_JSON);
      let parsed;
      try {
        parsed = JSON.parse(raw.toString("utf8"));
      } catch {
        return send(res, 400, { error: "Invalid JSON" });
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return send(res, 400, { error: "Invalid content" });
      const tmp = CONTENT_FILE + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(parsed, null, 2));
      fs.renameSync(tmp, CONTENT_FILE);
      return send(res, 200, { ok: true });
    }

    if (p === "/api/upload" && req.method === "POST") {
      if (!authorized(req)) return send(res, 401, { error: "Wrong password" });
      const ext = path.extname(url.searchParams.get("name") || "").toLowerCase();
      if (!IMAGE_TYPES[ext]) return send(res, 400, { error: "Use a PNG, JPG, GIF, WEBP or SVG image." });
      const data = await readBody(req, MAX_IMAGE);
      if (!data.length) return send(res, 400, { error: "Empty file" });
      const file = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}${ext}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, file), data);
      return send(res, 200, { url: `/uploads/${file}` });
    }

    return send(res, 404, { error: "Not found" });
  } catch (err) {
    const status = err.status || 500;
    if (!res.headersSent) send(res, status, { error: status === 413 ? "File is too large (max 8 MB)." : "Server error" });
  }
}
