import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const DATA_DIR =
  process.env.DATA_DIR ||
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  path.join(process.cwd(), "data", "runtime");
const DEFAULT_CONTENT_PATH = path.join(process.cwd(), "data", "site-content.default.json");
const AUTH_PATH = path.join(DATA_DIR, "auth.json");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");
const COOKIE_NAME = "mik_admin";
const SESSION_DAYS = 7;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "iveta.kustera@gmail.com").trim().toLowerCase();
const INITIAL_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

const loginAttempts = new Map();

function ensureDir() {
  mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDir();
  writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
}

function defaultContent() {
  return readJson(DEFAULT_CONTENT_PATH, {});
}

function loadContent() {
  const base = defaultContent();
  const overlay = existsSync(CONTENT_PATH) ? readJson(CONTENT_PATH, null) : null;
  if (!overlay || typeof overlay !== "object") return base;
  return {
    ...base,
    ...overlay,
    hero: { ...base.hero, ...overlay.hero },
    nav: { ...base.nav, ...overlay.nav },
    featured: { ...base.featured, ...overlay.featured },
    about: { ...base.about, ...overlay.about },
    help: { ...base.help, ...overlay.help },
    contact: { ...base.contact, ...overlay.contact },
    footer: { ...base.footer, ...overlay.footer },
    collections: Array.isArray(overlay.collections) ? overlay.collections : base.collections,
  };
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return `${salt.toString("hex")}:${Buffer.from(key).toString("hex")}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [saltHex, hashHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = Buffer.from(await scryptAsync(password, salt, 64));
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

async function loadAuth() {
  ensureDir();
  if (!existsSync(AUTH_PATH)) {
    const auth = {
      email: ADMIN_EMAIL,
      passwordHash: await hashPassword(INITIAL_PASSWORD),
      secret: randomBytes(32).toString("hex"),
    };
    writeJson(AUTH_PATH, auth);
    return auth;
  }
  const auth = readJson(AUTH_PATH, null);
  if (!auth?.secret || !auth?.passwordHash || !auth?.email) {
    const next = {
      email: auth?.email || ADMIN_EMAIL,
      passwordHash: auth?.passwordHash || (await hashPassword(INITIAL_PASSWORD)),
      secret: auth?.secret || randomBytes(32).toString("hex"),
    };
    writeJson(AUTH_PATH, next);
    return next;
  }
  return auth;
}

function sign(secret, payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function unsign(secret, token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function cookieHeader(value, maxAge) {
  const secure = Boolean(process.env.RAILWAY_ENVIRONMENT) || process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const item = loginAttempts.get(ip) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > item.reset) {
    item.count = 0;
    item.reset = now + 15 * 60 * 1000;
  }
  item.count += 1;
  loginAttempts.set(ip, item);
  return item.count > 12;
}

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(12);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
}

function send(res, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(payload);
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function emailNewPassword(to, password) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: "Nové heslo k administraci mikolection.com",
      _template: "box",
      _captcha: "false",
      message: `Nové heslo k administraci MiK:\n\n${password}\n\nPřihlášení: https://www.mikolection.com/admin\n\nHeslo si po přihlášení můžete znovu změnit.`,
    }),
  });
  if (!response.ok) throw new Error("email failed");
  const payload = await response.json().catch(() => ({}));
  if (payload.success === false || payload.success === "false") {
    const needsActivation =
      typeof payload.message === "string" && payload.message.toLowerCase().includes("activation");
    const error = new Error(needsActivation ? "activation" : "email failed");
    error.code = needsActivation ? "activation" : "email";
    throw error;
  }
}

async function requireSession(req) {
  const auth = await loadAuth();
  const token = parseCookies(req)[COOKIE_NAME];
  const payload = unsign(auth.secret, token);
  if (!payload?.email || payload.exp < Date.now()) return null;
  if (payload.email !== auth.email) return null;
  return { auth, payload };
}

export async function handleAdminRequest(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const route = url.pathname;

  if (req.method === "GET" && route === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("ok");
    return true;
  }

  if (!route.startsWith("/api/")) return false;

  if (req.method === "GET" && route === "/api/content") {
    send(res, 200, loadContent());
    return true;
  }

  if (req.method === "POST" && route === "/api/admin/login") {
    if (rateLimited(clientIp(req))) {
      send(res, 429, { error: "Příliš mnoho pokusů. Zkuste to za chvíli." });
      return true;
    }
    const auth = await loadAuth();
    let body = {};
    try {
      body = JSON.parse((await readBody(req)) || "{}");
    } catch {
      send(res, 400, { error: "Neplatný požadavek." });
      return true;
    }
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const emailOk = email === auth.email;
    const passOk = await verifyPassword(password, auth.passwordHash);
    if (!emailOk || !passOk) {
      send(res, 401, { error: "Nesprávný e-mail nebo heslo." });
      return true;
    }
    const token = sign(auth.secret, {
      email: auth.email,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    });
    send(res, 200, { email: auth.email }, { "Set-Cookie": cookieHeader(token, SESSION_DAYS * 24 * 60 * 60) });
    return true;
  }

  if (req.method === "POST" && route === "/api/admin/logout") {
    send(res, 200, { ok: true }, { "Set-Cookie": cookieHeader("", 0) });
    return true;
  }

  if (req.method === "GET" && route === "/api/admin/me") {
    const session = await requireSession(req);
    if (!session) {
      send(res, 401, { error: "Nepřihlášena." });
      return true;
    }
    send(res, 200, { email: session.auth.email });
    return true;
  }

  if (req.method === "POST" && route === "/api/admin/forgot-password") {
    if (rateLimited(clientIp(req))) {
      send(res, 429, { error: "Příliš mnoho pokusů. Zkuste to za chvíli." });
      return true;
    }
    let body = {};
    try {
      body = JSON.parse((await readBody(req)) || "{}");
    } catch {
      send(res, 400, { error: "Neplatný požadavek." });
      return true;
    }
    const email = String(body.email || "").trim().toLowerCase();
    const auth = await loadAuth();
    if (email === auth.email) {
      try {
        const password = generatePassword();
        auth.passwordHash = await hashPassword(password);
        writeJson(AUTH_PATH, auth);
        await emailNewPassword(auth.email, password);
      } catch (error) {
        if (error.code === "activation") {
          send(res, 200, {
            ok: true,
            activate: true,
            message:
              "Na přihlašovací e-mail přišel aktivační odkaz. Po jeho potvrzení pošlete žádost o nové heslo znovu.",
          });
          return true;
        }
        send(res, 500, { error: "E-mail s heslem se nepodařilo odeslat." });
        return true;
      }
    }
    send(res, 200, {
      ok: true,
      message: "Pokud je e-mail správný, nové heslo teď přijde do schránky.",
    });
    return true;
  }

  if (req.method === "POST" && route === "/api/admin/change-password") {
    const session = await requireSession(req);
    if (!session) {
      send(res, 401, { error: "Nepřihlášena." });
      return true;
    }
    let body = {};
    try {
      body = JSON.parse((await readBody(req)) || "{}");
    } catch {
      send(res, 400, { error: "Neplatný požadavek." });
      return true;
    }
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (newPassword.length < 8) {
      send(res, 400, { error: "Nové heslo musí mít alespoň 8 znaků." });
      return true;
    }
    const ok = await verifyPassword(currentPassword, session.auth.passwordHash);
    if (!ok) {
      send(res, 401, { error: "Současné heslo nesedí." });
      return true;
    }
    session.auth.passwordHash = await hashPassword(newPassword);
    writeJson(AUTH_PATH, session.auth);
    send(res, 200, { ok: true });
    return true;
  }

  if (req.method === "PUT" && route === "/api/content") {
    const session = await requireSession(req);
    if (!session) {
      send(res, 401, { error: "Nepřihlášena." });
      return true;
    }
    let body = {};
    try {
      body = JSON.parse((await readBody(req, 2_000_000)) || "{}");
    } catch {
      send(res, 400, { error: "Neplatný požadavek." });
      return true;
    }
    writeJson(CONTENT_PATH, body);
    send(res, 200, { ok: true, content: loadContent() });
    return true;
  }

  send(res, 404, { error: "Not found" });
  return true;
}
