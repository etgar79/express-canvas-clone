
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  resource_name TEXT,
  actor TEXT NOT NULL DEFAULT 'tech',
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_created ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_action ON public.audit_log (action);

CREATE TABLE public.bot_misses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  user_role TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_bot_misses_created ON public.bot_misses (created_at DESC);
CREATE INDEX idx_bot_misses_resolved ON public.bot_misses (resolved);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_misses ENABLE ROW LEVEL SECURITY;

-- Deny all direct access. Server-side edge functions use the service role and bypass RLS.
-- (No policies = no public access by default once RLS is enabled.)
