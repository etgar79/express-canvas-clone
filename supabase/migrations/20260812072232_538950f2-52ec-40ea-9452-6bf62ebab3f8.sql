-- alert_settings: server-only
DROP POLICY IF EXISTS "anyone can insert alert_settings" ON public.alert_settings;
DROP POLICY IF EXISTS "anyone can read alert_settings" ON public.alert_settings;
DROP POLICY IF EXISTS "anyone can update alert_settings" ON public.alert_settings;
REVOKE ALL ON public.alert_settings FROM anon, authenticated;
GRANT ALL ON public.alert_settings TO service_role;
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

-- bot_usage_counter: server-only reads
DROP POLICY IF EXISTS "anyone can read usage counter" ON public.bot_usage_counter;
REVOKE ALL ON public.bot_usage_counter FROM anon, authenticated;
GRANT ALL ON public.bot_usage_counter TO service_role;
ALTER TABLE public.bot_usage_counter ENABLE ROW LEVEL SECURITY;

-- endpoint_groups: server-only
DROP POLICY IF EXISTS "anyone can delete endpoint_groups" ON public.endpoint_groups;
DROP POLICY IF EXISTS "anyone can insert endpoint_groups" ON public.endpoint_groups;
DROP POLICY IF EXISTS "anyone can read endpoint_groups" ON public.endpoint_groups;
DROP POLICY IF EXISTS "anyone can update endpoint_groups" ON public.endpoint_groups;
REVOKE ALL ON public.endpoint_groups FROM anon, authenticated;
GRANT ALL ON public.endpoint_groups TO service_role;
ALTER TABLE public.endpoint_groups ENABLE ROW LEVEL SECURITY;

-- endpoints_metadata: server-only
DROP POLICY IF EXISTS "anyone can delete endpoints_metadata" ON public.endpoints_metadata;
DROP POLICY IF EXISTS "anyone can insert endpoints_metadata" ON public.endpoints_metadata;
DROP POLICY IF EXISTS "anyone can read endpoints_metadata" ON public.endpoints_metadata;
DROP POLICY IF EXISTS "anyone can update endpoints_metadata" ON public.endpoints_metadata;
REVOKE ALL ON public.endpoints_metadata FROM anon, authenticated;
GRANT ALL ON public.endpoints_metadata TO service_role;
ALTER TABLE public.endpoints_metadata ENABLE ROW LEVEL SECURITY;

-- script_executions: server-only
DROP POLICY IF EXISTS "anyone can insert script_executions" ON public.script_executions;
DROP POLICY IF EXISTS "anyone can read script_executions" ON public.script_executions;
DROP POLICY IF EXISTS "anyone can update script_executions" ON public.script_executions;
REVOKE ALL ON public.script_executions FROM anon, authenticated;
GRANT ALL ON public.script_executions TO service_role;
ALTER TABLE public.script_executions ENABLE ROW LEVEL SECURITY;

-- script_ratings: write-only from the site, no reads
DROP POLICY IF EXISTS "anyone can read ratings" ON public.script_ratings;
DROP POLICY IF EXISTS "anyone can insert ratings" ON public.script_ratings;
REVOKE ALL ON public.script_ratings FROM anon, authenticated;
GRANT INSERT ON public.script_ratings TO anon, authenticated;
GRANT ALL ON public.script_ratings TO service_role;
ALTER TABLE public.script_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site can submit ratings" ON public.script_ratings FOR INSERT TO anon, authenticated WITH CHECK (true);

-- script_usage: write-only from the site, no reads
DROP POLICY IF EXISTS "anyone can read usage" ON public.script_usage;
DROP POLICY IF EXISTS "anyone can insert usage" ON public.script_usage;
REVOKE ALL ON public.script_usage FROM anon, authenticated;
GRANT INSERT ON public.script_usage TO anon, authenticated;
GRANT ALL ON public.script_usage TO service_role;
ALTER TABLE public.script_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site can log usage" ON public.script_usage FOR INSERT TO anon, authenticated WITH CHECK (true);