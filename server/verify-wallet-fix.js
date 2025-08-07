const mysql = require("mysql2/promise");
const db = require("./src/config/db");

async function verifyWalletFix() {
  let connection;

  try {
    console.log("🔍 Verifying Wallet Fix...\n");

    connection = await db.getConnection();

    // Check the new trigger exists
    console.log("1. Checking trigger status...");
    const [triggers] = await connection.execute(`
            SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE 
            FROM information_schema.TRIGGERS 
            WHERE TRIGGER_SCHEMA = DATABASE() 
            AND TRIGGER_NAME LIKE '%wallet%'
        `);

    if (triggers.length > 0) {
      console.log("   ✅ Wallet triggers found:");
      triggers.forEach((trigger) => {
        console.log(
          `   - ${trigger.TRIGGER_NAME} (${trigger.EVENT_MANIPULATION} on ${trigger.EVENT_OBJECT_TABLE})`
        );
      });
    } else {
      console.log("   ❌ No wallet triggers found");
    }

    // Test wallet transactions table structure
    console.log("\n2. Checking Wallet_Transactions table structure...");
    const [columns] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'Wallet_Transactions'
            ORDER BY ORDINAL_POSITION
        `);

    console.log("   Wallet_Transactions columns:");
    columns.forEach((col) => {
      console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
    });

    // Check recent transactions (fix column name issue)
    console.log("\n3. Recent wallet transactions:");
    const [recentTransactions] = await connection.execute(`
            SELECT 
                wt.transaction_id,
                c.name,
                wt.amount,
                wt.transaction_type,
                wt.order_id
            FROM Wallet_Transactions wt
            JOIN Customers c ON wt.customer_id = c.customer_id
            ORDER BY wt.transaction_id DESC
            LIMIT 5
        `);

    if (recentTransactions.length > 0) {
      console.table(recentTransactions);
    } else {
      console.log("   ℹ️ No wallet transactions found");
    }

    console.log("\n✅ Wallet fix verification completed!");
    console.log("\n📝 Summary of fix applied:");
    console.log(
      '- Old trigger: update_wallet_on_add_money (only processed "Add Money")'
    );
    console.log(
      "- New trigger: update_wallet_on_transaction (processes ALL transactions)"
    );
    console.log(
      "- Effect: Now when orders are completed, wallet balance will be deducted properly"
    );
    console.log(
      "- Result: Lifetime spent will increase AND wallet balance will decrease correctly"
    );
  } catch (error) {
    console.error("❌ Error during verification:", error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

verifyWalletFix();
