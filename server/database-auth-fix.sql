-- =======================================
-- AUTHENTICATION FIX - UPDATED STORED PROCEDURES
-- =======================================
-- Run these queries to fix the authentication issue

-- Drop existing login procedures
DROP PROCEDURE IF EXISTS sp_customer_login;
DROP PROCEDURE IF EXISTS sp_employee_login;

-- 1. Updated Customer Login - Returns user data by email only
-- Backend will handle password comparison with bcrypt
DELIMITER //
CREATE PROCEDURE sp_customer_login(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT customer_id, name, email, phone, address, wallet_balance, password 
    FROM Customers 
    WHERE email = p_email;
END//
DELIMITER ;

-- 2. Updated Employee Login - Returns user data by email only  
-- Backend will handle password comparison with bcrypt
DELIMITER //
CREATE PROCEDURE sp_employee_login(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT employee_id, name, email, phone, earnings_balance, password 
    FROM Employees 
    WHERE email = p_email;
END//
DELIMITER ;

-- =======================================
-- VERIFICATION QUERIES (Optional - for testing)
-- =======================================

-- Test the updated procedures
-- CALL sp_customer_login('test@example.com');
-- CALL sp_employee_login('employee@example.com');
