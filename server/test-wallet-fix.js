const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "mysql-3a92ad0e-xjarifx-adf3.g.aivencloud.com",
  port: process.env.DB_PORT || 13673,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASS || "AVNS_T9BjB5XJfMUfhPfr7lN",
  database: process.env.DB_NAME || "LaundryOla",
  ssl: {
    rejectUnauthorized: false,
  },
};

async function fixWalletTrigger() {
  let connection;

  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    // Drop existing trigger
    console.log("Dropping existing trigger...");
    await connection.execute(
      "DROP TRIGGER IF EXISTS update_wallet_on_add_money"
    );

    // Create new trigger (need to handle delimiter properly)
    console.log("Creating new wallet trigger...");
    await connection.execute(`
      CREATE TRIGGER update_wallet_on_transaction
      AFTER INSERT ON Wallet_Transactions
      FOR EACH ROW
      BEGIN
          UPDATE Customers 
          SET wallet_balance = wallet_balance + NEW.amount
          WHERE customer_id = NEW.customer_id;
      END
    `);

    console.log("✅ Wallet trigger fixed successfully!");

    // Test the fix by checking payment transactions
    console.log("\nChecking existing payment transactions...");
    const [paymentTxns] = await connection.execute(`
      SELECT 
          wt.transaction_id,
          wt.customer_id,
          c.name,
          wt.amount,
          wt.transaction_type,
          wt.order_id,
          c.wallet_balance as current_wallet_balance,
          wt.created_at
      FROM Wallet_Transactions wt
      JOIN Customers c ON wt.customer_id = c.customer_id
      WHERE wt.transaction_type = 'Payment'
      ORDER BY wt.created_at DESC
      LIMIT 10
    `);

    console.log("Recent Payment Transactions:");
    console.table(paymentTxns);

    // Check if there are any customers with wallet balance issues
    console.log("\nChecking customer wallet vs lifetime spent...");
    const [customerData] = await connection.execute(`
      SELECT 
          customer_id,
          name,
          wallet_balance,
          lifetime_spent,
          (wallet_balance + lifetime_spent) as should_be_total_added
      FROM view_customer_complete 
      WHERE lifetime_spent > 0
      ORDER BY lifetime_spent DESC
      LIMIT 10
    `);

    console.log("Customer Wallet Analysis:");
    console.table(customerData);
  } catch (error) {
    console.error("Error fixing wallet trigger:", error);
    console.error("Error details:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the fix
fixWalletTrigger();
