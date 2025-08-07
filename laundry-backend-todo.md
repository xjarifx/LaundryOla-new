Here's the updated `laundry-backend-todo.md` for your new database with authentication:

```markdown
# Laundry Service Database - AI Implementation TODO (With Authentication)

## 📋 **Project Overview**
Create a complete Node.js Express.js backend for the laundry service database with full email/password authentication system. The database includes 6 tables, 3 views, 4 triggers, and 8 stored procedures including authentication procedures.

## 🎯 **Core Requirements**

### **1. Backend Setup**
- [ ] Initialize Node.js project with Express.js
- [ ] Install required dependencies (express, mysql2, cors, helmet, bcrypt, jsonwebtoken, etc.)
- [ ] Set up environment variables (.env file) including JWT_SECRET
- [ ] Create MySQL connection pool with proper configuration
- [ ] Set up basic server structure with middleware

### **2. Database Integration**
- [ ] Implement database connection using mysql2/promise
- [ ] Create database utility functions for query execution
- [ ] Set up connection error handling and retry logic
- [ ] Test database connectivity on server startup
- [ ] Create database seeding script with sample authenticated users

### **3. Authentication System Implementation**

#### **Password Security**
- [ ] Install and configure bcrypt for password hashing
- [ ] Set up password hashing with minimum 10 rounds
- [ ] Implement password strength validation
- [ ] Create password comparison utilities
- [ ] Add password reset functionality (optional)

#### **JWT Authentication**
- [ ] Install and configure jsonwebtoken
- [ ] Create JWT token generation function
- [ ] Implement JWT verification middleware
- [ ] Set up token expiration (24 hours recommended)
- [ ] Create role-based authentication middleware (customer vs employee)

#### **Authentication Middleware**
- [ ] `authenticateToken` - Verify JWT tokens
- [ ] `requireCustomer` - Ensure customer access only
- [ ] `requireEmployee` - Ensure employee access only
- [ ] Error handling for invalid/expired tokens
- [ ] Proper HTTP status codes for auth errors

### **4. Authentication Endpoints**

#### **Registration Endpoints**
- [ ] `POST /api/customers/register` - Customer registration with email/password
- [ ] `POST /api/employees/register` - Employee registration with email/password
- [ ] Input validation for email format and password strength
- [ ] Hash passwords before database storage
- [ ] Handle duplicate email/phone errors

#### **Login Endpoints**
- [ ] `POST /api/customers/login` - Customer authentication
- [ ] `POST /api/employees/login` - Employee authentication
- [ ] Password verification with bcrypt
- [ ] JWT token generation on successful login
- [ ] Return user data with token

#### **Logout Endpoint**
- [ ] `POST /api/auth/logout` - Logout functionality
- [ ] Token invalidation (if implementing blacklist)
- [ ] Clear client-side authentication state

### **5. Protected API Endpoints Implementation**

#### **Customer Management (Protected)**
- [ ] `GET /api/customers/profile` - Get authenticated customer profile
- [ ] `PUT /api/customers/profile` - Update customer profile
- [ ] `GET /api/customers/dashboard` - Customer dashboard data
- [ ] Ensure customers can only access their own data

#### **Wallet Management (Protected)**
- [ ] `POST /api/customers/wallet/add` - Add money to authenticated customer's wallet
- [ ] `GET /api/customers/wallet/balance` - Get current balance
- [ ] `GET /api/customers/transactions` - Get transaction history
- [ ] `GET /api/customers/transactions/:limit` - Limited transaction history

#### **Service Management**
- [ ] `GET /api/services` - Get all available services (public)
- [ ] `POST /api/services` - Create new service (employee only)
- [ ] `PUT /api/services/:id` - Update service (employee only)
- [ ] `DELETE /api/services/:id` - Delete service (employee only)
- [ ] `GET /api/services/:id` - Get specific service details

#### **Order Management (Protected)**
- [ ] `POST /api/orders` - Place new order (customer only)
- [ ] `GET /api/customers/orders` - Get authenticated customer orders
- [ ] `GET /api/orders/pending` - Get pending orders (employee only)
- [ ] `PUT /api/orders/:id/manage` - Accept/Reject/Complete orders (employee only)
- [ ] `GET /api/orders/:id` - Get specific order details (auth required)

#### **Employee Management (Protected)**
- [ ] `GET /api/employees/dashboard` - Employee dashboard (employee only)
- [ ] `GET /api/employees/orders` - Employee assigned orders
- [ ] `PUT /api/employees/profile` - Update employee profile
- [ ] `GET /api/employees/earnings` - Get employee earnings

## 🔐 **Security & Validation**

### **Input Validation**
- [ ] Email format validation with regex
- [ ] Password strength requirements (min 8 chars, special chars, etc.)
- [ ] Request body validation middleware
- [ ] Parameter validation for all routes
- [ ] Sanitize user inputs to prevent XSS

### **Authentication Security**
- [ ] Implement secure JWT secret management
- [ ] Add token expiration handling
- [ ] Prevent password exposure in API responses
- [ ] Implement rate limiting for auth endpoints
- [ ] Add account lockout after failed attempts (optional)

### **Authorization Controls**
- [ ] Role-based access control (customer vs employee)
- [ ] Resource ownership verification (customers can only access their data)
- [ ] Admin role implementation (optional)
- [ ] Proper HTTP status codes for authorization failures

### **Security Middleware**
- [ ] Add helmet.js for security headers
- [ ] Implement CORS with proper configuration
- [ ] Add request logging middleware
- [ ] Implement API rate limiting
- [ ] Add SQL injection prevention measures

## 📊 **Error Handling & Responses**

### **Authentication Error Management**
- [ ] Invalid credentials handling (401)
- [ ] Missing token handling (401)
- [ ] Expired token handling (403)
- [ ] Insufficient permissions handling (403)
- [ ] Duplicate registration handling (409)

### **Error Logging**
- [ ] Create centralized error handling middleware
- [ ] Implement custom error classes for auth
- [ ] Add proper HTTP status codes for all scenarios
- [ ] Create error logging system
- [ ] Add database error handling and mapping

### **Response Standardization**
- [ ] Create consistent API response format
- [ ] Implement success response wrapper
- [ ] Include proper error messages for validation
- [ ] Add request/response logging
- [ ] Handle authentication in response headers

## 🧪 **Testing & Documentation**

### **Authentication Testing**
- [ ] Set up Jest testing framework
- [ ] Create unit tests for auth middleware
- [ ] Test registration endpoints with various inputs
- [ ] Test login functionality with valid/invalid credentials
- [ ] Test protected routes with/without authentication
- [ ] Test role-based access control

### **Integration Testing**
- [ ] Test complete authentication flow
- [ ] Test order workflow with authentication
- [ ] Test error scenarios and edge cases
- [ ] Create test database with sample authenticated users
- [ ] Test JWT token expiration scenarios

### **API Documentation**
- [ ] Generate Swagger/OpenAPI documentation with auth
- [ ] Document all authentication endpoints
- [ ] Include JWT token usage examples
- [ ] Add authentication flow documentation
- [ ] Create Postman collection with auth examples

## ⚡ **Performance & Optimization**

### **Authentication Performance**
- [ ] Implement JWT token caching strategies
- [ ] Optimize password hashing performance
- [ ] Add authentication rate limiting
- [ ] Implement session management (optional)
- [ ] Optimize database queries for auth

### **Security Monitoring**
- [ ] Add authentication attempt logging
- [ ] Implement suspicious activity detection
- [ ] Add failed login attempt monitoring
- [ ] Create authentication metrics collection
- [ ] Add security event logging

## 🚀 **Deployment Ready Features**

### **Environment Configuration**
- [ ] Secure JWT secret management in production
- [ ] Environment-specific authentication settings
- [ ] Database connection security for production
- [ ] SSL/TLS configuration for auth endpoints
- [ ] Production-ready security headers

### **Production Security**
- [ ] Implement refresh token strategy (optional)
- [ ] Add authentication audit trails
- [ ] Configure secure cookie settings
- [ ] Implement proper CORS for production
- [ ] Add authentication health checks

## 📋 **Authentication-Specific Database Integration**

### **New Stored Procedures Integration**
- [ ] `sp_register_customer(name, phone, email, password, address)` - Customer registration
- [ ] `sp_register_employee(name, phone, email, password)` - Employee registration
- [ ] `sp_customer_login(email, password)` - Customer authentication
- [ ] `sp_employee_login(email, password)` - Employee authentication

### **Updated Views Integration**
- [ ] Use `view_customer_complete` with email field for customer profiles
- [ ] Use `view_available_services` for service listings  
- [ ] Use `view_all_orders` for order data with proper user filtering
- [ ] Implement authentication-aware pagination

### **Security Validation**
- [ ] Verify password hashing works with database procedures
- [ ] Test email uniqueness constraints
- [ ] Verify authentication triggers work correctly
- [ ] Test role-based data access
- [ ] Validate JWT integration with database user IDs

### **Business Logic Verification (With Auth)**
- [ ] Test automatic payment processing trigger
- [ ] Verify wallet balance updates work correctly
- [ ] Test order amount validation trigger
- [ ] Verify order status transition validation
- [ ] Test employee earnings automation
- [ ] Verify authenticated user can only access their own data

## 🎁 **Enhanced Authentication Features**

### **Advanced Authentication**
- [ ] Implement "Remember Me" functionality
- [ ] Add social login integration (optional)
- [ ] Create email verification system
- [ ] Add password reset via email
- [ ] Implement two-factor authentication (optional)

### **User Management**
- [ ] Add user profile picture upload
- [ ] Implement account deactivation
- [ ] Add user activity tracking
- [ ] Create user preference management
- [ ] Add account deletion functionality

### **Enhanced Functionality**
- [ ] Add order status change notifications (authenticated users only)
- [ ] Implement customer order history analytics
- [ ] Add employee performance metrics
- [ ] Create daily/weekly/monthly reports
- [ ] Add export functionality for reports

### **Advanced Features**
- [ ] Implement WebSocket for real-time order updates (authenticated)
- [ ] Add email notifications for order status changes
- [ ] Create admin panel endpoints
- [ ] Add bulk operations for orders/services
- [ ] Implement audit trail for sensitive operations

## 📚 **Deliverables**

### **Code Structure**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   └── employeeController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── customers.js
│   │   └── employees.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── bcrypt.js
│   │   └── validators.js
│   └── config/
│       └── database.js
├── tests/
│   ├── auth.test.js
│   ├── customers.test.js
│   └── employees.test.js
├── docs/
└── package.json
```

### **Environment Variables Required**
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=laundry_service
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=10
PORT=3000
```

### **Documentation**
- [ ] Complete README.md with setup instructions
- [ ] API documentation (Swagger) with authentication
- [ ] Database integration guide
- [ ] Authentication flow guide
- [ ] Deployment guide
- [ ] Testing guide

## 🎯 **Success Criteria**

The backend should:
- ✅ Handle complete authentication flow (register, login, logout)
- ✅ Implement secure password hashing and JWT tokens
- ✅ Protect all customer/employee operations with authentication
- ✅ Support role-based access control (customer vs employee)
- ✅ Properly integrate with all database views and procedures
- ✅ Include comprehensive error handling for auth scenarios
- ✅ Be production-ready with proper security measures
- ✅ Have complete test coverage including auth tests
- ✅ Include API documentation with authentication examples
- ✅ Follow REST API and JWT best practices

## 💡 **AI Implementation Notes**

- Use the database stored procedures for all authentication operations
- Implement bcrypt with minimum 10 rounds for password hashing
- Generate JWT tokens with user ID, type (customer/employee), and email
- Protect all data-modifying operations with authentication
- Ensure customers can only access their own data
- Use role-based middleware to separate customer and employee routes
- Test all authentication scenarios including edge cases
- Follow security best practices for JWT and password handling

**Time Estimate: 3-4 days for a complete, production-ready authenticated backend**

*This TODO list provides a comprehensive roadmap for creating a complete, professional backend with full authentication that properly integrates with the laundry service database system.*
```

This updated TODO now includes:
- ✅ Complete authentication system requirements
- ✅ JWT implementation tasks
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Protected endpoints specifications
- ✅ Authentication-specific testing requirements
- ✅ Security considerations for auth
- ✅ Updated database integration with auth stored procedures
- ✅ Environment variables for authentication
- ✅ Enhanced file structure with auth components

The TODO is now comprehensive for building a fully authenticated backend system! 🚀