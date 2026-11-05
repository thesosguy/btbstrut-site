# BTB Strut Systems — website

Marketing site for **BTB Strut Systems** (manufacturer of back-to-back / double welded strut channel).

- **Live:** https://b2bstrut.com  
- **Worker:** `btbstrut-site` (Cloudflare account SOSTECH)  
- **D1:** `btbstrut-leads` (`b5f1c474-9242-4258-8bc9-9ec6c258f529`)  
- **Quote notifications:** `dj@gooseautomation.com` via `send_email` binding `MAILER` (from `quotes@btbstrut.com`)

## Layout

| Path | Role |
|---|---|
| `scripts/build.py` | Regenerates `public/` (Python, no deps) |
| `scripts/make-deploy.mjs` | Embeds `public/` → `src/assets.js` + `deploy/deploy-code.js` |
| `public/` | Static HTML/CSS/JS/assets served by the Worker |
| `src/worker.js` | Host redirects, static file serve, `POST /api/quote` |
| `src/assets.js` | Generated base64 asset map |
| `schema.sql` | D1 `leads` table |
| `wrangler.jsonc` | For `npx wrangler deploy` |
| `deploy/deploy-code.js` | Cloudflare MCP `execute` upload payload |

## Build & deploy

```bash
python3 scripts/build.py
node scripts/make-deploy.mjs
# then either:
#   - run deploy/deploy-code.js via Cloudflare MCP execute
#   - or: npx wrangler deploy
```

Alias domains (`btbstrut.com`, `btbstruts.com`, `backtobackstrut.com`, and all `www.` hosts) 301 to `https://b2bstrut.com` with path + query preserved (Worker logic). Quote email From remains `quotes@btbstrut.com` (CF Email Routing); do not enable Email Routing on `b2bstrut.com` (Microsoft MX).

## Import note

This repository was reconstructed from the live Worker modules (`worker.js`, `assets.js`), live site HTML/CSS/JS, D1 schema, and the project SPEC. Content matches production; do not invent company facts (phone, address, certifications, etc.) beyond what is already on the site / SPEC.
