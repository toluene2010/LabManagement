-- ==========================================
-- ADD MISSING INSERT/UPDATE/DELETE POLICIES
-- This script adds the missing RLS policies so you can save data
-- Note: If a policy already exists, you'll see an error but it's safe to ignore
-- ==========================================

-- PROFILES
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Authenticated insert_profiles'
  ) THEN
    CREATE POLICY "Authenticated insert_profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Authenticated update_profiles'
  ) THEN
    CREATE POLICY "Authenticated update_profiles" ON public.profiles FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- TEST METHODS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_methods' AND policyname = 'Authenticated insert_test_methods'
  ) THEN
    CREATE POLICY "Authenticated insert_test_methods" ON public.test_methods FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_methods' AND policyname = 'Authenticated update_test_methods'
  ) THEN
    CREATE POLICY "Authenticated update_test_methods" ON public.test_methods FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_methods' AND policyname = 'Authenticated delete_test_methods'
  ) THEN
    CREATE POLICY "Authenticated delete_test_methods" ON public.test_methods FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- SPECIFICATIONS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'specifications' AND policyname = 'Authenticated insert_specifications'
  ) THEN
    CREATE POLICY "Authenticated insert_specifications" ON public.specifications FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'specifications' AND policyname = 'Authenticated update_specifications'
  ) THEN
    CREATE POLICY "Authenticated update_specifications" ON public.specifications FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'specifications' AND policyname = 'Authenticated delete_specifications'
  ) THEN
    CREATE POLICY "Authenticated delete_specifications" ON public.specifications FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- SAMPLES
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'samples' AND policyname = 'Authenticated insert_samples'
  ) THEN
    CREATE POLICY "Authenticated insert_samples" ON public.samples FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'samples' AND policyname = 'Authenticated update_samples'
  ) THEN
    CREATE POLICY "Authenticated update_samples" ON public.samples FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'samples' AND policyname = 'Authenticated delete_samples'
  ) THEN
    CREATE POLICY "Authenticated delete_samples" ON public.samples FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- TEST RESULTS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_results' AND policyname = 'Authenticated insert_test_results'
  ) THEN
    CREATE POLICY "Authenticated insert_test_results" ON public.test_results FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_results' AND policyname = 'Authenticated update_test_results'
  ) THEN
    CREATE POLICY "Authenticated update_test_results" ON public.test_results FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_results' AND policyname = 'Authenticated delete_test_results'
  ) THEN
    CREATE POLICY "Authenticated delete_test_results" ON public.test_results FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- DEVIATIONS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'deviations' AND policyname = 'Authenticated insert_deviations'
  ) THEN
    CREATE POLICY "Authenticated insert_deviations" ON public.deviations FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'deviations' AND policyname = 'Authenticated update_deviations'
  ) THEN
    CREATE POLICY "Authenticated update_deviations" ON public.deviations FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'deviations' AND policyname = 'Authenticated delete_deviations'
  ) THEN
    CREATE POLICY "Authenticated delete_deviations" ON public.deviations FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- STABILITY STUDIES
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stability_studies' AND policyname = 'Authenticated insert_stability_studies'
  ) THEN
    CREATE POLICY "Authenticated insert_stability_studies" ON public.stability_studies FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stability_studies' AND policyname = 'Authenticated update_stability_studies'
  ) THEN
    CREATE POLICY "Authenticated update_stability_studies" ON public.stability_studies FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stability_studies' AND policyname = 'Authenticated delete_stability_studies'
  ) THEN
    CREATE POLICY "Authenticated delete_stability_studies" ON public.stability_studies FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- STABILITY TIME POINTS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stability_time_points' AND policyname = 'Authenticated insert_stability_time_points'
  ) THEN
    CREATE POLICY "Authenticated insert_stability_time_points" ON public.stability_time_points FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stability_time_points' AND policyname = 'Authenticated update_stability_time_points'
  ) THEN
    CREATE POLICY "Authenticated update_stability_time_points" ON public.stability_time_points FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stability_time_points' AND policyname = 'Authenticated delete_stability_time_points'
  ) THEN
    CREATE POLICY "Authenticated delete_stability_time_points" ON public.stability_time_points FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- AUDIT LOGS (INSERT only)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Authenticated insert_audit_logs'
  ) THEN
    CREATE POLICY "Authenticated insert_audit_logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- PRODUCTS DELETE
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Authenticated delete_products'
  ) THEN
    CREATE POLICY "Authenticated delete_products" ON public.products FOR DELETE TO authenticated USING (auth.role() = 'authenticated');
  END IF;
END $$;
