const mysql = require("mysql2/promise");

async function checkEmployeeOrders() {
  const connection = await mysql.createConnection({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    port: 24345,
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Checking employee orders...\n");

    // Check all tables to find employee assignments
    console.log("1. Tables in database:");
    const [tables] = await connection.query("SHOW TABLES");
    tables.forEach((table) => console.log(`  - ${Object.values(table)[0]}`));

    // Check orders table structure
    console.log("\n2. Orders table structure:");
    const [orderCols] = await connection.query("DESCRIBE Orders");
    orderCols.forEach((col) => console.log(`  - ${col.Field} (${col.Type})`));

    // Check if there's a way to get employee's orders
    console.log("\n3. Sample orders with all columns:");
    const [orders] = await connection.query("SELECT * FROM Orders LIMIT 2");
    if (orders.length > 0) {
      console.log("Order columns:", Object.keys(orders[0]));
      orders.forEach((order, i) => console.log(`Order ${i + 1}:`, order));
    }

    // Check employees table
    console.log("\n4. Employees table structure:");
    const [empCols] = await connection.query("DESCRIBE Employees");
    empCols.forEach((col) => console.log(`  - ${col.Field} (${col.Type})`));

    // Test getting employee orders by employee name instead
    console.log("\n5. Testing employee orders query by employee name:");
    try {
      const [result] = await connection.query(
        "SELECT * FROM view_all_orders WHERE employee_name = ?",
        ["employee"]
      );
      console.log(`Found ${result.length} orders for employee 'employee'`);
    } catch (err) {
      console.log("❌ Error:", err.message);
    }
  } catch (error) {
    console.error("Database connection error:", error.message);
  } finally {
    await connection.end();
  }
}

checkEmployeeOrders();
