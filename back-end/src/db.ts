import { Pool } from "pg";

export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: "SuperAdminBM",
        host: "localhost",
        database: "my_database",
        password: "12345678",
        port: 5432,
      }
);