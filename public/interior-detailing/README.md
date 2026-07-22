# Al Haddaf Car Detailing — Landing Page

A premium, high-converting landing page built for Google Ads traffic, promoting
Al Haddaf's mobile car detailing service in Dubai. Pure HTML5 / CSS3 / vanilla
JavaScript — no frameworks, no build step.

Design language: the live brand palette pulled from `alhaddafcarwash.com` —
deep blue `#1a5490`, logo blue `#2388c7`, orange accent `#ff6b00` on light
neutral surfaces (`#f8f9fa` / `#eaf1f8`), with deep-navy `#0e2c4d` bands for
the hero, gallery, final CTA and footer. Playfair Display serif headings
paired with Inter body text. Logo and favicon are the official assets
downloaded from the main site.

## Stack

- **HTML5** — semantic, accessible markup with a JSON-LD `AutoWash` schema block
- **CSS3** — custom properties (design tokens), BEM naming, mobile-first responsive rules
- **Vanilla JavaScript** — no dependencies, defers to `DOMContentLoaded`

No React, no Tailwind/Bootstrap, no jQuery, no bundler. Open `index.html` directly
or serve the folder with any static file server.

## Project Structure

```
/
├── index.html          Page markup, SEO meta, JSON-LD schema
├── style.css            All styling (CSS variables, BEM, responsive)
├── script.js            Header scroll state, reviews carousel, FAQ accordion,
│                         scroll-reveal, floating-button visibility,
│                         hero quote form → Web3Forms
├── images/
│   ├── README.md         Exact filenames + dimensions the HTML expects
│   ├── hero/              Hero background (pulled from the live site), OG share image
│   ├── gallery-images/    Real before/after photos, one per service
│   ├── logo/              Official logo.svg / favicon.svg / favicon.ico from the main site
│   ├── services/          Optional service imagery
│   ├── testimonials/      Optional customer avatars
│   └── icons/             Reserved (all current icons are inline SVG)
└── README.md            This file
```

## Sections Implemented

1. Sticky header — logo plus two CTAs (Call, "Get Free Quote" — opens WhatsApp
   directly). **No navigation menu anywhere**: no header nav, no mobile burger,
   no footer link list. It is a single uninterrupted scroll, which is what you
   want for paid traffic — every click is a conversion action, not a way off
   the page.
2. Hero — two columns: eyebrow, headline, description, **Call and WhatsApp
   buttons** and three trust chips (4.9/5 rating, 10,000+ cars detailed,
   insured & warrantied) on the left; the free-quote lead form (Name, Phone,
   Email, Service) on the right. Stacks to one column below 980px. Background
   image pulled from the live `alhaddafcarwash.com` hero carousel.
3. Stats bar — cars detailed, average rating, quote response time, satisfaction
4. Why Choose Us — 4 reasons: premium products, technicians, warranty, doorstep service
5. Services — Interior Detailing (featured), Premium Car Wash, Quick Car Wash
6. Process — 4-step "how it works" (Request Quote → Choose Date → Team Arrives → Fresh Finish)
7. Before/After gallery — three real before/after photos (one per service),
   each already composited into a single image (no drag/slider interaction).
8. Customer reviews — a scroll-snap carousel (6 cards: 3-up on desktop, 2-up on
   tablet, 1-up on phone) with prev/next buttons, dot indicators, keyboard arrow
   support and native touch swipe. Page count recalculates on resize.
9. FAQ — single accessible accordion card (one open at a time)
10. Final CTA banner
11. Footer — everything centre-aligned: logo, phone, email, copyright

### Two conversion paths

**Talk now → WhatsApp.** Every "Book" button (the three service cards and the
final CTA banner), the header's "Get Free Quote" button, the hero's WhatsApp
button and the floating WhatsApp bubble all open WhatsApp directly in a new
tab, several with a message pre-filled naming the service. No form, no friction.

**Send details → the hero form.** The hero's quote form (Name, Phone, Email,
Service) is submitted via `fetch()` to [Web3Forms](https://web3forms.com) —
see `initLeadForm()` in `script.js`. It validates client-side, POSTs as
`FormData` with `Accept: application/json`, and shows a success/error toast
without navigating away. Requires a real `access_key` on the form's hidden
input in `index.html` (see "Before You Launch").

Plus: scroll-reveal animations (`IntersectionObserver`) and a toast for form
feedback. The floating Call + WhatsApp buttons only appear outside the hero —
the hero has its own Call/WhatsApp buttons and quote form, so the floating
stack would be redundant there (and on narrow phones would sit on top of the
form controls).

## Before You Launch

1. **Set the real Web3Forms access key.** The hero form's hidden `access_key`
   input in `index.html` currently holds a placeholder
   (`YOUR_WEB3FORMS_ACCESS_KEY`). Sign up at web3forms.com, grab your key, and
   replace it — otherwise submissions will fail.
2. **Replace the customer reviews.** All six testimonials in the carousel are
   written samples, not real customer feedback — as are the `aggregateRating`
   figures in the JSON-LD block. Swap in verified reviews (or remove the section
   and the schema block) before running ads to this page.
3. **Add the OG share cover.** `images/hero/og-cover.jpg` (1200×630) is still
   missing; the hero background itself is already in place. See
   `images/README.md`.
4. **Verify phone/WhatsApp numbers** throughout `index.html` (`tel:` links,
   `wa.me` links) match the live business line: currently `+971 55 550 3288`.
5. **Set the canonical/OG URLs** if this deploys to a different domain or path.
6. **Run Lighthouse/PageSpeed Insights** — image weight is the biggest lever
   left for LCP; keep the hero image under ~250KB.

## Google Ads / Quality Score Notes

- Single scroll-anchored page, no off-page navigation — keeps ad-to-page relevance high
- Fast by default: no external JS frameworks, one Google Fonts request, inline SVG icons
- `loading="lazy"` on all below-the-fold images; hero image uses `fetchpriority="high"`
- Explicit `width`/`height` on all `<img>` tags to prevent layout shift (CLS)
- Semantic heading hierarchy (`h1` → `h2` → `h3`), landmark regions, `aria-*` labels
  on icon-only buttons/links, keyboard-operable carousel and accordion
- Click-to-call (`tel:`) and click-to-WhatsApp (`wa.me`) links throughout for
  one-tap conversions on mobile traffic

## Customization

All colors, spacing, radii, shadows and font stacks are defined as CSS custom
properties at the top of `style.css` (`:root`) — change the palette, spacing scale,
or typography globally from one place.
