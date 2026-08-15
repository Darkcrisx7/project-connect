-- ============================================================================
-- Project Connect — Phase 5 schema (notifications)
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run
-- (Phases 1-4 must already be applied.)
-- ============================================================================

create type public.notification_type as enum ('new_application', 'status_update', 'announcement');

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark their own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id);

-- No insert policy for regular users — every notification is created by a
-- trigger below (security definer, bypasses RLS), never by a client request.
-- This means nobody can forge a notification appearing to come from the
-- platform or another user.

-- ----------------------------------------------------------------------------
-- New application received → notify the founder
-- ----------------------------------------------------------------------------
create function public.notify_new_application()
returns trigger as $$
declare
  v_founder_id uuid;
  v_startup_name text;
begin
  select founder_id, name into v_founder_id, v_startup_name
  from public.startups where id = new.startup_id;

  insert into public.notifications (user_id, type, title, body, link)
  values (
    v_founder_id,
    'new_application',
    'New application for ' || v_startup_name,
    left(new.intro, 140),
    '/startups/' || new.startup_id || '/applicants'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_application_created
  after insert on public.applications
  for each row execute procedure public.notify_new_application();

-- ----------------------------------------------------------------------------
-- Application status changed → notify the applicant
-- ----------------------------------------------------------------------------
create function public.notify_application_status_change()
returns trigger as $$
declare
  v_startup_name text;
  v_title text;
begin
  if new.status is distinct from old.status and new.status in ('shortlisted', 'accepted', 'rejected') then
    select name into v_startup_name from public.startups where id = new.startup_id;

    v_title := case new.status
      when 'shortlisted' then 'You were shortlisted by ' || v_startup_name
      when 'accepted' then 'You were accepted by ' || v_startup_name || '! 🎉'
      when 'rejected' then 'Update on your application to ' || v_startup_name
    end;

    insert into public.notifications (user_id, type, title, body, link)
    values (
      new.applicant_id,
      'status_update',
      v_title,
      case when new.status = 'accepted' then 'Contact details are now unlocked — check your applications.' else null end,
      '/applications'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_application_status_changed
  after update on public.applications
  for each row execute procedure public.notify_application_status_change();
