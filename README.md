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
