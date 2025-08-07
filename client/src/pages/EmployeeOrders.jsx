import React, { useEffect, useState } from "react";
import { employeeApi } from "../utils/api";
import Card from "../components/Card";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const breadcrumbs = [
    { label: "Dashboard", href: "/employee-dashboard" },
    { label: "My Orders" },
  ];

  useEffect(() => {
    fetchEmployeeOrders();
  }, []);

  const fetchEmployeeOrders = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch employee orders error:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
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
    {
      key: "completion_date",
      label: "Completion Date",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders 📋</h1>
        <p className="text-gray-600 mt-2">
          View and track all orders assigned to you
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      <Card>
        <Table
          columns={columns}
          data={orders}
          searchable={true}
          sortable={true}
          emptyMessage="No orders assigned to you yet. Accept orders from the pending section to get started!"
        />
      </Card>

      {/* Order Statistics */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-blue-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.length}
              </div>
              <div className="text-blue-800 text-sm">Total Orders</div>
            </div>
          </Card>

          <Card className="bg-yellow-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.order_status === "Accepted").length}
              </div>
              <div className="text-yellow-800 text-sm">In Progress</div>
            </div>
          </Card>

          <Card className="bg-green-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.order_status === "Completed").length}
              </div>
              <div className="text-green-800 text-sm">Completed</div>
            </div>
          </Card>

          <Card className="bg-purple-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                $
                {orders
                  .filter((o) => o.order_status === "Completed")
                  .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
                  .toFixed(2)}
              </div>
              <div className="text-purple-800 text-sm">Total Earnings</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployeeOrders;
