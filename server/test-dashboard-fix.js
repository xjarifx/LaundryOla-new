const axios = require("axios");
const mysql = require("mysql2/promise");

// Test the dashboard API endpoint
async function testDashboard() {
  console.log("🧪 Testing Dashboard API...\n");

  const BASE_URL = "http://localhost:5000/api";

  try {
    // First, register a customer to get a token
    console.log("1️⃣ Registering test customer...");
    const customerData = {
      name: "Dashboard Test",
      phone: "5555555555",
      email: "dashtest@example.com",
      password: "testpass123",
      address: "123 Dashboard Test St",
    };

    const regResponse = await axios.post(
      `${BASE_URL}/auth/customers/register`,
      customerData
    );
    console.log("✅ Registration successful");

    const token = regResponse.data.data.token;
    console.log("Token received:", token ? "✅ Yes" : "❌ No");

    // Test dashboard endpoint
    console.log("\n2️⃣ Testing dashboard endpoint...");
    const dashboardResponse = await axios.get(
      `${BASE_URL}/customers/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Dashboard API Success!");
    console.log(
      "Profile data:",
      dashboardResponse.data.profile ? "✅ Present" : "❌ Missing"
    );
    console.log(
      "Recent orders:",
      Array.isArray(dashboardResponse.data.recent_orders)
        ? "✅ Present"
        : "❌ Missing"
    );

    console.log("\n🎉 Dashboard test completed successfully!");
  } catch (error) {
    console.error(
      "❌ Dashboard Test Error:",
      error.response ? error.response.data : error.message
    );

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error details:", error.response.data);
    }
  }
}

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
  } catch (error) {
    console.error("❌ Database Error:", error.message);
  } finally {
    await db.end();
  }
}

// Run tests
async function runTests() {
  console.log("=".repeat(50));
  console.log("🚀 DASHBOARD FIX TESTING");
  console.log("=".repeat(50));

  // Test database first
  await testDatabase();

  console.log("\n" + "=".repeat(50));

  // Test API if server is running
  await testDashboard();
}

if (require.main === module) {
  runTests();
}

module.exports = { testDashboard, testDatabase };
