
CREATE TABLE public.script_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_hash TEXT NOT NULL,
  script_name TEXT,
  rating SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
  user_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (message_hash)
);

CREATE TABLE public.script_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  script_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('suggested', 'copied', 'run', 'explained')),
  user_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_script_usage_name ON public.script_usage (script_name);
CREATE INDEX idx_script_usage_created ON public.script_usage (created_at DESC);

ALTER TABLE public.script_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_usage ENABLE ROW LEVEL SECURITY;

-- Public can insert ratings/usage events (chatbot is anonymous)
CREATE POLICY "anyone can insert ratings" ON public.script_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can insert usage" ON public.script_usage FOR INSERT WITH CHECK (true);

-- Public can read aggregate data (needed for analytics dashboard later, harmless data)
CREATE POLICY "anyone can read ratings" ON public.script_ratings FOR SELECT USING (true);
CREATE POLICY "anyone can read usage" ON public.script_usage FOR SELECT USING (true);
