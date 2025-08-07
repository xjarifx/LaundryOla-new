const mysql = require('mysql2/promise');
const db = require('./src/config/db');

async function fixWalletTransactionsView() {
    let connection;
    
    try {
        console.log('🔧 Fixing Wallet Transactions View and Display Issues...\n');
        
        connection = await db.getConnection();
        console.log('✅ Connected to database successfully');
        
        // Drop existing view if it exists
        console.log('1. Dropping existing view (if any)...');
        await connection.query('DROP VIEW IF EXISTS view_wallet_transactions');
        console.log('   ✅ Old view dropped (if existed)');
        
        // Create the wallet transactions view
        console.log('2. Creating wallet transactions view...');
        await connection.query(`
            CREATE VIEW view_wallet_transactions AS
            SELECT 
                wt.transaction_id,
                wt.customer_id,
                wt.amount,
                wt.transaction_type,
                wt.transaction_date as created_at,
                wt.order_id,
                CASE 
                    WHEN wt.transaction_type = 'Add Money' THEN 'CREDIT'
                    WHEN wt.transaction_type = 'Payment' THEN 'DEBIT'
                    ELSE wt.transaction_type
                END as type,
                CASE 
                    WHEN wt.transaction_type = 'Add Money' THEN 'Wallet top-up'
                    WHEN wt.transaction_type = 'Payment' THEN CONCAT('Order payment - Order #', wt.order_id)
                    ELSE 'Transaction'
                END as description
            FROM Wallet_Transactions wt
            ORDER BY wt.transaction_date DESC
        `);
        console.log('   ✅ Wallet transactions view created successfully');
        
        // Test the view
        console.log('3. Testing the view...');
        const [testResult] = await connection.execute(`
            SELECT 
                transaction_id,
                amount,
                transaction_type,
                type,
                description,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
            FROM view_wallet_transactions 
            LIMIT 10
        `);
        
        if (testResult.length > 0) {
            console.log('   ✅ View is working correctly');
            console.log('\n📊 Sample transactions:');
            console.table(testResult);
        } else {
            console.log('   ℹ️ No transactions found (this is normal for new installations)');
        }
        
        console.log('\n🎉 Wallet transactions view fix applied successfully!');
        console.log('\nWhat was fixed:');
        console.log('1. Created missing view_wallet_transactions');  
        console.log('2. Mapped "Add Money" → "CREDIT" for frontend display');
        console.log('3. Mapped "Payment" → "DEBIT" for frontend display');
        console.log('4. Added description field for better UX');
        console.log('\nResult: Add Money transactions will now show as "+$4000" instead of "-$4000"');
        
    } catch (error) {
        console.error('❌ Error fixing wallet transactions view:', error);
        console.error('Error details:', error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

fixWalletTransactionsView();
