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
/* GET */
app.get("/customers", async (req, res) => {
    const result = await db_1.pool.query("SELECT * FROM customers ORDER BY customer_id ASC");
    res.json(result.rows);
});
/* CREATE */
app.post("/customers", async (req, res) => {
    const { customer_name, customer_company, customer_phone, customer_address, customer_email, } = req.body;
    const result = await db_1.pool.query(`INSERT INTO customers 
    (customer_name, customer_company, customer_phone, customer_address, customer_email)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`, [
        customer_name,
        customer_company,
        customer_phone,
        customer_address,
        customer_email,
    ]);
    res.json(result.rows[0]);
});
/* UPDATE */
app.put("/customers/:id", async (req, res) => {
    const id = req.params.id;
    const { customer_name, customer_company, customer_phone, customer_address, customer_email, } = req.body;
    const result = await db_1.pool.query(`UPDATE customers SET
      customer_name=$1,
      customer_company=$2,
      customer_phone=$3,
      customer_address=$4,
      customer_email=$5
    WHERE customer_id=$6
    RETURNING *`, [
        customer_name,
        customer_company,
        customer_phone,
        customer_address,
        customer_email,
        id,
    ]);
    res.json(result.rows[0]);
});
/* DELETE */
app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
    await db_1.pool.query("DELETE FROM customers WHERE customer_id=$1", [id]);
    res.json({ message: "Deleted" });
});
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
//# sourceMappingURL=index.js.map