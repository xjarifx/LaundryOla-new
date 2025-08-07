import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { employeeApi, orderApi } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  const breadcrumbs = [{ label: "Dashboard" }];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, employeeOrdersRes, pendingOrdersRes] =
        await Promise.all([
          employeeApi.getProfile(),
          employeeApi.getOrders(),
          orderApi.getPendingOrders(),
        ]);

      if (profileRes.success) {
        setProfile(profileRes.data);
      }

      if (employeeOrdersRes.success) {
        // Get recent orders (last 5)
        const allOrders = employeeOrdersRes.data || [];
        setRecentOrders(allOrders.slice(0, 5));
      }

      if (pendingOrdersRes.success) {
        setPendingOrders(pendingOrdersRes.data || []);
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = (order, action) => {
    setSelectedOrder(order);
    setSelectedAction(action);
    setShowActionModal(true);
  };

  const confirmOrderAction = async () => {
    if (!selectedOrder || !selectedAction) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await orderApi.manageOrder(
        selectedOrder.order_id,
        selectedAction
      );

      if (response.success) {
        setSuccess(`Order ${selectedAction.toLowerCase()}ed successfully!`);
        setShowActionModal(false);
        setSelectedOrder(null);
        setSelectedAction("");

        // Refresh dashboard data
        await fetchDashboardData();
      } else {
        setError(
          response.message || `Failed to ${selectedAction.toLowerCase()} order`
        );
      }
    } catch (err) {
      console.error("Order action error:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${selectedAction.toLowerCase()} order`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const pendingOrderColumns = [
    {
      key: "order_id",
      label: "Order ID",
      render: (value) => `#${value}`,
    },
    {
      key: "customer_name",
      label: "Customer",
      render: (value) => value || "N/A",
    },
    {
      key: "service_name",
      label: "Service",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "total_amount",
      label: "Amount",
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: "order_date",
      label: "Order Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const recentOrderColumns = [
    {
      key: "order_id",
      label: "Order ID",
      render: (value) => `#${value}`,
    },
    {
      key: "customer_name",
      label: "Customer",
    },
    {
      key: "service_name",
      label: "Service",
    },
    {
      key: "order_status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "completion_date",
      label: "Completed",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  const pendingOrderActions = (order) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="primary"
        onClick={() => handleOrderAction(order, "ACCEPT")}
      >
        Accept
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => handleOrderAction(order, "REJECT")}
      >
        Reject
      </Button>
      {order.order_status === "Accepted" && (
        <Button
          size="sm"
          variant="success"
          onClick={() => handleOrderAction(order, "COMPLETE")}
        >
          Complete
        </Button>
      )}
    </div>
  );

  const getActionMessage = () => {
    switch (selectedAction) {
      case "ACCEPT":
        return "Are you sure you want to accept this order? This will assign the order to you.";
      case "REJECT":
        return "Are you sure you want to reject this order? This action cannot be undone.";
      case "COMPLETE":
        return "Are you sure you want to mark this order as complete? Your earnings will be updated.";
      default:
        return "";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}! 👨‍💼
        </h1>
        <p className="text-gray-600 mt-2">
          Manage orders and track your earnings from your employee dashboard
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {/* Stats Overview */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">
                ${parseFloat(profile.earnings_balance).toFixed(2)}
              </div>
              <div className="text-green-100 text-sm">Earnings Balance</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {profile.total_orders_handled}
              </div>
              <div className="text-blue-100 text-sm">Total Orders</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {profile.completed_orders}
              </div>
              <div className="text-purple-100 text-sm">Completed</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {profile.in_progress_orders}
              </div>
              <div className="text-orange-100 text-sm">In Progress</div>
            </div>
          </Card>
        </div>
      )}

      {/* Pending Orders Section */}
      <div className="mb-8">
        <Card title="Pending Orders" subtitle="Orders waiting for your action">
          {pendingOrders.length > 0 ? (
            <Table
              columns={pendingOrderColumns}
              data={pendingOrders}
              actions={pendingOrderActions}
              searchable={true}
              emptyMessage="No pending orders at the moment."
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-500 mb-4">No pending orders</p>
              <p className="text-sm text-gray-400">
                New orders will appear here when customers place them.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8">
        <Card title="Recent Orders" subtitle="Your recently handled orders">
          {recentOrders.length > 0 ? (
            <div>
              <Table
                columns={recentOrderColumns}
                data={recentOrders}
                emptyMessage="No recent orders."
              />
              <div className="mt-4 text-center">
                <Link to="/my-orders">
                  <Button variant="outline" size="md">
                    View All Orders →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-500 mb-4">No orders handled yet</p>
              <p className="text-sm text-gray-400">
                Accept orders from the pending section to get started!
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/pending-orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-4">
              <div className="text-3xl mb-2">⏳</div>
              <div className="font-semibold">Pending Orders</div>
              <div className="text-sm text-gray-600">
                View all pending orders
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/my-orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-4">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold">My Orders</div>
              <div className="text-sm text-gray-600">View assigned orders</div>
            </div>
          </Card>
        </Link>

        <Link to="/services">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🧺</div>
              <div className="font-semibold">Services</div>
              <div className="text-sm text-gray-600">Manage services</div>
            </div>
          </Card>
        </Link>

        <Link to="/profile">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-4">
              <div className="text-3xl mb-2">👤</div>
              <div className="font-semibold">Profile</div>
              <div className="text-sm text-gray-600">
                Update your information
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Order Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setSelectedOrder(null);
          setSelectedAction("");
        }}
        title={`${selectedAction} Order`}
        size="md"
      >
        <div className="space-y-4">
          <p>{getActionMessage()}</p>

          {selectedOrder && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Order ID:</strong> #{selectedOrder.order_id}
                </div>
                <div>
                  <strong>Customer:</strong>{" "}
                  {selectedOrder.customer_name || "N/A"}
                </div>
                <div>
                  <strong>Service:</strong> {selectedOrder.service_name}
                </div>
                <div>
                  <strong>Amount:</strong> $
                  {parseFloat(selectedOrder.total_amount).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowActionModal(false);
                setSelectedOrder(null);
                setSelectedAction("");
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={selectedAction === "REJECT" ? "danger" : "primary"}
              onClick={confirmOrderAction}
              loading={actionLoading}
              disabled={actionLoading}
            >
              Confirm {selectedAction}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
