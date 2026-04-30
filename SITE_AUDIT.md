# Casa de España en Indiana — Website Audit
**Audited:** casaespanaindiana.org · April 23, 2026

---

## 1. First Impressions & User Experience (UX)

**What works well:**
- The organization's purpose — preserving Spanish culture in Indiana — is clearly stated above the fold. The tagline "Connecting Spain to Indiana" is immediate and legible.
- The section hierarchy (Mission → Programs → Events → CTA → Board → Footer) follows a logical editorial flow.
- The bilingual EN/ES toggle is a genuine differentiator and works correctly.
- The navigation is complete and covers all pages.

**What needs improvement:**

**All program card images are stock placeholders.** The three program section cards (Cultural Events, Resources, Community Support) still use `placehold.co` images. To a visitor, the site reads as unfinished — which undermines trust for a 20-year-old organization.

**All four board member photos are placeholders.** This is a significant credibility gap. A visitor who is considering joining or donating wants to see real people. Three of the four board bios (Jorge Ruiz, Carmen García, Andrés Fernández) also read as placeholder/fictional content — generic "born in Madrid/Valencia/Seville" bios with no real identifying details, LinkedIn, or verifiable affiliations.

**The events section is thin and contains off-brand entries.** As of today (April 23), the Feria de Abril event (April 5) has already passed and may no longer appear as "upcoming," leaving only 3 events visible. More critically, two of those events — the Indianapolis 500 and the Indiana State Fair — are general Indianapolis events, not Casa de España programming. A first-time visitor may be confused about what the organization actually runs vs. just attends. Both also use real URLs but have no Casa de España context.

**Two Casa de España events have broken/placeholder URLs.** The Feria de Abril and the Cervantes lecture both link to `#` — meaning visitors clicking "Learn More" or "Register" go nowhere.

**No favicon.** The browser tab shows a generic blank icon, which hurts professionalism and brand recall.

**No contact page.** The email `info@casaespanaindiana.org` appears in the footer, but there is no dedicated Contact page or contact form — a frequent expectation for nonprofits.

---

## 2. Content & Messaging

**What works well:**
- The mission copy is well-written and emotionally resonant. The charter quote is a strong anchor.
- Maria Wildridge's bio is detailed, specific, and credible (real awards, real role).
- The Resources page is substantive with ~30 links across three categories — a genuine utility for the community.
- The past events JSON shows 8 real events with real descriptions, confirming the organization is active.

**What needs improvement:**

**Page title is redundant and slightly spammy.** Every page uses the pattern `[Page Name] — Casa de España en Indiana | Casa de Espana en Indiana`. The second instance (without the ñ) repeats the org name unnecessarily. A better pattern: `Feria de Abril — Casa de España en Indiana` or `Events | Casa de España en Indiana`.

**The Past Events page has no real photos.** All 8 past event entries use `placehold.co` images. If the organization ran a Feria de Abril with 200 attendees and a FAEUSA national congress, there are almost certainly real photos somewhere. This page exists in the architecture but delivers no visual memory of the community — its entire purpose is unfulfilled.

**Indiana State Fair and Indy 500 should be framed as community outings, not organizational events.** If the org attends these, they should be labeled "Join Us At…" or moved to a separate "Community Picks" section — not listed as equals to Flamenco nights and literary lectures.

**No "About" or "History" standalone page.** The homepage has a short Who We Are paragraph but no deeper story — founding year (2004), key milestones, number of members, etc. Donors and journalists typically look for this.

**No privacy policy or terms page.** The site collects email addresses via the join form and links to PayPal for donations. A privacy policy is legally expected and builds trust. Under CAN-SPAM, GDPR (if serving visitors from Spain/EU), and general best practice, this is a gap.

**The join form has a confusing dual-submit UX.** There is both a mailto action and a form POST to a Google Apps Script. A toast message reading "Your email client has opened with a pre-filled message" appears — this is a vestige of an old flow and should be removed if the form now submits via Apps Script.

**No donation impact statement.** The PayPal donation CTA has no context: "what does $25 fund?" Even one line ("$50 sponsors a student's cultural event ticket") dramatically increases conversion.

---

## 3. SEO & Discoverability

This is the most uniformly deficient category across the entire site.

| Element | Status |
|---|---|
| Meta description | **Missing on all 6 pages** |
| Open Graph tags (og:title, og:description, og:image) | **Missing on all pages** |
| Twitter Card tags | **Missing on all pages** |
| Canonical URL tag | **Missing on all pages** |
| JSON-LD structured data (Organization, Event) | **Missing entirely** |
| Sitemap `<lastmod>` dates | **Missing** |
| Favicon | **Missing** |
| `lang` attribute on `<html>` | **Reported missing** (may be set dynamically via JS — verify) |
| Viewport meta tag | **Reported missing** (verify — critical for mobile indexing) |

**Impact:** When someone shares any page on Slack, LinkedIn, Facebook, or iMessage, it will render as a bare URL with no preview image, no title, and no description. When Google crawls the site, every page gets a self-generated snippet from body text — often inaccurate and unappealing. For a nonprofit trying to grow membership and donations, this is a significant discoverability loss.

**Quick wins:**
- Add unique meta descriptions (~155 chars) to all 6 pages
- Add `og:title`, `og:description`, `og:image` to all pages — use the logo or a event photo as the og:image
- Add `Organization` JSON-LD schema to the homepage with name, url, logo, description, foundingDate, address, sameAs (social URLs)
- Add `Event` JSON-LD entries for upcoming events (Google surfaces these in search results)
- Fix or confirm the `<html lang="...">` attribute

---

## 4. Accessibility & Mobile Optimization

**Images have no alt text.** The audit confirmed that images — including program card photos, board member photos, and logo instances — lack meaningful alt attributes. This fails WCAG 2.1 Level A (1.1.1 Non-text Content) and excludes screen reader users entirely. The logo should have `alt="Casa de España en Indiana"`, board photos `alt="[Name], [Title]"`, etc.

**Social icon images have no alt text.** The footer social icons (facebook.svg, instagram.svg, x.svg) rendered as `<img>` tags have no alt text — screen readers will read the filename.

**The viewport meta tag may be missing.** If confirmed absent, this is a critical mobile failure — the page will render at desktop width on phones, which Google's mobile-first indexing penalizes directly.

**Color contrast should be verified.** The brand's parchment backgrounds (#FAF4ED) and ink-light text (#7A6658) at smaller sizes may fall below WCAG AA's 4.5:1 ratio for normal text. This needs a pass with a contrast checker tool.

**No `aria-label` on icon-only buttons** (hamburger, social links) unless confirmed in source. These need descriptive labels for assistive tech.

**Mobile structure is otherwise sound** — Tailwind CSS with mobile-first responsive classes, a proper hamburger drawer, and stacked column layouts are all in place.

---

## 5. Technical & Trust Factors

**Two event URLs are broken (#).** Feria de Abril and the Cervantes lecture both have `"url": "#"` in events.json. Any "Details" or "Register" link on the events section goes nowhere.

**No privacy policy page.** Collecting email and names without one is a compliance gap (CAN-SPAM, and potentially GDPR for users accessing from Spain/EU).

**No 404 error page.** Navigating to a non-existent URL likely shows a default server error, not a branded recovery page.

**`email-welcome.html` is correctly noindexed** — good.

**Past Events page reveals placeholder infrastructure.** Visiting the page shows correct headings and structure but renders no photos (all placehold.co). For a returning member, this is a broken experience.

**PayPal donation link appears functional** — the real PayPal URL is live. Good.

**Facebook, Instagram, and X social links are all present and well-formed** — these appear live.

**HTTPS is active** — the site serves correctly over HTTPS. Good.

**Google Apps Script form endpoint is live** — the join form backend is connected.

**Sitemap and robots.txt are both present** — good baseline.

---

## Prioritized To-Do List

### HIGH PRIORITY — Critical fixes

- [X] **Add meta descriptions to all 6 pages.** Write unique ~155-character descriptions for index, resources, news, join, past-events, email-welcome. This is the single highest-ROI SEO action available.
- [X] **Add Open Graph tags to all pages** (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`). Use the logo as a fallback image. This fixes all social sharing previews immediately.
- [X] **Fix broken event URLs.** Update `events.json`: replace `"url": "#"` with real registration/info links for the Feria de Abril and the Cervantes lecture, or remove the URL field so no broken link is rendered.
- [X] **Remove or re-label the Indy 500 and Indiana State Fair from the events feed.** These aren't Casa de España events. Either remove them or add a separate "Community Outings" section with explicit framing ("Join us at…").
- [X] **Add alt text to all images.** Logo: `"Casa de España en Indiana"`. Board members: `"[Full Name], [Title]"`. Program cards: descriptive caption. Social icons: `"Facebook"`, `"Instagram"`, `"X (Twitter)"`.
- [X] **Verify and fix the viewport meta tag.** Confirm `<meta name="viewport" content="width=device-width, initial-scale=1">` is in the `<head>` of every page. If missing, add it immediately — mobile indexing depends on it.
- [X] **Verify/fix the `<html lang>` attribute.** The JS toggle sets `document.documentElement.lang` dynamically, but the static HTML default should be set to `lang="es"` or `lang="en"` so it's present before JS runs.
- [X] **Replace placeholder board member bios and photos.** Jorge Ruiz, Carmen García, and Andrés Fernández read as fictional. Either populate with real board members (even just name + title) or remove the placeholder people entirely. A board of one real person is more trustworthy than three fake ones.
- [X] **Add a favicon.** Create a 32×32 and 180×180 PNG from the logo and link it in `<head>`. This takes 15 minutes and has immediate brand presence impact.
- [X] **Write and publish a Privacy Policy page.** One-page policy covering: what data you collect (name, email), how it's used (newsletter, membership), that you don't sell data, and a contact email for data requests. Link it in the footer.

### MEDIUM PRIORITY — UX improvements & SEO

- [ ] **Add real photos to past-events.html.** Even 2–3 real photos per event transforms this page from a template into a community archive. Photos from Feria de Abril, FAEUSA congress, and Noches de Flamenco would make the biggest impact.
- [ ] **Add real program card images to the homepage.** Replace the three `placehold.co` cards in the Programs section with actual event photography. If no photo exists yet, use a high-quality free photo from Unsplash (flamenco, architecture, books) as a temporary bridge.
- [X] **Add JSON-LD structured data.** At minimum: `Organization` schema on the homepage (name, url, logo, address, foundingDate, sameAs). Add `Event` schema for each upcoming event. Google displays Event rich results directly in search — high visibility for zero cost.
- [X] **Fix the page title pattern.** Change `Casa de España en Indiana | Casa de Espana en Indiana` to just `Casa de España en Indiana` as the site name. The duplicate without ñ looks like keyword stuffing. If you need SEO for "Casa de Espana," handle it in the meta keywords or description instead.
- [X] **Add canonical `<link rel="canonical">` tags** to all pages to prevent duplicate content issues (especially relevant if the site is ever accessible at both `www.` and non-www URLs).
- [X] **Add donation impact language to the CTA section.** One line beneath the PayPal button: "Your gift directly funds events, scholarships, and community programs." Include a specific dollar example if possible.
- [X] **Add `lastmod` dates to sitemap.xml.** Helps Google prioritize recrawling recently updated pages (especially news.html which updates daily).
- [X]**Create a dedicated Contact page** (or at minimum add a contact section to join.html). Include: email, phone (if public), mailing address if available, and a simple contact form for general inquiries.
- [X]**Remove the "Your email client has opened…" toast/text from the join form.** This is dead code from a previous mailto implementation and confuses users after the Apps Script form is submitted.
- [X]**Clarify the join form's two membership tiers.** "Newsletter" vs. "Full Member" — what does Full Membership cost? What are the benefits? Adding one sentence per tier increases conversion.
- [X]**Add `aria-label` to the hamburger button and all icon-only interactive elements.**
- [X]**Audit ink-light text color (#7A6658) against parchment backgrounds** using a WCAG contrast checker. Upgrade to `#6B5648` or darker if below 4.5:1 for body-size text.

### LOW PRIORITY — Nice-to-have & future content

- [ ] **Create a real About/History page.** The 20-year history deserves more than a paragraph. Timeline of milestones (founding, first Feria de Abril, FAEUSA congress hosting, etc.), member count, geographic reach. This helps with press inquiries and grant applications.
- [ ] **Add a custom 404 page** (`404.html`) that matches the site design and links back to homepage and key pages.
- [ ] **Add Twitter/X Card meta tags** in addition to OG tags for better X.com link previews.
- [ ] **Add event registration/RSVP functionality.** Even a simple Eventbrite embed or "Email us to RSVP" CTA per event would make the events section actionable.
- [ ] **Add Google Analytics or Plausible Analytics.** Right now there is no way to know how many people visit, which pages they view, or where they come from. For a grant-seeking nonprofit, audience data is useful.
- [ ] **Add a newsletter archive or recent emails section** so prospective members can see what they'd receive before signing up.
- [ ] **Add a "Donate In Kind / Volunteer" option** to the Get Involved section — many supporters prefer non-monetary contributions.
- [ ] **Consider adding Spanish-language `hreflang` tags** for the bilingual content. If the site gains Spanish-speaking visitors from Google, `hreflang="es"` annotations will improve targeting.
- [ ] **Explore replacing the CORS news proxy** (`api.allorigins.win`) with a self-hosted or more reliable solution. Third-party CORS proxies have availability and rate-limit risks for a live production page.
