const db = require("./src/config/db");

async function checkViewStructure() {
  try {
    console.log("Checking view_all_orders structure...");

    // Check columns in the view
    const [columns] = await db.query("DESCRIBE view_all_orders");
    console.log("Columns in view_all_orders:");
    columns.forEach((col) => {
      console.log("-", col.Field, "(" + col.Type + ")");
    });

    // Get sample data
    const [sample] = await db.query("SELECT * FROM view_all_orders LIMIT 1");
    console.log("\nSample row:", sample[0]);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkViewStructure();
