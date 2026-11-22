ALTER TABLE public.action1_install_attempts ADD COLUMN blocked_until timestamptz;
CREATE OR REPLACE FUNCTION public.record_action1_install_attempt(p_ip_hash text, p_success boolean)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE t timestamptz; reset_at timestamptz; lock_until timestamptz; failures integer;
BEGIN
 IF p_ip_hash IS NULL OR p_ip_hash !~ '^[0-9a-f]{64}$' OR p_success IS NULL THEN RAISE EXCEPTION 'Invalid input'; END IF;
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_ip_hash, 0));
 t := clock_timestamp();
 SELECT max(attempted_at) INTO reset_at FROM public.action1_install_attempts WHERE ip_hash=p_ip_hash AND result='success';
 SELECT max(blocked_until) INTO lock_until FROM public.action1_install_attempts WHERE ip_hash=p_ip_hash AND (reset_at IS NULL OR attempted_at > reset_at);
 IF lock_until > t THEN
  INSERT INTO public.action1_install_attempts(ip_hash,attempted_at,result) VALUES(p_ip_hash,t,'blocked');
  RETURN 429;
 END IF;
 SELECT count(*) INTO failures FROM public.action1_install_attempts WHERE ip_hash=p_ip_hash AND result='failure' AND attempted_at > t - interval '15 minutes' AND (reset_at IS NULL OR attempted_at > reset_at) AND (lock_until IS NULL OR attempted_at >= lock_until);
 INSERT INTO public.action1_install_attempts(ip_hash,attempted_at,result,blocked_until) VALUES(p_ip_hash,t,CASE WHEN p_success THEN 'success' ELSE 'failure' END,CASE WHEN NOT p_success AND failures >= 4 THEN t + interval '15 minutes' ELSE NULL END);
 IF p_success THEN RETURN 200; END IF;
 RETURN 401;
END; $$;
REVOKE ALL ON FUNCTION public.record_action1_install_attempt(text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_action1_install_attempt(text, boolean) TO service_role;