import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { customerApi, orderApi, serviceApi } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Alert from "../components/Alert";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add Money form
  const [addMoneyForm, setAddMoneyForm] = useState({ amount: "" });
  const [addingMoney, setAddingMoney] = useState(false);

  // Quick Order form
  const [quickOrderForm, setQuickOrderForm] = useState({
    service_id: "",
    quantity: "1",
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const breadcrumbs = [{ label: "Dashboard" }];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, ordersRes, servicesRes] = await Promise.all([
        customerApi.getProfile(),
        customerApi.getOrders(),
        serviceApi.getServices(),
      ]);

      if (profileRes.success) {
        setProfile(profileRes.data);
      }

      if (ordersRes.success) {
        // Get only recent orders (last 5)
        const allOrders = ordersRes.data || [];
        setRecentOrders(allOrders.slice(0, 5));
      }

      if (servicesRes.success) {
        setServices(servicesRes.data || []);
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amount = parseFloat(addMoneyForm.amount);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setAddingMoney(true);
    setError("");
    setSuccess("");

    try {
      const response = await customerApi.addMoney({ amount });

      if (response.success) {
        setSuccess(`Successfully added $${amount} to your wallet!`);
        setAddMoneyForm({ amount: "" });

        // Update profile balance
        setProfile((prev) => ({
          ...prev,
          wallet_balance: prev.wallet_balance + amount,
        }));
      } else {
        setError(response.message || "Failed to add money");
      }
    } catch (err) {
      console.error("Add money error:", err);
      setError(err.response?.data?.message || "Failed to add money");
    } finally {
      setAddingMoney(false);
    }
  };

  const handleQuickOrder = async (e) => {
    e.preventDefault();
    const serviceId = parseInt(quickOrderForm.service_id);
    const quantity = parseInt(quickOrderForm.quantity);

    if (!serviceId || !quantity || quantity <= 0) {
      setError("Please select a service and enter valid quantity");
      return;
    }

    setPlacingOrder(true);
    setError("");
    setSuccess("");

    try {
      const response = await orderApi.placeOrder({
        service_id: serviceId,
        quantity: quantity,
      });

      if (response.success) {
        setSuccess("Order placed successfully!");
        setQuickOrderForm({ service_id: "", quantity: "1" });

        // Refresh dashboard data
        await fetchDashboardData();
      } else {
        setError(response.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Place order error:", err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const getSelectedServicePrice = () => {
    const selectedService = services.find(
      (s) => s.service_id == quickOrderForm.service_id
    );
    return selectedService ? selectedService.price_per_item : 0;
  };

  const calculateOrderTotal = () => {
    const price = getSelectedServicePrice();
    const quantity = parseInt(quickOrderForm.quantity) || 0;
    return price * quantity;
  };

  if (loading) return <Loader />;

  const orderColumns = [
    {
      key: "order_id",
      label: "Order ID",
      render: (value) => `#${value}`,
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
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your laundry orders and wallet from your dashboard
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {/* Stats Overview */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">
                ${parseFloat(profile.wallet_balance).toFixed(2)}
              </div>
              <div className="text-blue-100 text-sm">Wallet Balance</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{profile.total_orders}</div>
              <div className="text-green-100 text-sm">Total Orders</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{profile.pending_orders}</div>
              <div className="text-yellow-100 text-sm">Pending Orders</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">
                ${parseFloat(profile.lifetime_spent || 0).toFixed(2)}
              </div>
              <div className="text-purple-100 text-sm">Lifetime Spent</div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Money Section */}
        <Card title="Add Money to Wallet" className="lg:col-span-1">
          <form onSubmit={handleAddMoney} className="space-y-4">
            <FormInput
              label="Amount ($)"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={addMoneyForm.amount}
              onChange={(e) => setAddMoneyForm({ amount: e.target.value })}
              placeholder="Enter amount to add"
              required
              disabled={addingMoney}
            />

            {profile && addMoneyForm.amount && (
              <div className="text-sm text-gray-600">
                New balance will be: $
                {(
                  parseFloat(profile.wallet_balance) +
                  parseFloat(addMoneyForm.amount || 0)
                ).toFixed(2)}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={addingMoney}
              disabled={addingMoney}
            >
              💰 Add Money
            </Button>
          </form>
        </Card>

        {/* Quick Order Section */}
        <Card title="Quick Order" className="lg:col-span-2">
          <form onSubmit={handleQuickOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service *
                </label>
                <select
                  name="service_id"
                  value={quickOrderForm.service_id}
                  onChange={(e) =>
                    setQuickOrderForm({
                      ...quickOrderForm,
                      service_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={placingOrder}
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service.service_id} value={service.service_id}>
                      {service.service_name} - $
                      {parseFloat(service.price_per_item).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Quantity"
                name="quantity"
                type="number"
                min="1"
                value={quickOrderForm.quantity}
                onChange={(e) =>
                  setQuickOrderForm({
                    ...quickOrderForm,
                    quantity: e.target.value,
                  })
                }
                placeholder="1"
                required
                disabled={placingOrder}
                className="md:col-span-1"
              />

              <div className="md:col-span-1 flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={placingOrder}
                  disabled={placingOrder || !quickOrderForm.service_id}
                >
                  🧺 Place Order
                </Button>
              </div>
            </div>

            {quickOrderForm.service_id && quickOrderForm.quantity && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>Order Total:</span>
                  <span className="font-semibold text-lg">
                    ${calculateOrderTotal().toFixed(2)}
                  </span>
                </div>
                {profile && calculateOrderTotal() > profile.wallet_balance && (
                  <div className="text-red-600 text-sm mt-2">
                    ⚠️ Insufficient wallet balance. Please add money first.
                  </div>
                )}
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <Card title="Recent Orders" subtitle="Your latest order history">
          {recentOrders.length > 0 ? (
            <div>
              <Table
                columns={orderColumns}
                data={recentOrders}
                emptyMessage="No orders yet. Place your first order above!"
              />
              <div className="mt-4 text-center">
                <Link to="/orders">
                  <Button variant="outline" size="md">
                    View All Orders →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-500 mb-4">No orders yet</p>
              <p className="text-sm text-gray-400">
                Place your first order using the quick order form above!
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-4">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold">My Orders</div>
              <div className="text-sm text-gray-600">View all your orders</div>
            </div>
          </Card>
        </Link>

        <Link to="/wallet">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center py-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Wallet</div>
              <div className="text-sm text-gray-600">Manage your wallet</div>
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
    </div>
  );
};

export default CustomerDashboard;
