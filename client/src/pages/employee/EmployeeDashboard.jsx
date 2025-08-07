import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import {
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  BanknotesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, ordersRes] = await Promise.all([
        axios.get("/employees/dashboard"),
        axios.get("/employees/orders"),
      ]);

      console.log("Dashboard response:", dashboardRes.data);
      console.log("Orders response:", ordersRes.data);

      // Extract employee stats from the dashboard response
      const employeeStats = dashboardRes.data.employee_stats;
      const pendingOrdersData = dashboardRes.data.pending_orders || [];
      const currentWork = dashboardRes.data.current_work || [];

      // Create profile data from employee stats
      const profileData = {
        name: employeeStats?.name,
        earnings_balance: employeeStats?.earnings_balance || 0,
        formatted_earnings: employeeStats?.formatted_earnings,
        total_orders_handled: employeeStats?.total_orders_handled || 0,
        completed_orders: employeeStats?.completed_orders || 0,
        in_progress_orders: employeeStats?.in_progress_orders || 0,
      };

      setProfile(profileData);
      setPendingOrders(pendingOrdersData);
      setRecentOrders(ordersRes.data.data || []); // Use orders from the orders API
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      await axios.put(`/orders/${orderId}/manage`, {
        action: action, // Send 'ACCEPT' or 'REJECT' directly
      });

      // Refresh dashboard data
      fetchDashboardData();

      alert(`Order ${action.toLowerCase()} successfully!`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} order`
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Accepted":
        return "text-blue-600 bg-blue-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-gray-600">Manage orders and track your earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Earnings Balance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{profile?.earnings_balance || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.total_orders_handled || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.in_progress_orders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.completed_orders || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Pending Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Pending Orders
              </h2>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingOrders.length} pending
              </span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pending orders
                </h3>
                <p className="text-gray-600">All orders are up to date!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Order #{order.order_id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Customer: {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Service: {order.service_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ₹{order.total_amount}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {order.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          Ordered:{" "}
                          {order.formatted_date ||
                            order.order_datetime ||
                            "Unknown date"}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleOrderAction(order.order_id, "ACCEPT")
                        }
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleOrderAction(order.order_id, "REJECT")
                        }
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Earnings Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Current Earnings</h3>
            <div className="text-3xl font-bold mb-3">
              ₹{profile?.earnings_balance || 0}
            </div>
            <p className="text-green-100 text-sm">
              Complete more orders to increase earnings
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/employee/orders"
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <span>View All Orders</span>
              </Link>
              <Link
                to="/employee/services"
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <ChartBarIcon className="h-5 w-5" />
                <span>Manage Services</span>
              </Link>
              <Link
                to="/employee/profile"
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <UsersIcon className="h-5 w-5" />
                <span>Update Profile</span>
              </Link>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {profile?.total_orders_handled > 0
                    ? `${Math.round(
                        (profile?.completed_orders /
                          profile?.total_orders_handled) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Avg. Earnings/Order
                </span>
                <span className="text-sm font-semibold text-green-600">
                  ₹
                  {profile?.completed_orders > 0
                    ? Math.round(
                        profile?.earnings_balance / profile?.completed_orders
                      )
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/employee/orders"
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.service_name} (x{order.quantity})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.formatted_date ||
                        (order.order_datetime &&
                          new Date(
                            order.order_datetime
                          ).toLocaleDateString()) ||
                        "Unknown date"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
