// Test wallet balance deduction functionality
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testWalletDeduction() {
  try {
    console.log("🧪 Testing Wallet Balance Deduction Issue\n");

    // Step 0: Register a test customer first
    console.log("0. Creating test customer...");
    try {
      const registerResponse = await axios.post(
        `${BASE_URL}/auth/customers/register`,
        {
          name: "Test Customer",
          phone: "9876543210",
          email: "testcustomer@example.com",
          password: "testpass123",
          address: "123 Test Street",
        }
      );
      console.log("   ✅ Test customer created successfully");
    } catch (regError) {
      console.log("   ℹ️ Test customer might already exist, proceeding...");
    }

    // Step 1: Login as customer to get token
    console.log("1. Logging in as customer...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/customers/login`, {
      email: "testcustomer@example.com",
      password: "testpass123",
    });

    if (!loginResponse.data.success) {
      console.log(
        "❌ Customer login failed, trying with different credentials..."
      );
      return;
    }

    const customerToken = loginResponse.data.token;
    const config = {
      headers: { Authorization: `Bearer ${customerToken}` },
    };

    // Step 2: Check initial wallet balance
    console.log("2. Checking initial wallet balance...");
    const profileResponse = await axios.get(
      `${BASE_URL}/customers/profile`,
      config
    );
    const initialBalance = profileResponse.data.customer.wallet_balance;
    const initialLifetimeSpent = profileResponse.data.customer.lifetime_spent;

    console.log(`   Initial wallet balance: ₹${initialBalance}`);
    console.log(`   Initial lifetime spent: ₹${initialLifetimeSpent}`);

    // Step 3: Check recent orders
    console.log("3. Checking recent orders...");
    const ordersResponse = await axios.get(
      `${BASE_URL}/customers/orders`,
      config
    );
    const orders = ordersResponse.data.data || ordersResponse.data.orders || [];
    const completedOrders = orders.filter((o) => o.status === "Completed");

    console.log(`   Total orders: ${orders.length}`);
    console.log(`   Completed orders: ${completedOrders.length}`);

    // Step 4: Calculate expected wallet balance
    const expectedDeducted = completedOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount),
      0
    );
    console.log(
      `   Expected deducted from completed orders: ₹${expectedDeducted.toFixed(
        2
      )}`
    );
    console.log(`   Actual lifetime spent: ₹${initialLifetimeSpent}`);

    // Step 5: Check wallet transactions
    console.log("4. Checking wallet transactions...");
    const transactionsResponse = await axios.get(
      `${BASE_URL}/customers/transactions`,
      config
    );
    const transactions =
      transactionsResponse.data.transactions ||
      transactionsResponse.data.data ||
      [];

    const creditTransactions = transactions.filter(
      (t) => t.type === "CREDIT" || t.transaction_type === "Add Money"
    );
    const debitTransactions = transactions.filter(
      (t) => t.type === "DEBIT" || t.transaction_type === "Payment"
    );

    console.log(`   Credit transactions: ${creditTransactions.length}`);
    console.log(`   Debit transactions: ${debitTransactions.length}`);

    const totalCredits = creditTransactions.reduce(
      (sum, t) => sum + Math.abs(parseFloat(t.amount)),
      0
    );
    const totalDebits = debitTransactions.reduce(
      (sum, t) => sum + Math.abs(parseFloat(t.amount)),
      0
    );

    console.log(`   Total credits: ₹${totalCredits.toFixed(2)}`);
    console.log(`   Total debits: ₹${totalDebits.toFixed(2)}`);
    console.log(
      `   Expected wallet balance: ₹${(totalCredits - totalDebits).toFixed(2)}`
    );

    // Step 6: Analysis
    console.log("\n📊 ANALYSIS:");
    const balanceDiscrepancy = Math.abs(
      initialBalance - (totalCredits - totalDebits)
    );
    const lifetimeVsDebits = Math.abs(initialLifetimeSpent - totalDebits);

    if (balanceDiscrepancy > 0.01) {
      console.log(
        "❌ ISSUE CONFIRMED: Wallet balance does not match transaction history"
      );
      console.log(`   Discrepancy: ₹${balanceDiscrepancy.toFixed(2)}`);
    } else {
      console.log("✅ Wallet balance matches transaction history");
    }

    if (lifetimeVsDebits > 0.01) {
      console.log("❌ ISSUE: Lifetime spent does not match debit transactions");
      console.log(`   Discrepancy: ₹${lifetimeVsDebits.toFixed(2)}`);
    } else {
      console.log("✅ Lifetime spent matches debit transactions");
    }

    if (debitTransactions.length === 0 && completedOrders.length > 0) {
      console.log(
        "❌ CRITICAL ISSUE: No payment transactions found despite completed orders!"
      );
      console.log(
        "   This confirms the wallet trigger is not working properly."
      );
    }
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data?.message || error.message
    );
    if (error.response?.status === 401) {
      console.log("💡 Try logging in with correct credentials first");
    }
  }
}

testWalletDeduction();
