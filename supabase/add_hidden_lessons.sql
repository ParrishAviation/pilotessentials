-- Hidden Lessons (admin can hide/delete lessons from course view)
-- Run this in: Supabase Dashboard → SQL Editor → New Query

create table if not exists public.hidden_lessons (
  id uuid default gen_random_uuid() primary key,
  lesson_id text not null unique,
  course_id text not null,
  hidden_by uuid references auth.users(id),
  hidden_at timestamptz default now()
);

alter table public.hidden_lessons enable row level security;

-- Anyone can read (so the frontend can filter out hidden lessons for all users)
create policy "Anyone can view hidden lessons" on public.hidden_lessons
  for select using (true);

-- Only admins can insert / delete
create policy "Admins can hide lessons" on public.hidden_lessons
  for insert with check (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

create policy "Admins can restore lessons" on public.hidden_lessons
  for delete using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );
