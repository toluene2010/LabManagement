-- Create planned_deviations table
CREATE TABLE IF NOT EXISTS public.planned_deviations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deviation_number TEXT UNIQUE NOT NULL,
  date_raised TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  raised_by UUID REFERENCES public.profiles(id),
  department TEXT,
  type TEXT CHECK (type IN ('Planned', 'Unplanned')),
  description TEXT NOT NULL,
  justification TEXT,
  impact_assessment TEXT,
  risk_level TEXT CHECK (risk_level IN ('Low', 'Medium', 'High')),
  proposed_action TEXT,
  approver UUID REFERENCES public.profiles(id),
  approval_status TEXT DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  start_date DATE,
  end_date DATE,
  evidence_uploads TEXT, -- Store file paths/URLs
  closure_comment TEXT,
  closed_by UUID REFERENCES public.profiles(id),
  closed_date TIMESTAMP WITH TIME ZONE,
  capa_required BOOLEAN DEFAULT FALSE,
  linked_capa_id UUID, -- Assuming CAPA table exists, can reference it if needed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.planned_deviations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access_planned_deviations" ON public.planned_deviations
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert_planned_deviations" ON public.planned_deviations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update_planned_deviations" ON public.planned_deviations
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete_planned_deviations" ON public.planned_deviations
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Fix missing relationship in existing deviations table if needed
-- The error was "Could not find a relationship between 'deviations' and 'closed_by'"
-- We'll add the column if it doesn't exist or add the FK constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deviations' AND column_name = 'closed_by') THEN
        ALTER TABLE public.deviations ADD COLUMN closed_by UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_planned_deviations_status ON public.planned_deviations(approval_status);
CREATE INDEX IF NOT EXISTS idx_planned_deviations_number ON public.planned_deviations(deviation_number);
