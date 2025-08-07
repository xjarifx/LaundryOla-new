const mysql = require("mysql2/promise");

async function testDashboard() {
  const connection = await mysql.createConnection({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    port: 24345,
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Testing dashboard procedure...\n");

    // Try to get the procedure definition
    console.log("1. Trying to show procedure definition:");
    try {
      const [result] = await connection.query(
        "SHOW CREATE PROCEDURE sp_get_dashboard"
      );
      console.log("Procedure SQL:", result[0]["Create Procedure"]);
    } catch (err) {
      console.log("❌ Error getting procedure definition:", err.message);
    }

    // Let's try calling it with different parameters
    console.log("\n2. Testing procedure with EMPLOYEE type:");
    try {
      const [result] = await connection.query(
        "CALL sp_get_dashboard('EMPLOYEE', ?)",
        [2]
      );
      console.log("✅ Success! Results:");
      result.forEach((resultSet, i) => {
        console.log(`Result set ${i}:`, resultSet.length, "rows");
        if (resultSet.length > 0) {
          console.log("Sample row:", resultSet[0]);
        }
      });
    } catch (err) {
      console.log("❌ Procedure failed:", err.message);
      console.log("SQL State:", err.sqlState);
      console.log("Error Code:", err.errno);
    }

    // Try with CUSTOMER type for comparison
    console.log("\n3. Testing procedure with CUSTOMER type:");
    try {
      const [result] = await connection.query(
        "CALL sp_get_dashboard('CUSTOMER', ?)",
        [3]
      );
      console.log("✅ Customer dashboard works");
    } catch (err) {
      console.log("❌ Customer procedure also failed:", err.message);
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
  } finally {
    await connection.end();
  }
}

testDashboard();
