"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("../db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/* ================= GET CUSTOMER ================= */
app.get("/customers", async (req, res) => {
    const result = await db_1.pool.query("SELECT * FROM customers ORDER BY customer_id DESC");
    res.json(result.rows);
});
/* ================= CREATE QUOTATION ================= */
app.post("/quotations", async (req, res) => {
    const { customer, issue_date, expiry_date, items } = req.body;
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        let customer_id = customer.customer_id;
        // 👉 create customer if new
        if (!customer_id) {
            const newCustomer = await client.query(`INSERT INTO customers
        (customer_name, customer_company, customer_phone, customer_address, customer_email)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING customer_id`, [
                customer.customer_name,
                customer.customer_company,
                customer.customer_phone,
                customer.customer_address,
                customer.customer_email
            ]);
            customer_id = newCustomer.rows[0].customer_id;
        }
        // 👉 create quotation
        const q = await client.query(`INSERT INTO quotations (quotation_no, customer_id, issue_date, expiry_date)
       VALUES ($1,$2,$3,$4)
       RETURNING *`, ["QT-" + Date.now(), customer_id, issue_date, expiry_date]);
        const quotation_id = q.rows[0].quotation_id;
        let subtotal = 0;
        // 👉 items
        for (const item of items) {
            if (!item.product_name)
                continue;
            const total = item.qty * item.unit_price * (1 - item.discount / 100);
            subtotal += total;
            await client.query(`INSERT INTO quotation_items
        (quotation_id, product_name, description, qty, unit_price, discount_percent, total)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`, [
                quotation_id,
                item.product_name,
                item.description,
                item.qty,
                item.unit_price,
                item.discount,
                total
            ]);
        }
        const vat = subtotal * 0.07;
        const total = subtotal + vat;
        await client.query(`UPDATE quotations SET subtotal=$1, vat=$2, total=$3 WHERE quotation_id=$4`, [subtotal, vat, total, quotation_id]);
        await client.query("COMMIT");
        res.json({ message: "success" });
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json(err);
    }
    finally {
        client.release();
    }
});
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
//# sourceMappingURL=index.js.map