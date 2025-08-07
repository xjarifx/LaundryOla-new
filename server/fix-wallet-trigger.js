const mysql = require("mysql2/promise");

// Use the same config as the server
const db = require("./src/config/db");

async function fixWalletTrigger() {
  let connection;

  try {
    console.log("🔧 Applying Wallet Balance Trigger Fix...\n");

    // Get a connection from the pool
    connection = await db.getConnection();

    console.log("✅ Connected to database successfully");

    // Drop existing trigger
    console.log("1. Dropping existing trigger...");
    await connection.query("DROP TRIGGER IF EXISTS update_wallet_on_add_money");
    console.log("   ✅ Old trigger dropped");

    // Create new trigger that handles both transaction types
    console.log("2. Creating new wallet trigger...");
    await connection.query(`
            CREATE TRIGGER update_wallet_on_transaction
            AFTER INSERT ON Wallet_Transactions
            FOR EACH ROW
            BEGIN
                UPDATE Customers 
                SET wallet_balance = wallet_balance + NEW.amount
                WHERE customer_id = NEW.customer_id;
            END
        `);
    console.log("   ✅ New trigger created successfully");

    // Test the fix by checking existing data
    console.log("3. Analyzing existing wallet data...\n");

    // Get customers with orders
    const [customers] = await connection.execute(`
            SELECT 
                c.customer_id,
                c.name,
                c.wallet_balance,
                c.email,
                COALESCE(SUM(CASE WHEN wt.transaction_type = 'Add Money' THEN wt.amount ELSE 0 END), 0) as total_added,
                COALESCE(SUM(CASE WHEN wt.transaction_type = 'Payment' THEN wt.amount ELSE 0 END), 0) as total_spent_transactions,
                COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.total_amount ELSE 0 END), 0) as lifetime_spent_orders,
                COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) as completed_orders_count
            FROM Customers c
            LEFT JOIN Wallet_Transactions wt ON c.customer_id = wt.customer_id
            LEFT JOIN Orders o ON c.customer_id = o.customer_id
            GROUP BY c.customer_id, c.name, c.wallet_balance, c.email
            HAVING completed_orders_count > 0 OR total_added > 0
            ORDER BY completed_orders_count DESC, total_added DESC
            LIMIT 10
        `);

    if (customers.length === 0) {
      console.log("   ℹ️ No customers with wallet activity found");
      return;
    }

    console.log("📊 Customer Wallet Analysis:");
    console.log("============================");

    for (const customer of customers) {
      console.log(`\n👤 Customer: ${customer.name} (${customer.email})`);
      console.log(`   Current wallet balance: ₹${customer.wallet_balance}`);
      console.log(`   Total money added: ₹${Math.abs(customer.total_added)}`);
      console.log(
        `   Payment transactions: ₹${Math.abs(
          customer.total_spent_transactions
        )}`
      );
      console.log(
        `   Completed orders value: ₹${customer.lifetime_spent_orders}`
      );
      console.log(
        `   Completed orders count: ${customer.completed_orders_count}`
      );

      // Calculate what the wallet balance should be
      const expectedBalance =
        Math.abs(customer.total_added) + customer.total_spent_transactions;
      const balanceDiscrepancy = Math.abs(
        customer.wallet_balance - expectedBalance
      );

      if (balanceDiscrepancy > 0.01) {
        console.log(
          `   ❌ ISSUE: Expected balance ₹${expectedBalance.toFixed(
            2
          )}, actual ₹${customer.wallet_balance}`
        );
        console.log(`   📝 Discrepancy: ₹${balanceDiscrepancy.toFixed(2)}`);
      } else {
        console.log(`   ✅ Wallet balance is correct`);
      }

      // Check if payment transactions match completed orders
      const paymentVsOrders = Math.abs(
        Math.abs(customer.total_spent_transactions) -
          customer.lifetime_spent_orders
      );
      if (paymentVsOrders > 0.01) {
        console.log(
          `   ⚠️ Payment transactions (₹${Math.abs(
            customer.total_spent_transactions
          )}) don't match completed orders (₹${customer.lifetime_spent_orders})`
        );
      }
    }

    // Check recent wallet transactions
    console.log("\n💳 Recent Wallet Transactions:");
    console.log("==============================");
    const [transactions] = await connection.execute(`
            SELECT 
                wt.transaction_id,
                c.name,
                wt.amount,
                wt.transaction_type,
                wt.order_id,
                DATE_FORMAT(wt.created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM Wallet_Transactions wt
            JOIN Customers c ON wt.customer_id = c.customer_id
            ORDER BY wt.created_at DESC
            LIMIT 10
        `);

    if (transactions.length > 0) {
      console.table(transactions);
    } else {
      console.log("   ℹ️ No wallet transactions found");
    }

    console.log("\n🎉 Wallet trigger fix applied successfully!");
    console.log("\nNext steps:");
    console.log(
      "1. Test by completing an order to see if wallet balance is deducted"
    );
    console.log(
      '2. Check that both "Add Money" and "Payment" transactions update wallet balance'
    );
    console.log("3. Verify that lifetime_spent matches completed order values");
  } catch (error) {
    console.error("❌ Error applying wallet fix:", error);
    console.error("Error details:", error.message);

    if (error.code === "ER_TRG_ALREADY_EXISTS") {
      console.log(
        "💡 Trigger might already exist. Try dropping it manually first."
      );
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log(
        "💡 Database access denied. Check your credentials in .env file."
      );
    }
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Run the fix
fixWalletTrigger();
