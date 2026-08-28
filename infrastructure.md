# Infrastructure — Casa de España en Indiana

## Overview

A zero-build static website. No server, no database, no framework. All pages are plain HTML files deployed via GitHub Pages. The only automated backend process is a GitHub Actions cron that refreshes a cached JSON news feed every 30 minutes.

---

## Hosting

| Layer | Service | Detail |
|---|---|---|
| Production host | **GitHub Pages** | `w1ldr1.github.io` repo |
| Custom domain | `casaespanaindiana.org` | CNAME in repo root points Pages to this domain |
| Dev/staging repo | GitHub | `github.com/w1ldr1/CasaDeEspanaTest` |
| Form backend | Google Apps Script | Handles `join.html` membership/newsletter signup |
| News data source | El País RSS | `feeds.elpais.com/mrss-s/…/espana/portada` |
| Fonts | Google Fonts CDN | Cormorant Garamond (display) + Source Sans 3 (body) |
| CSS utility | Tailwind CDN | Loaded in each HTML page, no build step |

---

## Git Remotes

Two remotes are configured on the local repo. There is no staging server — the test repo itself is the staging environment.

```
origin  →  github.com/w1ldr1/CasaDeEspanaTest   (dev / staging)
prod    →  github.com/w1ldr1/w1ldr1.github.io    (production / GitHub Pages)
```

---

## Dev → Prod Flow

```
Local Machine (Windows 11)
│
│  Edit HTML / JSON files
│  node serve.mjs  →  http://localhost:3000  (dev preview)
│
│  git push origin main
│
▼
github.com/w1ldr1/CasaDeEspanaTest  (staging / review)
│
│  git push prod main
│
▼
github.com/w1ldr1/w1ldr1.github.io  (GitHub Pages)
│
│  GitHub Pages serves files at:
│  https://w1ldr1.github.io  →  CNAME redirect →  https://casaespanaindiana.org
│
▼
casaespanaindiana.org  (live site)
```

### Deploy command

```bash
git push prod main
```

There is no CI gate, no build step, and no approval process — the push is the deploy. GitHub Pages serves the new files within seconds.

---

## Automated Processes (GitHub Actions)

### News Cache Refresh

**File:** [.github/workflows/update-news.yml](.github/workflows/update-news.yml)
**Script:** [.github/scripts/fetch-news.mjs](.github/scripts/fetch-news.mjs)

| Setting | Value |
|---|---|
| Trigger | Cron every 30 minutes + manual `workflow_dispatch` |
| Runner | `ubuntu-latest` |
| Node | v20 |

**What it does:**
1. Checks out the repo.
2. Fetches the El País RSS feed (no CORS restriction from Actions runner).
3. Parses items (title, link, description, date, image URL) and writes `news-cache.json`.
4. Commits and pushes the updated cache back to `origin/main` with `[skip ci]` in the message to avoid a loop.

**Fallback (runtime):** `news.html` also tries `api.allorigins.win` as a CORS proxy if the cached file is stale or unavailable.

**Local dev fallback:** `serve.mjs` replicates the same RSS fetch logic and auto-refreshes `news-cache.json` when it's older than 30 minutes.

---

## Local Development

```bash
node serve.mjs          # start dev server → http://localhost:3000
node screenshot.mjs http://localhost:3000 <label>   # capture screenshot
```

**Dev server** (`serve.mjs`): a plain Node.js HTTP server. No hot reload. Handles MIME types, static file serving, and the news-cache refresh logic. Screenshots output to `./temporary screenshots/`.

**Dependencies** (not needed for the site itself — dev tooling only):

| Package | Purpose |
|---|---|
| `puppeteer-core` | Headless Chrome for `screenshot.mjs` |

`canvas` was listed here previously but was never actually required by `puppeteer-core` or used by any script in this repo — removed 2026-08-28 after its native binary turned out broken post-drive-migration.

Chrome binary cache: `C:/Users/wildr/.cache/puppeteer/`

---

## Data Layer

All data is flat files committed to the repo. There is no CMS or database.

| File | Updated by | Purpose |
|---|---|---|
| `events.json` | Manual commit | Upcoming events on homepage |
| `past-events.json` | Manual commit | Past events archive with photos |
| `news-cache.json` | GitHub Actions cron | Cached El País RSS feed |

---

## Form Handling

`join.html` posts to a **Google Apps Script** endpoint. The script receives the form data and sends a confirmation email. No server-side code lives in this repo; the endpoint URL is embedded in the HTML.

---

## DNS

The CNAME file in the repo root contains `casaespanaindiana.org`. GitHub Pages reads this and configures the custom domain. The DNS registrar must have a CNAME record pointing `casaespanaindiana.org` → `w1ldr1.github.io`.

---

## What Does Not Exist Here

- No build pipeline (no Webpack, Vite, etc.)
- No server-side rendering
- No database
- No CMS (WordPress was abandoned 2026-03-06 — see [PLANNING.md](PLANNING.md))
- No staging environment beyond the `origin` GitHub repo
- No CDN beyond GitHub Pages' built-in edge network
- No environment secrets or `.env` files (all config is inlined in HTML)
