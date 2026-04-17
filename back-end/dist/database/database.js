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
/* =========================
   GET: ดึง item ทั้งหมด
========================= */
app.get("/items", async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT * FROM item_master ORDER BY item_no ASC");
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetch failed" });
    }
});
/* =========================
   POST: เพิ่ม item
========================= */
app.post("/items", async (req, res) => {
    try {
        const { item_code, item_name, description, unit_cost, unit_price, uom, status, } = req.body;
        // ✅ validation กันพัง
        if (!item_code || !item_name) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await db_1.pool.query(`INSERT INTO item_master 
      (item_code, item_name, description, unit_cost, unit_price, uom, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`, [
            item_code,
            item_name,
            description || "",
            unit_cost || 0,
            unit_price || 0,
            uom || "EA",
            status || "ACTIVE",
        ]);
        res.json({
            message: "Insert success",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Insert failed" });
    }
});
/* =========================
   DELETE (optional เทพขึ้น)
========================= */
app.delete("/items/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db_1.pool.query("DELETE FROM item_master WHERE item_no = $1", [id]);
        res.json({ message: "Delete success" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});
/* =========================
   UPDATE (optional เทพขึ้น)
========================= */
app.put("/items/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { item_code, item_name, description, unit_cost, unit_price, uom, status, } = req.body;
        const result = await db_1.pool.query(`UPDATE item_master SET
        item_code=$1,
        item_name=$2,
        description=$3,
        unit_cost=$4,
        unit_price=$5,
        uom=$6,
        status=$7
      WHERE item_no=$8
      RETURNING *`, [
            item_code,
            item_name,
            description,
            unit_cost,
            unit_price,
            uom,
            status,
            id,
        ]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
});
/* =========================
   START SERVER
========================= */
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
//# sourceMappingURL=database.js.map