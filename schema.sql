-- D1 database: btbstrut-leads (b5f1c474-9242-4258-8bc9-9ec6c258f529)
-- Exported from live sqlite_master on 2026-11-03; columns extended 2026-11-05 (additive).

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  product_interest TEXT,
  quantity TEXT,
  message TEXT,
  source_host TEXT,
  ip TEXT,
  country TEXT,
  user_agent TEXT,
  email_status TEXT,
  length TEXT,
  slot_style TEXT,
  delivery_address TEXT,
  delivery_what3words TEXT,
  needed_by TEXT
);

-- Live DB migration (safe; does not wipe rows). Run once against remote D1 before deploy:
--   ALTER TABLE leads ADD COLUMN length TEXT;
--   ALTER TABLE leads ADD COLUMN slot_style TEXT;
--   ALTER TABLE leads ADD COLUMN delivery_address TEXT;
--   ALTER TABLE leads ADD COLUMN delivery_what3words TEXT;
--   ALTER TABLE leads ADD COLUMN needed_by TEXT;
