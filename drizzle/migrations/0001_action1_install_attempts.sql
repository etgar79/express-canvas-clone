CREATE TABLE public.action1_install_attempts (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 ip_hash text NOT NULL CHECK (ip_hash ~ '^[0-9a-f]{64}$'),
 attempted_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 result text NOT NULL CHECK (result IN ('success','failure','blocked'))
);
GRANT ALL ON public.action1_install_attempts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.action1_install_attempts_id_seq TO service_role;
REVOKE ALL ON public.action1_install_attempts FROM anon, authenticated;
ALTER TABLE public.action1_install_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX action1_install_attempts_lookup ON public.action1_install_attempts(ip_hash, attempted_at DESC);
CREATE FUNCTION public.record_action1_install_attempt(p_ip_hash text, p_success boolean)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE t timestamptz; reset_at timestamptz; fifth_at timestamptz; failures integer;
BEGIN
 IF p_ip_hash IS NULL OR p_ip_hash !~ '^[0-9a-f]{64}$' OR p_success IS NULL THEN RAISE EXCEPTION 'Invalid input'; END IF;
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_ip_hash, 0));
 t := clock_timestamp();
 SELECT max(attempted_at) INTO reset_at FROM public.action1_install_attempts WHERE ip_hash=p_ip_hash AND result='success';
 SELECT count(*), max(attempted_at) INTO failures, fifth_at FROM public.action1_install_attempts WHERE ip_hash=p_ip_hash AND result='failure' AND attempted_at > t - interval '15 minutes' AND (reset_at IS NULL OR attempted_at > reset_at);
 IF failures >= 5 AND fifth_at > t - interval '15 minutes' THEN
  INSERT INTO public.action1_install_attempts(ip_hash,attempted_at,result) VALUES(p_ip_hash,t,'blocked');
  RETURN 429;
 END IF;
 INSERT INTO public.action1_install_attempts(ip_hash,attempted_at,result) VALUES(p_ip_hash,t,CASE WHEN p_success THEN 'success' ELSE 'failure' END);
 IF p_success THEN RETURN 200; END IF;
 RETURN 401;
END; $$;
REVOKE ALL ON FUNCTION public.record_action1_install_attempt(text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_action1_install_attempt(text, boolean) TO service_role;