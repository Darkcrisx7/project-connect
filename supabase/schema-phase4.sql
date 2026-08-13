-- ============================================================================
-- Project Connect — Phase 4 schema (Pro subscription via Razorpay)
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run
-- (Phase 1, 2, 3 schemas must already be applied.)
-- ============================================================================

alter table public.profiles
  add column if not exists premium_until timestamptz;

-- is_premium already exists (Phase 1) but was never actually used until now —
-- kept as a fast boolean check; premium_until is the source of truth for
-- expiry. A row is genuinely premium only when premium_until is in the future.

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  amount_paise int not null,
  status text not null default 'created', -- created | paid | failed
  created_at timestamptz not null default now()
);

create index payments_user_idx on public.payments (user_id);

alter table public.payments enable row level security;

-- Users can see their own payment history only.
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies for regular users — all writes happen
-- through the server routes using the service role key, since payment
-- verification must not be something the client can fake.
