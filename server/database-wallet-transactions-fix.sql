-- Fix for wallet transactions display issue
-- Problem 1: Missing view_wallet_transactions
-- Problem 2: Transaction type mismatch between database and frontend

-- Create the missing wallet transactions view
CREATE VIEW view_wallet_transactions AS
SELECT 
    wt.transaction_id,
    wt.customer_id,
    wt.amount,
    wt.transaction_type,
    wt.transaction_date as created_at,
    wt.order_id,
    -- Map transaction_type to frontend expected values
    CASE 
        WHEN wt.transaction_type = 'Add Money' THEN 'CREDIT'
        WHEN wt.transaction_type = 'Payment' THEN 'DEBIT'
        ELSE wt.transaction_type
    END as type,
    -- Add description field
    CASE 
        WHEN wt.transaction_type = 'Add Money' THEN 'Wallet top-up'
        WHEN wt.transaction_type = 'Payment' THEN CONCAT('Order payment - Order #', wt.order_id)
        ELSE 'Transaction'
    END as description
FROM Wallet_Transactions wt
ORDER BY wt.transaction_date DESC;
