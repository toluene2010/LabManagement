-- Add planned_deviation_id to capas table
ALTER TABLE public.capas 
ADD COLUMN IF NOT EXISTS planned_deviation_id UUID REFERENCES public.planned_deviations(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_capas_planned_deviation_id ON public.capas(planned_deviation_id);
