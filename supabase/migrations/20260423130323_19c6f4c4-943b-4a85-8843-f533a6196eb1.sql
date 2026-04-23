-- Endpoints metadata: custom info per Action1 endpoint
CREATE TABLE public.endpoints_metadata (
  endpoint_id TEXT NOT NULL PRIMARY KEY,
  endpoint_name TEXT NOT NULL,
  alias TEXT,
  office TEXT,
  client TEXT,
  contact_phone TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  group_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.endpoints_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read endpoints_metadata"
  ON public.endpoints_metadata FOR SELECT USING (true);
CREATE POLICY "anyone can insert endpoints_metadata"
  ON public.endpoints_metadata FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update endpoints_metadata"
  ON public.endpoints_metadata FOR UPDATE USING (true);
CREATE POLICY "anyone can delete endpoints_metadata"
  ON public.endpoints_metadata FOR DELETE USING (true);

CREATE INDEX idx_endpoints_metadata_office ON public.endpoints_metadata(office);
CREATE INDEX idx_endpoints_metadata_client ON public.endpoints_metadata(client);
CREATE INDEX idx_endpoints_metadata_group ON public.endpoints_metadata(group_id);

-- Endpoint groups: custom groupings (e.g. "Tel Aviv office")
CREATE TABLE public.endpoint_groups (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.endpoint_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read endpoint_groups"
  ON public.endpoint_groups FOR SELECT USING (true);
CREATE POLICY "anyone can insert endpoint_groups"
  ON public.endpoint_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update endpoint_groups"
  ON public.endpoint_groups FOR UPDATE USING (true);
CREATE POLICY "anyone can delete endpoint_groups"
  ON public.endpoint_groups FOR DELETE USING (true);

-- Script executions: full history of script runs
CREATE TABLE public.script_executions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  script_name TEXT NOT NULL,
  endpoint_id TEXT,
  endpoint_name TEXT,
  endpoint_alias TEXT,
  group_id UUID,
  group_name TEXT,
  job_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  user_role TEXT,
  triggered_by TEXT,
  result_summary TEXT,
  error_message TEXT,
  duration_ms INTEGER,
  alert_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.script_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read script_executions"
  ON public.script_executions FOR SELECT USING (true);
CREATE POLICY "anyone can insert script_executions"
  ON public.script_executions FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update script_executions"
  ON public.script_executions FOR UPDATE USING (true);

CREATE INDEX idx_executions_created ON public.script_executions(created_at DESC);
CREATE INDEX idx_executions_status ON public.script_executions(status);
CREATE INDEX idx_executions_script ON public.script_executions(script_name);
CREATE INDEX idx_executions_endpoint ON public.script_executions(endpoint_id);

-- Alert settings: email notification preferences
CREATE TABLE public.alert_settings (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  recipient_email TEXT,
  config JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read alert_settings"
  ON public.alert_settings FOR SELECT USING (true);
CREATE POLICY "anyone can insert alert_settings"
  ON public.alert_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update alert_settings"
  ON public.alert_settings FOR UPDATE USING (true);

-- Default settings
INSERT INTO public.alert_settings (alert_type, enabled, recipient_email) VALUES
  ('script_failure', true, NULL),
  ('weekly_report', true, NULL);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_endpoints_metadata_updated_at
  BEFORE UPDATE ON public.endpoints_metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_endpoint_groups_updated_at
  BEFORE UPDATE ON public.endpoint_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_settings_updated_at
  BEFORE UPDATE ON public.alert_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();