const mysql = require("mysql2/promise");

async function checkDatabaseStructure() {
  const connection = await mysql.createConnection({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    port: 24345,
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Checking database structure...\n");

    // Check view_all_orders structure
    console.log("1. view_all_orders structure:");
    try {
      const [result] = await connection.query("DESCRIBE view_all_orders");
      console.log("Available columns:");
      result.forEach((col) => console.log(`  - ${col.Field} (${col.Type})`));
    } catch (err) {
      console.log("❌ Error:", err.message);
    }

    // Check if there are any orders with employee assignments
    console.log("\n2. Sample order data:");
    try {
      const [result] = await connection.query(
        "SELECT * FROM view_all_orders LIMIT 3"
      );
      console.log("Sample rows:", result.length);
      if (result.length > 0) {
        console.log("Sample data keys:", Object.keys(result[0]));
        result.forEach((row, i) => console.log(`Row ${i + 1}:`, row));
      }
    } catch (err) {
      console.log("❌ Error:", err.message);
    }

    // Check stored procedures
    console.log("\n3. Available stored procedures:");
    try {
      const [result] = await connection.query(
        "SHOW PROCEDURE STATUS WHERE Db = 'defaultdb'"
      );
      console.log("Procedures found:");
      result.forEach((proc) => console.log(`  - ${proc.Name}`));
    } catch (err) {
      console.log("❌ Error:", err.message);
    }

    // Check the sp_get_dashboard procedure definition
    console.log("\n4. sp_get_dashboard procedure definition:");
    try {
      const [result] = await connection.query(
        "SHOW CREATE PROCEDURE sp_get_dashboard"
      );
      if (result.length > 0) {
        console.log("Procedure definition found");
      }
    } catch (err) {
      console.log("❌ Error:", err.message);
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
  } finally {
    await connection.end();
  }
}

checkDatabaseStructure();
