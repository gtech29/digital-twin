-- EVENTS: time-series telemetry
CREATE TABLE IF NOT EXISTS events (
  timestamp   timestamptz NOT NULL,
  ingest_ts   timestamptz NOT NULL DEFAULT now(),

  point_id    text        NOT NULL,
  source      text,
  protocol    text,                   -- e.g. dnp3, bacnet, modbus, sim
  type        text,                   -- analog | binary | counter | string

  value_num   double precision,
  value_bool  boolean,
  value_text  text,

  unit        text,
  quality     text,                   -- good | bad | uncertain | comm_lost | etc.
  tags        jsonb,

  CHECK (
    (value_num IS NOT NULL)::int +
    (value_bool IS NOT NULL)::int +
    (value_text IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS ix_events_point_time ON events (point_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS ix_events_time       ON events (timestamp DESC);
CREATE INDEX IF NOT EXISTS ix_events_tags       ON events USING GIN (tags);

-- POINTS: catalog / metadata
CREATE TABLE IF NOT EXISTS points (
  point_id     text PRIMARY KEY,
  protocol     text NOT NULL,
  source       text NOT NULL,
  device_name  text,

  point_name   text NOT NULL,
  type         text NOT NULL,         -- analog | binary | counter | string
  unit         text,
  writable     boolean DEFAULT false,
  normal_min   double precision,
  normal_max   double precision,

  proto_ref    jsonb,                  -- protocol addressing info
  tags         jsonb,

  created_ts   timestamptz NOT NULL DEFAULT now(),
  updated_ts   timestamptz
);

-- CONTROLS: proposed/applied changes (audit trail)
CREATE TABLE IF NOT EXISTS controls (
  id                   text PRIMARY KEY,
  timestamp            timestamptz NOT NULL DEFAULT now(),

  target_point_id      text NOT NULL REFERENCES points(point_id) ON DELETE RESTRICT,

  proposed_value_num   double precision,
  proposed_value_bool  boolean,
  proposed_value_text  text,

  actor                text NOT NULL, -- ui | llm | sim | api
  requested_by         text,
  status               text NOT NULL, -- requested | approved | rejected | applied | failed
  reason               text,
  correlation_id       text,

  approved_ts          timestamptz,
  applied_ts           timestamptz,

  CHECK (
    (proposed_value_num IS NOT NULL)::int +
    (proposed_value_bool IS NOT NULL)::int +
    (proposed_value_text IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS ix_controls_time ON controls (timestamp DESC);