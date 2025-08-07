import { Link } from "react-router";
import {
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  WalletIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ user, logout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-bold text-gray-800">LaundryOla</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/register/customer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Customer Sign Up
                  </Link>
                  <Link
                    to="/register/employee"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Employee Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* User-specific navigation */}
                {user.role === "CUSTOMER" ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/customer/dashboard"
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <HomeIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/customer/orders"
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      to="/customer/wallet"
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <WalletIcon className="w-4 h-4" />
                      <span>Wallet</span>
                    </Link>
                    <Link
                      to="/customer/profile"
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/employee/dashboard"
                      className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <HomeIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/employee/orders"
                      className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      to="/employee/services"
                      className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                      <span>Services</span>
                    </Link>
                    <Link
                      to="/employee/profile"
                      className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </div>
                )}

                {/* User info and logout */}
                <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-gray-500 capitalize">
                      {user.role.toLowerCase()}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
