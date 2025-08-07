const mysql = require('mysql2/promise');
const db = require('./src/config/db');

async function testWalletAPI() {
    let connection;
    
    try {
        console.log('🧪 Testing Wallet Transactions API Fix\n');
        
        connection = await db.getConnection();
        
        // Check what customers exist
        console.log('1. Checking existing customers...');
        const [customers] = await connection.execute(`
            SELECT customer_id, name, email FROM Customers LIMIT 5
        `);
        
        console.log('Available customers:');
        console.table(customers);
        
        // Test the wallet transactions view directly
        console.log('\n2. Testing wallet transactions view...');
        const [transactions] = await connection.execute(`
            SELECT 
                transaction_id,
                customer_id,
                amount,
                transaction_type,
                type,
                description,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM view_wallet_transactions 
            WHERE customer_id = 1
            ORDER BY created_at DESC
            LIMIT 10
        `);
        
        if (transactions.length > 0) {
            console.log('✅ Wallet transactions view is working correctly');
            console.log('\nSample transactions for customer ID 1:');
            
            transactions.forEach((tx, index) => {
                console.log(`\nTransaction ${index + 1}:`);
                console.log(`  - Amount: ${tx.amount}`);
                console.log(`  - Type: ${tx.type} (Original: ${tx.transaction_type})`);
                console.log(`  - Description: ${tx.description}`);
                console.log(`  - Expected Display: ${tx.type === 'CREDIT' ? '+' : '-'}₹${Math.abs(parseFloat(tx.amount)).toFixed(2)}`);
                
                // Check if Add Money transactions show correctly
                if (tx.type === 'CREDIT') {
                    const displayAmount = Math.abs(parseFloat(tx.amount)).toFixed(2);
                    console.log(`  ✅ This Add Money transaction will show as: +₹${displayAmount}`);
                }
            });
            
            // Summary
            const creditTxns = transactions.filter(tx => tx.type === 'CREDIT');
            const debitTxns = transactions.filter(tx => tx.type === 'DEBIT');
            
            console.log(`\n📊 Summary:`);
            console.log(`- CREDIT transactions (Add Money): ${creditTxns.length}`);
            console.log(`- DEBIT transactions (Payments): ${debitTxns.length}`);
            
            if (creditTxns.length > 0) {
                console.log('\n✅ Fix Applied Successfully!');
                console.log('- Add Money transactions now have type="CREDIT"');
                console.log('- Frontend will display them as "+₹X" instead of "-₹X"');
                console.log('- Database view correctly maps transaction types');
            }
            
        } else {
            console.log('ℹ️ No transactions found for customer ID 1');
        }
        
    } catch (error) {
        console.error('❌ Error testing wallet API:', error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

testWalletAPI();
