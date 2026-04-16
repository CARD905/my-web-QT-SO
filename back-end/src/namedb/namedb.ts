import express from "express";
import cors from "cors";
import { pool } from "../db";

const app = express();
app.use(cors());
app.use(express.json());

// GET users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC'); // ✅ แก้ตรงนี้
    res.json(result.rows);
  } catch (err) {
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

    const result = await pool.query(
      'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', // ✅ แก้ตรงนี้
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});