const db = require("./src/config/db");

async function testCustomerOrders() {
  try {
    console.log("Testing customer orders query...");

    // Test the exact query from the controller
    const customerId = 3; // Your logged in customer ID
    const [result] = await db.query(
      "SELECT * FROM view_all_orders WHERE customer_id = ? ORDER BY order_date DESC",
      [customerId]
    );

    console.log("Query successful! Found orders:", result.length);
    console.log("Orders:", result);

    process.exit(0);
  } catch (error) {
    console.error("Query error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

testCustomerOrders();
