# The Vintage Prague — Design Document
_2026-03-13_

## Overview

A full-stack vintage fashion e-commerce site based in Prague, Czech Republic. Sells bags, clothing, shoes, and wallets. Operated by 1 owner with up to 3 admins.

## Tech Stack

- **Frontend/Backend**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Checkout (EUR/CZK)
- **Styling**: Tailwind CSS + vintage serif font (TBD, adjustable later)
- **Deployment**: Vercel

## Design System

- Background: `#0A0A0A`
- Accent: `#6D1A2A` (burgundy)
- Text: `#F0EDE8` (off-white)
- Typography: vintage serif for headings (to be finalized), Inter for body
- Mobile-first responsive

## Routing Structure

```
app/
├── (shop)/
│   ├── page.tsx                  # Homepage
│   ├── products/page.tsx         # Product listing (category tabs + search)
│   ├── products/[slug]/page.tsx  # Product detail + image carousel
│   ├── cart/page.tsx             # Cart page
│   ├── checkout/page.tsx         # Stripe Checkout redirect
│   ├── checkout/success/page.tsx # Order confirmation
│   └── account/
│       ├── page.tsx              # My page (addresses)
│       └── orders/page.tsx       # Order history
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (admin)/
│   └── admin/
│       ├── page.tsx              # Dashboard
│       ├── products/page.tsx     # Product list
│       ├── products/new/page.tsx # Create product
│       ├── products/[id]/page.tsx# Edit product
│       └── orders/page.tsx       # Order management
└── api/
    ├── checkout/route.ts         # Create Stripe Checkout session
    └── webhooks/stripe/route.ts  # Handle Stripe events
```

## Database Schema

### `profiles`
| column | type | notes |
|--------|------|-------|
| id | uuid | FK → auth.users |
| email | text | |
| full_name | text | |
| role | text | `'admin'` \| `'customer'` |
| created_at | timestamptz | |

### `products`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| slug | text | unique |
| description | text | |
| brand | text | |
| category | text | `bags` \| `clothing` \| `shoes` \| `wallets` |
| condition | text | `new` \| `s` \| `a` \| `b` |
| price | numeric | EUR |
| size | text | |
| stock | int | |
| is_active | bool | |
| created_at | timestamptz | |

### `product_images`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| url | text | Supabase Storage URL |
| position | int | 0–9, display order |
| created_at | timestamptz | |

### `addresses`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| label | text | e.g. "Home", "Work" |
| full_name | text | |
| line1 | text | |
| line2 | text | nullable |
| city | text | |
| postal_code | text | |
| country | text | |
| is_default | bool | |

### `orders`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users, nullable (guest) |
| stripe_session_id | text | |
| status | text | `pending` \| `paid` \| `shipped` \| `delivered` \| `cancelled` |
| total_amount | numeric | |
| currency | text | `EUR` \| `CZK` |
| shipping_address | jsonb | snapshot at time of order |
| created_at | timestamptz | |

### `order_items`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| order_id | uuid | FK → orders |
| product_id | uuid | FK → products |
| quantity | int | |
| price_at_purchase | numeric | |

## Key Decisions

| Topic | Decision |
|-------|----------|
| Language | English only |
| Auth | Email/password + Google OAuth |
| Payment | Stripe Checkout (hosted), EUR/CZK |
| Admin access | `role` column in profiles, up to 3 admins |
| Product images | Max 10 per product, Supabase Storage |
| Product filters | Category tabs + search bar (expandable later) |
| Cart | Dedicated `/cart` page, localStorage via Zustand |
| Shipping | To be configured later |
| i18n | None |

## Auth & Middleware

- Supabase Auth handles sessions via cookies (SSR-compatible)
- `middleware.ts` guards:
  - `/admin/*` → must have `role: 'admin'`
  - `/account/*` → must be logged in
- Supabase trigger auto-creates `profiles` row on signup
- Cart state: Zustand with localStorage persistence (no server sync)
