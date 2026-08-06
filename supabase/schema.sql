-- ============================================================================
-- Project Connect — Phase 1 schema (auth + profiles)
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================================

create type public.user_role as enum ('founder', 'co_founder', 'team_member', 'mentor', 'company', 'admin');
create type public.commitment_type as enum ('part_time', 'full_time', 'exploring');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role,
  onboarding_complete boolean not null default false,

  college text,
  course text,
  year text,
  location text,
  bio text,

  skills text[] default '{}',
  interests text[] default '{}',
  languages text[] default '{}',
  startup_experience text,
  preferred_role text,
  availability public.commitment_type,

  portfolio_url text,
  github_url text,
  linkedin_url text,
  resume_url text,

  is_verified boolean not null default false,
  is_premium boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every change.
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-create a profile row the moment someone signs up (Google or email).
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;

-- Profiles are publicly readable (this is a discovery platform — founders
-- need to see applicant profiles and vice versa). Tighten later if needed.
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- No insert/delete policies for regular users — rows are created only by
-- the handle_new_user trigger (runs as security definer) and cascade-deleted
-- with the auth user.
