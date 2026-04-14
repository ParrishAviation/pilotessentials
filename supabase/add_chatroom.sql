-- ============================================================
-- Pilot Essentials — Community Chatroom
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Chat messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  user_name text not null,
  content text not null check (char_length(content) between 1 and 2000),
  mentions text[] default '{}',          -- array of user_ids mentioned
  deleted_at timestamptz default null,   -- soft-delete by moderators
  deleted_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.chat_messages enable row level security;

-- Anyone authenticated can read non-deleted messages
create policy "Read chat messages" on public.chat_messages
  for select using (auth.uid() is not null and deleted_at is null);

-- Users can insert their own messages
create policy "Insert own chat messages" on public.chat_messages
  for insert with check (auth.uid() = user_id);

-- Users can soft-delete their own messages; moderators can delete any
create policy "Delete chat messages" on public.chat_messages
  for update using (
    auth.uid() = user_id
    or exists (
      select 1 from public.chat_moderators where user_id = auth.uid()
    )
  );

-- Index for fast ordered fetch
create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at desc);

-- Enable Realtime on this table
alter publication supabase_realtime add table public.chat_messages;


-- ─── Moderators ────────────────────────────────────────────────────────────────
create table if not exists public.chat_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  user_name text not null,
  user_email text,
  assigned_by uuid references auth.users(id),
  assigned_at timestamptz default now()
);
alter table public.chat_moderators enable row level security;

-- Anyone authenticated can read the moderator list
create policy "Read moderators" on public.chat_moderators
  for select using (auth.uid() is not null);

-- Only existing mods / admins can insert (enforced at app layer too)
create policy "Manage moderators" on public.chat_moderators
  for all using (auth.uid() is not null);


-- ─── CFI Chatroom (cfi_mentorship plan only) ──────────────────────────────────
create table if not exists public.cfi_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  user_name text not null,
  content text not null check (char_length(content) between 1 and 2000),
  mentions text[] default '{}',
  deleted_at timestamptz default null,
  deleted_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.cfi_chat_messages enable row level security;

-- Drop old policies if they exist (safe re-run)
drop policy if exists "Read CFI chat messages" on public.cfi_chat_messages;
drop policy if exists "Insert CFI chat messages" on public.cfi_chat_messages;
drop policy if exists "Delete CFI chat messages" on public.cfi_chat_messages;

-- Admins can always read; cfi_mentorship purchasers can read
create policy "Read CFI chat messages" on public.cfi_chat_messages
  for select using (
    auth.uid() is not null
    and deleted_at is null
    and (
      auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
      or exists (
        select 1 from public.purchases
        where user_id = auth.uid()
          and plan = 'cfi_mentorship'
      )
    )
  );

-- Admins can always post; cfi_mentorship purchasers can post
create policy "Insert CFI chat messages" on public.cfi_chat_messages
  for insert with check (
    auth.uid() = user_id
    and (
      auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
      or exists (
        select 1 from public.purchases
        where user_id = auth.uid()
          and plan = 'cfi_mentorship'
      )
    )
  );

-- Soft-delete by owner or moderator
create policy "Delete CFI chat messages" on public.cfi_chat_messages
  for update using (
    auth.uid() = user_id
    or auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
    or exists (select 1 from public.chat_moderators where user_id = auth.uid())
  );

-- Index for fast ordered fetch
create index if not exists cfi_chat_messages_created_at_idx on public.cfi_chat_messages (created_at desc);

-- Enable Realtime (ignore error if already added)
alter publication supabase_realtime add table public.cfi_chat_messages;
