#!/usr/bin/env node
/**
 * Embed public/ into src/assets.js and write deploy/deploy-code.js
 * for Cloudflare API upload (Workers modules + bindings).
 *
 * Usage: node scripts/make-deploy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");
const DEPLOY = path.join(ROOT, "deploy");

const ACCOUNT_ID = "29136c93dfb4e805eaab41e09731df1e";
const SCRIPT_NAME = "btbstrut-site";
const D1_ID = "b5f1c474-9242-4258-8bc9-9ec6c258f529";
const MAIL_TO = "dj@gooseautomation.com";
const COMPAT_DATE = "2025-09-01";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}

function toKey(abs) {
  const rel = path.relative(PUBLIC, abs).split(path.sep).join("/");
  return "/" + rel;
}

function buildAssets() {
  const assets = {};
  for (const abs of walk(PUBLIC).sort()) {
    const key = toKey(abs);
    const ext = path.extname(abs).toLowerCase();
    const type = TYPES[ext] || "application/octet-stream";
    const buf = fs.readFileSync(abs);
    // ETag hash (MD5 of file bytes). Imported production assets.js used a
    // different opaque hash; regenerating here is fine — next deploy refreshes ETags.
    const hash = crypto.createHash("md5").update(buf).digest("hex");
    assets[key] = { type, hash, b64: buf.toString("base64") };
  }
  return assets;
}

function writeAssetsJs(assets) {
  const body = `export const ASSETS = ${JSON.stringify(assets)};\n`;
  fs.mkdirSync(SRC, { recursive: true });
  fs.writeFileSync(path.join(SRC, "assets.js"), body);
  return body;
}

function writeDeployCode(assetsJs, workerJs) {
  fs.mkdirSync(DEPLOY, { recursive: true });
  // Entire file is an async arrow function for Cloudflare MCP `execute`.
  const deploySrc = `async () => {
  const WORKER_JS = ${JSON.stringify(workerJs)};
  const ASSETS_JS = ${JSON.stringify(assetsJs)};
  const accountId = ${JSON.stringify(ACCOUNT_ID)};
  const metadata = {
    main_module: "worker.js",
    compatibility_date: ${JSON.stringify(COMPAT_DATE)},
    bindings: [
      { type: "d1", name: "DB", id: ${JSON.stringify(D1_ID)} },
      { type: "send_email", name: "MAILER", destination_address: ${JSON.stringify(MAIL_TO)} },
    ],
  };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("worker.js", new Blob([WORKER_JS], { type: "application/javascript+module" }), "worker.js");
  form.append("assets.js", new Blob([ASSETS_JS], { type: "application/javascript+module" }), "assets.js");
  const res = await cloudflare.request({
    method: "PUT",
    path: \`/accounts/\${accountId}/workers/scripts/${SCRIPT_NAME}\`,
    body: form,
  });
  return { ok: true, id: res?.result?.id || ${JSON.stringify(SCRIPT_NAME)}, etag: res?.result?.etag };
}
`;
  fs.writeFileSync(path.join(DEPLOY, "deploy-code.js"), deploySrc);
}

const assets = buildAssets();
const assetsJs = writeAssetsJs(assets);
const workerJs = fs.readFileSync(path.join(SRC, "worker.js"), "utf8");
writeDeployCode(assetsJs, workerJs);
console.log(
  `Embedded ${Object.keys(assets).length} files -> src/assets.js (${assetsJs.length} bytes) and deploy/deploy-code.js`
);
