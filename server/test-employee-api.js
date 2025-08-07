const mysql = require("mysql2/promise");

async function testEmployeeAPI() {
  const connection = await mysql.createConnection({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    port: 24345,
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Testing employee dashboard API calls...\n");

    // Test 1: Check if sp_get_dashboard procedure exists
    console.log("1. Testing sp_get_dashboard procedure:");
    try {
      const [result] = await connection.query(
        "CALL sp_get_dashboard('EMPLOYEE', ?)",
        [2]
      );
      console.log("✅ sp_get_dashboard procedure works");
      console.log(
        "Result structure:",
        result.map((r) => r.length)
      );
    } catch (err) {
      console.log("❌ sp_get_dashboard failed:", err.message);
    }

    // Test 2: Check if view_all_orders view exists
    console.log("\n2. Testing view_all_orders view:");
    try {
      const [result] = await connection.query(
        "SELECT * FROM view_all_orders WHERE employee_id = ? LIMIT 1",
        [2]
      );
      console.log("✅ view_all_orders view works");
      console.log(
        "Columns available:",
        result.length > 0 ? Object.keys(result[0]) : "No data"
      );
    } catch (err) {
      console.log("❌ view_all_orders failed:", err.message);
    }

    // Test 3: Check if Employee_Earnings view exists
    console.log("\n3. Testing Employee_Earnings view:");
    try {
      const [result] = await connection.query(
        "SELECT * FROM Employee_Earnings WHERE employee_id = ? LIMIT 1",
        [2]
      );
      console.log("✅ Employee_Earnings view works");
      console.log(
        "Columns available:",
        result.length > 0 ? Object.keys(result[0]) : "No data"
      );
    } catch (err) {
      console.log("❌ Employee_Earnings failed:", err.message);
    }

    // Test 4: Check if sp_update_employee_profile procedure exists
    console.log("\n4. Testing sp_update_employee_profile procedure:");
    try {
      const [result] = await connection.query(
        "CALL sp_update_employee_profile(?, ?, ?, ?)",
        [2, "test", "test", "employee@employee"]
      );
      console.log("✅ sp_update_employee_profile procedure works");
    } catch (err) {
      console.log("❌ sp_update_employee_profile failed:", err.message);
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
  } finally {
    await connection.end();
  }
}

testEmployeeAPI();
