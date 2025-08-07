-- =======================================
-- DASHBOARD FIX - UPDATED STORED PROCEDURE
-- =======================================
-- Fix the sp_get_dashboard procedure with correct column names

-- Drop existing procedure
DROP PROCEDURE IF EXISTS sp_get_dashboard;

-- Updated Dashboard Procedure with correct column references
DELIMITER //
CREATE PROCEDURE sp_get_dashboard(
    IN p_user_type VARCHAR(20),
    IN p_user_id INT
)
BEGIN
    IF p_user_type = 'CUSTOMER' THEN
        -- Customer complete profile
        SELECT * FROM view_customer_complete WHERE customer_id = p_user_id;
        
        -- Customer's recent orders (using correct column name)
        SELECT * FROM view_all_orders 
        WHERE customer_id = p_user_id 
        ORDER BY order_datetime DESC LIMIT 10;
        
    ELSEIF p_user_type = 'EMPLOYEE' THEN
        -- Employee stats
        SELECT 
            e.employee_id,
            e.name,
            e.earnings_balance,
            CONCAT('$', FORMAT(e.earnings_balance, 2)) as formatted_earnings,
            COUNT(o.order_id) as total_orders_handled,
            COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) as completed_orders,
            COUNT(CASE WHEN o.status = 'Accepted' THEN 1 END) as in_progress_orders
        FROM Employees e
        LEFT JOIN Orders o ON e.employee_id = o.employee_id
        WHERE e.employee_id = p_user_id
        GROUP BY e.employee_id, e.name, e.earnings_balance;
        
        -- Pending orders for employee to accept (using correct column name)
        SELECT * FROM view_all_orders 
        WHERE status = 'Pending' 
        ORDER BY order_datetime ASC LIMIT 10;
        
        -- Employee's current work
        SELECT * FROM view_all_orders 
        WHERE employee_name = (SELECT name FROM Employees WHERE employee_id = p_user_id)
        AND status = 'Accepted'
        ORDER BY order_datetime DESC;
    END IF;
END//
DELIMITER ;

-- =======================================
-- VERIFICATION QUERIES (Optional - for testing)
-- =======================================

-- Test the updated procedure
-- CALL sp_get_dashboard('CUSTOMER', 1);
-- CALL sp_get_dashboard('EMPLOYEE', 1);
