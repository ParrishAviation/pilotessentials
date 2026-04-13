-- ============================================================
-- Support Tickets
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create table if not exists public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  user_name text,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

-- Users can submit tickets
create policy "Users can insert tickets" on public.support_tickets
  for insert with check (auth.uid() = user_id or user_id is null);

-- Users can view their own tickets
create policy "Users can view own tickets" on public.support_tickets
  for select using (auth.uid() = user_id);

-- Admins can do everything
create policy "Admins can manage all tickets" on public.support_tickets
  for all using (
    auth.email() in ('jack@parrishaviation.com', 'titiusmclaughlin@gmail.com')
  );

create index if not exists support_tickets_created_at_idx on public.support_tickets(created_at desc);
create index if not exists support_tickets_user_idx on public.support_tickets(user_id);
create index if not exists support_tickets_status_idx on public.support_tickets(status);
