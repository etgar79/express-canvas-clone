DROP POLICY IF EXISTS "site can submit ratings" ON public.script_ratings;
CREATE POLICY "site can submit valid ratings" ON public.script_ratings FOR INSERT TO anon, authenticated
WITH CHECK (rating IN (-1, 1) AND length(message_hash) BETWEEN 1 AND 128 AND (script_name IS NULL OR length(script_name) <= 200) AND (user_role IS NULL OR length(user_role) <= 50));
DROP POLICY IF EXISTS "site can log usage" ON public.script_usage;
CREATE POLICY "site can log valid usage" ON public.script_usage FOR INSERT TO anon, authenticated
WITH CHECK (length(script_name) BETWEEN 1 AND 200 AND length(event_type) BETWEEN 1 AND 50 AND (user_role IS NULL OR length(user_role) <= 50));