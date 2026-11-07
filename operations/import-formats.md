# Migration import shapes (templates only)
No customer data belongs in this public repository.

For local-only processing, use a CSV with one of these header rows:

contacts: source_id,name,email,phone
reservations: source_id,name,start_local,party_size,status
waitlist: source_id,name,party_size,status
inquiries: source_id,type,name,status
consents: source_id,channel,status,evidence_source,evidence_timestamp

- Times named start_local use America/New_York local time in ISO format (e.g. 2026-11-11T17:00). DST ambiguity must be resolved before import.
- Preserve original provider IDs, dates, status, cancellations and unsubscribes.
- Contacts are not assumed to have marketing consent.
- Import validator logs ONLY SHA-256 and counts, not names or emails.
- Actual import/duplicate resolution requires an authorized, separate secure backend.
- Get an export of future SpotHopper reservations and the original recipient-level email opt-in/out history before any migration.
