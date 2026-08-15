# Netlify

Fluted is connected to Netlify for hosting this Next.js App Router site.

## Build

`netlify.toml` configures:

- Build command: `npm run build`
- Next.js runtime via `@netlify/plugin-nextjs`
- Node 22

Connect the GitHub repo (`steficar2002/fluted.dev`) in the Netlify UI so pushes to `master` deploy automatically.

## Environment variables

Set these in **Netlify → Site configuration → Environment variables** (production + preview as needed):

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Recommended for production | Cloudflare Turnstile site key for the free audit captcha |
| `TURNSTILE_SECRET_KEY` | Recommended for production | Cloudflare Turnstile secret (server-only) |
| `AUDIT_LIVE` | Optional | Set to `1` only when live scrape/LLM audit APIs are ready |
| `OPENAI_API_KEY` | Only if `AUDIT_LIVE=1` | Live audit LLM |
| `FIRECRAWL_API_KEY` | Only if `AUDIT_LIVE=1` | Homepage scrape |
| `UPSTASH_REDIS_REST_URL` | Optional | Shared audit store across instances |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | With Upstash URL |
| `RESEND_API_KEY` | Optional | Audit unlock notifications |

Local copies belong in `.env.local` (gitignored). See `.env.example` for the captcha keys.

Without Turnstile keys, the app falls back to Cloudflare always-pass **test** keys — fine for local demo, not for public production.

## Free audit notes

- Demo audits persist under `.data/audits/` locally; on Netlify prefer Upstash Redis so serverless instances share audit records.
- Rate limits are in-memory per instance unless Redis is configured.
