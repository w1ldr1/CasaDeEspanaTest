# Site Planning Notes

## Decision: Abandon WordPress, Stay Static

**Date:** 2026-03-06

### Context
Casa de España en Indiana previously ran a WordPress site. A new static site has been
built (this repo) hosted on GitHub Pages. The decision was made to abandon WordPress
and fully replace it with the static site.

### Reasons for abandoning WordPress
- The static site already covers all current needs:
  - Events managed via `events.json` (easy to update)
  - News auto-refreshed via GitHub Actions + El País RSS feed
  - Membership/newsletter signup via `join.html` (mailto, no server needed)
- GitHub Pages hosting is free; WordPress requires paid hosting (~$10–20/month)
- WordPress carries ongoing maintenance burden: plugin updates, security patches, CMS login
- Slower page loads compared to static files
- WordPress is the #1 target for web attacks

### When to reconsider
If any of the following become requirements, revisit CMS options:
- Non-technical admins need to edit content without touching code
- Multi-author blog or editorial workflow
- E-commerce (member dues, event ticket sales)
- Site grows to many pages requiring structured content management

### Alternatives considered
| Option                  | Notes                                      | Cost         |
|-------------------------|--------------------------------------------|--------------|
| Stay static (chosen)    | Current needs fully met, zero overhead     | Free         |
| Decap CMS (Netlify CMS) | Browser admin UI over GitHub, stays static | Free         |
| Squarespace / Wix       | Fully managed, no code                     | ~$16/mo      |
| WordPress.com           | Managed WP                                 | ~$9–25/mo    |
| Self-hosted WordPress   | Full control, plugins                      | Hosting ~$10/mo |

### Migration checklist (WordPress → Static)
- [ ] Export any content from existing WP site worth preserving
- [ ] Redirect old WordPress URLs to new GitHub Pages domain (if domain is being transferred)
- [ ] Cancel WordPress hosting plan
- [ ] Point domain DNS to GitHub Pages
- [ ] Verify Google Search Console / analytics carry over
