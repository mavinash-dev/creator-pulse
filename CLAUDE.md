# CreatorPulse — Project Brief for Claude

> Read this first. Every session. This is your full context.

---

## What This Project Is

**One-liner:** New Relic for social media creators — real observability into your creator business, not just vanity metrics.

**Problem:** Social media creators (especially Indian micro/mid-tier) run a business they can't see clearly. Every existing analytics tool is built for brands. Creators have no cross-platform view, no alerting, no benchmarking, and pitch brands using outdated static PDFs. They price their work by gut feel.

**Solution:** A social media observability platform — time-series engagement tracking, drop/spike alerting, a shareable always-live media kit, and India-specific rate benchmarking.

**Positioning:** "New Relic for creators." Fintech + developer tool aesthetic, not "social media pink." Built for creators as the customer, not inventory.

---

## Target Users

- **Primary:** Micro to mid-tier Indian creators, 5K–500K followers, Instagram + YouTube, Tier 1/2/3 cities. Pain: no professional tools, underpriced, no visibility into their own numbers.
- **Secondary:** Nano creators (1K–5K) — aspiring professionals who will grow into the primary segment.
- **Not targeting:** Mega influencers (1M+) who have agencies; brands (Phase 3 only).

---

## Current Phase & Status

**Phase:** Phase 1 — Weekend MVP
**Status:** Active
**Last worked on:** 2026-05-16

**What's done:**
- [x] Researched existing creator tools landscape (global + India)
- [x] Identified core market gap: no creator-side observability platform
- [x] Defined product positioning and PRD
- [x] Set up project foundation (README, PRD, STATUS, ARCH, DESIGN, CLAUDE)

**What's next:**
- [ ] Check Instagram Basic Display API access + apply
- [ ] Scaffold Next.js project with Tailwind
- [ ] Build Instagram data ingestion (connect handle → pull metrics)
- [ ] Build time-series dashboard UI (7d / 30d / 90d)
- [ ] Build alerting system (email when engagement drops)
- [ ] Build shareable media kit page (`/[handle]`)
- [ ] Add rate benchmarking logic (India-specific)
- [ ] Deploy to Vercel + domain setup

---

## Core Features (Phase 1)

1. **Platform Connection** — Creator enters Instagram handle; pull follower count, post count, avg engagement rate, recent post performance via Instagram Basic Display API. Refresh every 24hr.
2. **Creator Dashboard (APM View)** — Time-series chart: engagement rate over 30/7/90 days. Key metrics: followers (delta), avg engagement, avg reach, best post this month. Trend vs 30-day baseline.
3. **Alerting** — Email alert when engagement drops >20% from baseline, follower growth stalls (<0.1% in 7 days), or a post significantly outperforms. Weekly digest: "Your CreatorPulse weekly report."
4. **Shareable Media Kit** — Auto-generated public profile at `creatorpulse.in/[handle]`. Live stats, engagement rate, niche, audience quality score. Always up-to-date. Free tier: "Powered by CreatorPulse" watermark. This is the viral loop — every link shared = product discovery.
5. **Rate Intelligence** — "Based on your profile, you should charge ₹X–₹Y per Instagram post." India-specific benchmarks in INR. Based on niche + followers + engagement + geography.

---

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Next.js API routes (Node.js)
- **DB:** PostgreSQL via Supabase
- **Auth:** Clerk
- **Hosting:** Vercel (frontend + API) + Supabase (DB)
- **Email:** Resend + React Email
- **Key APIs:** Instagram Basic Display API, YouTube Data API v3 (Phase 2)

---

## Hard Constraints

- No payment processing, GST invoicing, escrow, or contract handling — pure observability play
- India-first: INR pricing, India-specific rate benchmarks, Hindi UI in Phase 2
- Web-first, mobile responsive — no native app
- No multi-user/team accounts in Phase 1
- Solo founder: ruthless scope control, Phase 1 = 4 features only

---

## Turning Auth On (when ready)

Auth is currently disabled via `NEXT_PUBLIC_SKIP_AUTH=true`. No login required anywhere.

To enable Clerk auth in the future — change in **two places**, no code changes needed:
1. `.env.local` → `NEXT_PUBLIC_SKIP_AUTH=false`
2. Vercel dashboard → Environment Variables → `NEXT_PUBLIC_SKIP_AUTH=false`

---

## Key Decisions Already Made

- **No fintech** — No trust infrastructure, no compliance overhead, stay focused
- **India-first** — Unique regional pain, no good local competitor on the creator side
- **Reach over revenue** — 2–3yr exit target; footfall is the asset. Free core product drives the viral loop
- **Free media kit** — Every shared link = product discovery; watermark on free tier
- **PostgreSQL over time-series DB** — 24hr sync cadence keeps volume low; Postgres handles it without extra infra
- **Next.js monorepo** — Reduces infra surface for solo founder; extract later if needed

---

## Project Files

- `PRD.md` — Full product requirements (problem, vision, users, features, metrics, risks, roadmap)
- `ARCH.md` — Technical architecture (stack, data model, API constraints, key decisions)
- `DESIGN.md` — UX flows and key screens
- `STATUS.md` — Development log, pending tasks, time tracking
- `README.md` — Public summary

---

## How to Continue This Project

1. Read `STATUS.md` → Current Focus + Pending Tasks
2. Ask Avinash: "Continuing from [last task] — ready to proceed?"
3. Work on next pending task
4. On session end: update `STATUS.md` → Development Log + Time Tracker

---

## Important Context

- **Instagram API is the biggest blocker** — Apply for app review immediately; it can take days. Use public profile data for preview/demo while waiting.
- **Viral loop is the core growth strategy** — The media kit page (`/[handle]`) is not just a feature, it's the distribution engine. Every design decision should make it shareable and visually impressive.
- **India-specific rate data doesn't exist publicly** — Rate benchmarking will require manual research or community-sourced data. Don't block on this for V1; use reasonable estimates and label them clearly.
- **Design aesthetic is critical** — Creators are used to "social media pink" tools. CreatorPulse should feel like a developer tool (dark mode, monospace, data-dense) to signal premium and professional.
- **Avinash is a solo founder** — Scope decisions should always favor ruthless minimalism. If something doesn't directly support the 4 Phase 1 features, it waits.
