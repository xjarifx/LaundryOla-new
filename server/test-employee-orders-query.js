const mysql = require("mysql2/promise");

async function testEmployeeOrdersQuery() {
  const connection = await mysql.createConnection({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    port: 24345,
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Testing employee orders query...\n");

    // Test the new employee orders query
    console.log("1. Testing new employee orders query for employee_id = 2:");
    const [result] = await connection.query(
      `SELECT vo.* FROM view_all_orders vo 
       JOIN Orders o ON vo.order_id = o.order_id 
       WHERE o.employee_id = ? OR o.employee_id IS NULL
       ORDER BY vo.order_datetime DESC`,
      [2]
    );

    console.log(`✅ Found ${result.length} orders`);
    result.forEach((order, i) => {
      console.log(`Order ${i + 1}:`, {
        order_id: order.order_id,
        customer_name: order.customer_name,
        service_name: order.service_name,
        status: order.status,
        employee_name: order.employee_name,
      });
    });

    // Also test for employee_id = 1 which has assigned orders
    console.log("\n2. Testing for employee_id = 1 (who has orders):");
    const [result2] = await connection.query(
      `SELECT vo.* FROM view_all_orders vo 
       JOIN Orders o ON vo.order_id = o.order_id 
       WHERE o.employee_id = ?
       ORDER BY vo.order_datetime DESC`,
      [1]
    );

    console.log(`✅ Found ${result2.length} orders for employee 1`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

testEmployeeOrdersQuery();
