CREATE TABLE public.bot_usage_counter (
  period_key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.bot_usage_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read usage counter"
ON public.bot_usage_counter FOR SELECT
USING (true);

INSERT INTO public.app_settings (key, value) VALUES
  ('budget_daily_limit', '500'),
  ('budget_monthly_limit', '8000')
ON CONFLICT (key) DO NOTHING;