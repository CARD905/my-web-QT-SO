import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";

dotenv.config();

const app = express();

/* ===== CORS ===== */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://my-app-y7pz.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

/* ===== DEBUG ===== */
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

/* =========================================================
   GET ALL QUOTATIONS
========================================================= */
app.get("/quotations", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT 
        q.*,
        c.customer_name,
        c.customer_company,
        COALESCE(STRING_AGG(qi.product_name, ', '), '') AS products
      FROM quotations q
      LEFT JOIN customers c ON q.customer_id = c.customer_id
      LEFT JOIN quotation_items qi ON q.quotation_id = qi.quotation_id
      GROUP BY q.quotation_id, c.customer_name, c.customer_company
      ORDER BY q.quotation_id DESC
    `);

    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   GET DETAIL
========================================================= */
app.get("/quotations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const q = await pool.query(`
      SELECT 
        q.*,
        c.customer_name,
        c.customer_company,
        c.customer_phone,
        c.customer_address,
        c.customer_email
      FROM quotations q
      LEFT JOIN customers c ON q.customer_id = c.customer_id
      WHERE q.quotation_id = $1
    `, [id]);

    if (q.rows.length === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    const items = await pool.query(
      `SELECT * FROM quotation_items WHERE quotation_id = $1`,
      [id]
    );

    res.json({
      ...q.rows[0],
      items: items.rows,
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   CREATE QUOTATION
========================================================= */
app.post("/quotations", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      customer_id,
      customer,
      issue_date,
      expiry_date,
      items,
      vat_enabled,
      discount_type,
      payment_terms,
      notes,
      status
    } = req.body;

    /* ===== VALIDATION ===== */
    if (!issue_date) throw new Error("issue_date required");
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("items required");
    }

    for (const i of items) {
      if (!i.product_name) throw new Error("product_name required");
      if (!i.qty || i.qty <= 0) throw new Error("qty invalid");
      if (i.unit_price < 0) throw new Error("price invalid");
      if (i.discount < 0) throw new Error("discount invalid");
    }

    /* ===== CUSTOMER ===== */
    let cid = customer_id;

    if (!cid) {
      const c = await client.query(
        `INSERT INTO customers
        (customer_name, customer_company, customer_phone, customer_address, customer_email)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING customer_id`,
        [
          customer.customer_name,
          customer.customer_company,
          customer.customer_phone,
          customer.customer_address,
          customer.customer_email,
        ]
      );
      cid = c.rows[0].customer_id;
    }

    /* ===== CALCULATE ===== */
    let subtotal = 0;

    const cleanItems = items.map((i: any) => {
      const qty = Number(i.qty);
      const price = Number(i.unit_price);
      const discount = Number(i.discount);

      let total = qty * price;

      if (discount_type === "amount") {
        total -= discount;
      } else {
        total *= (1 - discount / 100);
      }

      subtotal += total;

      return { ...i, total };
    });

    const vat = vat_enabled ? subtotal * 0.07 : 0;
    const grandTotal = subtotal + vat;

    /* ===== GENERATE QT NO ===== */
    const count = await client.query(`SELECT COUNT(*) FROM quotations`);
    const running = String(Number(count.rows[0].count) + 1).padStart(4, "0");
    const quotationNo = `QT-2026-${running}`;

    /* ===== INSERT QT ===== */
    const q = await client.query(
      `INSERT INTO quotations
      (quotation_no, customer_id, issue_date, expiry_date,
       subtotal, vat, total,
       vat_enabled, discount_type,
       payment_terms, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        quotationNo,
        cid,
        issue_date,
        expiry_date,
        subtotal,
        vat,
        grandTotal,
        vat_enabled ?? true,
        discount_type || "percent",
        payment_terms,
        notes,
        status || "draft",
      ]
    );

    const qid = q.rows[0].quotation_id;

    /* ===== INSERT ITEMS ===== */
    for (const i of cleanItems) {
      await client.query(
        `INSERT INTO quotation_items
        (quotation_id, product_name, description, qty, unit_price, discount_percent, total)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          qid,
          i.product_name,
          i.description,
          i.qty,
          i.unit_price,
          i.discount,
          i.total,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({ success: true, quotation_id: qid });

  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* =========================================================
   UPDATE STATUS
========================================================= */
app.put("/quotations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const check = await pool.query(
      `SELECT status FROM quotations WHERE quotation_id = $1`,
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    if (check.rows[0].status === "converted") {
      return res.status(400).json({ error: "Already converted" });
    }

    await pool.query(
      `UPDATE quotations SET status = $1 WHERE quotation_id = $2`,
      [status, id]
    );

    res.json({ success: true });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   DELETE
========================================================= */
app.delete("/quotations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const check = await pool.query(
      `SELECT status FROM quotations WHERE quotation_id = $1`,
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    const locked = ["sent", "approved", "converted"];

    if (locked.includes(check.rows[0].status)) {
      return res.status(400).json({ error: "Cannot delete" });
    }

    await pool.query(`DELETE FROM quotation_items WHERE quotation_id = $1`, [id]);
    await pool.query(`DELETE FROM quotations WHERE quotation_id = $1`, [id]);

    res.json({ success: true });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   CONVERT TO SO
========================================================= */
app.post("/quotations/:id/convert", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;

    const q = await client.query(
      `SELECT * FROM quotations WHERE quotation_id = $1`,
      [id]
    );

    if (q.rows.length === 0) throw new Error("QT not found");
    if (q.rows[0].is_converted) throw new Error("Already converted");

    const so = await client.query(
      `INSERT INTO sale_orders
      (quotation_id, customer_id, total, status)
      VALUES ($1,$2,$3,'pending')
      RETURNING *`,
      [id, q.rows[0].customer_id, q.rows[0].total]
    );

    const so_id = so.rows[0].id;

    const items = await client.query(
      `SELECT * FROM quotation_items WHERE quotation_id = $1`,
      [id]
    );

    for (const i of items.rows) {
      await client.query(
        `INSERT INTO sale_order_items
        (sale_order_id, product_name, qty, unit_price, total)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          so_id,
          i.product_name,
          i.qty,
          i.unit_price,
          i.total,
        ]
      );
    }

    await client.query(
      `UPDATE quotations 
       SET is_converted = true, status = 'converted'
       WHERE quotation_id = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({ success: true, so_id });

  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* =========================================================
   GET CUSTOMERS
========================================================= */
app.get("/customers", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM customers ORDER BY customer_id DESC"
    );
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});