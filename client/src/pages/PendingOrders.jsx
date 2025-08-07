import React, { useEffect, useState } from "react";
import { orderApi } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  const breadcrumbs = [
    { label: "Dashboard", href: "/employee-dashboard" },
    { label: "Pending Orders" },
  ];

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getPendingOrders();
      if (response.success) {
        setPendingOrders(response.data || []);
      } else {
        setError(response.message || "Failed to fetch pending orders");
      }
    } catch (err) {
      console.error("Fetch pending orders error:", err);
      setError(err.response?.data?.message || "Failed to fetch pending orders");
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

        // Refresh pending orders
        await fetchPendingOrders();
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

  const getActionMessage = () => {
    switch (selectedAction) {
      case "ACCEPT":
        return "Are you sure you want to accept this order? This will assign the order to you and you'll be responsible for completing it.";
      case "REJECT":
        return "Are you sure you want to reject this order? This action cannot be undone and the order will be available for other employees.";
      case "COMPLETE":
        return "Are you sure you want to mark this order as complete? Your earnings will be updated and the customer will be notified.";
      default:
        return "";
    }
  };

  const columns = [
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
      key: "order_status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "order_date",
      label: "Order Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const orderActions = (order) => (
    <div className="flex gap-2">
      {order.order_status === "Pending" && (
        <>
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
        </>
      )}
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

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pending Orders ⏳</h1>
        <p className="text-gray-600 mt-2">
          Review and manage orders waiting for your action
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {/* Statistics Cards */}
      {pendingOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-yellow-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingOrders.length}
              </div>
              <div className="text-yellow-800 text-sm">Total Pending</div>
            </div>
          </Card>

          <Card className="bg-blue-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  pendingOrders.filter((o) => o.order_status === "Pending")
                    .length
                }
              </div>
              <div className="text-blue-800 text-sm">Awaiting Action</div>
            </div>
          </Card>

          <Card className="bg-green-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  pendingOrders.filter((o) => o.order_status === "Accepted")
                    .length
                }
              </div>
              <div className="text-green-800 text-sm">Accepted</div>
            </div>
          </Card>

          <Card className="bg-purple-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                $
                {pendingOrders
                  .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
                  .toFixed(2)}
              </div>
              <div className="text-purple-800 text-sm">Total Value</div>
            </div>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        {pendingOrders.length > 0 ? (
          <Table
            columns={columns}
            data={pendingOrders}
            actions={orderActions}
            searchable={true}
            sortable={true}
            emptyMessage="No pending orders at the moment."
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Orders
            </h3>
            <p className="text-gray-500 mb-4">
              There are no orders waiting for your action right now.
            </p>
            <p className="text-sm text-gray-400">
              New orders will appear here when customers place them.
            </p>
          </div>
        )}
      </Card>

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
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <div>#{selectedOrder.order_id}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Customer:</span>
                  <div>{selectedOrder.customer_name || "N/A"}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Service:</span>
                  <div>{selectedOrder.service_name}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <div className="font-semibold text-green-600">
                    ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div>{selectedOrder.quantity}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Order Date:</span>
                  <div>
                    {new Date(selectedOrder.order_date).toLocaleDateString()}
                  </div>
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
              variant={
                selectedAction === "REJECT"
                  ? "danger"
                  : selectedAction === "COMPLETE"
                  ? "success"
                  : "primary"
              }
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

export default PendingOrders;
