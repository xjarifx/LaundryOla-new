import { Navigate } from "react-router";

const ProtectedRoute = ({ children, user, requiredRole }) => {
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to appropriate dashboard or home
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to user's own dashboard if they have a different role
    if (user.role === "CUSTOMER") {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (user.role === "EMPLOYEE") {
      return <Navigate to="/employee/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
