CREATE TABLE IF NOT EXISTS quotations (
  quotation_id SERIAL PRIMARY KEY,
  quotation_no TEXT,
  customer_id INT REFERENCES customers(customer_id),
  issue_date DATE,
  expiry_date DATE,
  subtotal NUMERIC,
  vat NUMERIC,
  total NUMERIC,
  status TEXT DEFAULT 'draft'
);