-- ============================================================
-- AI Query Log — records every Captain AI question asked
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create table if not exists public.ai_query_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  query text not null,
  response_preview text,      -- first 300 chars of AI reply
  course_context text,        -- course title if chat was opened on a course page
  asked_at timestamptz not null default now()
);

alter table public.ai_query_log enable row level security;

-- Users can insert their own logs
create policy "Users can insert own ai logs" on public.ai_query_log
  for insert with check (auth.uid() = user_id or user_id is null);

-- Admins can read all logs
create policy "Admins can read ai logs" on public.ai_query_log
  for select using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

-- Index for fast admin queries
create index if not exists ai_query_log_asked_at_idx on public.ai_query_log(asked_at desc);
create index if not exists ai_query_log_user_idx on public.ai_query_log(user_id, asked_at desc);
