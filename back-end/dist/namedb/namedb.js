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
// GET users
app.get("/users", async (req, res) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM users ORDER BY id ASC'); // ✅ แก้ตรงนี้
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});
// POST users
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Missing data" });
        }
        const result = await db_1.pool.query('INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', // ✅ แก้ตรงนี้
        [name, email]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
//# sourceMappingURL=namedb.js.map