-- CreatorPulse initial schema
-- Migration 001: creators, creator_metrics, alerts, media_kits

-- creators table
create table creators (
  id uuid primary key default gen_random_uuid(),
  handle text not null,
  platform text not null check (platform in ('instagram', 'youtube', 'tiktok')),
  name text,
  bio text,
  niche text,
  profile_pic_url text,
  user_id text, -- Clerk user ID (nullable for preview users)
  created_at timestamptz default now(),
  last_synced_at timestamptz,
  unique(handle, platform)
);

-- creator_metrics time-series table
create table creator_metrics (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  recorded_at timestamptz default now(),
  follower_count integer,
  following_count integer,
  post_count integer,
  engagement_rate decimal(5,2),
  avg_reach integer,
  avg_impressions integer
);
create index on creator_metrics(creator_id, recorded_at desc);

-- alerts table
create table alerts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  type text not null check (type in ('engagement_drop', 'follower_stall', 'post_spike')),
  threshold decimal(5,2) not null,
  email text not null,
  is_active boolean default true,
  last_triggered_at timestamptz
);

-- media_kits table
create table media_kits (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade unique,
  slug text unique not null,
  is_public boolean default true,
  custom_domain text,
  watermark_enabled boolean default true,
  created_at timestamptz default now()
);

-- Row Level Security
alter table creators enable row level security;
alter table creator_metrics enable row level security;
alter table alerts enable row level security;
alter table media_kits enable row level security;

-- Policies: owners can manage their data, public can read public media kits
create policy "owners manage creators" on creators for all using (user_id = current_setting('request.jwt.claims')::json->>'sub');
create policy "owners manage metrics" on creator_metrics for all using (
  creator_id in (select id from creators where user_id = current_setting('request.jwt.claims')::json->>'sub')
);
create policy "owners manage alerts" on alerts for all using (
  creator_id in (select id from creators where user_id = current_setting('request.jwt.claims')::json->>'sub')
);
create policy "public read media kits" on media_kits for select using (is_public = true);
create policy "owners manage media kits" on media_kits for all using (
  creator_id in (select id from creators where user_id = current_setting('request.jwt.claims')::json->>'sub')
);
