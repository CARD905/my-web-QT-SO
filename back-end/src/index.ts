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
        c.customer_company
      FROM quotations q
      LEFT JOIN customers c 
      ON q.customer_id = c.customer_id
      ORDER BY q.quotation_id DESC
    `);

    res.json(r.rows);

  } catch (err: any) {
    console.error("GET QUOTATIONS ERROR:", err.message);
    res.status(500).json({ error: "get quotations error" });
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
      LEFT JOIN customers c 
      ON q.customer_id = c.customer_id
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
      items: items.rows || []
    });

  } catch (err: any) {
    console.error("DETAIL ERROR:", err.message);
    res.status(500).json({ error: "detail error" });
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
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("items required");
    }

    let cid = customer_id;

    /* ===== CREATE CUSTOMER ===== */
    if (!cid) {
      if (!customer || !customer.customer_name) {
        throw new Error("customer_name required");
      }

      const c = await client.query(
        `INSERT INTO customers
        (customer_name, customer_company, customer_phone, customer_address, customer_email)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING customer_id`,
        [
          customer.customer_name || "",
          customer.customer_company || "",
          customer.customer_phone || "",
          customer.customer_address || "",
          customer.customer_email || "",
        ]
      );

      cid = c.rows[0].customer_id;
    }

    /* ===== CALCULATE ===== */
    let subtotal = 0;

    for (const i of items) {
      const qty = Number(i.qty) || 0;
      const price = Number(i.unit_price) || 0;
      const discount = Number(i.discount) || 0;

      subtotal += qty * price * (1 - discount / 100);
    }

    const vat = subtotal * 0.07;
    const total = subtotal + vat;

    /* ===== INSERT QUOTATION ===== */
    const q = await client.query(
      `INSERT INTO quotations
      (quotation_no, customer_id, issue_date, expiry_date, subtotal, vat, total, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'draft')
      RETURNING *`,
      [
        `QT-${Date.now()}`,
        cid,
        issue_date || null,
        expiry_date || null,
        subtotal,
        vat,
        total,
      ]
    );

    const qid = q.rows[0].quotation_id;

    /* ===== INSERT ITEMS ===== */
    for (const i of items) {
      if (!i.product_name) continue;

      const qty = Number(i.qty) || 0;
      const price = Number(i.unit_price) || 0;
      const discount = Number(i.discount) || 0;

      const totalItem = qty * price * (1 - discount / 100);

      await client.query(
        `INSERT INTO quotation_items
        (quotation_id, product_name, description, qty, unit_price, discount_percent, total)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          qid,
          i.product_name || "",
          i.description || "",
          qty,
          price,
          discount,
          totalItem,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      quotation_id: qid,
    });

  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("CREATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* =========================================================
   🔥 UPDATE FULL (EDIT PAGE ใช้ตัวนี้)
========================================================= */
app.put("/quotations/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { customer, issue_date, expiry_date, items } = req.body;

    if (!items || !Array.isArray(items)) {
      throw new Error("items required");
    }

    /* ===== UPDATE CUSTOMER ===== */
    await client.query(`
      UPDATE customers SET
        customer_name=$1,
        customer_company=$2,
        customer_phone=$3,
        customer_address=$4,
        customer_email=$5
      WHERE customer_id = (
        SELECT customer_id FROM quotations WHERE quotation_id=$6
      )
    `, [
      customer.customer_name || "",
      customer.customer_company || "",
      customer.customer_phone || "",
      customer.customer_address || "",
      customer.customer_email || "",
      id
    ]);

    /* ===== DELETE OLD ITEMS ===== */
    await client.query(
      `DELETE FROM quotation_items WHERE quotation_id = $1`,
      [id]
    );

    /* ===== CALCULATE ===== */
    let subtotal = 0;

    for (const i of items) {
      const qty = Number(i.qty) || 0;
      const price = Number(i.unit_price) || 0;
      const discount = Number(i.discount) || 0;

      subtotal += qty * price * (1 - discount / 100);
    }

    const vat = subtotal * 0.07;
    const total = subtotal + vat;

    /* ===== INSERT NEW ITEMS ===== */
    for (const i of items) {
      if (!i.product_name) continue;

      const qty = Number(i.qty) || 0;
      const price = Number(i.unit_price) || 0;
      const discount = Number(i.discount) || 0;

      await client.query(
        `INSERT INTO quotation_items
        (quotation_id, product_name, description, qty, unit_price, discount_percent, total)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          id,
          i.product_name || "",
          i.description || "",
          qty,
          price,
          discount,
          qty * price * (1 - discount / 100)
        ]
      );
    }

    /* ===== UPDATE QUOTATION ===== */
    await client.query(`
      UPDATE quotations SET
        issue_date=$1,
        expiry_date=$2,
        subtotal=$3,
        vat=$4,
        total=$5
      WHERE quotation_id=$6
    `, [issue_date, expiry_date, subtotal, vat, total, id]);

    await client.query("COMMIT");

    res.json({ success: true });

  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* =========================================================
   STATUS (confirm / cancel)
========================================================= */
app.put("/quotations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      `UPDATE quotations SET status = $1 WHERE quotation_id = $2`,
      [status, id]
    );

    res.json({ success: true });

  } catch (err: any) {
    console.error("STATUS ERROR:", err.message);
    res.status(500).json({ error: "status update error" });
  }
});

/* =========================================================
   DELETE
========================================================= */
app.delete("/quotations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM quotation_items WHERE quotation_id = $1`, [id]);
    await pool.query(`DELETE FROM quotations WHERE quotation_id = $1`, [id]);

    res.json({ success: true });

  } catch (err: any) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ error: "delete error" });
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
    console.error("GET CUSTOMERS ERROR:", err.message);
    res.status(500).json({ error: "get customers error" });
  }
});

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});