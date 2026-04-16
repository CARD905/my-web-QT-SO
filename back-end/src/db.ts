import { Pool } from "pg";

export const pool = new Pool({
  user: "SuperAdminBM",
  host: "localhost",
  database: "my_database",
  password: "12345678",
  port: 5432,
});