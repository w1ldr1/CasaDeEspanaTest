# Project Brief — Casa de España en Indiana

## Organization
**Casa de España en Indiana** is a nonprofit organization connecting the Spanish-speaking community to Indiana. It provides cultural programming, resources, and community support.

## Project
A public-facing marketing website hosted via GitHub Pages. Multi-page static site, English/Spanish bilingual, mobile-first responsive.

## Stakeholder
- **Maria Wildridge** — President, Latino Services Director at Marion County Prosecutor's Office
- **Git user / developer**: w1ldr1 (wildridge@gmail.com)

---

## Site Pages

| Page | Purpose |
|---|---|
| `index.html` | Homepage — hero, mission, programs, events, CTA, board, footer |
| `programs.html` | Detail on the three program pillars: Cultural Events, Community Support, Resources |
| `events.html` | Full upcoming-events listing, data-driven from `events.json` |
| `board.html` | Board of Directors, full bios/photos |
| `donate.html` | Donation page — PayPal, impact tiers |
| `resources.html` | Curated links: government agencies, info resources, scholarships |
| `news.html` | RSS-fed news feed with CORS proxy + static cache fallback |
| `join.html` | Membership/newsletter signup form → Google Apps Script |
| `email-welcome.html` | Post-signup confirmation (noindex) |
| `past-events.html` | Archive of past events with photos, recaps, lightbox, year filter |
| `newcomers-en.html` / `newcomers-es.html` | Relocation guide for Spanish teachers/families moving to Indiana (separate files, not a toggle) |
| `newcomers.html` | Language-aware redirect stub → `newcomers-en.html` / `newcomers-es.html` |
| `privacy.html` | Bilingual privacy policy |

---

## Technical Stack

- **Framework**: Vanilla HTML/CSS/JS — no build step
- **Styling**: Tailwind CSS via CDN + inline styles
- **Fonts**: Cormorant Garamond (display) + Source Sans 3 (body) via Google Fonts
- **Data**: JSON files (`events.json`, `past-events.json`, `news-cache.json`)
- **News feed**: GitHub Actions cron every 30 min → `news-cache.json`; runtime fallback via `api.allorigins.win` CORS proxy
- **Events reminder**: GitHub Actions daily cron emails the org when the events lineup is about to run dry (see `infrastructure.md`)
- **Form backend**: Google Apps Script endpoint (`join.html` posts directly; no mailto fallback)
- **Dev server**: `node serve.mjs` (localhost:3000)
- **Screenshots**: `node screenshot.mjs http://localhost:3000 <label>` → `./temporary screenshots/`

## Hosting & Deployment

| Remote | Repo | Use |
|---|---|---|
| `origin` | `github.com/w1ldr1/CasaDeEspanaTest` | Development / staging |
| `prod` | `github.com/w1ldr1/w1ldr1.github.io` | Production (GitHub Pages) |

Deploy to prod: `git push prod main`

---

## Brand

### Colors
| Token | Hex | Role |
|---|---|---|
| `--terra` | `#C13B2B` | Primary — terracotta red |
| `--terra-deep` | `#8C2318` | Hover / active |
| `--terra-muted` | `#D4604F` | Secondary accent |
| `--parchment` | `#FAF4ED` | Page background |
| `--parch-2` | `#F2E9DF` | Card / section bg |
| `--parch-3` | `#E8DBCF` | Dividers |
| `--ink` | `#1C1410` | Near-black |
| `--ink-mid` | `#3D2E26` | Secondary text |
| `--ink-light` | `#6B5648` | Muted text |

### Assets
- Logo: `brand_assests/Logo.png` (transparent bg, nav height 112px)
- Favicon: `brand_assests/favicon.png`; OG/social share image: `brand_assests/OGlogo.jpg` (1200×630)
- Social SVGs: `brand_assests/facebook.svg`, `instagram.svg`, `x.svg`
- **Note**: folder is `brand_assests` (intentional double-s typo — do not rename)

---

## Bilingual System

Most pages share an identical language toggle implementation (`newcomers-en.html`/`newcomers-es.html` are the exception — separate files with plain-language nav, not a runtime toggle):

- **Storage**: `localStorage` key `"lang2"` → `"en"` or `"es"`, default `"es"`
- **Static text**: `data-en` / `data-es` attributes on translatable nodes
- **HTML content**: add `data-html="true"` → uses `innerHTML` instead of `textContent`
- **Placeholders**: `data-placeholder-en` / `data-placeholder-es` on inputs
- **Dynamic content**: `var onLangChange = function(lang) { ... };` hook (must use `var`, must have trailing `;`)
- **Toggle UI**: `.nav-lang-toggle` button in both desktop nav and mobile drawer

### Critical pitfall
`onLangChange` must be declared as `var onLangChange = function(lang) { ... };` — never as a hoisted `function` declaration, and never without the trailing semicolon before an IIFE.

---

## Nav (all pages)

- Height: `120px`; logo zone: `240px` wide
- Links: About · Programs · Events · Board · Get Involved · Resources · News · Past Events · Newcomers · EN/ES toggle
- `index.html`: transparent → solid on scroll >40px
- All other pages: always solid, scroll shadow only
- Mobile: hamburger drawer slides in from top (`translateY(-110%)` → `translateY(0)`)
- Active link: `2px solid var(--terra)` bottom border

---

## Hard Rules

- No `transition-all` — only animate `transform`, `opacity`, `color`, `background-color`, `border-color`
- No default Tailwind blue/indigo as primary color
- Tailwind config `<script>` must come before the CDN `<script src>` tag
- Always serve on localhost — never screenshot `file:///`
- Always check `brand_assests/` before designing; use real assets, not placeholders
- Match reference designs exactly — do not improve or add sections
- Smart/curly quotes break JSON — use straight double quotes `"` in all JSON files
