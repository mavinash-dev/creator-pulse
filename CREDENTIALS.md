# Credentials Guide
## CreatorPulse — What each key is, where to get it, how to use it

> Fill these into `.env.local` (never commit that file — it's gitignored).
> Copy `.env.example` → `.env.local` and replace each value one by one.

---

## Overview — Services Used

| Service | What it does in this app | Free tier? |
|---|---|---|
| **Clerk** | User auth — sign up, sign in, session management | Yes — 10,000 MAU free |
| **Supabase** | PostgreSQL database — stores creators, metrics, alerts | Yes — 500MB, 2 projects |
| **Resend** | Sends emails — alert notifications, weekly digest | Yes — 100 emails/day |
| **Instagram Basic Display API** | Pulls creator's Instagram stats (followers, ER, posts) | Yes — but needs app review |

---

## 1. Clerk (Authentication)

**What it is:** Clerk handles all login/signup. It gives you a hosted auth UI, session tokens, and a user ID (`user_id`) that ties each creator to their data in Supabase.

**Keys you need:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**How to get them:**
1. Go to [clerk.com](https://clerk.com) → Sign up (free)
2. Click **"Create application"**
3. Name it `CreatorPulse` → choose sign-in methods: **Email + Google** (recommended)
4. On the dashboard, go to **API Keys** (left sidebar)
5. Copy **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
6. Copy **Secret key** → `CLERK_SECRET_KEY`

**The other Clerk vars (don't change these):**
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in        ← where your sign-in page lives
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up        ← where your sign-up page lives
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard  ← redirect after login
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard  ← redirect after signup
```
These are already correct for this app — no changes needed.

**What happens without it:** The app loads but `/dashboard` throws a Clerk error. Auth pages won't render.

---

## 2. Supabase (Database)

**What it is:** Supabase gives you a managed PostgreSQL database. All creator data, metrics time-series, alerts, and media kit config live here. You also need to run the migration SQL to create the tables.

**Keys you need:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**How to get them:**
1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **"New project"**
   - Name: `creator-pulse`
   - Database password: generate a strong one and **save it somewhere safe**
   - Region: **Southeast Asia (Singapore)** — closest to India
3. Wait ~2 minutes for the project to spin up
4. Go to **Project Settings** (gear icon, bottom left) → **API**
5. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
6. Copy **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Copy **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY`

**Then run the database migration:**
1. In Supabase dashboard → go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase/migrations/001_initial_schema.sql` from this project
4. Paste the entire contents → click **Run**
5. You should see: `Success. No rows returned.`

That creates all 4 tables: `creators`, `creator_metrics`, `alerts`, `media_kits`.

**Difference between the 3 keys:**

| Key | Who uses it | Can do |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Just the endpoint address |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side code | Read/write within RLS policies — safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only (API routes) | Bypasses RLS — full admin access. **Never expose client-side.** |

**What happens without it:** API routes (`/api/sync`, `/api/creator`) crash. Dashboard shows mock data only (which is the current state).

---

## 3. Resend (Email)

**What it is:** Resend sends transactional emails — the engagement drop alert, follower stall warning, and weekly digest. It's a simple API: you call it with a recipient + HTML body and it sends.

**Key you need:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
```

**How to get it:**
1. Go to [resend.com](https://resend.com) → Sign up (free)
2. Go to **API Keys** (left sidebar) → **"Create API Key"**
3. Name it `creator-pulse-prod` → click Create
4. Copy the key (shown once) → `RESEND_API_KEY`

**Domain setup (for production):**
- By default, Resend lets you send from `onboarding@resend.dev` (fine for testing)
- For real alerts, add and verify your domain: `creatorpulse.in`
- Go to Resend → **Domains** → **Add Domain** → follow the DNS instructions
- Then set `FROM_EMAIL=alerts@creatorpulse.in` in your env (add this to `.env.local`)

**What happens without it:** The app works fine — alerts get saved to DB but no emails are sent. Wire this last.

---

## 4. Instagram Basic Display API

**What it is:** Instagram's official API for reading a user's own profile data — followers, posts, media. Requires the creator to OAuth into your app (grant permission), then you get an access token to pull their stats.

**Keys you need:**
```
INSTAGRAM_APP_ID=123456789
INSTAGRAM_APP_SECRET=abcdef1234567890abcdef
```

**How to get them:**
1. Go to [developers.facebook.com](https://developers.facebook.com) → Log in with Facebook
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** as app type → Next
4. App name: `CreatorPulse` → Create App
5. On your app dashboard → click **"Add Product"** → find **"Instagram Basic Display"** → click **Set Up**
6. Go to **Instagram Basic Display** → **Basic Display** tab
7. Fill in:
   - **Valid OAuth Redirect URIs:** `http://localhost:3000/api/auth/instagram/callback`
   - **Deauthorize Callback URL:** `http://localhost:3000/api/auth/instagram/deauth`
   - **Data Deletion Request URL:** `http://localhost:3000/api/auth/instagram/delete`
8. Click Save Changes
9. Copy **Instagram App ID** → `INSTAGRAM_APP_ID`
10. Copy **Instagram App Secret** → `INSTAGRAM_APP_SECRET`

**Important — App Review:**
- In development mode, the API only works for accounts you add as **Test Users**
- For production (real creators), you must submit for **App Review**
- Review takes: 1–5 business days if your app is simple
- To submit: App Dashboard → App Review → Request permissions: `instagram_graph_user_profile`, `instagram_graph_user_media`

**What happens without it:**
- The app currently uses **deterministic mock data** (same handle = same fake numbers)
- It works perfectly for demos and testing
- Real creator data only flows in once Instagram API is wired + creator does OAuth
- **Start the app review process immediately** — it's the longest dependency

---

## 5. App URL

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**What it is:** The base URL of the app. Used to build absolute URLs (e.g. media kit share links, OAuth redirect URIs).

**Change this when you deploy:**
```
NEXT_PUBLIC_APP_URL=https://creatorpulse.in
```

---

## Filling in `.env.local` — Step-by-step order

Do these in this order (each takes ~10 minutes):

```
Step 1: Clerk        → get publishable + secret key → test auth works
Step 2: Supabase     → create project, run migration SQL, get 3 keys → test /api/sync
Step 3: Resend       → get API key → test an alert email sends
Step 4: Instagram    → create FB app, get ID + secret → submit for review (async, takes days)
```

---

## Final `.env.local` — filled template

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_PASTE_HERE
CLERK_SECRET_KEY=sk_test_PASTE_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://PASTE_YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_SERVICE_ROLE_KEY_HERE

# Resend
RESEND_API_KEY=re_PASTE_HERE
FROM_EMAIL=onboarding@resend.dev   # change to alerts@creatorpulse.in after domain verify

# Instagram API
INSTAGRAM_APP_ID=PASTE_HERE
INSTAGRAM_APP_SECRET=PASTE_HERE

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # change to https://creatorpulse.in on deploy
```

---

## Quick sanity checks after each step

After wiring Clerk → run `npm run dev` → visit `http://localhost:3000/sign-up` → should see Clerk sign-up UI

After wiring Supabase → run this in your browser console or Postman:
```
POST http://localhost:3000/api/sync
Body: { "handle": "virat.kohli", "platform": "instagram" }
```
Should return a creator object with metrics.

After wiring Resend → trigger an alert save via `/api/alerts` POST → check your inbox.

---

*Keep this file. Delete it or move it to a private location before making this repo public if you've accidentally written any real keys into it.*
