// Test wallet transactions display after the fix
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testWalletTransactions() {
    try {
        console.log('🧪 Testing Wallet Transactions Display Fix\n');
        
        // Test customer login with a known customer 
        console.log('1. Testing customer login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/customers/login`, {
            email: 'customer@customer',  // Using existing customer from database
            password: 'customer123'      // Adjust password as needed
        });
        
        if (!loginResponse.data.success) {
            console.log('❌ Login failed, using hardcoded token for testing...');
            // You can manually set a token here for testing if needed
            return;
        }
        
        const token = loginResponse.data.data.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        
        console.log('✅ Login successful');
        
        // Test wallet transactions API
        console.log('2. Testing wallet transactions API...');
        const transactionsResponse = await axios.get(`${BASE_URL}/customers/transactions`, config);
        
        console.log('API Response Structure:');
        console.log('- Success:', transactionsResponse.data.success);
        console.log('- Has data:', !!transactionsResponse.data.data);
        console.log('- Transaction count:', transactionsResponse.data.data?.length || 0);
        
        if (transactionsResponse.data.data && transactionsResponse.data.data.length > 0) {
            console.log('\n📊 Sample Transactions:');
            transactionsResponse.data.data.slice(0, 5).forEach((tx, index) => {
                console.log(`Transaction ${index + 1}:`);
                console.log(`  - ID: ${tx.transaction_id}`);
                console.log(`  - Amount: ${tx.amount}`);
                console.log(`  - Type: ${tx.type} (Original: ${tx.transaction_type})`);
                console.log(`  - Description: ${tx.description}`);
                console.log(`  - Expected Display: ${tx.type === 'CREDIT' ? '+' : '-'}₹${Math.abs(parseFloat(tx.amount)).toFixed(2)}`);
                console.log('');
            });
            
            // Check for "Add Money" transactions specifically
            const addMoneyTransactions = transactionsResponse.data.data.filter(tx => tx.type === 'CREDIT');
            console.log(`✅ Found ${addMoneyTransactions.length} CREDIT transactions (Add Money)`);
            
            if (addMoneyTransactions.length > 0) {
                const sampleCredit = addMoneyTransactions[0];
                const displayAmount = Math.abs(parseFloat(sampleCredit.amount)).toFixed(2);
                console.log(`✅ Sample Add Money transaction will display as: +₹${displayAmount}`);
                
                if (parseFloat(sampleCredit.amount) < 0) {
                    console.log('⚠️ Warning: Add Money transaction has negative amount in database');
                } else {
                    console.log('✅ Add Money transaction has positive amount in database');
                }
            }
            
        } else {
            console.log('ℹ️ No transactions found - try adding money first');
        }
        
        console.log('\n🎉 Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 401) {
            console.log('💡 Authentication failed - check credentials or token');
        }
    }
}

testWalletTransactions();
