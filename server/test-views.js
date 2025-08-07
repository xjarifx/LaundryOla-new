const db = require("./src/config/db");

async function testViews() {
  try {
    console.log("Testing database views...");

    // Check if views exist
    const [tables] = await db.query("SHOW TABLES LIKE 'view_%'");
    console.log("Views found:", tables.length);
    tables.forEach((table) => {
      console.log("-", Object.values(table)[0]);
    });

    // Test the specific view
    try {
      const [orders] = await db.query("SELECT * FROM view_all_orders LIMIT 1");
      console.log("view_all_orders works:", orders.length, "rows");
    } catch (err) {
      console.error("view_all_orders error:", err.message);
    }

    // Test customers table
    const [customers] = await db.query(
      "SELECT customer_id, name FROM Customers LIMIT 3"
    );
    console.log("Customers found:", customers);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

testViews();
