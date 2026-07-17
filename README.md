# Cary Grant Clothing — Production Website

Premium e-commerce website for Cary Grant Clothing (CGC), Est. 2002, Barrie, Ontario 🇨🇦

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy the example file and fill in your values:
```bash
cp .env.local.example .env.local
```

Open `.env.local` and add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your-resend-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase database
1. Go to your Supabase project → SQL Editor
2. Copy and paste the contents of `supabase-setup.sql`
3. Click **Run**
4. This creates all tables, policies, and the storage bucket

### 4. Create your admin account
1. Go to Supabase → Authentication → Users
2. Click **Invite User** (or Add User)
3. Enter: `cary@carygrantclothing.com`
4. Set a strong password
5. This is the owner's login for `/admin`

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Pages & URLs

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Hero, categories, new arrivals, story, testimonials |
| Shop | `/shop` | All products with filters |
| Product | `/product/[slug]` | Product detail with sizes, colors |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | 3-step checkout flow |
| About | `/about` | Brand story & timeline |
| Contact | `/contact` | Contact form |
| Sign in / Sign up | `/auth` | Customer authentication |
| My Account | `/account` | Profile & order history |
| **Admin Login** | `/admin` | Owner login (hidden from public) |
| **Admin Dashboard** | `/admin/dashboard` | Stats & recent orders |
| **Admin Products** | `/admin/products` | Add/edit/delete products |
| **Admin Orders** | `/admin/orders` | View & manage all orders |

---

## 🗄️ Supabase Setup

### Database Tables
- **products** — product catalogue (name, price, images, sizes, colors, category)
- **orders** — customer orders (full details, status tracking)
- **messages** — contact form submissions
- **newsletter** — email subscribers

### Storage
- Bucket: `product-images` (public)
- Admin uploads images via the admin dashboard
- Images are served from Supabase CDN

### Auth
- Customer auth: email/password signup via `/auth`
- Admin auth: created manually in Supabase dashboard
- Row Level Security (RLS) enabled on all tables

---

## 🔐 Admin Access

The owner accesses the admin at:
```
https://yourdomain.com/admin
```

**No link to admin anywhere on the public site.** The owner types the URL directly.

Login with the email/password created in Supabase → Authentication → Users.

### What the owner can do:
- ➕ **Add products** — upload images, set name, price, sizes, colors, category
- ✏️ **Edit products** — update any product details
- 🗑️ **Delete products** — with confirmation dialog
- 📦 **View orders** — full customer and item details
- 🔄 **Update order status** — Pending → Processing → Delivered
- 📞 **Contact customer** — quick email/call link on each order

---

## ✉️ Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com) (free — 100 emails/day)
2. Get your API key
3. Add to `.env.local`: `RESEND_API_KEY=re_...`

Emails sent:
- ✅ Order confirmation to customer (branded CGC template)
- ✅ New order notification to `cary@carygrantclothing.com`
- ✅ Contact form notification to owner

> **Note:** On the free Resend plan, emails send from `onboarding@resend.dev`. To send from `orders@carygrantclothing.com`, add and verify the domain in Resend dashboard.

---

## 🚀 Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — CGC production site"
git remote add origin https://github.com/yourusername/cary-grant-clothing.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repo
4. **Before deploying** — add all environment variables:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel domain e.g. `https://cgc.vercel.app` |

5. Click **Deploy**

### 3. Connect custom domain
1. Vercel → Project → Settings → Domains
2. Add `carygrantclothing.com`
3. Update DNS at your domain registrar
4. Vercel provides the exact DNS records to add

---

## 🎨 Design System

```
Colors:
  White     #FFFFFF   — primary background
  Bone      #FAF9F6   — secondary sections
  Ink       #141414   — text, hero, footer
  Red       #E0102A   — brand accent (CGC logo red)
  Slate     #6B6B6B   — body text
  Hairline  #E6E3DD   — borders, dividers

Fonts:
  Archivo Black  — hero headline ONLY
  Inter          — all body, nav, buttons, forms
  IBM Plex Mono  — prices + swing tags only

Radius:
  Buttons  8px   (.btn)
  Cards    12px  (.card)
  Modals   16px  (.modal)
  Pills    20px  (.pill)
```

---

## 💳 Payment

Currently using a **demo card form** — looks and feels real, saves orders to Supabase, sends confirmation emails, but does not charge a real card.

**To add real payments later:**
1. Create a Stripe account at [stripe.com/ca](https://stripe.com/ca) (must be Canadian business)
2. Replace `DemoCardPaymentForm` in `/app/checkout/page.tsx` with real Stripe Elements
3. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` to environment variables

---

## 📂 Project Structure

```
cary-grant-clothing/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── shop/               # Shop page
│   ├── product/[slug]/     # Product detail
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   ├── about/              # About / Our Story
│   ├── contact/            # Contact form
│   ├── auth/               # Login & signup
│   ├── account/            # Customer account
│   ├── admin/              # Admin dashboard (hidden)
│   └── api/                # API routes
├── components/
│   ├── home/               # Homepage sections
│   ├── ui/                 # Shared UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CartDrawer.tsx
│   ├── ProductCard.tsx
│   └── SiteLayout.tsx
├── lib/
│   ├── supabase.ts         # Supabase client & queries
│   ├── emails.ts           # Email templates
│   └── utils.ts            # Utilities & constants
├── store/
│   └── cart.ts             # Zustand cart store
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/
│   └── images/             # Logo & static assets
├── supabase-setup.sql      # Database setup script
└── .env.local.example      # Environment variables template
```

---

## 📞 Store Info

| | |
|---|---|
| **Address** | 54 Dunlop Street West, Main Floor, Barrie, Ontario |
| **Phone** | +1 705-717-1073 |
| **Email** | cary@carygrantclothing.com |
| **Hours** | Mon–Sat 10am–7pm · Sun 11am–5pm |
| **Instagram** | [@cgclthn](https://instagram.com/cgclthn) |
| **Twitter** | [@CG021](https://twitter.com/CG021) |

---

Built with ❤️ for the streets of Barrie, Ontario 🇨🇦
