const mysql = require("mysql2/promise");

// Test direct database connection
async function testDatabase() {
  console.log("🗄️ Testing Database Connection...\n");

  const db = mysql.createPool({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    port: 24345,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    console.log("Testing stored procedure directly...");
    const [result] = await db.query("CALL sp_get_dashboard('CUSTOMER', 1)");
    console.log("✅ Database stored procedure works");
    console.log(
      "Profile result:",
      result[0].length > 0 ? "✅ Present" : "❌ Empty"
    );
    console.log("Orders result:", result[1] ? "✅ Present" : "❌ Missing");

    if (result[0].length > 0) {
      console.log("\n📊 Customer Profile Data:");
      console.log("- Customer ID:", result[0][0].customer_id);
      console.log("- Name:", result[0][0].name);
      console.log("- Email:", result[0][0].email);
      console.log("- Total Orders:", result[0][0].total_orders);
    }

    if (result[1]) {
      console.log("\n📋 Recent Orders:");
      console.log("- Orders count:", result[1].length);
    }
  } catch (error) {
    console.error("❌ Database Error:", error.message);
    console.error("Error details:", error);
  } finally {
    await db.end();
  }
}

testDatabase();
