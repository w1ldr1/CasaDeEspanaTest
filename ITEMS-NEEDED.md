# Items Needed From You

A single checklist of everything the site is currently blocked on — photos, bios, real content, and a few decisions only you can make. Organized by category; each item says exactly where it plugs in and what format to hand it off in. Supersedes `PHOTOS-NEEDED.md` (merged in below, and corrected against the site's current state as of 2026-09-09).

---

## 📸 Photos

### High priority — past events (`past-events.json`)

Every past event still ships with `placehold.co` placeholder images instead of real photos. That's 8 of 8 entries — this is the single biggest visible "unfinished" signal on the site, since `past-events.html` exists specifically to be a community photo archive.

| Event | Date | Photos needed | Notes |
|---|---|---|---|
| **FAEUSA National Member Gathering** | 2026-05-30 | 2–3 | Currently **zero** photos (empty array) — the only one with none at all. It's a highlighted (2-column) card. You likely have stills from this — the homepage's embedded video ("Charla FAEUSA 30 mayo 2026...") is a recording from this same event; check if screenshots/stills exist alongside the footage. |
| **Feria de Abril 2025** | 2025-04-06 | 3–4 | Highlighted card. Flamenco performance, tapas reception, community gathering shots would match the existing placeholder labels. |
| **Cervantes & the Birth of the Modern Novel** (lecture) | 2025-02-14 | 2–3 | Lecture hall, panel discussion, book signing. |
| **Nochebuena — Holiday Celebration** | 2024-12-07 | 3–5 | Highlighted card. Holiday feast, Las Posadas performance, Roscón de Reyes. |
| **FAEUSA Congreso** (hosted by Casa de España) | 2024-10-18 to 10-20 | 2–3 | Highlighted card. Opening ceremony, delegate networking. |
| **Día de la Hispanidad** | 2024-10-12 | 2–3 | Ceremony, cultural exhibition. |
| **Noches de Flamenco — Summer Series** | 2024-06-15 | 3–4 | Highlighted card. Performance shots (dancer, guitarist, singer). |
| **Feria de Abril 2024** | 2024-04-07 | 2–3 | Horse procession, caseta dancing, artisan market. |
| **Cabalgata de Reyes** | 2024-01-06 | 1–2 | Parade shots. |

**How to add them:** see `HOW-TO-UPDATE-PAST-EVENTS.md`. Short version — drop files in `photos/<event-id>/` (e.g. `photos/feria-2025/cover.jpg`), then update the `photos` array in `past-events.json` to point at them. First photo in the array is the card's cover image. JPG, ~1200×800px, under 500KB each.

**Minimum viable version:** even 1 real photo per event (replacing all the placeholders in that entry) would eliminate the placeholder look. You don't need the full 2–5 per event listed above — that's just matching how many placeholder slots currently exist.

### Medium priority

**Hero background** — `index.html`. Currently a custom geometric (azulejo-tile) pattern since no photo exists; not broken, but a wide, high-resolution photo (a cultural event, a crowd shot — something that reads well dimmed under the dark overlay text) would be a meaningful upgrade. Needs to be as wide/high-res as possible (1920px+ recommended, full-bleed).

### Optional / no longer urgent

**Programs section card art** (`index.html`, `programs.html` — Cultural Events, Community Support, Resources cards) — these used to be photo-placeholder slots, but as of the Sept 8 commits they now use custom-drawn SVG line-art icons (skyline, books, people outlines), which look intentional and finished. Real photos would still be a nice upgrade if you have great shots, but this is no longer a "looks unfinished" gap — treat as optional, not needed.

### Recurring, not one-time

**Email newsletter template photos** — `email-newsletter.html`. Every time you send an issue, it ships with placeholder images (a hero event photo + 3 small news thumbnails) that need manual swapping in before sending. This is expected per-issue work, not a backlog item — just a reminder it's not automatic.

### Explicitly skipped

**Board member headshots** — already decided against; the custom initials avatars on `board.html`/`index.html` stay as-is unless that changes.

---

## 👤 Board of Directors bios (`board.html`, `index.html`)

Maria Wildridge (President) has a full bio. Three board members currently have name + title only:

- **Marta Piñeiro Núñez** — Vice President / Vicepresidenta
- **Cristina Tajadura** — Treasurer / Tesorera
- **Karla De Juan Romero** — Secretary / Secretario

**What's needed:** 1–3 sentences per person — background, role, why they're involved with Casa de España — in the same style as Maria's bio (see `board.html`). Send in English or Spanish, whichever's easier; I'll translate to match the site's bilingual format either way. Send them whenever and I'll add them.

---

## 💬 Member testimonials (`index.html` or `join.html`)

2–3 short quotes from real members — why they joined, what the community means to them. Needs:
- The quote itself (1–3 sentences)
- Name (and title/role if relevant, e.g. "member since 2019")
- Confirmation they're OK being quoted by name (and with a photo, if you want to include one)

---

## 🙋 Volunteer roles (for a future volunteer-detail page)

`join.html` currently has a single "Volunteering" checkbox with no detail on what volunteering actually looks like. If you want a dedicated volunteer-roles page, I need the actual list of roles that exist — e.g. event setup/teardown, translation help, board committee work, newsletter writing, photography at events, etc. Just a plain list is fine; I'll write the page copy.

---

## 🤝 Sponsor / partner recognition (FAEUSA)

FAEUSA affiliation is mentioned in text (Congreso hosting, national gatherings) but not presented as a visual partnership anywhere. Needed:
- FAEUSA's official logo/wordmark (vector or high-res PNG)
- Confirmation they're OK being featured as a partner/affiliate on the site

---

## 💳 Recurring / monthly giving (`donate.html`)

Currently one-time PayPal only. To add a monthly-giving option, you'd need to create a subscription/recurring-donation button in your PayPal business dashboard first (this isn't something I can set up on your behalf — it requires your PayPal account access). Once you have the resulting PayPal link, send it over and I can wire it into the donate page in minutes.

---

## 🎉 Real event data (`events.json`)

This is the biggest open item. The live events calendar is currently 100% generic Indianapolis community outings (ballgames, brewfests, festivals) — zero Casa de España-organized cultural programming (flamenco nights, language exchanges, workshops), even though `events.html`, `programs.html`, and `donate.html` all reference that kind of programming (the marketing copy was already softened on 2026-09-09 to stop overpromising specific event types that aren't scheduled — see `SITE_AUDIT_2026-09.md`).

**What's needed:** actual upcoming Casa de España-organized events — date, time, title, location, and a short description — whenever you have real programming scheduled. I'll add them to `events.json` and the marketing copy can go back to naming specific event types once there's real programming to back it up.

---

## 📰 News feed curation (decision, not content)

Not something you need to hand off — just a call to make. `news.html` currently pulls raw El País headlines 100% algorithmically, with no topic filtering, and can surface political stories (e.g. immigration-related coverage) that sit oddly under a "News" tab on a family-facing cultural site. Worth deciding: keep it fully automated as-is, add keyword filtering to steer away from certain topics, or move to a manually curated feed? Let me know which direction and I can implement it.

---

*Whenever you have any of the above — even partially — just hand it off and I'll wire it in. Nothing here is blocking; the site works fine without it, this is just the list of what would make it better.*
