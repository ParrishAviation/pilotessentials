-- Quiz question overrides — admin-editable questions stored in Supabase
-- Run this once in Supabase SQL Editor

create table if not exists quiz_overrides (
  id          uuid primary key default gen_random_uuid(),
  quiz_key    text not null,          -- e.g. 'ppl-l5'
  question_id int  not null,          -- matches the id field in QUIZ_BANK questions
  question    text not null,
  options     jsonb not null,         -- array of strings
  correct     int  not null,          -- 0-based index of correct option
  explanation text not null default '',
  updated_at  timestamptz not null default now(),
  unique (quiz_key, question_id)
);

-- Allow admins (service role) full access; anon can only read
alter table quiz_overrides enable row level security;

create policy "Public read" on quiz_overrides
  for select using (true);

create policy "Service role full access" on quiz_overrides
  for all using (auth.role() = 'service_role');
