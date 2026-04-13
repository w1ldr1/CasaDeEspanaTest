# How to Update the Past Events Page

## The only file you need to edit: `past-events.json`

Add a new object to the **top** of the `events` array (newest first). Example:

```json
{
  "id": "feria-2026",
  "date": "2026-04-05",
  "dateEnd": "2026-04-06",
  "year": 2026,
  "type": "Cultural Celebration",
  "title": "Feria de Abril 2026",
  "location": "Athenaeum Foundation · Indianapolis",
  "description": "A short paragraph recap of the event.",
  "photos": [
    "photos/feria-2026/cover.jpg",
    "photos/feria-2026/photo-2.jpg"
  ],
  "highlight": true
}
```

### Field reference

| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | Unique slug, no spaces (e.g. `feria-2026`) |
| `date` | Yes | Format: `YYYY-MM-DD` |
| `dateEnd` | No | Only for multi-day events |
| `year` | Yes | Used for the year filter tabs |
| `type` | Yes | Shown as the red badge (e.g. `Cultural Celebration`, `Lecture Series`, `Performance`, `Holiday Gathering`, `Congreso`) |
| `title` | Yes | Event name |
| `location` | Yes | Venue · City format |
| `description` | Yes | 1–3 sentence recap paragraph |
| `photos` | Yes | Array of image paths — **first photo is the cover** |
| `highlight` | No | `true` = card spans 2 columns; use for major events |

---

## Where to store photos

Create a folder inside `photos/` named after the event id:

```
CasaDe/
  photos/
    feria-2026/
      cover.jpg
      photo-2.jpg
      photo-3.jpg
    navidad-2025/
      cover.jpg
      ...
```

Then reference in `past-events.json` as:
```json
"photos": [
  "photos/feria-2026/cover.jpg",
  "photos/feria-2026/photo-2.jpg"
]
```

---

## Photo guidelines

- **First photo** = cover image shown on the card. Use your best/widest shot.
- **Format**: JPG for photos
- **Size**: Resize to ~1200×800px before uploading (keeps the site fast)
- **File size**: Aim for under 500KB per image
- **Highlight card covers**: Use a wide/landscape crop — these display at a 16:7 aspect ratio
- **Minimum**: 1 photo is fine; the lightbox only appears when there are 2 or more

---

## After editing

Commit and push:
```bash
git add past-events.json photos/
git commit -m "Add [event name] to past events"
git push
git push prod main
```
