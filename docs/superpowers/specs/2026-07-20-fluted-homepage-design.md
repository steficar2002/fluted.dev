# Fluted Agency Homepage — Design Spec

**Date:** 2026-07-20  
**Status:** Approved for planning  
**Product:** Marketing homepage for Fluted, a Shopify conversion agency

## Goal

Ship a light-theme marketing homepage that positions Fluted as builders of completely custom Shopify stores that convert — with custom features, integrations, and product pages. The brand metaphor is fluted glass: reflecting/refracting light to reveal the true components of a website (like white light split into its colors).

## Brand

- **Name:** fluted
- **Logo:** `Asset 1.svg` (wordmark + mark with coral / yellow / purple bars)
- **Fonts:** Poppins (headers + body), Bitcount Prop Single (display moments)
- **Theme:** Light
- **Color tokens:**
  - Charcoal text / UI: `#231f20`
  - Soft ground: `#f6f4f1`
  - Accents (sparing): coral `#e14727`, yellow `#eaea70`, purple `#924d9e`
- **Accent usage:** Logo accents used sparingly site-wide; strongest in fluted-glass refraction highlights and small emphasis (metrics, primary form submit)

## Constraints & decisions

| Decision | Choice |
| --- | --- |
| Content | Placeholder case studies + testimonials for v1 |
| Primary CTA | Book a call (placeholder scheduling URL) |
| Secondary CTA | On-page contact form |
| Stack | Next.js App Router + TypeScript + Tailwind + Motion + motion-primitives |
| Fluted glass v1 | Custom CSS/SVG component (swappable later when a preferred technique is provided) |
| Case study depth | On-page only; no separate project routes in v1 |
| Contact backend | Route Handler stub (success response; no production email/CRM yet) |

## Out of scope (v1)

- CMS / MDX case study system
- Dedicated case study pages
- Real email delivery or CRM sync
- WebGL/shader glass (deferred; architecture keeps `FlutedGlass` swappable)
- Analytics product surfaces

## Page structure

Single homepage, top to bottom:

1. **Nav** — logo wordmark, section anchors (Work, Method, Contact), primary “Book a call”
2. **Hero** — split reveal (see below)
3. **What we do**
4. **Case studies**
5. **Testimonials**
6. **Method**
7. **Contact**
8. **Footer**

Tone: clear and confident. Refraction metaphor used sparingly — not in every headline.

## Hero (layout A — Split reveal)

Approved layout:

- **Left**
  - Brand as eyebrow / wordmark signal
  - One headline (e.g. “Shopify stores that convert”)
  - One short supporting sentence
  - CTA group: primary “Book a call”, secondary “See the method” (or Contact)
  - Interactive fluted strip under/across copy: cursor movement shifts vertical lenses and flashes coral / yellow / purple refraction
- **Right**
  - Logo (`Asset 1.svg`) as the visual plane
  - Vertical fluted-glass overlay (static lenses + subtle light sweep; stronger reaction on pointer move/hover)
- **Mobile**
  - Stack: copy first, then fluted logo panel
  - Interactive glass simplifies to light static fluting (no heavy cursor tracking)

Hero budget: brand, one headline, one short line, one CTA group, one dominant visual (fluted logo). No stats, cards, or secondary marketing blocks in the first viewport.

## Section content

### What we do

- One purpose: Shopify stores that convert, completely custom
- One headline + short supporting sentence
- Three pillars (not a heavy card grid): Custom features · Integrations · Product pages

### Case studies

- Three placeholder projects as list rows (name, one-line focus, outcome metric)
- Example placeholders:
  - Lumen Home — Custom PDP + bundle builder — +38% CVR
  - Northline Apparel — Headless Shopify + loyalty — 2.1× AOV
  - Solace Beauty — Subscription + quiz funnel — −22% CAC
- Interaction: expand inline detail or light panel; no separate routes in v1

### Testimonials

- 2–3 placeholder quotes with name + role
- Motion treatment via motion-primitives (in-view / text effect)

### Method

Four steps:

1. Discover — goals, funnels, constraints  
2. Structure — IA, PDP, conversion map  
3. Build — custom Shopify craft  
4. Refine — launch, measure, iterate  

### Contact

- Left/primary: “Book a call” button → placeholder scheduling URL
- Right/secondary: form fields — name, email, project notes; submit via Route Handler stub
- Success: inline confirmation state

### Footer

- Logo, email placeholder (e.g. `hello@fluted.studio`), sparse links, © year

## Technical architecture

### Stack

- Next.js (App Router), TypeScript
- Tailwind CSS
- Motion (`motion`)
- motion-primitives components added via CLI as needed
- Google Fonts: Poppins + Bitcount Prop Single

### Component map

| Component | Responsibility |
| --- | --- |
| `Nav` | Sticky/simple top nav, anchors, Book a call |
| `Hero` | Split layout; wires left interactive glass + right logo glass |
| `FlutedGlass` | Reusable CSS/SVG fluted overlay; props for static vs interactive intensity |
| `WhatWeDo` | Pillars section |
| `CaseStudies` | Placeholder project list + inline expand |
| `Testimonials` | Quotes + motion-primitives |
| `Method` | Numbered steps |
| `Contact` | Book a call + form |
| `Footer` | Minimal footer |
| Content modules | Local TS constants for copy, studies, testimonials |

### motion-primitives usage

Used for polish, not for the glass itself:

- Text Effect / similar for headlines or testimonials
- In View / Animated Group for section entrance
- Magnetic on primary CTAs where it feels intentional

### Data flow

- Static marketing content from TS modules
- Contact form POST → `app/api/contact/route.ts` → validate → return `{ ok: true }` (log or no-op storage in v1)
- Book a call is an external `href` constant

### Error handling

- Client-side required-field validation before submit
- API returns 400 on invalid payload; UI shows inline error
- API returns 200 + success message on accept

### Accessibility & performance

- Prefer CSS/SVG over canvas for glass
- Respect `prefers-reduced-motion`: disable cursor tracking and heavy animations
- Ensure contrast on charcoal text over soft ground; accent colors not sole carriers of meaning
- Mobile: degrade interactive glass to static fluting

## Visual direction notes

- One composition per viewport; brand-forward hero
- Avoid purple-on-white gradient clichés, cream+terracotta serif defaults, and card-heavy dashboards
- Atmosphere via soft ground + fluted refraction, not flat white alone
- Intentional motion: hero glass response, section in-view, CTA magnetic — 2–3 purposeful moments minimum

## Success criteria

- Homepage implements all eight regions with approved hero behavior
- Fluted glass reads as brand metaphor over the logo and interacts on the left
- Light theme, Poppins + Bitcount Prop Single applied
- Placeholder content feels coherent and replaceable
- Contact form and Book a call both present and functional at stub level
- `FlutedGlass` isolated so a later technique can replace internals without rewriting the page

## Open swap (intentional)

Fluted glass implementation technique may be replaced later by the stakeholder. Keep the public API of `FlutedGlass` stable (`children` / image slot, `interactive`, intensity props).
