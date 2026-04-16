CREATE TABLE IF NOT EXISTS quotation_items (
  item_id SERIAL PRIMARY KEY,
  quotation_id INT REFERENCES quotations(quotation_id) ON DELETE CASCADE,
  product_name TEXT,
  description TEXT,
  qty INT,
  unit_price NUMERIC,
  discount_percent NUMERIC,
  total NUMERIC
);