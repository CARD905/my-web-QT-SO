CREATE TABLE IF NOT EXISTS customers (
  customer_id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_email TEXT UNIQUE
);