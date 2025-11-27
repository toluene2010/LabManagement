-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  first_name text,
  last_name text,
  department text,
  role text check (role in ('admin', 'qa_manager', 'analyst', 'reviewer')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  generic_name text,
  code text unique not null,
  type text not null,
  category text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TEST METHODS
create table if not exists public.test_methods (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  code text unique not null,
  version text default '1.0',
  description text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SPECIFICATIONS
create table if not exists public.specifications (
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
create table if not exists public.samples (
  id uuid default uuid_generate_v4() primary key,
  sample_id text unique not null,
  product_id uuid references public.products(id),
  batch_number text not null,
  batch_size text,
  manufacturing_date date,
  expiry_date date,
  received_date date default current_date,
  status text default 'pending',
  priority text default 'normal',
  analyst_id uuid references public.profiles(id),
  reviewer_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TEST RESULTS
create table if not exists public.test_results (
  id uuid default uuid_generate_v4() primary key,
  sample_id uuid references public.samples(id) on delete cascade,
  test_method_id uuid references public.test_methods(id),
  parameter text,
  result_value text,
  result_numeric numeric,
  status text default 'pending',
  tested_by uuid references public.profiles(id),
  tested_at timestamp with time zone,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. DEVIATIONS
create table if not exists public.deviations (
  id uuid default uuid_generate_v4() primary key,
  deviation_number text unique not null,
  title text not null,
  description text,
  type text,
  severity text,
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
create table if not exists public.stability_studies (
  id uuid default uuid_generate_v4() primary key,
  study_number text unique not null,
  product_id uuid references public.products(id),
  batch_number text not null,
  study_type text,
  storage_condition text,
  start_date date,
  status text default 'active',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. STABILITY TIME POINTS
create table if not exists public.stability_time_points (
  id uuid default uuid_generate_v4() primary key,
  study_id uuid references public.stability_studies(id) on delete cascade,
  time_point_label text,
  scheduled_date date,
  actual_date date,
  status text default 'pending',
  observations text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Base Tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.test_methods enable row level security;
alter table public.specifications enable row level security;
alter table public.samples enable row level security;
alter table public.test_results enable row level security;
alter table public.deviations enable row level security;
alter table public.stability_studies enable row level security;
alter table public.stability_time_points enable row level security;
alter table public.audit_logs enable row level security;

-- Allow read access to authenticated users
create policy "Public read access_profiles" on public.profiles
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_products" on public.products
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_test_methods" on public.test_methods
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_specifications" on public.specifications
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_samples" on public.samples
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_test_results" on public.test_results
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_deviations" on public.deviations
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_stability_studies" on public.stability_studies
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Public read access_stability_time_points" on public.stability_time_points
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

-- Allow insert/update for authenticated users on products
create policy "Authenticated insert_products" on public.products
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_products" on public.products
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

-- ==========================================
-- UPDATES AND NEW TABLES
-- ==========================================

-- 0. MIGRATION UPDATES (from supabase_schema_migration.sql)
-- Add missing fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS material_type text DEFAULT 'finished_product',
ADD COLUMN IF NOT EXISTS dosage_form text,
ADD COLUMN IF NOT EXISTS packaging_type text,
ADD COLUMN IF NOT EXISTS schema_id uuid,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Add missing fields to test_methods table
ALTER TABLE public.test_methods
ADD COLUMN IF NOT EXISTS result_schema_id uuid,
ADD COLUMN IF NOT EXISTS acceptance_criteria text,
ADD COLUMN IF NOT EXISTS procedure text,
ADD COLUMN IF NOT EXISTS equipment jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS reagents jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Add missing fields to specifications table
ALTER TABLE public.specifications
ADD COLUMN IF NOT EXISTS lsl numeric,
ADD COLUMN IF NOT EXISTS usl numeric,
ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS effective_date date DEFAULT current_date,
ADD COLUMN IF NOT EXISTS expiry_date date,
ADD COLUMN IF NOT EXISTS frequency text;

-- Update specifications to use lsl/usl as primary, keep min/max for compatibility
UPDATE public.specifications SET lsl = min_value WHERE lsl IS NULL;
UPDATE public.specifications SET usl = max_value WHERE usl IS NULL;

-- 1. CAPAS TABLE
create table if not exists public.capas (
  id uuid default uuid_generate_v4() primary key,
  capa_number text unique not null,
  type text not null, -- 'corrective', 'preventive'
  title text not null,
  description text,
  status text default 'open',
  deviation_id uuid references public.deviations(id),
  action_plan text,
  responsible_person text,
  target_date date,
  implementation_details text,
  implemented_by uuid references public.profiles(id),
  implementation_date timestamp with time zone,
  verification_method text,
  verified_by uuid references public.profiles(id),
  verification_date timestamp with time zone,
  verification_comments text,
  effectiveness_check jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  closed_by uuid references public.profiles(id),
  closed_at timestamp with time zone
);

alter table public.capas enable row level security;

create policy "Public read access_capas" on public.capas
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_capas" on public.capas
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_capas" on public.capas
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_capas" on public.capas
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 2. DEVIATIONS UPDATES
alter table public.deviations add column if not exists investigation text;
alter table public.deviations add column if not exists immediate_action text;
alter table public.deviations add column if not exists impact_assessment text;

-- 3. STABILITY PROTOCOLS
create table if not exists public.stability_protocols (
  id uuid default uuid_generate_v4() primary key,
  protocol_number text unique not null,
  title text not null,
  study_type text,
  storage_conditions jsonb,
  time_points jsonb,
  test_methods jsonb,
  sampling_plan text,
  acceptance_criteria text,
  status text default 'draft',
  approved_by uuid references public.profiles(id),
  approved_date timestamp with time zone,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.stability_protocols enable row level security;

create policy "Public read access_stability_protocols" on public.stability_protocols
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_stability_protocols" on public.stability_protocols
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_stability_protocols" on public.stability_protocols
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_stability_protocols" on public.stability_protocols
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 4. STABILITY TEST RESULTS
create table if not exists public.stability_test_results (
  id uuid default uuid_generate_v4() primary key,
  time_point_id uuid references public.stability_time_points(id) on delete cascade,
  test_method_id uuid references public.test_methods(id),
  parameter text,
  result_value text,
  unit text,
  specification text,
  status text,
  remarks text,
  tested_by uuid references public.profiles(id),
  tested_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.stability_test_results enable row level security;

create policy "Public read access_stability_test_results" on public.stability_test_results
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_stability_test_results" on public.stability_test_results
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_stability_test_results" on public.stability_test_results
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_stability_test_results" on public.stability_test_results
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 5. STABILITY STUDIES UPDATES
alter table public.stability_studies add column if not exists protocol_id uuid references public.stability_protocols(id);

-- 6. R&D STUDIES
create table if not exists public.rd_studies (
  id uuid default uuid_generate_v4() primary key,
  study_number text unique not null,
  study_title text not null,
  study_type text,
  product_id uuid references public.products(id),
  status text default 'planning',
  objective text,
  start_date date,
  end_date date,
  lead_scientist uuid references public.profiles(id),
  team_members jsonb, -- Array of UUIDs or names
  parameters jsonb, -- Array of parameter objects
  conclusions text,
  recommendations text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.rd_studies enable row level security;
create policy "Public read access_rd_studies" on public.rd_studies
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_rd_studies" on public.rd_studies
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_rd_studies" on public.rd_studies
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_rd_studies" on public.rd_studies
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 7. R&D DISSOLUTION PROFILES
create table if not exists public.rd_dissolution_profiles (
  id uuid default uuid_generate_v4() primary key,
  rd_study_id uuid references public.rd_studies(id) on delete cascade,
  sample_id text, -- Can be text description or ID
  sample_description text,
  batch_number text,
  test_date date,
  medium text,
  apparatus text,
  rpm numeric,
  temperature numeric,
  time_points jsonb, -- Array of {time, percentDissolved}
  tested_by uuid references public.profiles(id),
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.rd_dissolution_profiles enable row level security;
create policy "Public read access_rd_dissolution_profiles" on public.rd_dissolution_profiles
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_rd_dissolution_profiles" on public.rd_dissolution_profiles
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_rd_dissolution_profiles" on public.rd_dissolution_profiles
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_rd_dissolution_profiles" on public.rd_dissolution_profiles
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 8. R&D COMPARABILITY ANALYSES
create table if not exists public.rd_comparability_analyses (
  id uuid default uuid_generate_v4() primary key,
  rd_study_id uuid references public.rd_studies(id) on delete cascade,
  analysis_title text,
  reference_profile_id uuid references public.rd_dissolution_profiles(id),
  test_profile_ids jsonb, -- Array of UUIDs
  comparison_method text,
  f1_value numeric,
  f2_value numeric,
  conclusion text,
  analysis_date date,
  analyzed_by uuid references public.profiles(id),
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.rd_comparability_analyses enable row level security;
create policy "Public read access_rd_comparability_analyses" on public.rd_comparability_analyses
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_rd_comparability_analyses" on public.rd_comparability_analyses
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_rd_comparability_analyses" on public.rd_comparability_analyses
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_rd_comparability_analyses" on public.rd_comparability_analyses
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 9. INSTRUMENTS
create table if not exists public.instruments (
  id uuid default uuid_generate_v4() primary key,
  instrument_number text unique not null,
  name text not null,
  manufacturer text,
  model text,
  serial_number text,
  status text default 'active',
  location text,
  calibration_type text,
  last_calibration_date date,
  next_calibration_date date,
  calibration_frequency integer,
  responsible_person text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.instruments enable row level security;
create policy "Public read access_instruments" on public.instruments
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_instruments" on public.instruments
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_instruments" on public.instruments
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_instruments" on public.instruments
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 10. REAGENTS
create table if not exists public.reagents (
  id uuid default uuid_generate_v4() primary key,
  catalog_number text,
  name text not null,
  manufacturer text,
  lot_number text,
  quantity numeric,
  unit text,
  status text default 'in_stock',
  received_date date,
  expiration_date date,
  storage_location text,
  storage_details text,
  minimum_stock numeric,
  reorder_level numeric,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.reagents enable row level security;
create policy "Public read access_reagents" on public.reagents
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_reagents" on public.reagents
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_reagents" on public.reagents
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_reagents" on public.reagents
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 11. GLASSWARE
create table if not exists public.glassware (
  id uuid default uuid_generate_v4() primary key,
  item_number text unique not null,
  name text not null,
  type text,
  size text,
  quantity integer,
  status text default 'available',
  location text,
  last_calibration_date date,
  next_calibration_date date,
  requires_calibration boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.glassware enable row level security;
create policy "Public read access_glassware" on public.glassware
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_glassware" on public.glassware
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_glassware" on public.glassware
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_glassware" on public.glassware
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 12. REFRIGERATOR ITEMS
create table if not exists public.refrigerator_items (
  id uuid default uuid_generate_v4() primary key,
  refrigerator_id text,
  refrigerator_name text,
  shelf_location text,
  item_type text,
  item_name text not null,
  lot_number text,
  quantity numeric,
  unit text,
  stored_date date,
  expiration_date date,
  temperature text,
  responsible_person text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.refrigerator_items enable row level security;
create policy "Public read access_refrigerator_items" on public.refrigerator_items
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_refrigerator_items" on public.refrigerator_items
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_refrigerator_items" on public.refrigerator_items
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_refrigerator_items" on public.refrigerator_items
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 13. REFERENCE SAMPLES
create table if not exists public.reference_samples (
  id uuid default uuid_generate_v4() primary key,
  reference_number text unique not null,
  name text not null,
  type text,
  manufacturer text,
  lot_number text,
  catalog_number text,
  quantity numeric,
  unit text,
  received_date date,
  expiration_date date,
  storage_location text,
  storage_details text,
  certificate_number text,
  purity text,
  status text default 'active',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.reference_samples enable row level security;
create policy "Public read access_reference_samples" on public.reference_samples
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_reference_samples" on public.reference_samples
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_reference_samples" on public.reference_samples
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_reference_samples" on public.reference_samples
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));

-- 14. SOPS
create table if not exists public.sops (
  id uuid default uuid_generate_v4() primary key,
  sop_number text unique not null,
  title text not null,
  version text,
  department text,
  effective_date date,
  review_date date,
  next_review_date date,
  review_frequency integer,
  status text default 'active',
  author text,
  approver text,
  approval_date date,
  description text,
  file_path text,
  related_sops jsonb, -- Array of strings
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.sops enable row level security;
create policy "Public read access_sops" on public.sops
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_sops" on public.sops
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_sops" on public.sops
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_sops" on public.sops
  for delete
  to authenticated
  using ((auth.role() = 'authenticated'));