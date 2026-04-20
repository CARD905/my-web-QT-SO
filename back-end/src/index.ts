
// // import express from "express";
// // import cors from "cors";
// // import { pool } from "./db";

// // const app = express();
// // app.use(cors({
// //   origin: "https://my-app.onrender.com"
// // }));
// // app.use(express.json());



// // /* ================= CUSTOMERS ================= */
// // app.get("/customers", async (req, res) => {
// //   try {
// //     const r = await pool.query(
// //       "SELECT * FROM customers ORDER BY customer_id DESC"
// //     );
// //     res.json(r.rows);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "get customers error" });
// //   }
// // });

// // /* ================= CREATE QUOTATION ================= */
// // app.post("/quotations", async (req, res) => {
// //   const client = await pool.connect();

// //   try {
// //     await client.query("BEGIN");

// //     const { customer_id, customer, issue_date, expiry_date, items } = req.body;

// //     if (!items || items.length === 0) {
// //       return res.status(400).json({ error: "items required" });
// //     }

// //     let cid = customer_id;

// //     /* ===== create customer if not select ===== */
// //     if (!cid) {
// //       if (!customer?.customer_name) {
// //         return res.status(400).json({ error: "customer required" });
// //       }

// //       const c = await client.query(
// //         `INSERT INTO customers
// //         (customer_name, customer_company, customer_phone, customer_address, customer_email)
// //         VALUES ($1,$2,$3,$4,$5)
// //         RETURNING customer_id`,
// //         [
// //           customer.customer_name,
// //           customer.customer_company,
// //           customer.customer_phone,
// //           customer.customer_address,
// //           customer.customer_email,
// //         ]
// //       );

// //       cid = c.rows[0].customer_id;
// //     }

// //     /* ===== calc ===== */
// //     const subtotal = items.reduce(
// //       (s: number, i: any) =>
// //         s + i.qty * i.unit_price * (1 - i.discount / 100),
// //       0
// //     );

// //     const vat = subtotal * 0.07;
// //     const total = subtotal + vat;

// //     /* ===== insert quotation ===== */
// //     const q = await client.query(
// //       `INSERT INTO quotations
// //       (quotation_no, customer_id, issue_date, expiry_date, subtotal, vat, total, status)
// //       VALUES ($1,$2,$3,$4,$5,$6,$7,'draft')
// //       RETURNING *`,
// //       [
// //         `QT-${Date.now()}`,
// //         cid,
// //         issue_date || null,
// //         expiry_date || null,
// //         subtotal,
// //         vat,
// //         total,
// //       ]
// //     );

// //     const qid = q.rows[0].quotation_id;

// //     /* ===== insert items ===== */
// //     for (const i of items) {
// //       if (!i.product_name) continue;

// //       await client.query(
// //         `INSERT INTO quotation_items
// //         (quotation_id, product_name, description, qty, unit_price, discount_percent, total)
// //         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
// //         [
// //           qid,
// //           i.product_name,
// //           i.description,
// //           i.qty,
// //           i.unit_price,
// //           i.discount,
// //           i.qty * i.unit_price * (1 - i.discount / 100),
// //         ]
// //       );
// //     }

// //     await client.query("COMMIT");

// //     res.json({ message: "success", quotation_id: qid });

// //   } catch (err) {
// //     await client.query("ROLLBACK");
// //     console.error("CREATE ERROR:", err);
// //     res.status(500).json({ error: "create quotation error" });
// //   } finally {
// //     client.release();
// //   }
// // });

// // /* ================= LIST ================= */
// // app.get("/quotations", async (req, res) => {
// //   try {
// //     const r = await pool.query(`
// //       SELECT 
// //         q.*, 
// //         c.customer_name
// //       FROM quotations q
// //       LEFT JOIN customers c 
// //       ON q.customer_id = c.customer_id
// //       ORDER BY q.quotation_id DESC
// //     `);

// //     res.json(r.rows);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "list error" });
// //   }
// // });

// // /* ================= DETAIL ================= */
// // app.get("/quotations/:id", async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     const q = await pool.query(`
// //       SELECT 
// //         q.*,
// //         c.customer_name,
// //         c.customer_company,
// //         c.customer_phone,
// //         c.customer_address,
// //         c.customer_email
// //       FROM quotations q
// //       LEFT JOIN customers c 
// //       ON q.customer_id = c.customer_id
// //       WHERE q.quotation_id = $1
// //     `, [id]);

// //     const items = await pool.query(
// //       "SELECT * FROM quotation_items WHERE quotation_id=$1",
// //       [id]
// //     );

// //     res.json({
// //       ...q.rows[0],
// //       items: items.rows,
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "detail error" });
// //   }
// // });

// // /* ================= UPDATE ================= */
// // app.put("/quotations/:id", async (req, res) => {
// //   const { id } = req.params;
// //   const { issue_date, expiry_date } = req.body;

// //   try {
// //     await pool.query(
// //       `UPDATE quotations 
// //        SET issue_date=$1, expiry_date=$2 
// //        WHERE quotation_id=$3`,
// //       [issue_date, expiry_date, id]
// //     );

// //     res.json({ message: "updated" });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "update error" });
// //   }
// // });

// // /* ================= STATUS ================= */
// // app.put("/quotations/:id/status", async (req, res) => {
// //   const { id } = req.params;
// //   const { status } = req.body;

// //   try {
// //     const r = await pool.query(
// //       `UPDATE quotations 
// //        SET status=$1 
// //        WHERE quotation_id=$2 
// //        RETURNING *`,
// //       [status, id]
// //     );

// //     res.json(r.rows[0]);

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "status error" });
// //   }
// // });

// // app.listen(process.env.PORT || 5000 , () => {
// //   console.log(`Server started on port ${process.env.PORT}`);
// // });
// import express from "express";
// import cors from "cors";
// import { pool } from "./db";

// const app = express();

// /* ===== middleware ===== */
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
// app.use(express.json());

// /* ===== health check ===== */
// app.get("/", (req, res) => {
//   res.send("API is running 🚀");
// });

// /* ================= CUSTOMERS ================= */
// app.get("/customers", async (req, res) => {
//   try {
//     const r = await pool.query(
//       "SELECT * FROM customers ORDER BY customer_id DESC"
//     );
//     res.json(r.rows);
//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ error: "get customers error" });
//   }
// });

// /* ================= CREATE QUOTATION ================= */
// app.post("/quotations", async (req, res) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     const { customer_id, customer, issue_date, expiry_date, items } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ error: "items required" });
//     }

//     let cid = customer_id;

//     if (!cid) {
//       if (!customer?.customer_name) {
//         return res.status(400).json({ error: "customer required" });
//       }

//       const c = await client.query(
//         `INSERT INTO customers
//         (customer_name, customer_company, customer_phone, customer_address, customer_email)
//         VALUES ($1,$2,$3,$4,$5)
//         RETURNING customer_id`,
//         [
//           customer.customer_name,
//           customer.customer_company,
//           customer.customer_phone,
//           customer.customer_address,
//           customer.customer_email,
//         ]
//       );

//       cid = c.rows[0].customer_id;
//     }

//     /* ===== calc ===== */
//     const subtotal = items.reduce((s: number, i: any) => {
//       const discount = i.discount || 0;
//       return s + i.qty * i.unit_price * (1 - discount / 100);
//     }, 0);

//     const vat = subtotal * 0.07;
//     const total = subtotal + vat;

//     /* ===== insert quotation ===== */
//     const q = await client.query(
//       `INSERT INTO quotations
//       (quotation_no, customer_id, issue_date, expiry_date, subtotal, vat, total, status)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,'draft')
//       RETURNING *`,
//       [
//         `QT-${Date.now()}`,
//         cid,
//         issue_date || null,
//         expiry_date || null,
//         subtotal,
//         vat,
//         total,
//       ]
//     );

//     const qid = q.rows[0].quotation_id;

//     /* ===== insert items ===== */
//     for (const i of items) {
//       if (!i.product_name) continue;

//       const discount = i.discount || 0;

//       await client.query(
//         `INSERT INTO quotation_items
//         (quotation_id, product_name, description, qty, unit_price, discount_percent, total)
//         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
//         [
//           qid,
//           i.product_name,
//           i.description,
//           i.qty,
//           i.unit_price,
//           discount,
//           i.qty * i.unit_price * (1 - discount / 100),
//         ]
//       );
//     }

//     await client.query("COMMIT");

//     res.json({ message: "success", quotation_id: qid });

//   } catch (err: any) {
//     await client.query("ROLLBACK");
//     console.error("CREATE ERROR:", err.message);
//     res.status(500).json({ error: "create quotation error" });
//   } finally {
//     client.release();
//   }
// });

// /* ================= LIST ================= */
// app.get("/quotations", async (req, res) => {
//   try {
//     const r = await pool.query(`
//       SELECT q.*, c.customer_name
//       FROM quotations q
//       LEFT JOIN customers c 
//       ON q.customer_id = c.customer_id
//       ORDER BY q.quotation_id DESC
//     `);

//     res.json(r.rows);
//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ error: "list error" });
//   }
// });

// /* ================= DETAIL ================= */
// app.get("/quotations/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const q = await pool.query(`
//       SELECT q.*, c.customer_name, c.customer_company,
//              c.customer_phone, c.customer_address, c.customer_email
//       FROM quotations q
//       LEFT JOIN customers c 
//       ON q.customer_id = c.customer_id
//       WHERE q.quotation_id = $1
//     `, [id]);

//     if (q.rows.length === 0) {
//       return res.status(404).json({ error: "not found" });
//     }

//     const items = await pool.query(
//       "SELECT * FROM quotation_items WHERE quotation_id=$1",
//       [id]
//     );

//     res.json({
//       ...q.rows[0],
//       items: items.rows,
//     });

//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ error: "detail error" });
//   }
// });

// /* ================= UPDATE ================= */
// app.put("/quotations/:id", async (req, res) => {
//   const { id } = req.params;
//   const { issue_date, expiry_date } = req.body;

//   try {
//     await pool.query(
//       `UPDATE quotations 
//        SET issue_date=$1, expiry_date=$2 
//        WHERE quotation_id=$3`,
//       [issue_date, expiry_date, id]
//     );

//     res.json({ message: "updated" });

//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ error: "update error" });
//   }
// });

// /* ================= STATUS ================= */
// app.put("/quotations/:id/status", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const r = await pool.query(
//       `UPDATE quotations 
//        SET status=$1 
//        WHERE quotation_id=$2 
//        RETURNING *`,
//       [status, id]
//     );

//     res.json(r.rows[0]);

//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ error: "status error" });
//   }
// });

// /* ================= DELETE ================= */
// app.delete("/quotations/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await pool.query("DELETE FROM quotation_items WHERE quotation_id=$1", [id]);
//     await pool.query("DELETE FROM quotations WHERE quotation_id=$1", [id]);

//     res.json({ message: "deleted" });

//   } catch (err: any) {
//     console.error(err.message);
//     res.status(500).json({ error: "delete error" });
//   }
// });

// /* ===== start server ===== */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";

dotenv.config();

const app = express();

/* ================= CORS (กันพัง) ================= */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://my-app-y7pz.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

/* ================= DEBUG ================= */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ================= CUSTOMERS ================= */
app.get("/customers", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM customers ORDER BY customer_id DESC"
    );
    res.json(r.rows);
  } catch (err: any) {
    console.error("CUSTOMERS ERROR:", err.message);
    res.status(500).json({ error: "get customers error" });
  }
});

/* ================= CREATE ================= */
app.post("/quotations", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { customer_id, customer, issue_date, expiry_date, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "items required" });
    }

    let cid = customer_id;

    if (!cid) {
      if (!customer?.customer_name) {
        return res.status(400).json({ error: "customer required" });
      }

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

    const subtotal = items.reduce((sum: number, i: any) => {
      const discount = i.discount || 0;
      return sum + i.qty * i.unit_price * (1 - discount / 100);
    }, 0);

    const vat = subtotal * 0.07;
    const total = subtotal + vat;

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

    for (const i of items) {
      if (!i.product_name) continue;

      const discount = i.discount || 0;

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
          discount,
          i.qty * i.unit_price * (1 - discount / 100),
        ]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "success", quotation_id: qid });

  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("CREATE ERROR:", err.message);
    res.status(500).json({ error: "create quotation error" });
  } finally {
    client.release();
  }
});

/* ================= LIST ================= */
app.get("/quotations", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT q.*, c.customer_name, c.customer_company
      FROM quotations q
      LEFT JOIN customers c 
      ON q.customer_id = c.customer_id
      ORDER BY q.quotation_id DESC
    `);

    res.json(r.rows);
  } catch (err: any) {
    console.error("LIST ERROR:", err.message);
    res.status(500).json({ error: "list error" });
  }
});

/* ================= DETAIL ================= */
app.get("/quotations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const q = await pool.query(`
      SELECT q.*, c.customer_name, c.customer_company,
             c.customer_phone, c.customer_address, c.customer_email
      FROM quotations q
      LEFT JOIN customers c 
      ON q.customer_id = c.customer_id
      WHERE q.quotation_id = $1
    `, [id]);

    if (q.rows.length === 0) {
      return res.status(404).json({ error: "not found" });
    }

    const items = await pool.query(
      "SELECT * FROM quotation_items WHERE quotation_id=$1",
      [id]
    );

    res.json({ ...q.rows[0], items: items.rows });

  } catch (err: any) {
    console.error("DETAIL ERROR:", err.message);
    res.status(500).json({ error: "detail error" });
  }
});

/* ================= UPDATE ================= */
app.put("/quotations/:id", async (req, res) => {
  const { id } = req.params;
  const { issue_date, expiry_date } = req.body;

  try {
    await pool.query(
      `UPDATE quotations 
       SET issue_date=$1, expiry_date=$2 
       WHERE quotation_id=$3`,
      [issue_date, expiry_date, id]
    );

    res.json({ message: "updated" });

  } catch (err: any) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ error: "update error" });
  }
});

/* ================= STATUS ================= */
app.put("/quotations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const r = await pool.query(
      `UPDATE quotations 
       SET status=$1 
       WHERE quotation_id=$2 
       RETURNING *`,
      [status, id]
    );

    res.json(r.rows[0]);

  } catch (err: any) {
    console.error("STATUS ERROR:", err.message);
    res.status(500).json({ error: "status error" });
  }
});

/* ================= DELETE ================= */
app.delete("/quotations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM quotation_items WHERE quotation_id=$1", [id]);
    await pool.query("DELETE FROM quotations WHERE quotation_id=$1", [id]);

    res.json({ message: "deleted" });

  } catch (err: any) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ error: "delete error" });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});