-- Drop table if it exists to reset the schema definition
DROP TABLE IF EXISTS public.schemas;

-- Create schemas table to store entity and test result schemas
-- Changed id to text to support legacy IDs like 'schema_tablet'
create table public.schemas (
  id text primary key,
  name text not null,
  description text,
  version text default '1.0',
  schema_type text not null check (schema_type in ('entity', 'test_result')),
  fields jsonb not null default '[]',
  is_system boolean default false,
  status text default 'active' check (status in ('active', 'inactive', 'archived')),
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.schemas enable row level security;

-- RLS Policies
create policy "Public read access_schemas" on public.schemas
  for select
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated insert_schemas" on public.schemas
  for insert
  to authenticated
  with check ((auth.role() = 'authenticated'));

create policy "Authenticated update_schemas" on public.schemas
  for update
  to authenticated
  using ((auth.role() = 'authenticated'));

create policy "Authenticated delete_schemas" on public.schemas
  for delete
  to authenticated
  using ((auth.role() = 'authenticated') and (is_system = false));

-- Insert default schemas for common pharmaceutical dosage forms
INSERT INTO public.schemas (id, name, description, version, schema_type, fields, is_system, created_by)
VALUES 
(
  'schema_tablet',
  'Oral Solid - Tablet',
  'Schema for tablet products',
  '1.0',
  'entity',
  '[
    {"id": "f1", "name": "strength", "label": "Strength", "type": "text", "required": true, "unit": "mg"},
    {"id": "f2", "name": "shape", "label": "Shape", "type": "select", "required": true, "validation": {"options": ["Round", "Oval", "Oblong", "Capsule"]}},
    {"id": "f3", "name": "color", "label": "Color", "type": "text", "required": true},
    {"id": "f4", "name": "coating", "label": "Coating Type", "type": "select", "required": false, "validation": {"options": ["Film Coated", "Sugar Coated", "Enteric Coated", "Uncoated"]}},
    {"id": "f5", "name": "scoring", "label": "Scoring", "type": "boolean", "required": false}
  ]'::jsonb,
  true,
  NULL
),
(
  'schema_syrup',
  'Oral Liquid - Syrup',
  'Schema for syrup products',
  '1.0',
  'entity',
  '[
    {"id": "f1", "name": "concentration", "label": "Concentration", "type": "text", "required": true, "unit": "mg/mL"},
    {"id": "f2", "name": "volume", "label": "Pack Volume", "type": "number", "required": true, "unit": "mL", "validation": {"min": 0}},
    {"id": "f3", "name": "flavor", "label": "Flavor", "type": "text", "required": false},
    {"id": "f4", "name": "preservative", "label": "Preservative", "type": "text", "required": false},
    {"id": "f5", "name": "viscosity", "label": "Viscosity Range", "type": "text", "required": false, "unit": "cP"}
  ]'::jsonb,
  true,
  NULL
),
(
  'schema_cream',
  'Semi-Solid - Cream',
  'Schema for cream products',
  '1.0',
  'entity',
  '[
    {"id": "f1", "name": "concentration", "label": "Active Concentration", "type": "text", "required": true, "unit": "% w/w"},
    {"id": "f2", "name": "tubeSize", "label": "Tube Size", "type": "number", "required": true, "unit": "g", "validation": {"min": 0}},
    {"id": "f3", "name": "baseType", "label": "Base Type", "type": "select", "required": true, "validation": {"options": ["Oil-in-Water", "Water-in-Oil", "Absorption", "Emulsion"]}},
    {"id": "f4", "name": "appearance", "label": "Appearance", "type": "text", "required": true},
    {"id": "f5", "name": "pH", "label": "pH Range", "type": "text", "required": false}
  ]'::jsonb,
  true,
  NULL
),
(
  'test_schema_assay',
  'Assay Test',
  'Schema for assay test results',
  '1.0',
  'test_result',
  '[
    {"id": "r1", "name": "result", "label": "Assay Result", "type": "number", "required": true, "unit": "%", "validation": {"min": 0, "max": 120}, "helpText": "Percentage of labeled claim"},
    {"id": "r2", "name": "average", "label": "Average (n=3)", "type": "number", "required": true, "unit": "%"},
    {"id": "r3", "name": "rsd", "label": "RSD", "type": "number", "required": false, "unit": "%", "validation": {"min": 0, "max": 10}}
  ]'::jsonb,
  true,
  NULL
),
(
  'test_schema_dissolution',
  'Dissolution Test',
  'Schema for dissolution test results',
  '1.0',
  'test_result',
  '[
    {"id": "r1", "name": "time", "label": "Time Point", "type": "number", "required": true, "unit": "min"},
    {"id": "r2", "name": "q_value", "label": "Q Value", "type": "number", "required": true, "unit": "%", "validation": {"min": 0, "max": 100}},
    {"id": "r3", "name": "medium", "label": "Dissolution Medium", "type": "text", "required": true},
    {"id": "r4", "name": "apparatus", "label": "Apparatus", "type": "select", "required": true, "validation": {"options": ["USP I (Basket)", "USP II (Paddle)', 'USP III', 'USP IV"]}},
    {"id": "r5", "name": "rpm", "label": "RPM", "type": "number", "required": true, "validation": {"min": 0}}
  ]'::jsonb,
  true,
  NULL
),
(
  'test_schema_ph',
  'pH Test',
  'Schema for pH test results',
  '1.0',
  'test_result',
  '[
    {"id": "r1", "name": "ph_value", "label": "pH Value", "type": "number", "required": true, "validation": {"min": 0, "max": 14}},
    {"id": "r2", "name": "temperature", "label": "Temperature", "type": "number", "required": true, "unit": "°C"},
    {"id": "r3", "name": "instrument", "label": "pH Meter ID", "type": "text", "required": true}
  ]'::jsonb,
  true,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Create index for faster queries
create index if not exists idx_schemas_type on public.schemas(schema_type);
create index if not exists idx_schemas_status on public.schemas(status);
