-- Fix for customer wallet balance deduction issue
-- Problem: Wallet balance was not being deducted when orders were completed
-- Solution: Update trigger to handle both 'Add Money' and 'Payment' transactions

-- Drop the existing trigger
DROP TRIGGER IF EXISTS update_wallet_on_add_money;

-- Create the corrected trigger that handles both transaction types
DELIMITER //
CREATE TRIGGER update_wallet_on_transaction
AFTER INSERT ON Wallet_Transactions
FOR EACH ROW
BEGIN
    -- Update wallet balance for both Add Money (positive) and Payment (negative) transactions
    UPDATE Customers 
    SET wallet_balance = wallet_balance + NEW.amount
    WHERE customer_id = NEW.customer_id;
END//
DELIMITER ;

-- Optional: Verify the fix by checking existing payment transactions that weren't processed
-- Run this to see if there are any 'Payment' transactions that didn't affect wallet balance:
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
ORDER BY wt.created_at DESC;
