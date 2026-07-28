# Al Haddaf Car Wash — Quick & Premium Car Wash Landing Page

A premium, high-converting landing page built for Google Ads traffic, promoting
Al Haddaf's Quick Car Wash and Premium Car Wash services in Dubai. Pure HTML5 /
CSS3 / vanilla JavaScript — no frameworks, no build step. Same stack and design
system as the `/interior-detailing` landing page, scoped to these two services.

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
├── style.css            All styling (CSS variables, BEM, responsive) — same file as
│                         /interior-detailing/style.css plus a `--duo` grid modifier
│                         for the two-card services/gallery layout on this page
├── script.js            Header scroll state, reviews carousel, FAQ accordion,
│                         scroll-reveal, floating-button visibility,
│                         hero quote form → Web3Forms
├── images/
│   ├── README.md         Exact filenames + dimensions the HTML expects
│   ├── hero/              Hero background (reused from the main site)
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
   no footer link list. Single uninterrupted scroll for paid traffic.
2. Hero — two columns: eyebrow, headline, description, **Call and WhatsApp
   buttons** and three trust chips (4.9/5 rating, 10,000+ cars washed,
   insured & warrantied) on the left; the free-quote lead form (Name, Phone,
   Email, Service — Quick or Premium) on the right. Stacks to one column below 980px.
3. Stats bar — cars washed, average rating, quote response time, satisfaction
4. Why Choose Us — 4 reasons: premium products, technicians, warranty, doorstep service
5. Services — Premium Car Wash (featured) and Quick Car Wash, side by side
6. Process — 4-step "how it works" (Request Quote → Choose Date → Team Arrives → Fresh Finish)
7. Before/After gallery — two real before/after photos (one per service),
   each already composited into a single image (no drag/slider interaction).
8. Customer reviews — a scroll-snap carousel (6 cards: 3-up on desktop, 2-up on
   tablet, 1-up on phone) with prev/next buttons, dot indicators, keyboard arrow
   support and native touch swipe.
9. FAQ — single accessible accordion card (one open at a time), including a
   "What's the difference between Quick and Premium?" question specific to this page
10. Final CTA banner
11. Footer — everything centre-aligned: logo, phone, email, copyright

### Two conversion paths

**Talk now → WhatsApp.** Every "Book" button (the two service cards and the
final CTA banner), the header's "Get Free Quote" button, the hero's WhatsApp
button and the floating WhatsApp bubble all open WhatsApp directly in a new
tab, several with a message pre-filled naming the service. No form, no friction.

**Send details → the hero form.** The hero's quote form (Name, Phone, Email,
Service) is submitted via `fetch()` to [Web3Forms](https://web3forms.com) —
see `initLeadForm()` in `script.js`. Reuses the same Web3Forms access key as
`/interior-detailing`, so submissions from both pages land in the same inbox.

## Before You Launch

1. **Replace the customer reviews** if you want page-specific testimonials —
   the current six are adapted from `/interior-detailing`'s set, tweaked to
   reference Quick/Premium wash rather than interior detailing.
2. **Add the OG share cover.** `images/hero/og-cover.jpg` (1200×630) is still
   missing, same gap as on `/interior-detailing`.
3. **Verify phone/WhatsApp numbers** throughout `index.html` match the live
   business line: currently `+971 55 550 3288`.
4. **Confirm the GTM container ID** (`GTM-P9F6GT2N`) is still the right one to
   attribute this page's traffic to — currently reuses the same container as
   the main site and `/interior-detailing`.
5. **Run Lighthouse/PageSpeed Insights** — image weight is the biggest lever
   left for LCP; keep the hero image under ~250KB.

## Customization

All colors, spacing, radii, shadows and font stacks are defined as CSS custom
properties at the top of `style.css` (`:root`) — identical to `/interior-detailing`,
change the palette, spacing scale, or typography globally from one place.
