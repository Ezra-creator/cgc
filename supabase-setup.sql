-- ============================================================
-- Cary Grant Clothing — Supabase Database Setup
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(10,2) not null,
  category text not null check (category in ('mens','womens','kids','african','activewear','accessories')),
  gender text not null check (gender in ('mens','womens','kids','unisex')),
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  in_stock boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Index for fast queries
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_products_in_stock on products(in_stock);
create index if not exists idx_products_slug on products(slug);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  email text not null,
  phone text default '',
  address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  country text default 'Canada',
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_status text default 'demo' check (payment_status in ('demo','paid','failed','refunded')),
  status text default 'pending' check (status in ('pending','processing','delivered','cancelled')),
  created_at timestamptz default now()
);

-- Index for email lookups (customer order history)
create index if not exists idx_orders_email on orders(email);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);

-- ============================================================
-- MESSAGES TABLE (contact form)
-- ============================================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- NEWSLETTER TABLE
-- ============================================================
create table if not exists newsletter (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Products: anyone can read, only authenticated admin can write
alter table products enable row level security;

create policy "Products are publicly readable"
  on products for select
  using (true);

create policy "Only authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Only authenticated users can update products"
  on products for update
  to authenticated
  using (true);

create policy "Only authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);

-- Orders: anyone can insert (place an order), only authenticated can read all
alter table orders enable row level security;

create policy "Anyone can place an order"
  on orders for insert
  with check (true);

create policy "Customers can view their own orders"
  on orders for select
  using (true);

create policy "Only authenticated users can update orders"
  on orders for update
  to authenticated
  using (true);

-- Messages: anyone can insert, only authenticated can read
alter table messages enable row level security;

create policy "Anyone can send a message"
  on messages for insert
  with check (true);

create policy "Only authenticated users can read messages"
  on messages for select
  to authenticated
  using (true);

-- Newsletter: anyone can subscribe
alter table newsletter enable row level security;

create policy "Anyone can subscribe to newsletter"
  on newsletter for insert
  with check (true);

create policy "Only authenticated users can read newsletter"
  on newsletter for select
  to authenticated
  using (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run this in Supabase Dashboard → Storage → New Bucket
-- Or via SQL:

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Product images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ============================================================
-- SAMPLE DATA (optional — remove before production)
-- ============================================================

-- Uncomment to add sample products for testing:
/*
insert into products (name, slug, description, price, category, gender, sizes, colors, in_stock, featured)
values
  (
    'CGC Eagle Hoodie — Grey',
    'cgc-eagle-hoodie-grey',
    'Premium heavyweight hoodie featuring the iconic CGC eagle logo. Made from 80% cotton, 20% polyester blend.',
    95.00,
    'mens',
    'mens',
    array['S','M','L','XL','XXL'],
    array['Grey','Orange'],
    true,
    true
  ),
  (
    'CGC Classic Hoodie — White',
    'cgc-classic-hoodie-white',
    'The original CGC hoodie that started it all. Clean white with the signature red CGC logo.',
    95.00,
    'mens',
    'mens',
    array['S','M','L','XL','XXL'],
    array['White'],
    true,
    true
  ),
  (
    'African Print Shirt',
    'african-print-shirt',
    'Bold African print long-sleeve shirt. Heritage meets streetwear.',
    68.00,
    'african',
    'mens',
    array['S','M','L','XL'],
    array['Multicolor'],
    true,
    true
  ),
  (
    'CGC Active Set — Navy',
    'cgc-active-set-navy',
    'Sports bra and shorts set with the CGC logo. Perfect for the gym or casual wear.',
    85.00,
    'activewear',
    'womens',
    array['XS','S','M','L','XL'],
    array['Navy'],
    true,
    true
  );
*/
