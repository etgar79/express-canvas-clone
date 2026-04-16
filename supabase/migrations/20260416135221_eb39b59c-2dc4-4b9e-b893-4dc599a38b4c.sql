CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO public.app_settings (key, value) VALUES
  ('ACTION1_CLIENT_ID', ''),
  ('ACTION1_CLIENT_SECRET', ''),
  ('ACTION1_ORG_ID', ''),
  ('TECH_PASSWORD', '06536368')
ON CONFLICT (key) DO NOTHING;