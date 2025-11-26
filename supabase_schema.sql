-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  first_name text,
  last_name text,
  department text,
  role text check (role in ('admin', 'qa_manager', 'analyst', 'reviewer')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MASTER DATA: PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  generic_name text,
  code text unique not null,
  type text not null, -- 'raw_material', 'finished_product', 'packaging_material'
  category text, -- 'tablet', 'capsule', 'liquid', etc.
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MASTER DATA: TEST METHODS
create table public.test_methods (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  code text unique not null,
  version text default '1.0',
  description text,
  category text, -- 'chemical', 'physical', 'microbiological'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SPECIFICATIONS (Linking Products and Test Methods)
create table public.specifications (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  test_method_id uuid references public.test_methods(id),
  parameter text not null,
  specification_text text not null,
  min_value numeric,
  max_value numeric,
  target_value numeric,
  unit text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SAMPLES
create table public.samples (
  id uuid default uuid_generate_v4() primary key,
  sample_id text unique not null, -- Human readable ID e.g., 'S-2023-001'
  product_id uuid references public.products(id),
  batch_number text not null,
  batch_size text,
  manufacturing_date date,
  expiry_date date,
  received_date date default current_date,
  status text default 'pending', -- 'pending', 'in_progress', 'under_review', 'approved', 'rejected'
  priority text default 'normal',
  analyst_id uuid references public.profiles(id),
  reviewer_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TEST RESULTS
create table public.test_results (
  id uuid default uuid_generate_v4() primary key,
  sample_id uuid references public.samples(id) on delete cascade,
  test_method_id uuid references public.test_methods(id),
  parameter text,
  result_value text,
  result_numeric numeric, -- For trending/stats
  status text default 'pending', -- 'pass', 'fail', 'pending'
  tested_by uuid references public.profiles(id),
  tested_at timestamp with time zone,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. DEVIATIONS
create table public.deviations (
  id uuid default uuid_generate_v4() primary key,
  deviation_number text unique not null,
  title text not null,
  description text,
  type text, -- 'oos', 'oot', 'incident'
  severity text, -- 'critical', 'major', 'minor'
  status text default 'open',
  related_batch text,
  product_id uuid references public.products(id),
  reported_by uuid references public.profiles(id),
  reported_at timestamp with time zone default timezone('utc'::text, now()),
  root_cause text,
  capa text,
  closed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. STABILITY STUDIES
create table public.stability_studies (
  id uuid default uuid_generate_v4() primary key,
  study_number text unique not null,
  product_id uuid references public.products(id),
  batch_number text not null,
  study_type text, -- 'long_term', 'accelerated', etc.
  storage_condition text, -- '25C/60%RH', etc.
  start_date date,
  status text default 'active',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. STABILITY TIME POINTS
create table public.stability_time_points (
  id uuid default uuid_generate_v4() primary key,
  study_id uuid references public.stability_studies(id) on delete cascade,
  time_point_label text, -- '3 Months', '6 Months'
  scheduled_date date,
  actual_date date,
  status text default 'pending',
  observations text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. AUDIT LOGS
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies (Basic Setup)
alter table profiles enable row level security;
alter table products enable row level security;
alter table test_methods enable row level security;
alter table specifications enable row level security;
alter table samples enable row level security;
alter table test_results enable row level security;
alter table deviations enable row level security;
alter table stability_studies enable row level security;
alter table stability_time_points enable row level security;
alter table audit_logs enable row level security;

-- Allow read access to authenticated users for now
create policy "Public read access" on profiles for select using (auth.role() = 'authenticated');
create policy "Public read access" on products for select using (auth.role() = 'authenticated');
create policy "Public read access" on test_methods for select using (auth.role() = 'authenticated');
create policy "Public read access" on specifications for select using (auth.role() = 'authenticated');
create policy "Public read access" on samples for select using (auth.role() = 'authenticated');
create policy "Public read access" on test_results for select using (auth.role() = 'authenticated');
create policy "Public read access" on deviations for select using (auth.role() = 'authenticated');
create policy "Public read access" on stability_studies for select using (auth.role() = 'authenticated');
create policy "Public read access" on stability_time_points for select using (auth.role() = 'authenticated');

-- Allow insert/update for authenticated users (Refine this for production!)
create policy "Authenticated insert" on products for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on products for update using (auth.role() = 'authenticated');
-- ... (Repeat for other tables as needed)
