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

create policy "Public read access" on public.capas for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.capas for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.capas for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.capas for delete using (auth.role() = 'authenticated');

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

create policy "Public read access" on public.stability_protocols for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.stability_protocols for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.stability_protocols for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.stability_protocols for delete using (auth.role() = 'authenticated');

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

create policy "Public read access" on public.stability_test_results for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.stability_test_results for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.stability_test_results for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.stability_test_results for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.rd_studies for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.rd_studies for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.rd_studies for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.rd_studies for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.rd_dissolution_profiles for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.rd_dissolution_profiles for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.rd_dissolution_profiles for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.rd_dissolution_profiles for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.rd_comparability_analyses for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.rd_comparability_analyses for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.rd_comparability_analyses for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.rd_comparability_analyses for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.instruments for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.instruments for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.instruments for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.instruments for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.reagents for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.reagents for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.reagents for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.reagents for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.glassware for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.glassware for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.glassware for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.glassware for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.refrigerator_items for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.refrigerator_items for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.refrigerator_items for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.refrigerator_items for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.reference_samples for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.reference_samples for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.reference_samples for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.reference_samples for delete using (auth.role() = 'authenticated');

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
create policy "Public read access" on public.sops for select using (auth.role() = 'authenticated');
create policy "Authenticated insert" on public.sops for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update" on public.sops for update using (auth.role() = 'authenticated');
create policy "Authenticated delete" on public.sops for delete using (auth.role() = 'authenticated');
