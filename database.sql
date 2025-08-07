
-- =======================================
-- CREATE COMPLETE DATABASE WITH AUTH
-- =======================================

-- 1. Customers Table (WITH EMAIL & PASSWORD)
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    CONSTRAINT chk_wallet_positive CHECK (wallet_balance >= 0)
);

-- 2. Employees Table (WITH EMAIL & PASSWORD)
CREATE TABLE Employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    earnings_balance DECIMAL(10,2) DEFAULT 0.00
);

-- 3. Services Table
CREATE TABLE Services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(50) NOT NULL,
    price_per_item DECIMAL(6,2) NOT NULL
);

-- 4. Orders Table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    employee_id INT,
    service_id INT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Accepted', 'Rejected', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (service_id) REFERENCES Services(service_id),
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_amount_positive CHECK (total_amount > 0)
);

-- 5. Wallet_Transactions Table
CREATE TABLE Wallet_Transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    amount DECIMAL(8,2) NOT NULL,
    transaction_type ENUM('Add Money', 'Payment') NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- 6. Employee_Earnings Table
CREATE TABLE Employee_Earnings (
    earning_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    order_id INT NOT NULL,
    amount DECIMAL(8,2) NOT NULL,
    earned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- =======================================
-- CREATE VIEWS
-- =======================================

-- 1. Complete Customer View
CREATE VIEW view_customer_complete AS
SELECT 
    c.customer_id,
    c.name,
    c.phone,
    c.email,
    c.address,
    c.wallet_balance,
    CONCAT('$', FORMAT(c.wallet_balance, 2)) as formatted_balance,
    COUNT(o.order_id) as total_orders,
    COUNT(CASE WHEN o.status = 'Pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) as completed_orders,
    COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.total_amount ELSE 0 END), 0) as lifetime_spent,
    CONCAT('$', FORMAT(COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.total_amount ELSE 0 END), 0), 2)) as formatted_spent,
    MAX(o.order_date) as last_order_date
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.phone, c.email, c.address, c.wallet_balance;

-- 2. Available Services View
CREATE VIEW view_available_services AS
SELECT 
    service_id,
    service_name,
    price_per_item,
    CONCAT('$', FORMAT(price_per_item, 2)) as formatted_price
FROM Services
ORDER BY price_per_item;

-- 3. All Orders View
CREATE VIEW view_all_orders AS
SELECT 
    o.order_id,
    o.customer_id,
    c.name as customer_name,
    c.phone as customer_phone,
    s.service_name,
    o.quantity,
    o.total_amount,
    CONCAT('$', FORMAT(o.total_amount, 2)) as formatted_amount,
    o.status,
    DATE_FORMAT(o.order_date, '%Y-%m-%d %H:%i') as order_datetime,
    DATE_FORMAT(o.order_date, '%M %d, %Y at %H:%i') as formatted_date,
    e.name as employee_name,
    CASE 
        WHEN o.status = 'Pending' THEN 'warning'
        WHEN o.status = 'Accepted' THEN 'info'
        WHEN o.status = 'Completed' THEN 'success'
        WHEN o.status = 'Rejected' THEN 'danger'
    END as status_color
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Services s ON o.service_id = s.service_id
LEFT JOIN Employees e ON o.employee_id = e.employee_id
ORDER BY o.order_date DESC;

-- =======================================
-- CREATE TRIGGERS
-- =======================================

-- 1. Wallet Balance Update Trigger
DELIMITER //
CREATE TRIGGER update_wallet_on_add_money
AFTER INSERT ON Wallet_Transactions
FOR EACH ROW
BEGIN
    IF NEW.transaction_type = 'Add Money' THEN
        UPDATE Customers 
        SET wallet_balance = wallet_balance + NEW.amount
        WHERE customer_id = NEW.customer_id;
    END IF;
END//
DELIMITER ;

-- 2. Order Amount Validation Trigger
DELIMITER //
CREATE TRIGGER validate_order_amount
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    DECLARE expected_amount DECIMAL(8,2);
    
    SELECT price_per_item * NEW.quantity INTO expected_amount
    FROM Services WHERE service_id = NEW.service_id;
    
    IF NEW.total_amount != expected_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order amount does not match service price × quantity';
    END IF;
END//
DELIMITER ;

-- 3. Order Status Validation Trigger
DELIMITER //
CREATE TRIGGER validate_order_status_transition
BEFORE UPDATE ON Orders
FOR EACH ROW
BEGIN
    -- Only allow valid status transitions
    IF OLD.status = 'Pending' AND NEW.status NOT IN ('Accepted', 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'From Pending, can only go to Accepted or Rejected';
    END IF;
    
    IF OLD.status = 'Accepted' AND NEW.status NOT IN ('Completed', 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'From Accepted, can only go to Completed or Rejected';
    END IF;
    
    IF OLD.status IN ('Completed', 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot change status of completed/rejected orders';
    END IF;
    
    -- Employee must be assigned when accepting order
    IF OLD.status = 'Pending' AND NEW.status = 'Accepted' AND NEW.employee_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee must be assigned when accepting order';
    END IF;
END//
DELIMITER ;

-- 4. Automatic Payment Processing Trigger
DELIMITER //
CREATE TRIGGER process_completed_order
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF OLD.status != 'Completed' AND NEW.status = 'Completed' AND NEW.employee_id IS NOT NULL THEN
        -- Add to employee earnings
        UPDATE Employees 
        SET earnings_balance = earnings_balance + NEW.total_amount
        WHERE employee_id = NEW.employee_id;
        
        -- Record wallet transaction (trigger will update wallet balance automatically)
        INSERT INTO Wallet_Transactions (customer_id, amount, transaction_type, order_id)
        VALUES (NEW.customer_id, -NEW.total_amount, 'Payment', NEW.order_id);
        
        -- Record employee earning
        INSERT INTO Employee_Earnings (employee_id, order_id, amount)
        VALUES (NEW.employee_id, NEW.order_id, NEW.total_amount);
    END IF;
END//
DELIMITER ;

-- =======================================
-- CREATE STORED PROCEDURES
-- =======================================

-- 1. Customer Registration
DELIMITER //
CREATE PROCEDURE sp_register_customer(
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_address TEXT
)
BEGIN
    DECLARE phone_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO phone_exists FROM Customers WHERE phone = p_phone;
    SELECT COUNT(*) INTO email_exists FROM Customers WHERE email = p_email;
    
    IF phone_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phone number already registered';
    END IF;
    
    IF email_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    END IF;
    
    INSERT INTO Customers (name, phone, email, password, address)
    VALUES (p_name, p_phone, p_email, p_password, p_address);
    
    SELECT LAST_INSERT_ID() as customer_id, 'Customer registered successfully' as message;
END//
DELIMITER ;

-- 2. Employee Registration
DELIMITER //
CREATE PROCEDURE sp_register_employee(
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE phone_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO phone_exists FROM Employees WHERE phone = p_phone;
    SELECT COUNT(*) INTO email_exists FROM Employees WHERE email = p_email;
    
    IF phone_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phone number already registered';
    END IF;
    
    IF email_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    END IF;
    
    INSERT INTO Employees (name, phone, email, password)
    VALUES (p_name, p_phone, p_email, p_password);
    
    SELECT LAST_INSERT_ID() as employee_id, 'Employee registered successfully' as message;
END//
DELIMITER ;

-- 3. Customer Login
DELIMITER //
CREATE PROCEDURE sp_customer_login(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT customer_id, name, email, phone 
    FROM Customers 
    WHERE email = p_email AND password = p_password;
END//
DELIMITER ;

-- 4. Employee Login
DELIMITER //
CREATE PROCEDURE sp_employee_login(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT employee_id, name, email, phone 
    FROM Employees 
    WHERE email = p_email AND password = p_password;
END//
DELIMITER ;

-- 5. Add Money to Wallet
DELIMITER //
CREATE PROCEDURE sp_add_money(
    IN p_customer_id INT,
    IN p_amount DECIMAL(8,2)
)
BEGIN
    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be positive';
    END IF;
    
    INSERT INTO Wallet_Transactions (customer_id, amount, transaction_type)
    VALUES (p_customer_id, p_amount, 'Add Money');
    
    SELECT CONCAT('Successfully added $', p_amount, ' to wallet') as message;
END//
DELIMITER ;

-- 6. Place Order
DELIMITER //
CREATE PROCEDURE sp_place_order(
    IN p_customer_id INT,
    IN p_service_id INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_wallet_balance DECIMAL(10,2);
    DECLARE v_total_amount DECIMAL(8,2);
    
    -- Check wallet balance before placing order
    SELECT c.wallet_balance, s.price_per_item * p_quantity
    INTO v_wallet_balance, v_total_amount
    FROM Customers c, Services s 
    WHERE c.customer_id = p_customer_id AND s.service_id = p_service_id;
    
    IF v_wallet_balance < v_total_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient wallet balance';
    END IF;
    
    -- Triggers will handle amount validation
    INSERT INTO Orders (customer_id, service_id, quantity, total_amount)
    VALUES (p_customer_id, p_service_id, p_quantity, v_total_amount);
    
    SELECT 'Order placed successfully' as message, LAST_INSERT_ID() as order_id;
END//
DELIMITER ;

-- 7. Manage Orders
DELIMITER //
CREATE PROCEDURE sp_manage_order(
    IN p_action VARCHAR(20),
    IN p_employee_id INT,
    IN p_order_id INT
)
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_current_employee INT;
    
    SELECT status, employee_id INTO v_status, v_current_employee 
    FROM Orders WHERE order_id = p_order_id;
    
    IF p_action = 'ACCEPT' THEN
        IF v_status != 'Pending' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order is not in pending status';
        END IF;
        
        UPDATE Orders 
        SET status = 'Accepted', employee_id = p_employee_id
        WHERE order_id = p_order_id;
        
        SELECT CONCAT('Order ', p_order_id, ' accepted') as message;
        
    ELSEIF p_action = 'REJECT' THEN
        IF v_status != 'Pending' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Can only reject pending orders';
        END IF;
        
        UPDATE Orders SET status = 'Rejected' WHERE order_id = p_order_id;
        SELECT CONCAT('Order ', p_order_id, ' rejected') as message;
        
    ELSEIF p_action = 'COMPLETE' THEN
        IF v_status != 'Accepted' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order must be accepted first';
        END IF;
        
        IF v_current_employee != p_employee_id THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only assigned employee can complete order';
        END IF;
        
        UPDATE Orders SET status = 'Completed' WHERE order_id = p_order_id;
        SELECT CONCAT('Order ', p_order_id, ' completed successfully') as message;
    END IF;
END//
DELIMITER ;

-- 8. Get Dashboard
DELIMITER //
CREATE PROCEDURE sp_get_dashboard(
    IN p_user_type VARCHAR(20),
    IN p_user_id INT
)
BEGIN
    IF p_user_type = 'CUSTOMER' THEN
        -- Customer complete profile
        SELECT * FROM view_customer_complete WHERE customer_id = p_user_id;
        
        -- Customer's recent orders
        SELECT * FROM view_all_orders 
        WHERE customer_id = p_user_id 
        ORDER BY order_date DESC LIMIT 10;
        
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
        
        -- Pending orders for employee to accept
        SELECT * FROM view_all_orders 
        WHERE status = 'Pending' 
        ORDER BY order_date ASC LIMIT 10;
        
        -- Employee's current work
        SELECT * FROM view_all_orders 
        WHERE employee_name = (SELECT name FROM Employees WHERE employee_id = p_user_id)
        AND status = 'Accepted';
    END IF;
END//
DELIMITER ;
