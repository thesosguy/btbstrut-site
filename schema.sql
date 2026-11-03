-- D1 database: btbstrut-leads (b5f1c474-9242-4258-8bc9-9ec6c258f529)
-- Exported from live sqlite_master on 2026-11-03

CREATE TABLE leads (
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
  email_status TEXT
);
