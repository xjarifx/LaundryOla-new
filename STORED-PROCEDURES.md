# Stored Procedures – Definitions and Usage Map

This document catalogs all stored procedures used by LaundryOla, their responsibilities, input/output contracts, and where they are invoked in the codebase. It also includes representative code snippets so you can see exactly how each procedure is called and how its results are consumed.

Scope: MySQL 8.x; final state as of 2025‑08‑09.

---

## Index

- sp_register_customer
- sp_register_employee
- sp_customer_login
- sp_employee_login
- sp_add_money
- sp_place_order
- sp_manage_order
- sp_get_dashboard
- sp_manage_service
- sp_update_employee_profile (referenced from code; definition external)

---

## sp_register_customer(name, phone, email, password_hash, address)

Purpose:

- Register a new customer with unique phone and email. Password must be pre-hashed (bcrypt) by the API.

Defined in:

- `database.sql` (base schema)

Definition (SQL):

```sql
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

  SELECT LAST_INSERT_ID() AS customer_id, 'Customer registered successfully' AS message;
END//
DELIMITER ;
```

Validation and Errors (SIGNAL 45000):

- "Phone number already registered"
- "Email already registered"

Returns:

- Result set with one row: `{ customer_id, message }`

Usage:

- Endpoint: `POST /api/auth/customers/register`
- Code: `server/src/controllers/authController.js`

Snippet (API):

```javascript
const hashedPassword = await bcrypt.hash(
  password,
  parseInt(process.env.BCRYPT_ROUNDS || "10")
);
const [result] = await db.query("CALL sp_register_customer(?, ?, ?, ?, ?)", [
  name,
  phone,
  email,
  hashedPassword,
  address,
]);
const customerId = result[0][0].customer_id;
```

---

## sp_register_employee(name, phone, email, password_hash)

Purpose:

- Register a new employee with unique phone and email. Password must be pre-hashed.

Defined in:

- `database.sql` (base schema)

Definition (SQL):

```sql
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

  SELECT LAST_INSERT_ID() AS employee_id, 'Employee registered successfully' AS message;
END//
DELIMITER ;
```

Validation and Errors:

- "Phone number already registered"
- "Email already registered"

Returns:

- Result set with one row: `{ employee_id, message }`

Usage:

- Endpoint: `POST /api/auth/employees/register`
- Code: `server/src/controllers/authController.js`

Snippet (API):

```javascript
const hashedPassword = await bcrypt.hash(
  password,
  parseInt(process.env.BCRYPT_ROUNDS || "10")
);
const [result] = await db.query("CALL sp_register_employee(?, ?, ?, ?)", [
  name,
  phone,
  email,
  hashedPassword,
]);
const employeeId = result[0][0].employee_id;
```

---

## sp_customer_login(p_email)

Purpose:

- Fetch a customer by email, including the bcrypt password hash for application-layer verification.

Defined in:

- Final: `server/database-auth-fix.sql` (supersedes older base definition that accepted password)

Definition (SQL):

```sql
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
```

Returns:

- One row: `{ customer_id, name, email, phone, address, wallet_balance, password }`

Usage:

- Endpoint: `POST /api/auth/customers/login`
- Code: `server/src/controllers/authController.js`

Snippet (API):

```javascript
const [result] = await db.query("CALL sp_customer_login(?)", [email]);
if (!result[0] || result[0].length === 0) {
  /* 401 */
}
const customer = result[0][0];
const ok = await bcrypt.compare(password, customer.password);
```

Notes:

- The controller removes the `password` field before returning the user object.

---

## sp_employee_login(p_email)

Purpose:

- Fetch an employee by email, including the bcrypt password hash for verification.

Defined in:

- Final: `server/database-auth-fix.sql`

Definition (SQL):

```sql
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
```

Returns:

- One row: `{ employee_id, name, email, phone, earnings_balance, password }`

Usage:

- Endpoint: `POST /api/auth/employees/login`
- Code: `server/src/controllers/authController.js`

Snippet (API):

```javascript
const [result] = await db.query("CALL sp_employee_login(?)", [email]);
if (!result[0] || result[0].length === 0) {
  /* 401 */
}
const employee = result[0][0];
const ok = await bcrypt.compare(password, employee.password);
```

---

## sp_add_money(p_customer_id, p_amount)

Purpose:

- Add funds to a customer's wallet by inserting a Wallet_Transactions row (type: "Add Money"). The wallet balance is updated by trigger `update_wallet_on_transaction`.

Defined in:

- `database.sql`

Definition (SQL):

```sql
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

  SELECT CONCAT('Successfully added $', p_amount, ' to wallet') AS message;
END//
DELIMITER ;
```

Validation and Errors:

- `p_amount > 0` required, else SIGNAL "Amount must be positive".

Returns:

- One-row result set: `{ message }` (e.g., "Successfully added $X to wallet")

Usage:

- Endpoint: `POST /api/customers/wallet/add`
- Code: `server/src/controllers/customerController.js`

Snippet (API):

```javascript
const [result] = await db.query("CALL sp_add_money(?, ?)", [
  req.user.id,
  amount,
]);
res.json(success(null, result[0][0].message));
```

---

## sp_place_order(p_customer_id, p_service_id, p_quantity)

Purpose:

- Place an order if the wallet has sufficient funds. Inserts a row into Orders.

Defined in:

- `database.sql`

Definition (SQL):

```sql
DELIMITER //
CREATE PROCEDURE sp_place_order(
  IN p_customer_id INT,
  IN p_service_id INT,
  IN p_quantity INT
)
BEGIN
  DECLARE v_wallet_balance DECIMAL(10,2);
  DECLARE v_total_amount DECIMAL(8,2);

  SELECT c.wallet_balance, s.price_per_item * p_quantity
  INTO v_wallet_balance, v_total_amount
  FROM Customers c, Services s
  WHERE c.customer_id = p_customer_id AND s.service_id = p_service_id;

  IF v_wallet_balance < v_total_amount THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient wallet balance';
  END IF;

  INSERT INTO Orders (customer_id, service_id, quantity, total_amount)
  VALUES (p_customer_id, p_service_id, p_quantity, v_total_amount);

  SELECT 'Order placed successfully' AS message, LAST_INSERT_ID() AS order_id;
END//
DELIMITER ;
```

Validation and Errors:

- Ensures sufficient wallet balance; amount correctness is enforced by trigger `validate_order_amount`.
- May SIGNAL "Insufficient wallet balance".

Returns:

- One row: `{ message, order_id }`

Usage:

- Endpoint: `POST /api/orders`
- Code: `server/src/controllers/orderController.js`

Snippet (API):

```javascript
const [result] = await db.query("CALL sp_place_order(?, ?, ?)", [
  req.user.id,
  service_id,
  quantity,
]);
res.json(success(result[0][0]));
```

---

## sp_manage_order(p_action, p_employee_id, p_order_id)

Purpose:

- Transition an order through ACCEPT, REJECT, COMPLETE with safety checks.

Defined in:

- `database.sql`

Definition (SQL):

```sql
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
    UPDATE Orders SET status = 'Accepted', employee_id = p_employee_id
    WHERE order_id = p_order_id;
    SELECT CONCAT('Order ', p_order_id, ' accepted') AS message;

  ELSEIF p_action = 'REJECT' THEN
    IF v_status != 'Pending' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Can only reject pending orders';
    END IF;
    UPDATE Orders SET status = 'Rejected' WHERE order_id = p_order_id;
    SELECT CONCAT('Order ', p_order_id, ' rejected') AS message;

  ELSEIF p_action = 'COMPLETE' THEN
    IF v_status != 'Accepted' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order must be accepted first';
    END IF;
    IF v_current_employee != p_employee_id THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only assigned employee can complete order';
    END IF;
    UPDATE Orders SET status = 'Completed' WHERE order_id = p_order_id;
    SELECT CONCAT('Order ', p_order_id, ' completed successfully') AS message;
  END IF;
END//
DELIMITER ;
```

Validation and Errors:

- Pending → ACCEPT/REJECT; Accepted → COMPLETE/REJECT; others immutable.
- COMPLETE requires same employee who accepted the order.
- Example errors: "Order is not in pending status", "Only assigned employee can complete order".

Returns:

- One row: `{ message }`

Usage:

- Endpoint: `PUT /api/orders/:id/manage`
- Code: `server/src/controllers/orderController.js`

Snippet (API):

```javascript
const [result] = await db.query("CALL sp_manage_order(?, ?, ?)", [
  action,
  req.user.id,
  req.params.id,
]);
res.json(success(null, result[0][0].message));
```

---

## sp_get_dashboard(p_user_type, p_user_id)

Purpose:

- Multi-result-set dashboard data for CUSTOMER or EMPLOYEE.

Defined in:

- Final: `server/database-complete-fix.sql` (preferred ordering by DATETIME `order_date`).
- Historical: `server/database-dashboard-fix.sql` (ordered by string `order_datetime`) – avoid.

Definition (SQL – final preferred):

```sql
DROP PROCEDURE IF EXISTS sp_get_dashboard;
DELIMITER //
CREATE PROCEDURE sp_get_dashboard(
  IN p_user_type VARCHAR(20),
  IN p_user_id INT
)
BEGIN
  IF p_user_type = 'CUSTOMER' THEN
    SELECT * FROM view_customer_complete WHERE customer_id = p_user_id;
    SELECT * FROM view_all_orders
    WHERE customer_id = p_user_id
    ORDER BY order_date DESC LIMIT 10;

  ELSEIF p_user_type = 'EMPLOYEE' THEN
    SELECT
      e.employee_id,
      e.name,
      e.earnings_balance,
      CONCAT('$', FORMAT(e.earnings_balance, 2)) AS formatted_earnings,
      COUNT(o.order_id) AS total_orders_handled,
      COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) AS completed_orders,
      COUNT(CASE WHEN o.status = 'Accepted' THEN 1 END) AS in_progress_orders
    FROM Employees e
    LEFT JOIN Orders o ON e.employee_id = o.employee_id
    WHERE e.employee_id = p_user_id
    GROUP BY e.employee_id, e.name, e.earnings_balance;

    SELECT * FROM view_all_orders
    WHERE status = 'Pending'
    ORDER BY order_date ASC LIMIT 10;

    SELECT * FROM view_all_orders
    WHERE employee_name = (SELECT name FROM Employees WHERE employee_id = p_user_id)
    AND status = 'Accepted'
    ORDER BY order_date DESC;
  END IF;
END//
DELIMITER ;
```

Results:

- CUSTOMER: [0] profile from `view_customer_complete`; [1] recent orders from `view_all_orders` ordered by `order_date` DESC.
- EMPLOYEE: [0] employee stats; [1] pending orders (ASC by `order_date`); [2] current accepted work (DESC by `order_date`).

Usage:

- Endpoints:
  - `GET /api/customers/dashboard` (calls with 'CUSTOMER')
  - `GET /api/employees/dashboard` (calls with 'EMPLOYEE')
- Code: `server/src/controllers/customerController.js`, `server/src/controllers/employeeController.js`

Snippet (API):

```javascript
// Customer
const [result] = await db.query('CALL sp_get_dashboard("CUSTOMER", ?)', [
  req.user.id,
]);
const profile = result[0][0];
const recent = result[1];

// Employee
const [er] = await db.query("CALL sp_get_dashboard('EMPLOYEE', ?)", [
  req.user.id,
]);
const stats = er[0][0];
const pending = er[1];
const current = er[2];
```

Notes:

- Always interpret result sets by index as shown above.

---

## sp_manage_service(p_action, p_service_id, p_service_name, p_price_per_item)

Purpose:

- CRUD for services with strong validation, e.g., name uniqueness, non-negative price, and referential safety on delete.

Defined in:

- `database.sql`

Definition (SQL):

```sql
DELIMITER //
CREATE PROCEDURE sp_manage_service(
  IN p_action VARCHAR(20),
  IN p_service_id INT,
  IN p_service_name VARCHAR(50),
  IN p_price_per_item DECIMAL(6,2)
)
BEGIN
  IF p_action = 'CREATE' THEN
    IF p_service_name IS NULL OR p_price_per_item IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service name and price are required';
    END IF;
    IF p_price_per_item <= 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Price must be positive';
    END IF;
    IF EXISTS (SELECT 1 FROM Services WHERE service_name = p_service_name) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service name already exists';
    END IF;
    INSERT INTO Services (service_name, price_per_item)
    VALUES (p_service_name, p_price_per_item);
    SELECT CONCAT('Service "', p_service_name, '" created successfully') AS message,
         LAST_INSERT_ID() AS service_id;

  ELSEIF p_action = 'UPDATE' THEN
    IF p_service_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service ID is required for update';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM Services WHERE service_id = p_service_id) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service not found';
    END IF;
    IF p_service_name IS NOT NULL AND EXISTS (
      SELECT 1 FROM Services
      WHERE service_name = p_service_name AND service_id != p_service_id
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service name already exists';
    END IF;
    UPDATE Services
    SET
      service_name = COALESCE(p_service_name, service_name),
      price_per_item = COALESCE(p_price_per_item, price_per_item)
    WHERE service_id = p_service_id;
    SELECT 'Service updated successfully' AS message;

  ELSEIF p_action = 'DELETE' THEN
    IF p_service_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service ID is required for delete';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM Services WHERE service_id = p_service_id) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service not found';
    END IF;
    IF EXISTS (SELECT 1 FROM Orders WHERE service_id = p_service_id) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete service that has orders';
    END IF;
    DELETE FROM Services WHERE service_id = p_service_id;
    SELECT 'Service deleted successfully' AS message;

  ELSE
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid action. Use CREATE, UPDATE, or DELETE';
  END IF;
END//
DELIMITER ;
```

Returns:

- CREATE: `{ message, service_id }`
- UPDATE/DELETE: `{ message }`

Usage:

- Currently not exposed by dedicated controller in the repo’s routes; intended for admin/employee tooling.
- Refer to examples included in `database.sql` comments.

Representative call (example):

```sql
CALL sp_manage_service('CREATE', NULL, 'Premium Wash', 7.50);
CALL sp_manage_service('UPDATE', 1, 'Updated Name', 8.00);
CALL sp_manage_service('DELETE', 1, NULL, NULL);
```

---

## sp_update_employee_profile(employee_id, name, phone, email)

Purpose:

- Update an employee’s profile details. Referenced by the API, definition should exist in the database (not included in schema files here).

Observed Usage:

- Endpoint: `PUT /api/employees/profile`
- Code: `server/src/controllers/employeeController.js`

Snippet (API):

```javascript
const [result] = await db.query("CALL sp_update_employee_profile(?, ?, ?, ?)", [
  req.user.id,
  name,
  phone,
  email,
]);
res.json(success(result[0][0], "Profile updated successfully"));
```

Notes:

- Ensure the procedure upholds email uniqueness and returns updated profile fields.

Definition (SQL — reference implementation):

```sql
-- Ensure this exists in your DB; adjust to your needs.
DELIMITER //
CREATE PROCEDURE sp_update_employee_profile(
  IN p_employee_id INT,
  IN p_name VARCHAR(100),
  IN p_phone VARCHAR(15),
  IN p_email VARCHAR(100)
)
BEGIN
  IF EXISTS (SELECT 1 FROM Employees WHERE email = p_email AND employee_id <> p_employee_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
  END IF;
  UPDATE Employees
  SET name = p_name,
    phone = p_phone,
    email = p_email
  WHERE employee_id = p_employee_id;
  SELECT employee_id, name, phone, email, earnings_balance FROM Employees WHERE employee_id = p_employee_id;
END//
DELIMITER ;
```

---

## Result Shapes and Axios Consumption

- MySQL2 `CALL` returns nested arrays. The first array is the list of result sets. Each set is an array of rows.
- Patterns used in code:
  - Single-row: `result[0][0]`
  - Message-only: `result[0][0].message`
  - Multi-sets: index per section (see dashboard examples).

Example:

```javascript
const [result] = await db.query("CALL sp_add_money(?, ?)", [id, amount]);
// result: [ [ [{ message: 'Successfully added $10 to wallet' }] ], ...metadata ]
const msg = result[0][0].message;
```

---

## Error Contracts (Raised via SIGNAL)

- Duplicate email/phone on registration.
- Amount must be positive.
- Insufficient wallet balance.
- Invalid order state transitions, unassigned employee on accept, etc.

Catch in API and convert to appropriate HTTP codes:

- 400 Bad Request for business rule violations.
- 401 Unauthorized for login failures.
- 409 Conflict for duplicates.

---

## Quick Testing Snippets

SQL:

```sql
CALL sp_customer_login('john@example.com');
CALL sp_employee_login('employee@laundryola.com');
CALL sp_add_money(1, 50.00);
CALL sp_place_order(1, 1, 3);
CALL sp_manage_order('ACCEPT', 1, 123);
CALL sp_manage_order('COMPLETE', 1, 123);
CALL sp_get_dashboard('CUSTOMER', 1);
CALL sp_get_dashboard('EMPLOYEE', 1);
```

Node (using mysql2/promise):

```javascript
const [result] = await db.query("CALL sp_place_order(?, ?, ?)", [
  userId,
  serviceId,
  qty,
]);
const payload = result[0][0];
```

---

## Cross-References

- Base DDL and procedure bodies: `database.sql`
- Auth procedure overrides: `server/database-auth-fix.sql`
- Dashboard/view alignment: `server/database-complete-fix.sql`
- Wallet trigger and transactions view: `server/database-wallet-fix.sql`, `server/database-wallet-transactions-fix.sql`
- Code call sites: `server/src/controllers/*.js`, routes: `server/src/routes/*.js`

This document should give you a precise view of where and how each stored procedure is invoked throughout the project, with real code references.
