-- ============================================================
-- Features SQL: Email Campaigns + CFI Scheduling
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── EMAIL CAMPAIGNS ───────────────────────────────────────

create table if not exists public.email_campaigns (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  subject      text not null,
  body_html    text not null,
  segment      text not null default 'all', -- all | free | paid | cfi
  status       text not null default 'draft', -- draft | sent | scheduled
  sent_at      timestamptz,
  send_count   integer default 0,
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.email_campaigns enable row level security;

create policy "Admins manage campaigns"
  on public.email_campaigns for all
  using (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'))
  with check (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'));

-- ─── CFI PROFILES ──────────────────────────────────────────

create table if not exists public.cfis (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  title        text not null default 'Certified Flight Instructor',
  bio          text,
  photo_url    text,
  email        text,
  specialties  text[] default '{}', -- e.g. ['PPL', 'IFR', 'Commercial']
  zoom_link    text,
  active       boolean default true,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

alter table public.cfis enable row level security;

-- Anyone can view active CFIs
create policy "Public read active CFIs"
  on public.cfis for select
  using (active = true);

-- Admins manage CFIs
create policy "Admins manage CFIs"
  on public.cfis for all
  using (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'))
  with check (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'));

-- ─── CFI AVAILABILITY (weekly recurring slots) ─────────────

create table if not exists public.cfi_availability (
  id           uuid primary key default gen_random_uuid(),
  cfi_id       uuid references public.cfis(id) on delete cascade,
  day_of_week  integer not null check (day_of_week between 0 and 6), -- 0=Sun, 6=Sat
  start_time   time not null,  -- e.g. '09:00'
  end_time     time not null,  -- e.g. '17:00'
  slot_minutes integer default 60 -- session length in minutes
);

alter table public.cfi_availability enable row level security;

create policy "Public read availability"
  on public.cfi_availability for select using (true);

create policy "Admins manage availability"
  on public.cfi_availability for all
  using (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'))
  with check (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'));

-- ─── CFI BOOKINGS ──────────────────────────────────────────

create table if not exists public.cfi_bookings (
  id              uuid primary key default gen_random_uuid(),
  cfi_id          uuid references public.cfis(id) on delete set null,
  student_id      uuid references auth.users(id) on delete set null,
  student_name    text not null,
  student_email   text not null,
  scheduled_at    timestamptz not null,
  duration_min    integer default 60,
  topic           text,
  notes           text,
  zoom_link       text,
  status          text not null default 'pending', -- pending | confirmed | cancelled
  cancelled_by    text, -- 'student' | 'cfi' | 'admin'
  created_at      timestamptz default now()
);

create index if not exists cfi_bookings_cfi_idx       on public.cfi_bookings (cfi_id);
create index if not exists cfi_bookings_student_idx   on public.cfi_bookings (student_id);
create index if not exists cfi_bookings_scheduled_idx on public.cfi_bookings (scheduled_at);
create index if not exists cfi_bookings_status_idx    on public.cfi_bookings (status);

alter table public.cfi_bookings enable row level security;

-- Students can insert and read their own bookings
create policy "Students insert bookings"
  on public.cfi_bookings for insert
  with check (auth.uid() = student_id);

create policy "Students read own bookings"
  on public.cfi_bookings for select
  using (auth.uid() = student_id);

create policy "Students cancel own bookings"
  on public.cfi_bookings for update
  using (auth.uid() = student_id);

-- Admins full access
create policy "Admins manage bookings"
  on public.cfi_bookings for all
  using (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'))
  with check (auth.email() in ('jakeortner@gmail.com','info@mypilotessentials.com'));
