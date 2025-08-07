import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Profile from "./pages/Profile";

// Customer Pages
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerWallet from "./pages/CustomerWallet";

// Employee Pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PendingOrders from "./pages/PendingOrders";
import EmployeeOrders from "./pages/EmployeeOrders";
import Services from "./pages/Services";

// Component to auto-redirect based on user role
const AutoRedirect = () => {
  const { isAuthenticated, isCustomer, isEmployee } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (isCustomer()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isEmployee()) {
    return <Navigate to="/employee-dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Customer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <CustomerOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <CustomerWallet />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee-dashboard"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending-orders"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <PendingOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <EmployeeOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <Services />
                </ProtectedRoute>
              }
            />

            {/* Shared Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Redirect based on user role */}
            <Route path="/auto-redirect" element={<AutoRedirect />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
