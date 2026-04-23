-- Enable pg_cron and pg_net for scheduling weekly report
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove existing schedule if present (idempotent)
DO $$
DECLARE
  job_id BIGINT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'weekly-tech-report';
  IF job_id IS NOT NULL THEN
    PERFORM cron.unschedule(job_id);
  END IF;
END $$;

-- Schedule weekly-report every Sunday at 09:00 Asia/Jerusalem
-- (UTC offset: winter UTC+2 → 07:00 UTC, summer UTC+3 → 06:00 UTC)
-- Using 06:00 UTC as a reasonable compromise (closer to summer time)
SELECT cron.schedule(
  'weekly-tech-report',
  '0 6 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://pzjkrotlikvopslpdvof.supabase.co/functions/v1/weekly-report',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amtyb3RsaWt2b3BzbHBkdm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDkwMzIsImV4cCI6MjA3NzIyNTAzMn0.MUGLN3Xl6dhlR6LgCjP53AL0irvvRWs9MR8VWOfzQ78"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);