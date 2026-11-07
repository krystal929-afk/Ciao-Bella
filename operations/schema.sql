-- Ciao Bella private operations schema, staging-only; no PII or API keys.
-- Install only in a dedicated owner-approved database (never existing unrelated projects).
BEGIN;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE SCHEMA IF NOT EXISTS ciao_ops;
REVOKE ALL ON SCHEMA ciao_ops FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA ciao_ops REVOKE ALL ON TABLES FROM PUBLIC;

CREATE TABLE IF NOT EXISTS ciao_ops.import_batches (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity text NOT NULL,
 provider text NOT NULL, source_hash char(64) NOT NULL,
 exported_at timestamptz, expected_count int CHECK(expected_count>=0),
 imported_count int DEFAULT 0 CHECK(imported_count>=0),
 state text NOT NULL DEFAULT 'prepared'
   CHECK(state IN ('prepared','importing','verified','failed','rolled_back')),
 created_at timestamptz DEFAULT now(),
 UNIQUE(entity,provider,source_hash)
);
CREATE TABLE IF NOT EXISTS ciao_ops.guests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), display_name text,
 email text, phone text, provider text NOT NULL DEFAULT 'manual',
 provider_id text, import_batch_id uuid REFERENCES ciao_ops.import_batches(id),
 created_at timestamptz DEFAULT now(),
 CHECK(nullif(trim(coalesce(display_name,'')),'') IS NOT NULL OR
       nullif(trim(coalesce(email,'')),'') IS NOT NULL OR
       nullif(trim(coalesce(phone,'')),'') IS NOT NULL),
 UNIQUE(provider,provider_id)
);
CREATE INDEX IF NOT EXISTS guests_email_idx ON ciao_ops.guests(lower(email));
CREATE TABLE IF NOT EXISTS ciao_ops.marketing_consent (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 guest_id uuid NOT NULL REFERENCES ciao_ops.guests(id) ON DELETE RESTRICT,
 channel text NOT NULL CHECK(channel IN ('email','sms')),
 status text NOT NULL DEFAULT 'unknown' CHECK(status IN ('unknown','opted_in','opted_out')),
 evidence_source text, evidence_at timestamptz,
 UNIQUE(guest_id,channel),
 CHECK(status<>'opted_in' OR (nullif(trim(coalesce(evidence_source,'')),'') IS NOT NULL AND evidence_at IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS ciao_ops.reservations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 guest_id uuid REFERENCES ciao_ops.guests(id),
 guest_name text NOT NULL, guest_phone text, guest_email text,
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 party_size smallint NOT NULL CHECK(party_size BETWEEN 1 AND 30),
 state text NOT NULL DEFAULT 'requested'
  CHECK(state IN ('requested','confirmed','seated','completed','cancelled','no_show')),
 provider text NOT NULL DEFAULT 'manual', provider_id text,
 staff_note text, guest_requests text,
 import_batch_id uuid REFERENCES ciao_ops.import_batches(id),
 created_at timestamptz DEFAULT now(),
 CHECK(ends_at>starts_at), UNIQUE(provider,provider_id)
);
CREATE INDEX IF NOT EXISTS reservations_dates_idx ON ciao_ops.reservations(starts_at,state);
CREATE TABLE IF NOT EXISTS ciao_ops.dining_tables (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 label text NOT NULL UNIQUE, seats smallint NOT NULL CHECK(seats BETWEEN 1 AND 30),
 section text, enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS ciao_ops.table_assignments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 table_id uuid NOT NULL REFERENCES ciao_ops.dining_tables(id),
 reservation_id uuid REFERENCES ciao_ops.reservations(id),
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 state text NOT NULL DEFAULT 'held' CHECK(state IN ('held','seated','released','cancelled')),
 CHECK(ends_at>starts_at),
 CONSTRAINT prevent_double_booking EXCLUDE USING gist (
  table_id WITH =, tstzrange(starts_at,ends_at,'[)') WITH &&
 ) WHERE (state IN ('held','seated'))
);
CREATE TABLE IF NOT EXISTS ciao_ops.waitlist (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 guest_name text NOT NULL, guest_phone text,
 party_size smallint NOT NULL CHECK(party_size BETWEEN 1 AND 30),
 joined_at timestamptz NOT NULL DEFAULT now(), estimated_at timestamptz,
 seated_at timestamptz,
 state text NOT NULL DEFAULT 'waiting'
  CHECK(state IN ('waiting','notified','seated','left','cancelled')),
 provider text NOT NULL DEFAULT 'manual', provider_id text,
 UNIQUE(provider,provider_id)
);
CREATE TABLE IF NOT EXISTS ciao_ops.inquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 kind text NOT NULL CHECK(kind IN ('catering','private_event','general')),
 guest_name text NOT NULL, guest_phone text, guest_email text,
 event_date date, guest_count int CHECK(guest_count BETWEEN 1 AND 1000),
 details text,
 state text NOT NULL DEFAULT 'new' CHECK(state IN ('new','contacted','quoted','booked','closed','cancelled')),
 provider text NOT NULL DEFAULT 'manual', provider_id text,
 received_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(provider,provider_id)
);
CREATE TABLE IF NOT EXISTS ciao_ops.campaigns (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 channel text NOT NULL CHECK(channel IN ('email','social','popup')),
 title text NOT NULL, content text, scheduled_at timestamptz,
 state text NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','approved','scheduled','published','cancelled')),
 provider text NOT NULL DEFAULT 'manual', provider_id text,
 UNIQUE(provider,provider_id)
);
CREATE TABLE IF NOT EXISTS ciao_ops.notification_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 event_name text NOT NULL, guest_id uuid REFERENCES ciao_ops.guests(id),
 channel text NOT NULL CHECK(channel IN ('email','sms')),
 payload jsonb NOT NULL DEFAULT '{}'::jsonb,
 state text NOT NULL DEFAULT 'disabled'
  CHECK(state IN ('disabled','ready','sending','delivered','failed')),
 unique_event_key text NOT NULL UNIQUE, created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ciao_ops.integrations (
 name text PRIMARY KEY,
 state text NOT NULL DEFAULT 'not_configured'
  CHECK(state IN ('not_configured','testing','verified','active','retired','failed')),
 last_verified_at timestamptz, note text
);
-- Defense in depth: RLS is enabled but there are intentionally no public policies.
DO $$
DECLARE x record;
BEGIN
 FOR x IN SELECT tablename FROM pg_tables WHERE schemaname='ciao_ops' LOOP
  EXECUTE format('ALTER TABLE ciao_ops.%I ENABLE ROW LEVEL SECURITY', x.tablename);
 END LOOP;
END $$;
COMMIT;