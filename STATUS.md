# Project Status
## CreatorPulse

<!-- DASHBOARD_META
name: CreatorPulse
slug: creator-pulse
status: Active
phase: Phase 1
started: 2026-05-16
last_updated: 2026-05-16
summary: New Relic for social media creators — observability, not just analytics
current_focus: Weekend MVP — Instagram dashboard + alerts + shareable media kit
-->

---

## Current Phase
**Phase 1** — Weekend MVP

## Status
`Active`

---

## Current Focus
Build Instagram dashboard with time-series engagement view, baseline alerting, and shareable media kit URL.

---

## Development Log

### 2026-05-16 — Session 1
**Done:**
- [x] Researched existing creator tools landscape (global + India)
- [x] Identified core market gap: no creator-side observability platform
- [x] Defined product positioning: New Relic for creators
- [x] Created PRD with full Phase 1–3 roadmap
- [x] Set up project foundation and Project Builder system

**Decisions:**
- No fintech/payments — pure observability play
- India-first, then global
- Reach over revenue — free tier is the growth engine
- Phase 1: Instagram only, then expand platforms

**Time:** 2h

---

## Pending Tasks

### Phase 1 — Weekend MVP
- [ ] Check Instagram Basic Display API access + apply — est: 1h
- [ ] Scaffold Next.js project with Tailwind — est: 2h
- [ ] Build Instagram data ingestion (connect handle → pull metrics) — est: 3h
- [ ] Build time-series dashboard UI (7d / 30d / 90d) — est: 4h
- [ ] Build alerting system (email when engagement drops) — est: 3h
- [ ] Build shareable media kit page (`/[handle]`) — est: 3h
- [ ] Add rate benchmarking logic (India-specific) — est: 2h
- [ ] Deploy to Vercel + domain setup — est: 1h

### Phase 2 — Month 1–2
- [ ] YouTube API integration
- [ ] TikTok integration
- [ ] Benchmarking vs similar creators in niche
- [ ] Hindi UI support

### Phase 3 — Month 3–6
- [ ] ShareChat / Moj integration
- [ ] Brand-facing creator directory
- [ ] Regional language support

---

## Blockers
- Instagram API app review can take days — start this first before any UI work

---

## Time Tracker

| Date | Session | Hours | Cumulative |
|---|---|---|---|
| 2026-05-16 | Brainstorm + Research + Setup | 2h | 2h |

---

## Key Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-16 | No payment/fintech features | Solo founder, no trust infrastructure, no compliance overhead |
| 2026-05-16 | India-first | Unique GST/regional pain, no good local competitor for creator side |
| 2026-05-16 | Reach over revenue | 2-3yr exit target — footfall is the asset, not profit |
| 2026-05-16 | Free core product | Viral loop: every media kit shared = product discovery |
