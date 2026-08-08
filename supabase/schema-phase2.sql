-- ============================================================================
-- Project Connect — Phase 2 schema (startup listings + discovery)
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run
-- (Phase 1's schema.sql / phase1-insert-policy.sql must already be applied.)
-- ============================================================================

create type public.startup_stage as enum ('idea', 'mvp', 'revenue');
create type public.work_mode as enum ('remote', 'hybrid', 'onsite');
create type public.role_commitment as enum ('part_time', 'full_time');

create table public.startups (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references public.profiles(id) on delete cascade,

  name text not null,
  pitch text not null,
  problem text,
  solution text,

  stage public.startup_stage not null default 'idea',
  industry text not null,
  location text,
  work_mode public.work_mode not null default 'remote',

  required_skills text[] default '{}',
  open_roles int not null default 1,
  commitment public.role_commitment,
  equity_offered text,
  application_deadline date,
  team_size int not null default 1,

  banner_url text,
  logo_url text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger startups_updated_at
  before update on public.startups
  for each row execute procedure public.handle_updated_at();

create index startups_industry_idx on public.startups (industry);
create index startups_stage_idx on public.startups (stage);
create index startups_work_mode_idx on public.startups (work_mode);
create index startups_created_at_idx on public.startups (created_at desc);

alter table public.startups enable row level security;

-- Anyone can browse active listings — this is a discovery platform.
create policy "Active startups are viewable by everyone"
  on public.startups for select
  using (is_active = true or auth.uid() = founder_id);

create policy "Founders can create their own startups"
  on public.startups for insert
  with check (auth.uid() = founder_id);

create policy "Founders can update their own startups"
  on public.startups for update
  using (auth.uid() = founder_id);

create policy "Founders can delete their own startups"
  on public.startups for delete
  using (auth.uid() = founder_id);
