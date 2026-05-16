# Architecture Document
## CreatorPulse

**Version:** 0.1
**Created:** 2026-05-16

---

## 1. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS | SSR for SEO on media kit pages; App Router for nested layouts |
| Backend | Next.js API routes (Node.js) | Co-located with frontend; reduces infra surface for solo founder |
| Database | PostgreSQL via Supabase | Time-series metrics storage; Supabase gives managed DB + auth |
| Auth | Clerk | Drop-in auth with social login; faster than rolling NextAuth for V1 |
| Hosting | Vercel | Native Next.js support; free tier covers MVP load |
| Email/Notifications | Resend | Simple API, generous free tier, React Email for templates |

---

## 2. Architecture Overview

```
                      ┌──────────────────┐
                      │   Creator Browser │
                      └────────┬─────────┘
                               │ HTTPS
                      ┌────────▼─────────┐
                      │   Vercel (Edge)   │
                      │  Next.js App      │
                      │  - /dashboard     │
                      │  - /[handle]      │  ← public media kit
                      │  - /api/*         │
                      └────────┬─────────┘
               ┌───────────────┼───────────────┐
               │               │               │
     ┌─────────▼──┐  ┌─────────▼──┐  ┌────────▼────────┐
     │  Supabase  │  │  Instagram  │  │  Resend (Email) │
     │ PostgreSQL │  │  Basic API  │  │  Alert digests  │
     └────────────┘  └────────────┘  └─────────────────┘
                               │
                      ┌────────▼─────────┐
                      │  Cron Job (24hr) │
                      │  Data sync       │
                      └──────────────────┘
```

---

## 3. Data Model

```
Creator
  - id: uuid (PK)
  - handle: text (unique, per platform)
  - platform: enum (instagram, youtube, tiktok)
  - name: text
  - bio: text
  - niche: text
  - profile_pic_url: text
  - created_at: timestamp
  - last_synced_at: timestamp

CreatorMetrics (time-series, one row per sync)
  - id: uuid (PK)
  - creator_id: uuid (FK → Creator)
  - recorded_at: timestamp
  - follower_count: integer
  - following_count: integer
  - post_count: integer
  - engagement_rate: decimal
  - avg_reach: integer
  - avg_impressions: integer

Alert
  - id: uuid (PK)
  - creator_id: uuid (FK → Creator)
  - type: enum (engagement_drop, follower_stall, post_spike)
  - threshold: decimal
  - email: text
  - is_active: boolean
  - last_triggered_at: timestamp

MediaKit
  - id: uuid (PK)
  - creator_id: uuid (FK → Creator)
  - slug: text (unique, = handle by default)
  - is_public: boolean
  - custom_domain: text (nullable)
  - theme: jsonb
  - watermark_enabled: boolean (true for free tier)
  - created_at: timestamp
```

---

## 4. External APIs & Integrations

| API | Purpose | Rate Limits | Notes |
|---|---|---|---|
| Instagram Basic Display API | Pull follower count, posts, engagement | 200 req/hour per token | Requires app review for production; start with public profile scrape for preview |
| YouTube Data API v3 | Channel stats, video performance | 10,000 units/day free | Straightforward, generous quota |
| Resend | Transactional email (alerts, weekly digest) | 100 emails/day free tier | Use React Email for template rendering |

---

## 5. Key Technical Decisions

### Decision 1: PostgreSQL over time-series DB (InfluxDB/TimescaleDB)
- **Chose:** PostgreSQL (via Supabase)
- **Over:** InfluxDB, TimescaleDB
- **Because:** 24hr sync cadence means volume is low; Postgres handles this easily without extra infra. TimescaleDB adds complexity a solo founder doesn't need in V1.

### Decision 2: Next.js monorepo over separate frontend/backend
- **Chose:** Next.js API routes as backend
- **Over:** Separate Express/FastAPI backend
- **Because:** Reduces infra surface, faster iteration for solo founder. Can extract to separate service if scaling demands it.

### Decision 3: Clerk over NextAuth
- **Chose:** Clerk
- **Over:** NextAuth, Supabase Auth
- **Because:** Drop-in UI, handles edge cases (magic link, social login, session management) out of the box. Worth the cost at this stage.

### Decision 4: Vercel hosting
- **Chose:** Vercel
- **Over:** Railway, Fly.io, EC2
- **Because:** Zero config for Next.js, free tier, edge functions for media kit pages at global CDN.

---

## 6. Infrastructure & Deployment

- **Environments:** local → prod (no staging for V1 — solo founder, ruthless scope control)
- **CI/CD:** Vercel auto-deploy on push to main
- **Domain:** `creatorpulse.in` [ASSUMED — check availability]
- **Secrets management:** Vercel environment variables for prod; `.env.local` for dev

---

## 7. Security Considerations

- Instagram tokens stored encrypted in DB, never exposed client-side
- Media kit pages are public by default — no PII shown beyond what creator chooses
- Rate limiting on `/api/sync` to prevent abuse
- Clerk handles all auth — no custom session management

---

## 8. Performance Considerations

- Media kit pages (`/[handle]`) served via Next.js ISR (revalidate every 24hr) — CDN-cached, fast global load
- Dashboard queries use indexed `creator_id + recorded_at` — time-series reads stay fast
- 24hr sync cadence keeps API quota usage low and avoids rate limiting

---

## 9. Open Technical Questions

- [ ] Instagram API app review timeline — apply immediately, use public scrape for preview in the interim
- [ ] What public Instagram data is available without API auth? (follower count, post count — confirm)
- [ ] Supabase vs Railway-hosted Postgres — Supabase wins on auth integration but check pricing at scale
- [ ] Cron job for 24hr sync — Vercel cron (Pro) or external (Upstash, GitHub Actions)?
