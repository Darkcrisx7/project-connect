-- Fix: payments inserts from the Cashfree integration were failing
-- silently. Root causes, discovered after a real ₹79 test payment
-- succeeded on Cashfree's side but never showed up in the app:
--
--   1. razorpay_order_id was still `not null` with no default. The
--      Cashfree code never sets this column, so every insert violated
--      the constraint and was rejected by Postgres.
--   2. cashfree_payment_id did not exist yet, even though gateway and
--      cashfree_order_id had already been added in an earlier change.
--
-- The insert in app/api/cashfree/create-order/route.ts doesn't check
-- for errors, so this failed silently — checkout looked fine, but no
-- payment row was ever created, and /api/cashfree/verify then
-- correctly reported "order not found."

alter table public.payments
  alter column razorpay_order_id drop not null;

alter table public.payments
  add column if not exists cashfree_payment_id text;

-- One real payment (UPI txn 004724233589, ₹79, 6 Sep 2026) was made
-- before this fix and had to be credited manually for
-- hraheebbasha@gmail.com once these columns were corrected.
