-- ============================================================
-- Exit Survey — run once in Supabase SQL Editor
-- ============================================================

create table if not exists public.exit_survey_responses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  user_email    text,
  course_id     text not null,
  exam_score    integer,                    -- percentage 0-100
  preparedness  integer check (preparedness between 1 and 5),
  course_rating integer check (course_rating between 1 and 5),
  most_valuable text,
  heard_from    text,
  recommend     text,
  comments      text,
  submitted_at  timestamptz default now()
);

-- Indexes for analytics queries
create index if not exists exit_survey_course_id_idx  on public.exit_survey_responses (course_id);
create index if not exists exit_survey_submitted_idx  on public.exit_survey_responses (submitted_at desc);
create index if not exists exit_survey_rating_idx     on public.exit_survey_responses (course_rating);

-- RLS
alter table public.exit_survey_responses enable row level security;

-- Anyone (including anonymous) can insert their own response
create policy "Insert own survey response"
  on public.exit_survey_responses for insert
  with check (true);

-- Only admins can read all responses
create policy "Admins read survey responses"
  on public.exit_survey_responses for select
  using (
    auth.email() in (
      'jakeortner@gmail.com',
      'info@mypilotessentials.com'
    )
  );
