# Casa de España en Indiana — Website Audit
**Audited:** casaespanaindiana.org (local repo state) · September 9, 2026
**Scope:** 16 top-level HTML pages, events.json, past-events.json, news-cache.json, sitemap.xml, robots.txt, .github/workflows, CLAUDE.md compliance
**Supersedes:** SITE_AUDIT.md (April 23, 2026) — that audit is ~90% resolved; see it for history, this file is the current source of truth.

---

## Prioritized To-Do List

### 🔴 CRITICAL

- [x] **Events content doesn't match events marketing copy.** `events.json` is 100% generic Indianapolis outings (ballgames, brewfests, Oktoberfest, Jazz Fest) — zero flamenco nights, language exchanges, or cultural workshops — despite `events.html`, `programs.html`, and `donate.html` all describing exactly that kind of programming. `past-events.json` shows no real in-person event since Feria de Abril, April 2025 (13+ month gap; the one entry since then, a virtual FAEUSA meeting, is itself 3+ months old). This is a mismatch between what the site promises and what it delivers.
  - **Resolution (2026-09-09):** per user decision, softened marketing copy in `events.html`, `programs.html`, `donate.html`, and `index.html` to stop promising specific unscheduled event types (flamenco nights, language exchanges, gastronomy nights) as current/recurring offerings. `programs.html`'s program list is now explicitly framed as historical ("Programming over the years has included…") rather than an active lineup. **Still open:** the underlying gap — no real Casa de España-organized event since April 2025 — is a programming issue, not a copy issue, and remains unresolved. Revisit with real event data when available.
- [x] **`join.html` signup form silently loses submissions on failure.** The `fetch()` POST to the Apps Script endpoint has no `.then()`/`.catch()` — the page redirects to the "Welcome!" success screen unconditionally, even on network failure, ad-blocker interference, or Apps Script outage.
  - **Resolution (2026-09-09):** fetch now chains `.then(goToWelcome)`/`.catch(...)` — only redirects on success; on failure, re-enables the submit button and shows a bilingual inline alert directing the user to email `info@casaespanaindiana.org` directly. Verified via automated Puppeteer test.
- [x] **`join.html` form validation is broken.** `novalidate` disables native HTML5 validation, but `required` attributes are left on the inputs (now inert). The JS replacement only validates first name + email — last name (marked required) can be submitted blank, and there's no email-format check at all.
  - **Resolution (2026-09-09):** JS validation now checks first name, last name, and a proper email-format regex; invalid fields get `.has-error` styling + `aria-invalid`, first invalid field is focused, and a bilingual inline alert explains the problem. Verified visually and via automated test (blank last name + malformed email correctly blocked submission).
- [x] **Page-title regression on language toggle.** Switching language on `index.html`/`news.html` rewrites `<title>` to a duplicated `"X | X"` pattern (e.g. `"Casa de España en Indiana | Casa de Espana en Indiana"`) — the exact spammy-title issue the April 2026 audit already fixed and checked off. It's back via `onLangChange`.
  - **Resolution (2026-09-09):** removed the duplicated `"| Casa de Espana en Indiana"` suffix from both `index.html` and `news.html`'s `onLangChange`. Confirmed no other page has the same pattern (grepped site-wide).

### 🟠 HIGH

- [ ] **Nav inconsistent site-wide.** `past-events.html`, `newcomers-en.html`, and `newcomers-es.html` are all missing the Newcomers/Guía link in their top nav (present in `past-events.html`'s own footer, so it's a slip not a deliberate removal).
- [ ] **9 dead footer social links** (`href="#"`) on `resources.html`, `join.html`, `news.html`. Every other page has the real URLs.
- [ ] **`resources.html`'s entire 25-link resource directory is untranslated.** Section headers switch to Spanish; individual link labels stay English even for Spanish-speaking users — the page's core audience.
- [ ] **Board bios are lopsided.** Only Maria Wildridge (President) has a bio; Marta, Cristina, and Karla have name + title only.
- [ ] **`past-events.html` photo lightbox has no focus trap and doesn't restore focus on close** — keyboard users can tab behind the visually-blocking overlay, and focus is lost on close.
- [ ] **Design-token drift:** `--ink-light` is defined as two different colors in `index.html` — Tailwind config `#7A6658` vs. CSS custom property `#6B5648`. `#7A6658` sits right at the WCAG AA contrast floor (4.52:1) and was already flagged/fixed once; it's dormant (unused) but will silently reintroduce the contrast issue if anyone reaches for the Tailwind utility class instead of the CSS var.

### 🟡 MEDIUM

- [ ] Heading hierarchy skips (h1→h4, h1→h3 with no h2) on `index.html`, `board.html`, `events.html`.
- [ ] Decorative icon `aria-label`s are English-only (not swapped on language toggle) on `index.html`; `programs.html`'s equivalent icons have no label or `aria-hidden` at all.
- [ ] Sitemap `lastmod` dates stale — 6 pages frozen at April 2026 despite August content changes.
- [ ] Inconsistent Spanish for "About Us" nav label ("Sobre Nosotros" vs. "Quiénes Somos" on `past-events.html`/`email-welcome.html`).
- [ ] `join.html` and `email-welcome.html` post-submit success headings ("¡Bienvenido!") are hardcoded Spanish regardless of the visitor's chosen language.
- [ ] `events.json` contains ~7 already-past entries not yet pruned (harmless — filtered client-side — but due for a cleanup pass).
- [ ] Accordion triggers on newcomers pages lack `aria-controls`/`aria-labelledby` pairing to their panels.
- [ ] `og:image` (`OGlogo.png`) is 498KB and not the standard 1200×630 OG ratio — will crop unpredictably on social shares.
- [ ] `resources.html` lists a Minneapolis USCIS field office with no Indianapolis-area equivalent nearby — reads as an uncustomized template leftover.

### 🟢 LOW / cleanup

- [ ] Stray empty directory `$(echo "C:` at project root — debris from a broken shell command, untracked, harmless, delete when convenient.
- [ ] `brand_assests/favicon-original-1254.png` (966KB, untracked, unused) — at risk of accidental commit via a future `git add -A`.
- [ ] Repo-root doc clutter: `CLAUDE_old.md`, `element.style.txt` (junk from an unrelated WordPress site), `SOCIAL-FEED-SETUP.md` (documents an integration never built), `PROJECT_BRIEF.md` + `infrastructure.md` (both stale — wrong page count, wrong localStorage key/default, wrong logo filename), `email-newsletter-website-launch.html` (one-off announcement, now historical). `SITE_AUDIT.md` itself is a good candidate to archive now that this file supersedes it.
- [ ] `PHOTOS-NEEDED.md` is current but untracked — commit it if it should persist.
- [ ] No custom `404.html` page exists.
- [ ] `newcomers.html`'s meta-refresh redirect is hardcoded to Spanish (dead weight — the JS redirect always wins first); safe to remove.

### 💡 Content opportunities (not bugs — worth discussing)

- [ ] Member testimonials (index or join page).
- [ ] FAQ, especially on the newcomers guide and join page.
- [ ] Recurring/monthly giving option on `donate.html` (currently only one-time PayPal).
- [ ] Per-event photo galleries once real event photos replace the `placehold.co` placeholders.
- [ ] Search/filter on the 25+ resource links as that list grows.
- [ ] A volunteer-roles page (currently just one checkbox on the join form).
- [ ] Sponsor/partner recognition (FAEUSA affiliation mentioned but not visually presented as a partnership).
- [ ] An accessibility statement — the site invests real effort in ARIA/focus states but doesn't say so anywhere.
- [ ] News feed curation — currently 100% algorithmic from El País and can surface political stories (e.g. Ceuta immigration coverage) that sit oddly under a family-facing cultural site's "News" tab.

---

## Passing / confirmed-good (from CLAUDE.md compliance check)

- No `transition-all` anywhere in the codebase.
- No default Tailwind `blue-*`/`indigo-*` used as primary color.
- No flat `shadow-md` — shadows consistently layered/tinted per design tokens.
- Hover/focus-visible/active states present and correctly scoped on buttons/links/cards.
- `events.json`/`past-events.json` use straight double quotes throughout (no curly-quote JSON breakage).
- Large JS functions spot-checked are all under the 30-line threshold.
- Board member list/titles are consistent between `board.html` and `index.html`.
- GitHub Actions workflows reference scripts and files that actually exist; no missing-file issues found locally.
