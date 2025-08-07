import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated, isCustomer, isEmployee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  const customerMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/orders", label: "My Orders", icon: "📋" },
    { path: "/wallet", label: "Wallet", icon: "💰" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  const employeeMenuItems = [
    { path: "/employee-dashboard", label: "Dashboard", icon: "🏢" },
    { path: "/pending-orders", label: "Pending Orders", icon: "⏳" },
    { path: "/my-orders", label: "My Orders", icon: "📋" },
    { path: "/services", label: "Services", icon: "🧺" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">🧺</span>
              <span className="ml-2 text-xl font-bold">LaundryOla</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated() && (
                <>
                  {isCustomer() &&
                    customerMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                          isActivePath(item.path)
                            ? "bg-blue-800 text-white"
                            : "text-blue-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                  {isEmployee() &&
                    employeeMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                          isActivePath(item.path)
                            ? "bg-blue-800 text-white"
                            : "text-blue-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                </>
              )}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated() ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-right">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-blue-100 text-xs capitalize">
                      {user?.role?.toLowerCase()}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            {isAuthenticated() && (
              <>
                {isCustomer() &&
                  customerMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActivePath(item.path)
                          ? "bg-blue-800 text-white"
                          : "text-blue-100 hover:bg-blue-600 hover:text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                {isEmployee() &&
                  employeeMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActivePath(item.path)
                          ? "bg-blue-800 text-white"
                          : "text-blue-100 hover:bg-blue-600 hover:text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                <div className="border-t border-blue-600 pt-4 pb-3">
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium">{user?.name}</div>
                      <div className="text-sm font-medium text-blue-100 capitalize">
                        {user?.role?.toLowerCase()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated() && (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
