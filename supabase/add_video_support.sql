-- ============================================================
-- SkyAce — Video Upload + AI Study Guide Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ALSO: Go to Storage → Create bucket named "course-videos" (set to Public)
-- ============================================================

-- Study Guides (AI-generated per lesson, cached to avoid regeneration)
create table if not exists public.study_guides (
  id uuid default gen_random_uuid() primary key,
  lesson_id text not null unique,
  course_id text not null,
  content jsonb not null,
  model text default 'claude-sonnet-4-6',
  generated_at timestamptz default now()
);
alter table public.study_guides enable row level security;
create policy "Anyone can read study guides" on public.study_guides
  for select using (true);
create policy "Service role manages study guides" on public.study_guides
  for all using (true);  -- server-side only (service role key required)

-- Lesson Videos table
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

-- Storage policies for course-videos bucket
-- (bucket must already exist as Public in the dashboard)
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
