const axios = require("axios");

async function testEmployeeAPI() {
  // First login as employee
  console.log("1. Logging in as employee...");

  try {
    const loginResponse = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: "employee@employee",
        password: "employee",
      }
    );

    console.log("✅ Login successful");
    const token = loginResponse.data.data.token;

    // Set up axios with token
    const api = axios.create({
      baseURL: "http://localhost:5000/api",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Test dashboard
    console.log("\n2. Testing employee dashboard...");
    const dashboardResponse = await api.get("/employees/dashboard");
    console.log("✅ Dashboard API works!");
    console.log(
      "Dashboard data structure:",
      Object.keys(dashboardResponse.data)
    );

    // Test orders
    console.log("\n3. Testing employee orders...");
    const ordersResponse = await api.get("/employees/orders");
    console.log("✅ Orders API works!");
    console.log("Orders count:", ordersResponse.data.data.length);

    console.log("\n🎉 All employee APIs are working!");
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testEmployeeAPI();
