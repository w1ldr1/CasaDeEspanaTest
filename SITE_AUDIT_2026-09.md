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

- [x] **Nav inconsistent site-wide.** `past-events.html`, `newcomers-en.html`, and `newcomers-es.html` are all missing the Newcomers/Guía link in their top nav (present in `past-events.html`'s own footer, so it's a slip not a deliberate removal).
  - **Resolution (2026-09-09):** added the Newcomers/Guía link to desktop nav + mobile drawer on all three pages; `newcomers-en.html`/`newcomers-es.html` now self-link with `.active` state.
- [x] **9 dead footer social links** (`href="#"`) on `resources.html`, `join.html`, `news.html`. Every other page has the real URLs.
  - **Resolution (2026-09-09):** replaced all 9 with the real Facebook/Instagram/X URLs, matching every other page.
- [x] **`resources.html`'s entire 25-link resource directory is untranslated.** Section headers switch to Spanish; individual link labels stay English even for Spanish-speaking users — the page's core audience.
  - **Resolution (2026-09-09):** wrapped each of the 25 link labels in a `data-en`/`data-es` span; verified both directions render correctly via automated test (including one entry with embedded quotes that needed HTML-entity escaping).
- [ ] **Board bios are lopsided.** Only Maria Wildridge (President) has a bio; Marta, Cristina, and Karla have name + title only.
  - **Status:** deferred per user (2026-09-09) — needs real biographical input from the board members themselves, can't be fabricated. Revisit when available.
- [x] **`past-events.html` photo lightbox has no focus trap and doesn't restore focus on close** — keyboard users can tab behind the visually-blocking overlay, and focus is lost on close.
  - **Resolution (2026-09-09):** added a Tab-key focus trap cycling through the lightbox's buttons, and focus now returns to the trigger element on close. Along the way, found and fixed a real bug: nested elements (`.photo-badge`/`.btn-gallery` inside `.event-card`) both carried `data-event-id` and both had click listeners, so a single click bubbled and fired `openLightbox` twice, corrupting the trigger reference — fixed with `stopPropagation()` and explicit trigger-element passing. Verified via automated Puppeteer test (open → Shift+Tab wrap → Tab wrap → Escape → focus restored to trigger).
- [x] **Design-token drift:** `--ink-light` is defined as two different colors in `index.html` — Tailwind config `#7A6658` vs. CSS custom property `#6B5648`. `#7A6658` sits right at the WCAG AA contrast floor (4.52:1) and was already flagged/fixed once; it's dormant (unused) but will silently reintroduce the contrast issue if anyone reaches for the Tailwind utility class instead of the CSS var.
  - **Resolution (2026-09-09):** the drift turned out to be site-wide, not just `index.html` — 10 of 13 pages had the stale `#7A6658` in their Tailwind config while already using `#6B5648` in their CSS var. Normalized all pages to `#6B5648`.

### 🟡 MEDIUM

- [x] Heading hierarchy skips (h1→h4, h1→h3 with no h2) on `index.html`, `board.html`, `events.html`.
  - **Resolution (2026-09-09):** `index.html`'s "What We Do" changed h4→h3; `board.html`'s 4 board-name headings and `events.html`'s dynamic event-title heading changed h3→h2 (both pages have no other subheading level, so h2 directly under h1 is correct).
- [x] Decorative icon `aria-label`s are English-only (not swapped on language toggle) on `index.html`; `programs.html`'s equivalent icons have no label or `aria-hidden` at all.
  - **Resolution (2026-09-09):** `index.html`'s 3 program-card icon `aria-label`s now swap bilingually via `onLangChange`; `programs.html`'s 3 equivalent icons (purely decorative, redundant with adjacent heading text) now carry `aria-hidden="true"`.
- [x] Sitemap `lastmod` dates stale — 6 pages frozen at April 2026 despite August content changes.
  - **Resolution (2026-09-09):** updated all 12 sitemap entries to 2026-09-09, reflecting today's real edits across every listed page.
- [x] Inconsistent Spanish for "About Us" nav label ("Sobre Nosotros" vs. "Quiénes Somos" on `past-events.html`/`email-welcome.html`).
  - **Resolution (2026-09-09):** normalized both to "Sobre Nosotros" matching the other 9 pages. (Note: `index.html`'s "Who We Are" → "Quiénes Somos" is a different string for a different section and was left as-is — that translation is correct there.)
- [x] `join.html` and `email-welcome.html` post-submit success headings ("¡Bienvenido!") are hardcoded Spanish regardless of the visitor's chosen language.
  - **Resolution (2026-09-09):** both now carry `data-en`/`data-es` (email-welcome.html's uses `data-html="true"` to preserve the `<em>` wrapper).
- [x] `events.json` contains ~7 already-past entries not yet pruned (harmless — filtered client-side — but due for a cleanup pass).
  - **Resolution (2026-09-09):** removed exactly 7 entries whose end date had passed as of 2026-09-09 (21 → 14 events); validated JSON stays well-formed.
- [x] Accordion triggers on newcomers pages lack `aria-controls`/`aria-labelledby` pairing to their panels.
  - **Resolution (2026-09-09):** paired all 15 trigger/panel sets on both `newcomers-en.html` and `newcomers-es.html` (30 total) with unique ids + `aria-controls`/`aria-labelledby`; verified no duplicate ids and toggle JS (class-based, unaffected) still works.
- [x] `og:image` (`OGlogo.png`) is 498KB and not the standard 1200×630 OG ratio — will crop unpredictably on social shares.
  - **Resolution (2026-09-09):** re-cropped to the standard 1200×630 ratio and re-encoded as JPEG — `OGlogo.jpg`, 76KB (down from 498KB). Updated all 12 pages' `og:image`/`twitter:image` references; old PNG removed.
- [x] `resources.html` lists a Minneapolis USCIS field office with no Indianapolis-area equivalent nearby — reads as an uncustomized template leftover.
  - **Resolution (2026-09-09):** replaced with the real Indianapolis USCIS Application Support Center (`uscis.gov/about-us/IN/Indianapolis`, 1099 N Meridian St) — verified live via web search/fetch before publishing, not guessed.

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
