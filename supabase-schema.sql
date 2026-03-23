-- =============================================
-- WhatsWrapped - Supabase Database Schema
-- =============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Analyses table - stores wrapped analysis results
create table if not exists public.analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Mi análisis',
  data jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Enable Row Level Security
alter table public.analyses enable row level security;

-- 4. RLS Policies - users can only access their own analyses
create policy "Users can view their own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analyses"
  on public.analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- 5. Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_analyses_updated
  before update on public.analyses
  for each row
  execute function public.handle_updated_at();

-- 6. Index for faster queries by user
create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_created_at on public.analyses(created_at desc);
