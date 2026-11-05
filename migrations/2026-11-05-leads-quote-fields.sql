-- Additive migration for btbstrut-leads — does NOT drop or recreate the table.
-- Run once against remote D1 before deploying Worker code that INSERTs these columns:
--
--   npx wrangler d1 execute btbstrut-leads --remote --file=migrations/2026-11-05-leads-quote-fields.sql
--
-- Or via Cloudflare dashboard → D1 → Console (one statement at a time if needed).

ALTER TABLE leads ADD COLUMN length TEXT;
ALTER TABLE leads ADD COLUMN slot_style TEXT;
ALTER TABLE leads ADD COLUMN delivery_address TEXT;
ALTER TABLE leads ADD COLUMN delivery_what3words TEXT;
ALTER TABLE leads ADD COLUMN needed_by TEXT;
