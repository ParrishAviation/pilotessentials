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
create policy "Admins can view all profiles" on public.profiles for select using (
  auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
);

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
create policy "Admins can view all enrollments" on public.enrolled_courses for select using (
  auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
);

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
create policy "Admins can view all completed lessons" on public.completed_lessons for select using (
  auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
);

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
create policy "Admins can view all quiz scores" on public.quiz_scores for select using (
  auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
);

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

-- Lesson Videos (admin-managed video uploads per lesson)
create table if not exists public.lesson_videos (
  id uuid default gen_random_uuid() primary key,
  lesson_id text not null unique,
  course_id text not null,
  video_url text not null,
  file_size bigint,
  duration_seconds integer,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.lesson_videos enable row level security;
create policy "Anyone can view lesson videos" on public.lesson_videos
  for select using (true);
create policy "Admins can manage lesson videos" on public.lesson_videos
  for all using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

-- Storage bucket for course videos (run after creating bucket in dashboard)
insert into storage.buckets (id, name, public)
  values ('course-videos', 'course-videos', true)
  on conflict (id) do nothing;

create policy "Public read course videos" on storage.objects
  for select using (bucket_id = 'course-videos');
create policy "Admins can upload course videos" on storage.objects
  for insert with check (
    bucket_id = 'course-videos' and
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );
create policy "Admins can update course videos" on storage.objects
  for update using (
    bucket_id = 'course-videos' and
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );
create policy "Admins can delete course videos" on storage.objects
  for delete using (
    bucket_id = 'course-videos' and
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

-- Hidden Lessons (admin-managed, hides lessons from all users)
create table if not exists public.hidden_lessons (
  id uuid default gen_random_uuid() primary key,
  lesson_id text not null unique,
  course_id text not null,
  hidden_by uuid references auth.users(id),
  hidden_at timestamptz default now()
);
alter table public.hidden_lessons enable row level security;
create policy "Anyone can view hidden lessons" on public.hidden_lessons
  for select using (true);
create policy "Admins can hide lessons" on public.hidden_lessons
  for insert with check (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );
create policy "Admins can restore lessons" on public.hidden_lessons
  for delete using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

-- ============================================================
-- Purchases — tracks Stripe payments per user
-- ============================================================
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('full_access', 'cfi_mentorship')),
  stripe_payment_id text not null unique,
  amount_cents integer not null,
  status text not null default 'completed',
  cfi_access_expires_at timestamptz,  -- set to now() + 12 months for cfi_mentorship
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);
create policy "Admins can view all purchases" on public.purchases
  for select using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );
-- Only the service role (server-side) can insert purchases
create policy "Service role can insert purchases" on public.purchases
  for insert with check (true);

-- ============================================================
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

-- ============================================================
-- Quiz Overrides (admin-editable questions + figure attachments)
-- ============================================================
create table if not exists public.quiz_overrides (
  id uuid default gen_random_uuid() primary key,
  quiz_key text not null,
  question_id bigint not null,
  question text not null,
  options jsonb not null,
  correct integer not null,
  explanation text,
  figure integer default null,  -- FAA supplement figure number (e.g. 8 = Figure 8)
  updated_at timestamptz default now(),
  unique(quiz_key, question_id)
);
alter table public.quiz_overrides enable row level security;
create policy "Anyone can read quiz overrides" on public.quiz_overrides
  for select using (true);
create policy "Admins can manage quiz overrides" on public.quiz_overrides
  for all using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

-- Migration: add figure column to existing quiz_overrides table (run if table already exists)
alter table public.quiz_overrides add column if not exists figure integer default null;
