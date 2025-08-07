import React, { useEffect, useState } from "react";
import { customerApi } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Table from "../components/Table";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const CustomerWallet = () => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addMoneyForm, setAddMoneyForm] = useState({ amount: "" });
  const [addingMoney, setAddingMoney] = useState(false);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Wallet" },
  ];

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [profileRes, transactionsRes] = await Promise.all([
        customerApi.getProfile(),
        customerApi.getTransactions(),
      ]);

      if (profileRes.success) {
        setProfile(profileRes.data);
      }

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data || []);
      }
    } catch (err) {
      console.error("Wallet data fetch error:", err);
      setError("Failed to load wallet data");
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

    if (amount > 10000) {
      setError("Maximum amount per transaction is $10,000");
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

        // Refresh wallet data
        await fetchWalletData();
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

  const transactionColumns = [
    {
      key: "transaction_id",
      label: "Transaction ID",
      render: (value) => `#${value}`,
    },
    {
      key: "transaction_type",
      label: "Type",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "CREDIT"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "CREDIT" ? "+ Credit" : "- Debit"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value, row) => (
        <span
          className={
            row.transaction_type === "CREDIT"
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {row.transaction_type === "CREDIT" ? "+" : "-"}$
          {parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "transaction_date",
      label: "Date",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const quickAmounts = [10, 25, 50, 100];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wallet 💰</h1>
        <p className="text-gray-600 mt-2">
          Manage your wallet balance and view transaction history
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {/* Wallet Balance */}
      {profile && (
        <Card className="mb-8">
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              ${parseFloat(profile.wallet_balance).toFixed(2)}
            </div>
            <div className="text-xl text-gray-600">Current Balance</div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Money */}
        <Card title="Add Money" subtitle="Add funds to your wallet">
          <form onSubmit={handleAddMoney} className="space-y-4">
            <FormInput
              label="Amount ($)"
              name="amount"
              type="number"
              min="1"
              max="10000"
              step="0.01"
              value={addMoneyForm.amount}
              onChange={(e) => setAddMoneyForm({ amount: e.target.value })}
              placeholder="Enter amount to add"
              required
              disabled={addingMoney}
            />

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick amounts:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setAddMoneyForm({ amount: amount.toString() })
                    }
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={addingMoney}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {profile && addMoneyForm.amount && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>New balance will be:</strong> $
                  {(
                    parseFloat(profile.wallet_balance) +
                    parseFloat(addMoneyForm.amount || 0)
                  ).toFixed(2)}
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={addingMoney}
              disabled={addingMoney}
            >
              💳 Add Money
            </Button>
          </form>
        </Card>

        {/* Wallet Stats */}
        <div className="space-y-6">
          <Card title="Wallet Statistics">
            <div className="space-y-4">
              {profile && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-semibold">
                      {profile.total_orders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Orders:</span>
                    <span className="font-semibold text-yellow-600">
                      {profile.pending_orders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Orders:</span>
                    <span className="font-semibold text-green-600">
                      {profile.completed_orders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lifetime Spent:</span>
                    <span className="font-semibold text-red-600">
                      ${parseFloat(profile.lifetime_spent || 0).toFixed(2)}
                    </span>
                  </div>
                  {profile.last_order_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Order:</span>
                      <span className="font-semibold">
                        {new Date(profile.last_order_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <Card
          title="Transaction History"
          subtitle="Your wallet transaction history"
        >
          <Table
            columns={transactionColumns}
            data={transactions}
            searchable={true}
            sortable={true}
            emptyMessage="No transactions yet. Add money to your wallet to get started!"
          />
        </Card>
      </div>
    </div>
  );
};

export default CustomerWallet;
