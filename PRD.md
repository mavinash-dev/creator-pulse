# Product Requirements Document
## CreatorPulse — Observability for Social Media Creators

**Version:** 0.1 (Draft)
**Author:** Avinash
**Created:** 2026-05-16
**Status:** In Brainstorm → Moving to Build

---

## 1. Problem Statement

Social media creators run a business they can't see clearly.

They have no single view of their performance across platforms. They don't know when their engagement drops, why it drops, or how they compare to similar creators. They pitch brands with a static PDF they made in Canva last quarter. They price their work by gut feel.

Every analytics tool that exists is either:
- Built for **brands** (creator = inventory, not customer)
- Solving **one problem** in isolation (newsletter, merch, links)
- **Shallow** — shows vanity metrics, not real insight

No tool treats a creator the way New Relic treats a software engineer — giving them real observability into the system they run.

---

## 2. Vision

> **"New Relic for creators. Know your numbers. Know your worth."**

CreatorPulse is a social media observability platform for creators.

Not just analytics. Observability — the ability to understand the internal state of your creator business from the outside signals it produces, so you can ask questions you haven't thought of yet.

---

## 3. Target Users

### Primary: Micro to Mid-tier Creators (India-first)
- **Follower range:** 5K – 500K
- **Platforms:** Instagram, YouTube (Phase 1), TikTok, ShareChat (Phase 2)
- **Geography:** India (Tier 1, 2, 3 cities)
- **Language:** English + Hindi UI (Phase 1), regional language support (Phase 2)
- **Pain:** No professional tools, underpriced, no visibility into their own performance

### Secondary: Nano Creators (1K–5K)
- Aspiring professionals
- Will grow into primary segment
- High volume, low monetization — important for footfall

### Not targeted (Phase 1):
- Mega influencers (1M+) — have managers, agencies
- Brands — not the customer here

---

## 4. Goals & Success Metrics

### Product Goals
| Goal | Metric | Target (12 months) |
|---|---|---|
| Footfall | Monthly Active Creators | 100,000 |
| Retention | 30-day retention | > 40% |
| Virality | Media kit links shared/week | > 10,000 |
| Trust | Data accuracy vs native platform | > 98% |

### Non-Goals
- Revenue optimization (secondary to reach)
- Payment/invoice handling
- Brand-side features (Phase 3 only)
- Desktop app / mobile app (web-first)

---

## 5. Core Features — Phase 1 (Weekend MVP)

### 5.1 Platform Connection (The Agent)
- Creator enters their Instagram handle
- OAuth or public data pull (Instagram Basic Display API)
- Pulls: follower count, post count, avg engagement rate, recent post performance
- Data refreshed every 24 hours

### 5.2 Creator Dashboard (The APM View)
- Time-series chart: engagement rate over 30 days
- Key metrics panel:
  - Followers (with delta: +X this week)
  - Avg engagement rate
  - Avg reach per post
  - Best performing post this month
- Trend indicator: up/down vs personal 30-day baseline

### 5.3 Alerting (The Killer Feature)
- Creator sets their baseline (or system auto-sets from 30-day avg)
- Email alert when:
  - Engagement drops > 20% from baseline
  - Follower growth stalls (< 0.1% in 7 days)
  - A post significantly outperforms (surface what worked)
- Weekly digest email: "Your CreatorPulse weekly report"

### 5.4 Shareable Media Kit (The Distribution Engine)
- Auto-generated public profile: `creatorpulse.in/[handle]`
- Shows: live stats, engagement rate, niche, audience quality score
- Always up-to-date (no manual updates ever)
- Free tier: "Powered by CreatorPulse" watermark
- Premium tier: custom domain, no watermark, custom color theme
- **This is the viral loop** — every link shared is product discovery

### 5.5 Rate Intelligence (The Value Anchor)
- Based on: niche + follower count + engagement rate + geography
- Output: "Based on your profile, you should charge ₹X–₹Y per Instagram post"
- India-specific benchmarks (INR, not USD)
- Positioned as a tool, not a guarantee

---

## 6. Features Explicitly Out of Scope

- Payment processing of any kind
- GST invoice generation
- Escrow or deal management
- Contract templates
- Brand outreach tools (Phase 2/3)
- Mobile app (web responsive first)
- Multi-user / team accounts

---

## 7. User Journey (Phase 1)

```
1. Creator lands on creatorpulse.in
   (from: word of mouth, shared media kit link, creator Twitter)
         ↓
2. Enters Instagram handle
   → Sees a preview of their dashboard immediately (hooks them)
         ↓
3. Signs up with email to save dashboard + enable alerts
         ↓
4. Dashboard loads with 30-day performance view
         ↓
5. Sets up alert: "Tell me when my engagement drops"
         ↓
6. Shares their media kit link with a brand they're pitching
         ↓
7. Brand opens the link → sees "Powered by CreatorPulse"
         ↓
8. Brand signs up → discovers other creators on platform
   (secondary viral loop)
```

---

## 8. Technical Approach

### Stack (Suggested — to be confirmed)
- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Node.js / Next.js API routes
- **Database:** PostgreSQL (time-series data for metrics)
- **Auth:** NextAuth or Clerk
- **APIs:** Instagram Basic Display API, YouTube Data API v3
- **Email:** Resend or Postmark (for alerts + digests)
- **Hosting:** Vercel (frontend) + Railway/Supabase (DB)

### Data Model (Core)
```
Creator
  - id, handle, platform, name, bio, niche
  - created_at, last_synced_at

CreatorMetrics (time-series)
  - creator_id, recorded_at
  - follower_count, following_count
  - engagement_rate, avg_reach, avg_impressions
  - post_count

Alert
  - creator_id, type, threshold, last_triggered_at

MediaKit
  - creator_id, slug, is_public, custom_domain
  - theme, watermark_enabled
```

### API Constraints to Note
- Instagram Basic Display API: requires app review for production
- Public data scraping: rate limited, fragile — avoid for V1
- YouTube Data API: generous quota, straightforward
- Plan for: data freshness tradeoffs (24hr sync is acceptable for V1)

---

## 9. Design Principles

1. **Trust through accuracy** — Show only what we can verify. No estimates presented as facts.
2. **Insight over data** — Surface "what this means" not just "what happened"
3. **Premium feel** — Design borrowed from fintech + developer tools, not "social media pink"
4. **Zero friction onboarding** — Show value before asking for signup
5. **Mobile responsive** — Most Indian creators are mobile-first

---

## 10. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Instagram API access denied / delayed | High | Start with public profile data, apply for API access in parallel |
| Low creator trust (giving access to handle) | Medium | Show value preview before any auth; explain data usage clearly |
| Engagement data inaccuracy | Medium | Validate against native platform, show "last synced" timestamp |
| Competitor copies the idea | Low (moat is data + trust) | Move fast, build community early |
| Solo founder bandwidth | High | Ruthless scope control — Phase 1 is 4 features only |

---

## 11. Open Questions

- [ ] What is the exact Instagram API scope needed for Phase 1?
- [ ] Do we scrape public data for preview (pre-auth) or use a limited API call?
- [ ] What niche taxonomy to use for Indian creators?
- [ ] Rate benchmark data source — manual research or community-sourced?
- [ ] Domain: `creatorpulse.in` — check availability

---

## 12. Phase Roadmap

| Phase | Timeline | Key Deliverable |
|---|---|---|
| Phase 1 | This weekend | Instagram dashboard + alerts + shareable media kit |
| Phase 2 | Month 1–2 | YouTube + TikTok, benchmarking, Hindi UI |
| Phase 3 | Month 3–6 | Regional languages, Tier 2/3 discoverability, brand directory |
| Phase 4 | Month 6–12 | Brand search/contact (monetization layer) |

---

*This PRD is a living document. Update as product evolves.*
