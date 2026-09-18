# Little Gift Shop — Complete Full-Stack E-Commerce App

A complete Next.js + Prisma + Neon PostgreSQL e-commerce application:
customer storefront, cart/wishlist/checkout, authentication, and a
protected admin dashboard with real charts and full CRUD.

## What's included

### Storefront (customer-facing)
- **Home** — hero with a real custom video player, shop-by-occasion,
  featured products (live from the database), a countdown-timer offer
  banner, our-story video section, testimonials, Instagram gallery,
  newsletter signup (writes to the database)
- **Shop** (`/shop`) — live search, category/occasion/price/rating
  filters, sorting, pagination
- **Product detail** (`/shop/[slug]`) — image + video gallery, quantity
  selector, working Add to Cart / Buy Now / Wishlist, a review form,
  related products
- **Occasions** (`/occasions`, `/occasions/[slug]`) — browse gifts by
  occasion
- **About** (`/about`), **Blog** (`/blog`, `/blog/[slug]`, published
  posts only, managed from the admin), **Contact** (`/contact`, a real
  form that saves to the database and shows up in the admin inbox)
- **Cart & Checkout** — guest carts in `localStorage`, signed-in carts
  in the database (merged automatically on login), real coupon
  validation, and an order-creation endpoint that re-validates prices
  and stock server-side before ever touching the database
- **Auth** — register, login, logout, forgot/reset password (JWTs via
  the Edge-compatible `jose` library, bcrypt-hashed passwords)
- **Account area** (`/account`, `/orders`, `/wishlist`, `/profile`)

### Admin dashboard (`/admin`)
Protected server-side by middleware (not just a hidden link) —
non-admins are redirected, no exceptions. Visually distinct from the
storefront: clean, minimal, no florals.

- **Dashboard** — live stats (revenue, orders, products, customers,
  pending/completed orders, low stock) and Recharts charts (revenue
  over time, orders over time, top products, sales by category) —
  every number comes from a real Prisma query, nothing hardcoded
- **Products** — full CRUD, real image upload (drag files in, they're
  saved to `public/uploads/products` and served locally), category/
  occasion assignment, featured/active toggles, video URL field
- **Categories & Occasions** — CRUD
- **Orders** — list with status filter, detail page with order-status
  and payment-status updates
- **Customers** — list with order count and lifetime spend, detail
  page with full order history
- **Reviews** — approve / reject / delete, pending-only filter (only
  approved reviews show on the storefront)
- **Coupons** — CRUD, percentage or fixed-amount discounts
- **Blog** — CRUD with a featured-image uploader and publish toggle
- **Newsletter** — subscriber list, search, CSV export
- **Messages** — contact-form submissions, mark read/unread, delete

## 1. Install

```bash
npm install
```

## 2. Set up Neon PostgreSQL

1. Create a free project at https://neon.tech
2. Copy the connection string it gives you
3. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and
   `AUTH_SECRET` (any long random string)

```bash
cp .env.example .env
```

## 3. Run Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

The seed script creates realistic products, categories, occasions,
reviews, customers, sample orders, two coupons, one blog post — and
prints your admin login (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
`.env`, or the defaults in `.env.example`). Use that to sign in and
visit `/admin`.

## 4. Add media assets

The site references these paths and renders gracefully if some are
missing:

```
public/videos/hero-gift.mp4
public/videos/gift-wrapping.mp4
public/videos/unboxing.mp4
public/videos/products/lavender-gift-box.mp4
public/videos/products/teddy-bear.mp4
public/videos/products/chocolate-box.mp4

public/images/video-posters/hero-gift-poster.jpg
public/images/video-posters/gift-wrapping-poster.jpg
public/images/video-posters/unboxing-poster.jpg
public/images/offer-giftbox.jpg
public/images/avatars/sarah.jpg, ali.jpg, ayesha.jpg, bilal.jpg
public/images/instagram/1.jpg ... 6.jpg
public/images/<product-slug>.jpg   (one per seeded product)
```

Product images added through the admin panel upload automatically to
`public/uploads/products/` — no manual step needed for those.

## 5. Run it

```bash
npm run dev
```

Visit http://localhost:3000 for the storefront, http://localhost:3000/admin
for the dashboard (sign in with the admin account first).

## Commands

```
npm run dev            # local development
npm run build          # production build
npm start               # production start
npx prisma studio      # browse your Neon data visually
npm run db:seed        # re-seed (wipes and recreates sample data)
```

## Notes on things that need a real provider before going live

- **Email**: password reset generates a real, signed, expiring token.
  In development it's printed to the server console and returned in
  the API response so the flow is testable. Wire up a real provider
  (Resend, SendGrid, etc.) in `app/api/auth/forgot-password/route.js`.
- **Online payments**: checkout supports Cash on Delivery for real.
  The "Online Payment" option is visibly disabled rather than faked —
  wire up Stripe or a local gateway when you're ready, then enable it.
- **Image uploads on serverless hosting**: `/api/admin/upload` writes
  to the local filesystem, which works for a traditional Node server
  (`next start` on a VM) but not on read-only serverless platforms
  like Vercel. Swap it for S3, Cloudinary, or Vercel Blob before
  deploying there.

## Project structure

```
app/
  (site)/          customer-facing pages + layout (storefront chrome)
  admin/            admin dashboard pages + layout (dashboard chrome)
  api/              all API routes (public, account, admin)
components/         shared UI components
  admin/             admin-only UI components
hooks/               React contexts (auth, cart, wishlist)
lib/                 prisma client, auth helpers, session helpers
prisma/              schema + seed script
public/              images, videos, uploads
```

The app uses two nested root-adjacent layouts under one true root
layout (`app/layout.js`, fonts + `<html>`/`<body>` only): `app/(site)/
layout.js` adds the storefront navbar/footer/providers, and `app/admin/
layout.js` adds the dashboard sidebar/topbar. This is what makes the
admin panel look completely different from the storefront while still
sharing one Next.js app.
