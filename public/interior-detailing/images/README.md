# Image Assets

This project ships without stock photography (avoids fake/misleading imagery). Real
photos live in the folders below using the filenames the HTML already references.

## /images/hero/
| File | Recommended size | Notes |
|---|---|---|
| `hero-bg.jpg` | 1920×1080 (16:9), < 250KB | In place — pulled from the live alhaddafcarwash.com hero carousel. This is the LCP image; re-compress if you swap it. |
| `og-cover.jpg` | 1200×630 | Still needed. Used for Open Graph / Twitter share previews (`index.html` `<meta property="og:image">`). |

## /images/gallery-images/
Three real before/after photos, one per service, already composited into a single
image each (a divider line baked into the photo, not a draggable slider):
- `interior-detailing.jpeg` — Interior Deep Clean & Sanitization
- `premium-car-wash.jpeg` — Premium Car Wash Finish
- `quick-car-wash.jpeg` — Quick Car Wash Shine

All three are 1536×1024 (3:2). The gallery section in `index.html` (`.gallery__grid`)
renders them as plain `<figure>` cards — no comparison-slider JS/CSS is involved
(that code was removed along with the old `images/gallery/` SVG placeholders).

## /images/logo/
Downloaded from the live site (`alhaddafcarwash.com`) — do not replace with placeholders.
- `logo.svg` — full brand lockup, 857×457 viewBox. Rendered at a fixed height with
  `width: auto`; inverted to white on dark backgrounds via `.brand__logo--invert`.
- `favicon.svg` / `favicon.ico` — official browser-tab mark.

## /images/services/
Optional supporting imagery per service card (not required — cards currently use inline icons).

## /images/testimonials/
Optional customer/vehicle photos if you want to add avatars beyond the initials badges currently used.

## /images/icons/
Reserved for any additional icon assets; all current icons are inline SVG in `index.html` (zero extra HTTP requests).

---
**Format tips for PageSpeed:** export JPG/WebP at 70–80% quality, serve WebP with a JPG
`<picture>` fallback if possible, and never exceed the recommended pixel dimensions above —
oversized images hurt LCP.
