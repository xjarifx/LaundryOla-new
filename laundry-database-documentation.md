Here's the updated `laundry-database-documentation.md` for your new database with authentication:

```markdown
# Laundry Service Database API Documentation

## Database Overview

This documentation provides complete API guidelines for integrating with the laundry service database. The database is designed in 3NF with automated business logic through triggers, optimized views for frontend consumption, and complete email/password authentication system.

## Database Schema

### Core Tables
- **Customers** - Customer information with digital wallet and authentication (email/password)
- **Employees** - Employee details with earnings tracking and authentication (email/password)
- **Services** - Available laundry services with pricing
- **Orders** - Order management with status workflow
- **Wallet_Transactions** - Customer payment history
- **Employee_Earnings** - Employee payment records

### Authentication Fields
Both Customers and Employees tables include:
- `email VARCHAR(100) UNIQUE NOT NULL` - Login identifier
- `password VARCHAR(255) NOT NULL` - Hashed password

## API Endpoints Guide

### 1. Authentication Management

#### Customer Registration
```
// POST /api/customers/register
app.post('/api/customers/register', async (req, res) => {
    const { name, phone, email, password, address } = req.body;
    
    try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.query(
            'CALL sp_register_customer(?, ?, ?, ?, ?)',
            [name, phone, email, hashedPassword, address]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
```

#### Customer Login
```
// POST /api/customers/login
app.post('/api/customers/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const result = await db.query(
            'CALL sp_customer_login(?, ?)',
            [email, password]
        );
        
        if (result.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const customer = result;
        const token = jwt.sign(
            { id: customer.customer_id, type: 'customer', email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            token,
            user: {
                id: customer.customer_id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                type: 'customer'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

#### Employee Registration
```
// POST /api/employees/register
app.post('/api/employees/register', async (req, res) => {
    const { name, phone, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.query(
            'CALL sp_register_employee(?, ?, ?, ?)',
            [name, phone, email, hashedPassword]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
```

#### Employee Login
```
// POST /api/employees/login
app.post('/api/employees/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const result = await db.query(
            'CALL sp_employee_login(?, ?)',
            [email, password]
        );
        
        if (result.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const employee = result;
        const token = jwt.sign(
            { id: employee.employee_id, type: 'employee', email: employee.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            token,
            user: {
                id: employee.employee_id,
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                type: 'employee'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

#### Logout
```
// POST /api/auth/logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
    // In a more complex system, you might blacklist the token
    res.json({ success: true, message: 'Logged out successfully' });
});
```

### 2. Authentication Middleware

#### JWT Verification Middleware
```
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ');
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const requireCustomer = (req, res, next) => {
    if (req.user.type !== 'customer') {
        return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    next();
};

const requireEmployee = (req, res, next) => {
    if (req.user.type !== 'employee') {
        return res.status(403).json({ success: false, message: 'Employee access required' });
    }
    next();
};
```

### 3. Protected Customer Management

#### Get Customer Profile (Protected)
```
// GET /api/customers/profile
app.get('/api/customers/profile', authenticateToken, requireCustomer, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM view_customer_complete WHERE customer_id = ?',
            [req.user.id]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

#### Customer Dashboard (Protected)
```
// GET /api/customers/dashboard
app.get('/api/customers/dashboard', authenticateToken, requireCustomer, async (req, res) => {
    try {
        const result = await db.query(
            'CALL sp_get_dashboard("CUSTOMER", ?)',
            [req.user.id]
        );
        res.json({ 
            success: true, 
            profile: result,
            recent_orders: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

### 4. Protected Wallet Management

#### Add Money to Wallet (Protected)
```
// POST /api/customers/wallet/add
app.post('/api/customers/wallet/add', authenticateToken, requireCustomer, async (req, res) => {
    const { amount } = req.body;
    
    try {
        const result = await db.query(
            'CALL sp_add_money(?, ?)',
            [req.user.id, amount]
        );
        res.json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
```

#### Get Wallet Transactions (Protected)
```
// GET /api/customers/transactions
app.get('/api/customers/transactions', authenticateToken, requireCustomer, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM view_wallet_transactions WHERE customer_id = ? LIMIT 20',
            [req.user.id]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

### 5. Service Management

#### Get Available Services (Public)
```
// GET /api/services
app.get('/api/services', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM view_available_services');
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

#### Service Management (Employee Only)
```
// POST /api/services
app.post('/api/services', authenticateToken, requireEmployee, async (req, res) => {
    const { action, service_id, service_name, price } = req.body;
    
    try {
        const result = await db.query(
            'CALL sp_manage_service(?, ?, ?, ?)',
            [action, service_id, service_name, price]
        );
        res.json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Usage examples:
// Create: { action: "CREATE", service_name: "Premium Wash", price: 7.50 }
// Update: { action: "UPDATE", service_id: 1, service_name: "Updated Name", price: 8.00 }
// Delete: { action: "DELETE", service_id: 1 }
```

### 6. Protected Order Management

#### Place Order (Customer Only)
```
// POST /api/orders
app.post('/api/orders', authenticateToken, requireCustomer, async (req, res) => {
    const { service_id, quantity } = req.body;
    
    try {
        const result = await db.query(
            'CALL sp_place_order(?, ?, ?)',
            [req.user.id, service_id, quantity]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
```

#### Get Customer Orders (Protected)
```
// GET /api/customers/orders
app.get('/api/customers/orders', authenticateToken, requireCustomer, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM view_all_orders WHERE customer_id = ? ORDER BY order_date DESC',
            [req.user.id]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

#### Get Pending Orders (Employee Only)
```
// GET /api/orders/pending
app.get('/api/orders/pending', authenticateToken, requireEmployee, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM view_all_orders WHERE status = "Pending" ORDER BY order_date ASC'
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

### 7. Protected Employee Management

#### Employee Dashboard (Protected)
```
// GET /api/employees/dashboard
app.get('/api/employees/dashboard', authenticateToken, requireEmployee, async (req, res) => {
    try {
        const result = await db.query(
            'CALL sp_get_dashboard("EMPLOYEE", ?)',
            [req.user.id]
        );
        res.json({ 
            success: true,
            employee_stats: result,
            pending_orders: result,
            current_work: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

#### Accept/Reject/Complete Orders (Employee Only)
```
// PUT /api/orders/:id/manage
app.put('/api/orders/:id/manage', authenticateToken, requireEmployee, async (req, res) => {
    const { action } = req.body;
    
    try {
        const result = await db.query(
            'CALL sp_manage_order(?, ?, ?)',
            [action, req.user.id, req.params.id]
        );
        res.json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Usage examples:
// Accept: { action: "ACCEPT" }
// Reject: { action: "REJECT" }
// Complete: { action: "COMPLETE" }
```

## Quick Reference Views

### Frontend Data Views (Authentication Required)
```
// Customer complete profile with stats (includes email)
'SELECT * FROM view_customer_complete WHERE customer_id = ?'

// All available services with formatted prices (public)
'SELECT * FROM view_available_services'

// All orders with complete details and formatting (filtered by user)
'SELECT * FROM view_all_orders WHERE customer_id = ?'

// Filter orders by status (employee access)
'SELECT * FROM view_all_orders WHERE status = "Pending"'
```

## Authentication Flow

### 1. Registration Flow
```
1. POST /api/customers/register or /api/employees/register
2. Validate input (email format, password strength)
3. Hash password with bcrypt
4. Call stored procedure to register user
5. Return success/error response
```

### 2. Login Flow
```
1. POST /api/customers/login or /api/employees/login
2. Validate credentials with stored procedure
3. Generate JWT token with user info
4. Return token + user data
```

### 3. Protected Route Access
```
1. Include JWT token in Authorization header: "Bearer "
2. Middleware verifies token and extracts user info
3. Role-based middleware checks user type (customer/employee)
4. Proceed with authenticated request
```

## Error Handling

### Authentication Error Responses

#### Invalid Credentials
```
{
    "success": false,
    "message": "Invalid credentials"
}
```

#### Missing Token
```
{
    "success": false,
    "message": "Access token required"
}
```

#### Invalid/Expired Token
```
{
    "success": false,
    "message": "Invalid or expired token"
}
```

#### Insufficient Permissions
```
{
    "success": false,
    "message": "Customer access required"
}
```

#### Duplicate Registration
```
{
    "success": false,
    "message": "Email already registered"
}
```

### Common Error Responses

#### Insufficient Balance
```
{
    "success": false,
    "message": "Insufficient wallet balance"
}
```

#### Invalid Order Status
```
{
    "success": false,
    "message": "Order is not in pending status"
}
```

## Database Connection Setup

### Node.js with MySQL2 and Authentication
```
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'laundry_service',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Environment variables needed
process.env.JWT_SECRET = 'your-secret-key';
process.env.BCRYPT_ROUNDS = '10';

// Usage
const [results] = await db.query('SELECT * FROM view_available_services');
```

## Business Logic Automation

### Automatic Processes (Handled by Database)
- ✅ **Payment Processing** - When order status changes to "Completed"
- ✅ **Wallet Updates** - When money is added via transactions
- ✅ **Employee Earnings** - Automatically credited on order completion
- ✅ **Data Validation** - Order amounts, status transitions, balance checks
- ✅ **Transaction Logging** - All financial activities are tracked
- ✅ **Authentication Validation** - Email uniqueness, password requirements

### Manual Operations (API Required)
- 🔧 Customer/Employee registration with authentication
- 🔧 Login/logout functionality
- 🔧 Adding money to wallet (authenticated customers only)
- 🔧 Placing orders (authenticated customers only)
- 🔧 Employee accepting/rejecting/completing orders (authenticated employees only)
- 🔧 Service management (authenticated employees only)

## Testing Examples

### Complete Authentication Journey
```
// 1. Register customer
POST /api/customers/register
Body: { 
    name: "John Doe", 
    phone: "123-456-7890", 
    email: "john@example.com",
    password: "securepassword123",
    address: "123 Main St" 
}

// 2. Login customer
POST /api/customers/login
Body: { email: "john@example.com", password: "securepassword123" }
Response: { success: true, token: "jwt-token-here", user: {...} }

// 3. Use protected endpoints
GET /api/customers/profile
Headers: { Authorization: "Bearer jwt-token-here" }

// 4. Add money to wallet
POST /api/customers/wallet/add
Headers: { Authorization: "Bearer jwt-token-here" }
Body: { amount: 50.00 }

// 5. Place order
POST /api/orders
Headers: { Authorization: "Bearer jwt-token-here" }
Body: { service_id: 1, quantity: 3 }

// 6. Employee login and accept order
POST /api/employees/login
Body: { email: "employee@example.com", password: "employeepass123" }

PUT /api/orders/1/manage
Headers: { Authorization: "Bearer employee-jwt-token-here" }
Body: { action: "ACCEPT" }

// 7. Employee completes order (automatic payment processing)
PUT /api/orders/1/manage
Headers: { Authorization: "Bearer employee-jwt-token-here" }
Body: { action: "COMPLETE" }
```

## Performance Tips

1. **Use Views** - Pre-optimized queries with formatted data
2. **Leverage Stored Procedures** - Complex business logic handled in database
3. **Connection Pooling** - Maintain persistent database connections
4. **JWT Token Caching** - Implement token verification caching
5. **Error Handling** - Database validates all business rules automatically
6. **Transactions** - All critical operations are wrapped in database transactions

## Security Considerations

### Password Security
- Passwords hashed with bcrypt (minimum 10 rounds)
- Never store plain text passwords
- Validate password strength on frontend

### JWT Security
- Tokens expire in 24 hours
- Include user type (customer/employee) in token
- Verify token on every protected route

### Input Validation
- Email format validation
- Password strength requirements
- SQL injection prevention through parameterized queries

### Access Control
- Role-based authorization (customer vs employee)
- Users can only access their own data
- Database triggers provide additional validation layer
- Foreign key constraints prevent invalid data relationships
- Check constraints ensure data integrity at database level

This documentation provides everything your backend needs to integrate seamlessly with the authenticated laundry service database! 🚀
```

This updated documentation now includes:
- ✅ Complete authentication system with email/password
- ✅ JWT token-based authentication
- ✅ Role-based access control (customer vs employee)
- ✅ Protected endpoints with proper middleware
- ✅ Updated stored procedures with authentication
- ✅ Authentication flow documentation
- ✅ Security considerations for auth
- ✅ Complete testing examples with authentication

The documentation is now ready for AI implementation of your authenticated backend!