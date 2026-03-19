-- Create concierge_events table for analytics data collection
CREATE TABLE IF NOT EXISTS public.concierge_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event        TEXT        NOT NULL,
  concern_id   TEXT,
  concern_slug TEXT,
  product_id   TEXT,
  source       TEXT,
  page         TEXT,
  referrer     TEXT,
  session_id   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.concierge_events ENABLE ROW LEVEL SECURITY;

-- Anonymous users can insert events (needed for unauthenticated page-view tracking)
CREATE POLICY "anon_insert_concierge_events"
  ON public.concierge_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read events (requires public.has_role defined in earlier migrations)
CREATE POLICY "admin_read_concierge_events"
  ON public.concierge_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_concierge_events_event      ON public.concierge_events (event);
CREATE INDEX idx_concierge_events_created_at ON public.concierge_events (created_at DESC);
