-- ============================================================
-- Pilot Essentials — AI Command Center Analytics
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Student behavioral events ────────────────────────────────────────────────
create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  -- event_type values:
  --   lesson_start, lesson_complete, lesson_abandon
  --   quiz_attempt, quiz_complete
  --   video_progress (percent watched)
  --   page_view
  course_id text,
  lesson_id text,
  module_id text,
  quiz_id text,
  metadata jsonb default '{}',  -- flexible: score, percent, time_spent_seconds, etc.
  created_at timestamptz default now()
);
alter table public.analytics_events enable row level security;

-- Users can insert their own events
create policy "Users can insert own events" on public.analytics_events
  for insert with check (auth.uid() = user_id);

-- Admins can read all events
create policy "Admins can read all events" on public.analytics_events
  for select using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

-- Index for fast queries
create index if not exists analytics_events_user_id_idx on public.analytics_events (user_id);
create index if not exists analytics_events_event_type_idx on public.analytics_events (event_type);
create index if not exists analytics_events_lesson_id_idx on public.analytics_events (lesson_id);
create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);

-- ─── AI Recommendations (cached, admin feedback loop) ─────────────────────────
create table if not exists public.ai_recommendations (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('learning', 'errors', 'revenue', 'engagement')),
  priority text not null check (priority in ('critical', 'high', 'medium', 'low')),
  title text not null,
  description text not null,
  action text not null,
  impact_score integer default 50,  -- 0–100, used for sorting
  data jsonb default '{}',           -- supporting data/metrics
  status text default 'open' check (status in ('open', 'accepted', 'rejected', 'resolved')),
  admin_note text,
  generated_at timestamptz default now(),
  resolved_at timestamptz
);
alter table public.ai_recommendations enable row level security;

create policy "Admins can manage recommendations" on public.ai_recommendations
  for all using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

create index if not exists ai_recommendations_status_idx on public.ai_recommendations (status);
create index if not exists ai_recommendations_category_idx on public.ai_recommendations (category);
create index if not exists ai_recommendations_impact_idx on public.ai_recommendations (impact_score desc);
