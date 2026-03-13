# Handoff Document — The Vintage Prague

## Project Summary
Full-stack vintage fashion e-commerce site. Next.js 15 + Supabase + Stripe + Tailwind.

## Repo
https://github.com/HyunJung-Kim-2/the-vintage-prague-web

## Design Decisions
- Black bg (#0A0A0A), burgundy accent (#6D1A2A), off-white text (#F0EDE8)
- Cormorant Garant (serif headings) + Inter (body)
- Route groups: `(shop)`, `(auth)`, `(admin)`
- Cart: Zustand + localStorage (no server sync)
- Auth: Supabase email/password + Google OAuth
- Payment: Stripe Checkout (hosted), EUR/CZK
- Admin: role-based via `profiles.role = 'admin'`

## Environment Variables
Already in `.env.local` (not committed). See `.env.local.example` for keys needed.
- Supabase URL: https://zuczcxobuakvuhmvdhrw.supabase.co
- Stripe: placeholder for now, set up later

## Current Status
See `docs/plans/2026-03-13-vintage-prague-implementation.md` for the full plan.

### Completed
- [x] Task 1: Next.js 15 init + all dependencies installed
- [x] Task 2-3: Tailwind vintage theme + .env.local.example

### In Progress
- [ ] Task 4-6: Supabase schema SQL + client utils + middleware

### Remaining (in order)
- [ ] Task 7-9: Auth pages (login, signup, Google OAuth callback)
- [ ] Task 10-14: Header, Footer, CartStore (Zustand), shop layout
- [ ] Task 15-17: Homepage, product listing, product detail
- [ ] Task 18-21: Cart page, Stripe Checkout API, webhook, success page
- [ ] Task 22-23: Account page (addresses), order history
- [ ] Task 24-28: Admin panel (dashboard, product CRUD + image upload, orders)
- [ ] Task 29: next.config.ts image domains

## How to Continue with Codex

```bash
cd /Users/hj/the-vintage-prague
codex
```

Then paste this prompt:
> "Continue implementing The Vintage Prague e-commerce site. Read docs/HANDOFF.md and docs/plans/2026-03-13-vintage-prague-implementation.md to understand what's done and what's next. Work through the remaining tasks in order, committing after each one."

## Key Files to Know
- `docs/plans/2026-03-13-vintage-prague-implementation.md` — full implementation plan with exact code
- `types/database.ts` — TypeScript types (to be created in Task 4-6)
- `lib/supabase/` — Supabase clients (to be created in Task 4-6)
- `supabase/schema.sql` — DB schema to run in Supabase SQL Editor

## Supabase Notes
- Run `supabase/schema.sql` manually in Supabase Dashboard → SQL Editor
- Create `product-images` storage bucket (public) in Supabase Dashboard → Storage
- Enable Google OAuth in Supabase Dashboard → Authentication → Providers

## Stripe Notes
- Add real keys to `.env.local` when ready
- Webhook endpoint: `POST /api/webhooks/stripe`
- Event to listen: `checkout.session.completed`
