const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL_CA_PATH
    ? {
        ca: process.env.DB_SSL_CA_PATH,
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
      }
    : process.env.DB_SSL_REJECT_UNAUTHORIZED === "false"
    ? { rejectUnauthorized: false }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
