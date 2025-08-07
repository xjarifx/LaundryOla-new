import { useState, useEffect } from "react";
import axios from "axios";
import {
  WalletIcon,
  PlusIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const CustomerWallet = () => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMoneyLoading, setAddMoneyLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [profileRes, transactionsRes] = await Promise.all([
        axios.get("/customers/profile"),
        axios.get("/customers/transactions"),
      ]);

      console.log("Profile API response:", profileRes.data);
      const profileData = profileRes.data.data || profileRes.data.customer || profileRes.data;
      console.log("Processed profile data:", profileData);
      
      setProfile(profileData);
      
      console.log("Transactions API response:", transactionsRes.data);
      const transactionsData = transactionsRes.data.data || transactionsRes.data.transactions || [];
      console.log("Processed transactions data:", transactionsData);
      
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthAndReload = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  const decodeJWTPayload = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const addMoney = async (e) => {
    e.preventDefault();
    setAddMoneyLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      if (parsedAmount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      // Debug: Check if token exists
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      console.log("Token exists:", !!token);
      console.log("Token type:", typeof token);
      console.log("Token value:", token);
      console.log("User data:", userData);
      console.log(
        "Token preview:",
        token && typeof token === "string"
          ? token.substring(0, 20) + "..."
          : "Invalid token"
      );

      const response = await axios.post(
        "/customers/wallet/add",
        {
          amount: parsedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Add money response:", response.data);

      // Refresh wallet data
      fetchWalletData();
      setAmount("");
      setShowAddMoney(false);
      alert("Money added successfully!");
    } catch (error) {
      console.error("Add money error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to add money";
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
      } else {
        alert(errorMessage);
      }
    } finally {
      setAddMoneyLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "CREDIT":
      case "DEPOSIT":
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case "DEBIT":
      case "ORDER":
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      default:
        return <CurrencyRupeeIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "CREDIT":
      case "DEPOSIT":
        return "text-green-600";
      case "DEBIT":
      case "ORDER":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">
          Manage your wallet balance and view transaction history
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <WalletIcon className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Wallet Balance</h2>
            </div>
            <p className="text-blue-100 mb-4">
              Available balance in your account
            </p>
            <div className="text-4xl font-bold mb-4">
              ₹{profile?.wallet_balance || 0}
            </div>
            <button
              onClick={() => setShowAddMoney(!showAddMoney)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Money</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-blue-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Add Money Form */}
      {showAddMoney && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Money to Wallet
          </h3>
          <form onSubmit={addMoney} className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount to Add
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  required
                />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                disabled={addMoneyLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {addMoneyLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Money</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddMoney(false)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Add Amounts */}
      {showAddMoney && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Quick Add Amounts
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[100, 500, 1000, 2000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-center font-medium"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            View all your wallet transactions
          </p>
        </div>

        {transactions && transactions.length === 0 ? (
          <div className="text-center py-12">
            <WalletIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-600">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions &&
              transactions.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "CREDIT" ||
                          transaction.type === "DEPOSIT"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.type === "CREDIT" ||
                          transaction.type === "DEPOSIT"
                            ? "Money Added"
                            : "Order Payment"}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {transaction.type === "CREDIT" ||
                        transaction.type === "DEPOSIT"
                          ? "+"
                          : "-"}
                        ₹{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                      </div>
                      {transaction.order_id && (
                        <div className="text-sm text-gray-500">
                          Order #{transaction.order_id}
                        </div>
                      )}
                    </div>
                  </div>

                  {transaction.description && (
                    <div className="mt-3 ml-12 text-sm text-gray-600">
                      {transaction.description}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Wallet Info */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">
          How Wallet Works
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Adding Money</h5>
            <ul className="space-y-1">
              <li>• Add money instantly to your wallet</li>
              <li>• Minimum amount: ₹1</li>
              <li>• Secure payment processing</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Using Wallet</h5>
            <ul className="space-y-1">
              <li>• Pay for orders automatically</li>
              <li>• No need to pay each time</li>
              <li>• Track all transactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWallet;
