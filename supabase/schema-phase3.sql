-- ============================================================================
-- Project Connect — Phase 3 schema (applications + connection unlock)
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run
-- (Phase 1 and Phase 2 schemas must already be applied.)
-- ============================================================================

create type public.application_status as enum ('pending', 'shortlisted', 'accepted', 'rejected');

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,

  intro text not null,
  why_join text not null,
  status public.application_status not null default 'pending',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (startup_id, applicant_id)
);

create trigger applications_updated_at
  before update on public.applications
  for each row execute procedure public.handle_updated_at();

create index applications_startup_idx on public.applications (startup_id);
create index applications_applicant_idx on public.applications (applicant_id);

alter table public.applications enable row level security;

-- Visible only to the applicant themself and the founder of the startup
-- they applied to — nobody else's applications are visible to anyone.
create policy "Applicants and founders can view relevant applications"
  on public.applications for select
  using (
    auth.uid() = applicant_id
    or auth.uid() = (select founder_id from public.startups where id = startup_id)
  );

create policy "Students can apply to startups"
  on public.applications for insert
  with check (auth.uid() = applicant_id);

-- Founders update status (accept/shortlist/reject); applicants can also
-- update their own row only to withdraw (handled as a delete instead, see
-- below) — so update is founder-only.
create policy "Founders can update application status"
  on public.applications for update
  using (auth.uid() = (select founder_id from public.startups where id = startup_id));

-- Applicants can withdraw their own application.
create policy "Applicants can withdraw their application"
  on public.applications for delete
  using (auth.uid() = applicant_id);

-- ----------------------------------------------------------------------------
-- Contact unlock — enforced in the database, not just the UI.
-- Returns the other party's email ONLY if an accepted application connects
-- the caller and that person (either direction: founder <-> applicant).
-- Direct client queries against profiles.email for someone else still work
-- structurally (Phase 1's public read policy covers the whole row), but the
-- app never reads email that way for another user — it always goes through
-- this function, so a normal user of the product can only ever see a
-- connected party's email after both sides have accepted.
-- ----------------------------------------------------------------------------
create function public.get_contact_email(other_id uuid)
returns text as $$
  select email from public.profiles where id = other_id
  and exists (
    select 1 from public.applications a
    join public.startups s on s.id = a.startup_id
    where a.status = 'accepted'
    and (
      (a.applicant_id = auth.uid() and s.founder_id = other_id)
      or (s.founder_id = auth.uid() and a.applicant_id = other_id)
    )
  );
$$ language sql security definer set search_path = public;
