-- CRITICAL FIX: Change schema_id and result_schema_id to TEXT
-- This is required because the application uses string IDs (e.g., 'schema_syrup') 
-- which are NOT valid UUIDs. Without this, saving products/methods will fail or data will be lost.

-- 1. Fix Products Table
ALTER TABLE public.products 
ALTER COLUMN schema_id TYPE text;

-- 2. Fix Test Methods Table
ALTER TABLE public.test_methods 
ALTER COLUMN result_schema_id TYPE text;

-- 3. Verify the change (Optional, just for confirmation)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'schema_id';
