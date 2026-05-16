# Design Document
## CreatorPulse

**Version:** 0.1
**Created:** 2026-05-16

---

## 1. Design Principles

1. **Developer tool aesthetic, not social media pink** — Dark mode first, monospace data, data-dense layouts. Think New Relic / Datadog, not Later or Hootsuite.
2. **Insight over data** — Surface "what this means" not just "what happened." Every metric should have a signal attached (up/down vs baseline, trend arrow).
3. **Zero friction onboarding** — Show value before asking for signup. Creator types their handle → sees a preview dashboard immediately → signs up to save + enable alerts.
4. **Trust through accuracy** — Only show what we can verify. Always show "last synced" timestamp. No estimates presented as facts.
5. **Mobile responsive** — Most Indian creators are mobile-first. Dashboard must work on a phone, not just desktop.

---

## 2. User Flows

### Flow 1: Onboarding (Zero to Dashboard)
```
Landing page (enter handle)
  → Preview dashboard loads (no auth, public data)
  → "Save your dashboard + get alerts" CTA
  → Sign up with email (Clerk)
  → Full dashboard with 30-day history
  → Alert setup prompt: "Tell me when my engagement drops"
  → Dashboard saved ✓
```
- **Entry point:** Direct to `creatorpulse.in` (word of mouth, shared media kit link, creator Twitter)
- **Exit point:** Saved dashboard with at least one alert configured
- **Key decision:** Show value before asking for anything — handle first, email second

### Flow 2: Media Kit Sharing (Viral Loop)
```
Creator on dashboard
  → Clicks "Share my media kit"
  → Copies link: creatorpulse.in/[handle]
  → Shares with brand in DM/email
  → Brand opens link (no auth required)
  → Brand sees: live stats, engagement rate, niche, audience quality
  → Brand sees "Powered by CreatorPulse" watermark
  → Brand signs up / explores other creators
```
- **Entry point:** Creator pitching a brand
- **Exit point:** Brand discovers CreatorPulse (secondary viral loop)
- **Key decision:** Media kit is always public, always live — zero maintenance for creator

### Flow 3: Alert Triggered
```
24hr sync detects engagement drop > 20%
  → Resend email: "Your engagement dropped"
  → Email shows: current rate, baseline, which posts underperformed
  → CTA: "View your dashboard"
  → Creator opens dashboard, sees time-series dip
  → Creator adjusts posting strategy
```
- **Entry point:** Automated — no creator action needed
- **Exit point:** Creator back in dashboard investigating the drop

### Flow 4: Rate Card Check
```
Creator on dashboard
  → Opens "What should I charge?" section
  → Sees: ₹X–₹Y per post, ₹A–₹B per story, ₹P–₹Q per reel
  → Based on: [niche] + [follower count] + [engagement rate] + [geography]
  → "Share your rate card" → adds to media kit
```
- **Entry point:** Creator preparing to pitch a brand
- **Exit point:** Rate card visible on media kit or copied to clipboard

---

## 3. Key Screens

### Screen: Landing Page
- **Purpose:** Convert visitor to dashboard preview with zero friction
- **Key elements:**
  - Headline: "Know your numbers. Know your worth."
  - Single input: "Enter your Instagram handle" + "See your dashboard →"
  - Below fold: 3 value props (dashboard preview, alerts, media kit)
  - Social proof: "X creators already tracking their pulse"
- **User action:** Types handle, hits enter

### Screen: Dashboard (APM View)
- **Purpose:** Creator's command center — understand performance at a glance
- **Key elements:**
  - Top bar: handle, platform badge, "last synced 2hr ago"
  - KPI cards: Followers (+ delta), Engagement Rate (+ trend arrow), Avg Reach, Best Post
  - Time-series chart: Engagement rate over 7d / 30d / 90d (tabbed)
  - Alert status: "1 alert active" badge
  - "Share media kit" button (prominent, top right)
- **User action:** Switch time ranges, click a data point to see post detail, configure alerts

### Screen: Media Kit (Public, `/[handle]`)
- **Purpose:** Creator's live pitch document — replaces static PDF
- **Key elements:**
  - Creator name, handle, profile pic, niche badge
  - Live stats: Followers, Engagement Rate, Avg Reach, Post Frequency
  - Audience quality score (0–100)
  - "Last updated: [timestamp]"
  - Rate card (if creator chose to show it)
  - "Powered by CreatorPulse" watermark (free tier) or hidden (premium)
- **User action:** None — this is a read-only public page for brands

### Screen: Alert Configuration
- **Purpose:** Creator sets their alert thresholds
- **Key elements:**
  - Toggle: "Engagement drop alert" → threshold slider (default: 20%)
  - Toggle: "Follower stall alert" → threshold (default: <0.1% in 7 days)
  - Toggle: "Post spike alert" → outperformance threshold
  - Toggle: "Weekly digest email"
  - Email input (pre-filled from signup)
- **User action:** Toggle alerts on/off, adjust thresholds, save

### Screen: Rate Intelligence
- **Purpose:** Give creator a confident, data-backed price to quote brands
- **Key elements:**
  - "Based on your profile:" → ₹X–₹Y per post, per story, per reel
  - Inputs used: niche, follower count, engagement rate, geography (auto-detected)
  - Disclaimer: "Based on India market benchmarks. Treat as a guide."
  - "Add to media kit" toggle
- **User action:** Review rates, optionally add to media kit

---

## 4. Design Decisions

### Dark mode as default
- **Chose:** Dark background (`#0D0D0D` or similar), light text, accent in electric blue/green
- **Because:** Signals "developer tool," differentiates from every pink/white creator tool. Also easier on eyes for creators who check stats late at night.
- **Trade-off:** May feel unfamiliar to non-tech-savvy creators — mitigate with clean layouts, not raw terminal aesthetics.

### Show value before signup
- **Chose:** Preview dashboard on handle entry, no auth required
- **Because:** Creator trust is earned, not assumed. Seeing their own data immediately converts better than any landing page copy.
- **Trade-off:** Public preview requires public Instagram data (no API auth needed for preview — acceptable for V1).

### Single handle input on landing (not multi-step form)
- **Chose:** One field, one action on landing page
- **Because:** Friction = drop. Every additional field loses 20–30% of visitors. Get them to the "aha moment" (their own dashboard) as fast as possible.
- **Trade-off:** Can't collect email until after preview — acceptable tradeoff.

### Media kit as primary viral mechanism
- **Chose:** Auto-generated public URL, always live, no creator maintenance
- **Because:** If the creator has to update it, they won't. If it updates itself, they'll share it forever.
- **Trade-off:** Public by default (creator can set to private) — handle edge cases where creator doesn't want public stats.

---

## 5. Component Reference

| Component | Used In | Notes |
|---|---|---|
| KPI Card | Dashboard, Media Kit | Metric + delta + trend arrow. Reused across both contexts. |
| EngagementChart | Dashboard | Recharts or Chart.js; time range tabs (7d/30d/90d) |
| AlertBadge | Dashboard top bar | Shows count of active alerts; click to open alert config |
| MediaKitPage | `/[handle]` | Public, SSR/ISR, no auth. Optimized for link preview (OG tags) |
| HandleInput | Landing page | Single input with platform detection (@ prefix handling) |
| RateCard | Dashboard + Media Kit | Shows INR rate range; toggleable on media kit |

---

## 6. Design Resources

- Figma / wireframes: TBD (V1 goes straight to code — no Figma)
- Design system: Custom, inspired by Vercel + Linear aesthetic
- Fonts: Inter (UI) + JetBrains Mono (metrics/numbers)
- Colors:
  - Background: `#0A0A0A`
  - Surface: `#141414`
  - Border: `#262626`
  - Text primary: `#FAFAFA`
  - Text secondary: `#737373`
  - Accent: `#3B82F6` (blue) — alerts, CTAs
  - Positive: `#22C55E` (green) — growth, up trends
  - Negative: `#EF4444` (red) — drops, alerts
