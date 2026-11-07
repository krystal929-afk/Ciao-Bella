-- Synthetic tests only. Tests roll back; no real customers or reservations.
BEGIN;
DO $$
DECLARE g uuid; r uuid; t uuid;
BEGIN
 IF (SELECT count(*) FROM pg_tables WHERE schemaname='ciao_ops') <> 10 THEN
  RAISE EXCEPTION 'Missing tables';
 END IF;
 IF EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname='ciao_ops' AND c.relkind='r' AND NOT c.relrowsecurity) THEN
  RAISE EXCEPTION 'Missing RLS';
 END IF;
 INSERT INTO ciao_ops.guests(display_name,provider,provider_id)
 VALUES('Synthetic Sample','test','001') RETURNING id INTO g;
 INSERT INTO ciao_ops.marketing_consent(guest_id,channel) VALUES(g,'email');
 BEGIN
  UPDATE ciao_ops.marketing_consent SET status='opted_in' WHERE guest_id=g;
  RAISE EXCEPTION 'Unverified opt-in accepted';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 INSERT INTO ciao_ops.reservations(guest_name,starts_at,ends_at,party_size,provider,provider_id,state)
 VALUES('Synthetic Sample','2026-11-11 17:00-05','2026-11-11 19:00-05',2,'test','res-001','confirmed')
 RETURNING id INTO r;
 BEGIN
  INSERT INTO ciao_ops.reservations(guest_name,starts_at,ends_at,party_size,provider,provider_id)
  VALUES('Duplicate','2026-11-11 17:00-05','2026-11-11 19:00-05',2,'test','res-001');
  RAISE EXCEPTION 'Duplicate provider reservation accepted';
 EXCEPTION WHEN unique_violation THEN NULL;
 END;
 INSERT INTO ciao_ops.dining_tables(label,seats) VALUES('SYNTHETIC TABLE',4) RETURNING id INTO t;
 INSERT INTO ciao_ops.table_assignments(table_id,reservation_id,starts_at,ends_at)
 VALUES(t,r,'2026-11-11 17:00-05','2026-11-11 19:00-05');
 BEGIN
  INSERT INTO ciao_ops.table_assignments(table_id,starts_at,ends_at)
  VALUES(t,'2026-11-11 18:00-05','2026-11-11 20:00-05');
  RAISE EXCEPTION 'Overlapping table booking accepted';
 EXCEPTION WHEN exclusion_violation THEN NULL;
 END;
 INSERT INTO ciao_ops.waitlist(guest_name,party_size) VALUES('Sample',3);
 INSERT INTO ciao_ops.inquiries(kind,guest_name) VALUES('catering','Sample');
 INSERT INTO ciao_ops.campaigns(channel,title) VALUES('email','Sample draft');
 INSERT INTO ciao_ops.notification_outbox(event_name,channel,unique_event_key)
 VALUES('test','email','synthetic-only');
 IF EXISTS(SELECT 1 FROM ciao_ops.notification_outbox WHERE state<>'disabled') THEN
  RAISE EXCEPTION 'Automatic notification unexpectedly enabled';
 END IF;
 RAISE NOTICE 'PASS: 10 private tables; RLS; consent; duplicate ids; double-booking; disabled messaging';
END $$;
ROLLBACK;