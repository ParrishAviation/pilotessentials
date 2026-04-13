-- ============================================================
-- Quiz Attempts — append-only history of every quiz attempt
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id text not null,
  score integer not null,
  total integer not null,
  percent integer not null,
  is_perfect boolean default false,
  attempted_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;
create policy "Users manage own quiz attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id);

-- Index for fast per-user per-quiz lookups
create index if not exists quiz_attempts_user_quiz_idx
  on public.quiz_attempts(user_id, quiz_id, attempted_at desc);
