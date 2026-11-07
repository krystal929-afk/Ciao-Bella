# Ciao Bella operations backend - staging-only foundation

Private Postgres schema for CRM, email/SMS consents, reservations, tables, table assignments, waitlist, inquiries, campaigns and notification tracking.

Never connect this code to a public GitHub Pages form. No API keys, PII, staff admin application or customer records are included in this repository.
Apply schema.sql ONLY to a separate restaurant-authorized database, not an unrelated existing Supabase project.
No records or bookings have yet been imported. Email/SMS delivery is OFF by default.
Marketing consent is UNKNOWN until evidence is available. Unsubscribed contacts must remain suppressed.
Never confirm a reservation automatically before staff availability and notifications are operational.
Use America/New_York local time for staff controls, UTC timestamps in the database.
Run synthetic SQL tests on an ephemeral Postgres database before connecting any staff app.
Cutover requires imported confirmed bookings, no missing waitlist entries, verified lead delivery, authenticated staff access, backups and rollback.