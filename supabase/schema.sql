-- ============================================================
-- SkyAce Pilot Training Platform — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  full_name text,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Enrolled Courses
create table if not exists public.enrolled_courses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id text not null,
  enrolled_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table public.enrolled_courses enable row level security;
create policy "Users manage own enrollments" on public.enrolled_courses for all using (auth.uid() = user_id);

-- Completed Lessons
create table if not exists public.completed_lessons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id text not null,
  xp_earned integer default 0,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);
alter table public.completed_lessons enable row level security;
create policy "Users manage own completed lessons" on public.completed_lessons for all using (auth.uid() = user_id);

-- Completed Modules
create table if not exists public.completed_modules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id text not null,
  completed_at timestamptz default now(),
  unique(user_id, module_id)
);
alter table public.completed_modules enable row level security;
create policy "Users manage own completed modules" on public.completed_modules for all using (auth.uid() = user_id);

-- Completed Courses
create table if not exists public.completed_courses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id text not null,
  completed_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table public.completed_courses enable row level security;
create policy "Users manage own completed courses" on public.completed_courses for all using (auth.uid() = user_id);

-- Quiz Scores (upsert on conflict)
create table if not exists public.quiz_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id text not null,
  score integer not null,
  total integer not null,
  percent integer not null,
  is_perfect boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, quiz_id)
);
alter table public.quiz_scores enable row level security;
create policy "Users manage own quiz scores" on public.quiz_scores for all using (auth.uid() = user_id);

-- Earned Badges
create table if not exists public.earned_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);
alter table public.earned_badges enable row level security;
create policy "Users manage own badges" on public.earned_badges for all using (auth.uid() = user_id);

-- Perfect Quizzes
create table if not exists public.perfect_quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id text not null,
  achieved_at timestamptz default now(),
  unique(user_id, quiz_id)
);
alter table public.perfect_quizzes enable row level security;
create policy "Users manage own perfect quizzes" on public.perfect_quizzes for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Leaderboard view (public, shows top 50 by XP)
create or replace view public.leaderboard as
  select
    p.id,
    p.username,
    p.full_name,
    p.xp,
    p.level,
    p.streak,
    rank() over (order by p.xp desc) as rank
  from public.profiles p
  order by p.xp desc
  limit 50;
