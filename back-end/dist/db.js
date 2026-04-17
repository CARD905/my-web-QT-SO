"use strict";
// import { Pool } from "pg";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// export const pool = new Pool(
//   process.env.DATABASE_URL
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//       }
//     : {
//         user: "SuperAdminBM",
//         host: "localhost",
//         database: "my_database",
//         password: "12345678",
//         port: 5432,
//       }
// );
const pg_1 = require("pg");
const isProduction = !!process.env.DATABASE_URL;
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
});
//# sourceMappingURL=db.js.map