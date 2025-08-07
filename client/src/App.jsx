import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import CustomerRegister from "./pages/auth/CustomerRegister";
import EmployeeRegister from "./pages/auth/EmployeeRegister";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerWallet from "./pages/customer/CustomerWallet";
import CustomerProfile from "./pages/customer/CustomerProfile";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeOrders from "./pages/employee/EmployeeOrders";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import ServicesManagement from "./pages/employee/ServicesManagement";
import ProtectedRoute from "./components/ProtectedRoute";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000/api";

// Add request interceptor to include token in every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];

      // Update user state if we're in a React component context
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        // Only redirect if not already on login/home page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          // Check if userData is actually a string and not "undefined"
          if (userData === "undefined" || userData === "null") {
            throw new Error("Invalid user data");
          }

          const parsedUser = JSON.parse(userData);

          // Validate that user has required fields
          if (
            !parsedUser.role ||
            (!parsedUser.customer_id && !parsedUser.employee_id)
          ) {
            throw new Error("Incomplete user data - missing role or ID");
          }

          // Set the default Authorization header for axios
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Validate token by making a quick API call
          try {
            const endpoint =
              parsedUser.role === "CUSTOMER"
                ? "/customers/profile"
                : "/employees/profile";
            await axios.get(endpoint);

            // Token is valid, set user state
            setUser(parsedUser);
          } catch (apiError) {
            // Token is invalid or expired
            throw new Error("Token validation failed");
          }
        } catch (error) {
          console.error("Error initializing authentication:", error);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    // Force navigation to home page
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} logout={logout} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate
                    to={
                      user.role === "CUSTOMER"
                        ? "/customer/dashboard"
                        : "/employee/dashboard"
                    }
                  />
                ) : (
                  <Login setUser={setUser} />
                )
              }
            />
            <Route
              path="/register/customer"
              element={
                user ? (
                  <Navigate to="/customer/dashboard" />
                ) : (
                  <CustomerRegister />
                )
              }
            />
            <Route
              path="/register/employee"
              element={
                user ? (
                  <Navigate to="/employee/dashboard" />
                ) : (
                  <EmployeeRegister />
                )
              }
            />

            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute user={user} requiredRole="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <ProtectedRoute user={user} requiredRole="CUSTOMER">
                  <CustomerOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/wallet"
              element={
                <ProtectedRoute user={user} requiredRole="CUSTOMER">
                  <CustomerWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute user={user} requiredRole="CUSTOMER">
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute user={user} requiredRole="EMPLOYEE">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/orders"
              element={
                <ProtectedRoute user={user} requiredRole="EMPLOYEE">
                  <EmployeeOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute user={user} requiredRole="EMPLOYEE">
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/services"
              element={
                <ProtectedRoute user={user} requiredRole="EMPLOYEE">
                  <ServicesManagement />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
