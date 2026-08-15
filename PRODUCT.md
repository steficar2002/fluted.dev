# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are potential clients — founders, operators, and ecomm teams looking to hire someone to redesign or build from scratch a high-quality, high-performing ecommerce website, with custom Liquid / custom-coded features rather than theme presets.

## Product Purpose

Fluted is a Shopify conversion agency. This site exists to persuade qualified prospects that Fluted can design and build custom Shopify stores that convert — not decorate themes. Success means a prospect books a call or starts a contact conversation ready to discuss a custom build.

## Positioning

Fluted specializes in custom sections and custom-coded solutions, combining top-level design, CRO, and integrations while building a sales funnel engineered for maximum conversion. Neighboring theme shops and generic Shopify agencies cannot truthfully claim this full stack of custom code + design + CRO + integrations + conversion funnel craft as the core offer.

## Operating Context

Prospects evaluate Fluted through this marketing homepage: proof of craft, method, and outcomes, then a primary “Book a call” path or secondary on-page contact form. Delivery work itself happens off-site in Shopify / Liquid / custom code engagements.

## Capabilities and Constraints

- Confirmed site capabilities: marketing homepage sections (hero, what we do, case studies, testimonials, method, contact, footer); primary CTA to a scheduling URL; secondary contact form via a Next.js Route Handler stub.
- Stack in use: Next.js App Router, TypeScript, Tailwind, Motion / motion-primitives, fluted-glass shader (`@paper-design/shaders-react`).
- Undecided / not production yet: real scheduling URL (Calendly placeholder), production email/CRM for contact submissions, CMS or dedicated case-study routes.
- Out of scope for v1 per project decisions: CMS/MDX case studies, analytics product surfaces as part of this site.

## Brand Commitments

- Name: **fluted** (lowercase wordmark usage as established).
- Metaphor: fluted glass — reflecting / refracting light to reveal true website components (like white light split into color). Use sparingly in copy; do not force into every headline.
- Identity assets: logo / wordmark / icon / emboss mark in `public/` (`logo.svg`, `logo-icon.svg`, `logo-emboss.svg`, related variants).
- Binding type: Poppins (headers + body), Bitcount Prop Single (display moments).
- Binding theme direction: light ground; charcoal text; accents sparingly from logo — coral `#e14727`, yellow `#eaea70`, purple `#924d9e`.
- Voice: clear and confident.

## Evidence on Hand

- Placeholder case studies and testimonials in `src/lib/content.ts` (Lumen Home, Northline Apparel, Solace Beauty). These are not confirmed real clients or metrics — future work must not present them as factual without user confirmation, and must not invent additional clients, quotes, or benchmarks.
- Placeholder contact email: `hello@fluted.studio`.
- Placeholder booking URL: `https://calendly.com/`.
- Real brand assets: logo SVGs and hero imagery in `public/`.
- Design decisions recorded in `docs/superpowers/specs/2026-07-20-fluted-homepage-design.md`.

## Product Principles

1. Custom code over theme presets — sections, Liquid, and features unique to the brand.
2. Conversion is the product — design, CRO, integrations, and funnel craft serve purchase path clarity.
3. Refract, don’t decorate — reveal what actually converts; metaphor supports positioning, not ornament.
4. Honest proof — placeholders stay labeled as provisional until real evidence replaces them.
5. Prospect action first — every major surface should make booking or contacting the next clear step.
