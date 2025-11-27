-- Change schema_id and result_schema_id to TEXT to support legacy/hardcoded schema IDs
ALTER TABLE public.products 
ALTER COLUMN schema_id TYPE text;

ALTER TABLE public.test_methods 
ALTER COLUMN result_schema_id TYPE text;
