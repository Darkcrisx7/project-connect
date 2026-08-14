# Project Connect — Phase 0 (Foundation + Landing Page)

## What's in this drop
- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion
- `config/brand.ts` — every brand string/color/font in one file. Rename the
  startup by editing this file only.
- Full landing page: sticky glass nav + mobile bottom nav, animated hero
  (network graphic), how-it-works, startup discovery preview cards (sample
  Indian startups), animated stats band, testimonials, FAQ accordion, CTA,
  footer.
- Mobile-first: 48px touch targets, bottom nav bar, safe-area padding,
  reduced-motion support, PWA manifest.
- Design tokens for light + dark mode wired through CSS variables
  (`app/globals.css`) — dark mode toggle isn't wired to a button yet, that's
  Phase 1 alongside auth.

## Run it locally
```
npm install
npm run dev
```

## Deploy (matches your usual flow)
1. Push this folder to your GitHub repo (drag files into the GitHub web UI,
   or `git push` if you're comfortable with it).
2. Import the repo in Vercel — it auto-detects Next.js, no config needed.
3. No environment variables required yet (Phase 0 has no backend).

## Not built yet (coming in later phases)
- Auth (Google + email via Supabase), role selection
- Student profile, startup listing creation, discovery with filters
- Applications, founder dashboard, connection-request messaging
- Premium/Razorpay, notifications, admin panel
- Real PWA icons (192px/512px) — placeholders referenced in manifest.json

## Phase 1 — Auth + Profiles (added)

### Set up Supabase
1. Create a project at supabase.com and enable Google in Authentication > Providers.
2. Open the SQL Editor and run everything in `supabase/schema.sql` — this
   creates the `profiles` table, roles, RLS policies, and a trigger that
   auto-creates a profile row on signup.
3. Copy `.env.local.example` to `.env.local` and fill in your Project URL
   and anon key (also add both as Environment Variables in Vercel).

### What's wired up
- `/signup`, `/login` — Google OAuth + email/password (Supabase Auth)
- `/auth/callback` — OAuth/email-confirmation redirect handler
- `/onboarding/role` — Founder / Co-founder / Team member selection
- `/onboarding/profile` — full student profile form (college, skills,
  interests, availability, links)
- `/dashboard` — protected page proving the round trip works; also the
  landing spot for Phase 2 (startup listings + discovery)
- `middleware.ts` — refreshes the session on every request and redirects
  signed-out users away from `/dashboard` and `/onboarding`

### Still to build (Phase 2+)
- Startup listing creation + discovery with filters
- Applications + founder dashboard
- Connection-request messaging
- Premium/Razorpay, notifications, admin panel

## Phase 2 — Startup Listings + Discovery (added)

### Database
Run `supabase/schema-phase2.sql` in the Supabase SQL Editor (after Phase 1's
schema is already applied). This adds the `startups` table with RLS: anyone
can browse active listings, only the founder who created one can edit/delete it.

### What's wired up
- `/startups/new` — create a listing (protected, redirects to login if signed out)
- `/discover` — browse all active listings with search + filters (industry,
  stage, remote/hybrid/on-site, newest/oldest) — filters live in the URL so
  they're shareable/bookmarkable
- `/startups/[id]` — full listing detail page; shows an "Apply" button
  (disabled — wired up in Phase 3) or "This is your listing" if you're the founder
- Dashboard now shows "Post your idea" / "Browse startups" buttons and lists
  your own posted startups

### Still to build (Phase 3+)
- Applications (the Apply button becomes real)
- Founder dashboard: view/accept/reject/shortlist applicants
- Connection-request messaging
- Premium/Razorpay, notifications, admin panel

## Phase 3 — Applications + Founder Inbox + Contact Unlock (added)

### Database
Run `supabase/schema-phase3.sql` in the Supabase SQL Editor (after Phase 1
and Phase 2 schemas are already applied). This adds:
- `applications` table (student → startup, with intro/why-join/status)
- RLS so only the applicant and the founder of that startup can see an application
- A `get_contact_email()` database function — email is only ever returned
  when an accepted application connects the two people asking. This is
  enforced by the database itself, not just hidden in the UI.

### What's wired up
- `/startups/[id]` — real Apply button (inline form), shows your application
  status if you've already applied, lets you withdraw a pending one
- `/startups/[id]/applicants` — founder-only inbox for one listing: see each
  applicant's intro, why-join, skills, and Shortlist/Accept/Reject buttons.
  Contact details (email, GitHub, LinkedIn, portfolio) only appear once
  status is Accepted.
- `/applications` — student's "My Applications" list across every startup
  they've applied to, with the founder's email unlocked once accepted
- Dashboard now links to "My applications"; each of your own listings on
  the dashboard links through to /startups/[id] → "View applicants"

### Still to build (Phase 4+)
- Premium/Razorpay (unlimited applications, featured listings)
- Notifications (in-app, for status changes and new applications)
- Admin panel (approve listings, manage reports, platform settings)

## Phase 4 — Pro Subscription via Razorpay (added)

### Database
Run `supabase/schema-phase4.sql` (after Phases 1-3). Adds `premium_until` to
profiles and a `payments` table that records every order/payment attempt.

### New environment variables (add in Vercel too, then redeploy)
- `RAZORPAY_KEY_ID` — from Razorpay Dashboard > Settings > API Keys
- `RAZORPAY_KEY_SECRET` — same page (keep this secret, never commit it)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase Project Settings > API > service_role
  key (also secret — this one bypasses all RLS, never expose it to the client)

### What's wired up
- Single Pro tier: **₹79/month**, no free trial
- Free plan limits: 1 active listing, 3 applications/month — enforced in the
  server actions themselves (`createStartup`, `applyToStartup`), not just the UI
- Dashboard shows current plan status and an "Upgrade to Pro" button
  (Razorpay Checkout modal) when on the free plan, or "You're on Pro" with
  the renewal date when active
- Payment verification is done server-side via HMAC signature check — the
  client can never fake a successful payment
- Renewing early stacks on top of remaining days rather than wasting them

### Still to build (Phase 5+)
- Notifications (in-app, for status changes and new applications)
- Admin panel (approve listings, manage reports, platform settings)

### Known limitation
"Priority visibility" for Pro listings in Discover isn't implemented yet —
Pro currently only removes the free-tier limits. Ranked sorting (Pro
listings surfaced first) would need a join-aware sort and is a good Phase 5
candidate if you want it.
