## LaundryOla Database – Final Comprehensive Reference

This document is the single source of truth for the LaundryOla database. It captures the final schema, views, triggers, stored procedures, invariants, migration steps, verification queries, and operational guidance as of 2025‑08‑09.

Important notes:

- Engine: MySQL 8.x (InnoDB, SQL mode strict enabled is recommended).
- Timezone: Store timestamps in server time (DATETIME). Format for display in views; use raw DATETIME for sorting and filtering.
- Authentication: Passwords are hashed with bcrypt in the application layer. The database returns hashes; it never performs password comparison.

## 1) Entity Model Overview

Entities and relationships (PK ▣, FK →):

```
Customers(▣ customer_id)           Employees(▣ employee_id)
    email UNIQUE                         email UNIQUE
    wallet_balance                       earnings_balance
                ▲                                     ▲
                │                                     │
                │                                     │
Wallet_Transactions(▣ transaction_id)   Employee_Earnings(▣ earning_id)
    → customer_id                               → employee_id
    → order_id (nullable)                       → order_id

Orders(▣ order_id)
    → customer_id
    → employee_id (nullable)
    → service_id

Services(▣ service_id)
```

## 2) Tables (Data Dictionary)

### 2.1 Customers

- Columns:
  - customer_id INT PK AUTO_INCREMENT
  - name VARCHAR(100) NOT NULL
  - phone VARCHAR(15) NOT NULL
  - email VARCHAR(100) UNIQUE NOT NULL
  - password VARCHAR(255) NOT NULL (bcrypt hash)
  - address TEXT NULL
  - wallet_balance DECIMAL(10,2) DEFAULT 0.00 CHECK (wallet_balance >= 0)
- Notes:
  - Unique email enforced; unique phone enforced at procedure level; add DB UNIQUE(phone) if required.
  - Wallet balance is maintained by triggers based on Wallet_Transactions.

### 2.2 Employees

- Columns:
  - employee_id INT PK AUTO_INCREMENT
  - name VARCHAR(100) NOT NULL
  - phone VARCHAR(15) NOT NULL
  - email VARCHAR(100) UNIQUE NOT NULL
  - password VARCHAR(255) NOT NULL
  - earnings_balance DECIMAL(10,2) DEFAULT 0.00
- Notes:
  - Earnings balance is accumulated automatically on order completion via trigger.

### 2.3 Services

- Columns:
  - service_id INT PK AUTO_INCREMENT
  - service_name VARCHAR(50) NOT NULL
  - price_per_item DECIMAL(6,2) NOT NULL
- Notes:
  - Name uniqueness is enforced by procedure `sp_manage_service`.

### 2.4 Orders

- Columns:
  - order_id INT PK AUTO_INCREMENT
  - customer_id INT NOT NULL → Customers.customer_id
  - employee_id INT NULL → Employees.employee_id
  - service_id INT NOT NULL → Services.service_id
  - quantity INT NOT NULL CHECK (quantity > 0)
  - total_amount DECIMAL(8,2) NOT NULL CHECK (total_amount > 0)
  - order_date DATETIME DEFAULT CURRENT_TIMESTAMP
  - status ENUM('Pending','Accepted','Rejected','Completed') DEFAULT 'Pending'
- Notes:
  - Amount integrity validated by trigger `validate_order_amount` (must equal service.price_per_item × quantity).
  - Status transitions validated by `validate_order_status_transition`.
  - On transition to Completed with an assigned employee, `process_completed_order` will:
    1. Credit employee earnings_balance and insert into Employee_Earnings;
    2. Insert a Wallet_Transactions row as a negative Payment for the customer;
    3. The wallet trigger updates the customer wallet_balance.

### 2.5 Wallet_Transactions

- Columns:
  - transaction_id INT PK AUTO_INCREMENT
  - customer_id INT NOT NULL → Customers.customer_id
  - amount DECIMAL(8,2) NOT NULL (Add Money: positive; Payment: negative)
  - transaction_type ENUM('Add Money','Payment') NOT NULL
  - transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP
  - order_id INT NULL → Orders.order_id
- Notes:
  - Insert-only audit log; do not update existing rows post-insert.
  - Wallet balance is derived from sum of all transactions via trigger on insert.

### 2.6 Employee_Earnings

- Columns:
  - earning_id INT PK AUTO_INCREMENT
  - employee_id INT NOT NULL → Employees.employee_id
  - order_id INT NOT NULL → Orders.order_id
  - amount DECIMAL(8,2) NOT NULL
  - earned_date DATETIME DEFAULT CURRENT_TIMESTAMP
- Notes:
  - Populated by `process_completed_order` trigger; mirrors earnings_balance.

Indexes: MySQL auto-creates indexes for PKs and required FKs. For performance add:

```sql
CREATE INDEX idx_orders_status_date ON Orders (status, order_date);
CREATE INDEX idx_wallet_tx_customer_date ON Wallet_Transactions (customer_id, transaction_date);
CREATE INDEX idx_orders_customer_date ON Orders (customer_id, order_date);
```

## 3) Views (Read Models)

### 3.1 view_customer_complete

- Purpose: Single-row customer snapshot with aggregate stats.
- Columns (selected): customer_id, name, phone, email, address, wallet_balance, formatted_balance, total_orders, pending_orders, completed_orders, lifetime_spent, formatted_spent, last_order_date (DATETIME).
- Source: LEFT JOIN Customers with Orders; aggregates across Orders by customer.

### 3.2 view_available_services

- Purpose: Public list of services with human-friendly price.
- Columns: service_id, service_name, price_per_item, formatted_price.

### 3.3 view_all_orders

- Purpose: Unified order feed for dashboards.
- Columns (selected):
  - order_id, customer_id, customer_name, customer_phone, customer_address,
  - service_name, quantity, total_amount, formatted_amount,
  - status, order_date (DATETIME),
  - order_datetime (VARCHAR, formatted '%Y-%m-%d %H:%i' for compact display),
  - formatted_date (VARCHAR, e.g., 'August 08, 2025 at 10:30'),
  - employee_name, status_color ('warning'|'info'|'success'|'danger').
- Sorting guidance:
  - Always sort/filter by `order_date` (DATETIME). Do not sort by the string `order_datetime`.

### 3.4 view_wallet_transactions

- Purpose: Customer-facing wallet history with normalized types.
- Columns: transaction_id, customer_id, amount, transaction_type ('Add Money'|'Payment'), created_at (alias of transaction_date), order_id, type ('CREDIT' for Add Money, 'DEBIT' for Payment), description.

## 4) Triggers (Business Rules in DB)

### 4.1 update_wallet_on_transaction (AFTER INSERT ON Wallet_Transactions)

- Logic: `Customers.wallet_balance += NEW.amount`.
- Effect: Positive amounts (Add Money) increase balance; negative (Payment) decrease.

### 4.2 validate_order_amount (BEFORE INSERT ON Orders)

- Logic: Ensure `NEW.total_amount == Services.price_per_item × NEW.quantity`.
- Error: `45000 'Order amount does not match service price × quantity'`.

### 4.3 validate_order_status_transition (BEFORE UPDATE ON Orders)

- Rules:
  - Pending → Accepted|Rejected only.
  - Accepted → Completed|Rejected only.
  - Completed|Rejected → no further changes.
  - Accepting requires `employee_id` not NULL.
- Errors:
  - `45000 'From Pending, can only go to Accepted or Rejected'`
  - `45000 'From Accepted, can only go to Completed or Rejected'`
  - `45000 'Cannot change status of completed/rejected orders'`
  - `45000 'Employee must be assigned when accepting order'`

### 4.4 process_completed_order (AFTER UPDATE ON Orders)

- Guard: Fires only when status transitions to Completed and `employee_id` is set.
- Actions:
  - Credit Employees.earnings_balance by order total;
  - Insert Wallet_Transactions with negative amount and `Payment` type (trigger 4.1 adjusts wallet);
  - Insert Employee_Earnings row.

## 5) Stored Procedures (API Surface)

All procedures are idempotent to create and safe to re-run with DROP/CREATE as provided.

### 5.1 sp_register_customer(name, phone, email, password_hash, address)

- Validates unique phone and email; inserts customer; returns `{customer_id, message}`.

### 5.2 sp_register_employee(name, phone, email, password_hash)

- Validates unique phone and email; inserts employee; returns `{employee_id, message}`.

### 5.3 sp_customer_login(p_email)

- Final version (see `server/database-auth-fix.sql`).
- Returns one row with: customer_id, name, email, phone, address, wallet_balance, password (hash).
- Comparison of plaintext password is done in the application using bcrypt.

### 5.4 sp_employee_login(p_email)

- Final version; returns employee profile + password hash.

### 5.5 sp_add_money(p_customer_id, p_amount)

- Validates `p_amount > 0`; inserts Wallet_Transactions (Add Money); the wallet trigger updates balance; returns user message.

### 5.6 sp_place_order(p_customer_id, p_service_id, p_quantity)

- Checks wallet balance sufficient for service × quantity; inserts Orders; amount validation enforced by trigger; returns `{message, order_id}`.

### 5.7 sp_manage_order(p_action, p_employee_id, p_order_id)

- Actions:
  - ACCEPT: requires order Pending; sets status Accepted and assigns employee.
  - REJECT: requires Pending; sets Rejected.
  - COMPLETE: requires Accepted by the same employee; sets Completed. Triggers handle payments/earnings.
- Errors:
  - 'Order is not in pending status', 'Can only reject pending orders', 'Order must be accepted first', 'Only assigned employee can complete order'.

### 5.8 sp_get_dashboard(p_user_type, p_user_id)

- For 'CUSTOMER':
  - Result set 1: `view_customer_complete` for the user;
  - Result set 2: last 10 orders from `view_all_orders` for the user, ordered by `order_date` DESC.
- For 'EMPLOYEE':
  - Result set 1: aggregate employee stats (earnings, totals);
  - Result set 2: first 10 Pending orders (`order_date` ASC);
  - Result set 3: current Accepted work for the employee (`order_date` DESC).
- Implementation note: Some earlier versions ordered by `order_datetime` (string). The final stable version orders by `order_date` (DATETIME). Prefer the final version in `server/database-complete-fix.sql`.

### 5.9 sp_manage_service(p_action, p_service_id, p_service_name, p_price_per_item)

- CREATE/UPDATE/DELETE with strong validation and clear error messages.

## 6) Migration & Patch Order (Apply/Reapply Safely)

Run from the repository root (adjust credentials as needed). Apply in this order:

```bash
# 1) Base schema (first time only or to rebuild)
mysql -u <user> -p <db_name> < database.sql

# 2) Authentication procedures (email-only login returning password hash)
mysql -u <user> -p <db_name> < server/database-auth-fix.sql

# 3) Wallet trigger fix (unified Add Money/Payment handling)
mysql -u <user> -p <db_name> < server/database-wallet-fix.sql

# 4) Wallet transactions view (normalized types + descriptions)
mysql -u <user> -p <db_name> < server/database-wallet-transactions-fix.sql

# 5) View + dashboard alignment (order by DATETIME, not string)
mysql -u <user> -p <db_name> < server/database-complete-fix.sql
```

Notes:

- The file `server/database-dashboard-fix.sql` exists historically; prefer `server/database-complete-fix.sql` as the final version to avoid ordering by string fields.
- Scripts include `DROP VIEW/PROCEDURE` where needed for idempotency.

## 7) Verification (Smoke Tests)

Run these after applying patches:

```sql
-- Services available
SELECT * FROM view_available_services LIMIT 5;

-- Customer profile snapshot
SELECT * FROM view_customer_complete WHERE customer_id = 1;

-- Orders feed sorted by true datetime
SELECT order_id, status, order_date, order_datetime FROM view_all_orders ORDER BY order_date DESC LIMIT 10;

-- Wallet history with normalized types
SELECT transaction_id, amount, type, description, created_at
FROM view_wallet_transactions WHERE customer_id = 1 LIMIT 10;

-- Dashboard procedures
CALL sp_get_dashboard('CUSTOMER', 1);
CALL sp_get_dashboard('EMPLOYEE', 1);

-- Auth procedures return hashes (verify in app with bcrypt)
CALL sp_customer_login('john@example.com');
CALL sp_employee_login('employee@laundryola.com');
```

## 8) Business Rules & Invariants (Contract)

- Wallet balance = Σ Wallet_Transactions.amount per customer. Only triggers mutate the balance.
- An order’s total_amount is derived from Services.price_per_item × quantity (enforced).
- Only assigned employee can complete an Accepted order.
- Completing an order produces exactly one Payment wallet transaction and one employee earning row.
- Never sort by formatted strings (`order_datetime`, `formatted_date`). Use `order_date`.

## 9) Error Messages (Thrown via SIGNAL 45000)

- 'Phone number already registered', 'Email already registered'
- 'Amount must be positive'
- 'Insufficient wallet balance'
- 'Order amount does not match service price × quantity'
- 'Order is not in pending status'
- 'Can only reject pending orders'
- 'Order must be accepted first'
- 'Only assigned employee can complete order'
- 'From Pending, can only go to Accepted or Rejected'
- 'From Accepted, can only go to Completed or Rejected'
- 'Cannot change status of completed/rejected orders'
- 'Employee must be assigned when accepting order'
- 'Service name already exists', 'Service not found', 'Cannot delete service that has orders', 'Invalid action. Use CREATE, UPDATE, or DELETE'

## 10) Operational Guidance

- Transactions: The triggers ensure atomic outcomes for critical state changes. When chaining multiple DML statements in application code, wrap in a transaction if any step’s failure should roll back all.
- Permissions: Create a dedicated DB user for the app with least privileges (SELECT/INSERT/UPDATE/DELETE, EXECUTE). Admin-only for migrations.
- Backups: Before running patches in production, take a snapshot.
- Data cleanup: Use procedures or new migrations; avoid direct updates to aggregate columns (wallet/earnings).

## 11) Performance Recommendations

- Add the suggested indexes (see Section 2) once data size grows (>50k rows on Orders/Wallet_Transactions).
- Prefer views for read models; keep them deterministic and avoid volatile functions in WHERE clauses.
- Use pagination for large feeds (ORDER BY order_date, order_id with LIMIT/OFFSET or keyset pagination).

## 12) Appendix (DDL Locations)

- Base schema: `database.sql`
- Final fixes (apply in order):
  - `server/database-auth-fix.sql`
  - `server/database-wallet-fix.sql`
  - `server/database-wallet-transactions-fix.sql`
  - `server/database-complete-fix.sql`
- Historical (avoid, superseded by complete-fix):
  - `server/database-dashboard-fix.sql`

This document reflects the final, production-aligned database model used by LaundryOla. Keep it in sync with any future migrations.
