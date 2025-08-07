// Test authentication state management
// This script can be run in the browser console to test auth persistence

console.log("🧪 Testing Authentication State Management");

// Function to check current auth state
function checkAuthState() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log("=== Current Auth State ===");
  console.log("Token exists:", !!token);
  console.log(
    "Token preview:",
    token ? token.substring(0, 20) + "..." : "null"
  );

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log("User data:", userData);
      console.log("User role:", userData.role);
      console.log("User ID:", userData.customer_id || userData.employee_id);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  } else {
    console.log("User data: null");
  }

  console.log(
    "Axios auth header:",
    axios.defaults.headers.common["Authorization"] || "not set"
  );
  console.log("========================");
}

// Function to simulate login (for testing)
function simulateLogin(userType = "customer") {
  console.log(`🔐 Simulating ${userType} login...`);

  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken.signature";
  const mockUser =
    userType === "customer"
      ? {
          customer_id: 1,
          name: "Test Customer",
          email: "test@customer.com",
          role: "CUSTOMER",
        }
      : {
          employee_id: 1,
          name: "Test Employee",
          email: "test@employee.com",
          role: "EMPLOYEE",
        };

  localStorage.setItem("token", mockToken);
  localStorage.setItem("user", JSON.stringify(mockUser));

  console.log("✅ Mock login data stored");
  checkAuthState();
}

// Function to simulate logout
function simulateLogout() {
  console.log("🚪 Simulating logout...");

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];

  console.log("✅ Auth data cleared");
  checkAuthState();
}

// Function to simulate page refresh
function simulateRefresh() {
  console.log(
    "🔄 Simulating page refresh - checking if auth state persists..."
  );

  // This simulates what App.jsx does on mount
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    try {
      const parsedUser = JSON.parse(userData);
      if (
        parsedUser.role &&
        (parsedUser.customer_id || parsedUser.employee_id)
      ) {
        console.log("✅ Auth state would persist after refresh");
        console.log(
          "User would be redirected to:",
          parsedUser.role === "CUSTOMER"
            ? "/customer/dashboard"
            : "/employee/dashboard"
        );
      } else {
        console.log("❌ Incomplete user data - auth would be cleared");
      }
    } catch (e) {
      console.log("❌ Invalid user data - auth would be cleared");
    }
  } else {
    console.log("ℹ️ No auth data - user would see landing page");
  }
}

// Run initial check
checkAuthState();

// Export functions for manual testing
window.authTest = {
  checkState: checkAuthState,
  simulateLogin,
  simulateLogout,
  simulateRefresh,
};

console.log("📝 Available test functions:");
console.log("- authTest.checkState() - Check current auth state");
console.log(
  '- authTest.simulateLogin("customer" | "employee") - Simulate login'
);
console.log("- authTest.simulateLogout() - Simulate logout");
console.log("- authTest.simulateRefresh() - Test refresh behavior");
