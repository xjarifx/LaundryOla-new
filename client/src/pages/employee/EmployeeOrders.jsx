import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  ClipboardDocumentListIcon,
  FunnelIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { formatDateShort } from "../../utils/dateUtils";

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [assignedRes, pendingRes] = await Promise.all([
        api.get("/employees/orders"),
        api.get("/orders/pending"),
      ]);

      console.log("Assigned orders response:", assignedRes.data);
      console.log("Pending orders response:", pendingRes.data);

      setOrders(assignedRes.data.data || []);
      setPendingOrders(pendingRes.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Set empty arrays on error to prevent iteration issues
      setOrders([]);
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      await api.put(`/orders/${orderId}/manage`, { action });

      // Refresh orders data
      fetchOrders();

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
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "Accepted":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "Completed":
        return "text-green-600 bg-green-100 border-green-200";
      case "Rejected":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <ClockIcon className="h-4 w-4" />;
      case "Accepted":
        return <ClipboardDocumentListIcon className="h-4 w-4" />;
      case "Completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "Rejected":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Combine pending and assigned orders for filtering, removing duplicates
  const allOrdersMap = new Map();

  // Add assigned orders first
  (orders || []).forEach((order) => {
    allOrdersMap.set(order.order_id, { ...order, source: "assigned" });
  });

  // Add pending orders, but don't overwrite assigned ones
  (pendingOrders || []).forEach((order) => {
    if (!allOrdersMap.has(order.order_id)) {
      allOrdersMap.set(order.order_id, { ...order, source: "pending" });
    }
  });

  const allOrders = Array.from(allOrdersMap.values());

  console.log("Deduplicated orders:", allOrders.length);
  console.log("Original assigned:", orders?.length || 0);
  console.log("Original pending:", pendingOrders?.length || 0);

  const filteredOrders = allOrders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  // Calculate stats from deduplicated data
  const pendingCount = allOrders.filter(
    (order) => order.status === "Pending"
  ).length;
  const acceptedCount = allOrders.filter(
    (order) => order.status === "Accepted"
  ).length;
  const completedCount = allOrders.filter(
    (order) => order.status === "Completed"
  ).length;
  const totalCount = allOrders.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Management
        </h1>
        <p className="text-gray-600">
          Manage pending orders and track completed work
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingOrders?.length || 0}
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
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {acceptedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹
                {allOrders
                  .filter((o) => o.status === "Completed")
                  .reduce(
                    (sum, order) => sum + parseFloat(order.total_amount || 0),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Filter by status:
          </span>
          <div className="flex space-x-2">
            {["all", "pending", "accepted", "completed", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === status
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "No orders available at the moment."
                : `No ${filter} orders found.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div
                key={`${order.order_id}-${order.status}-${
                  order.source || "default"
                }`}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-semibold text-gray-900">
                      Order #{order.order_id}
                    </div>
                    <div
                      className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                    {order.status === "Pending" && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{order.total_amount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDateShort(order.order_datetime)}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Order Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium text-gray-900">
                          {order.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-gray-900">
                          {order.service_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium text-gray-900">
                          {order.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per item:</span>
                        <span className="font-medium text-gray-900">
                          ₹{order.price_per_item}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Customer Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-600">
                        <span className="font-medium">Address:</span>
                        <p className="mt-1">{order.customer_address}</p>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{order.customer_phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                {order.status === "Pending" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleOrderAction(order.order_id, "ACCEPT")
                      }
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() =>
                        handleOrderAction(order.order_id, "REJECT")
                      }
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Reject Order
                    </button>
                  </div>
                )}

                {order.status === "Accepted" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleOrderAction(order.order_id, "COMPLETE")
                      }
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Mark as Complete</span>
                    </button>
                  </div>
                )}

                {order.status === "Completed" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Order completed successfully
                        </span>
                      </div>
                      <span className="text-sm text-green-700">
                        Earned: ₹{order.total_amount}
                      </span>
                    </div>
                  </div>
                )}

                {order.status === "Rejected" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-2">
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Order was rejected
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeOrders;
