# LaundryOla API Testing Guide

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Customer Endpoints](#customer-endpoints)
4. [Employee Endpoints](#employee-endpoints)
5. [Order Management Endpoints](#order-management-endpoints)
6. [Service Management Endpoints](#service-management-endpoints)
7. [Testing Workflows](#testing-workflows)
8. [Error Testing Scenarios](#error-testing-scenarios)
9. [Postman Collection Setup](#postman-collection-setup)

## Base Configuration

**Base URL:** `https://laundryola-new.onrender.com/api`

### Environment Variables for Testing

```json
{
  "baseUrl": "http://localhost:5000",
  "customerToken": "",
  "employeeToken": "",
  "customerId": "",
  "employeeId": "",
  "orderId": "",
  "serviceId": ""
}
```

### Common Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{token}}"
}
```

---

## Authentication Endpoints

### 1. Customer Registration

**POST** `/api/auth/customers/register`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com",
  "password": "password123",
  "address": "123 Main Street, City, State 12345"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Customer registered successfully",
  "customer": {
    "id": 1,
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main Street, City, State 12345",
    "wallet_balance": 0.0,
    "created_at": "2025-08-07T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- **400 Bad Request:** Invalid input data
- **409 Conflict:** Email already exists

### 2. Customer Login

**POST** `/api/auth/customers/login`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "customer": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "address": "123 Main Street, City, State 12345",
    "wallet_balance": 0.0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- **400 Bad Request:** Invalid credentials
- **404 Not Found:** Customer not found

### 3. Employee Registration

**POST** `/api/auth/employees/register`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "phone": "0987654321",
  "email": "jane.smith@laundryola.com",
  "password": "employee123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Employee registered successfully",
  "employee": {
    "id": 1,
    "name": "Jane Smith",
    "phone": "0987654321",
    "email": "jane.smith@laundryola.com",
    "total_earnings": 0.0,
    "created_at": "2025-08-07T10:35:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Employee Login

**POST** `/api/auth/employees/login`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "jane.smith@laundryola.com",
  "password": "employee123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "employee": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane.smith@laundryola.com",
    "phone": "0987654321",
    "total_earnings": 0.0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Logout (Both Customer & Employee)

**POST** `/api/auth/logout`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{token}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Customer Endpoints

### 1. Get Customer Profile

**GET** `/api/customers/profile`

**Headers:**

```json
{
  "Authorization": "Bearer {{customerToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "customer": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "address": "123 Main Street, City, State 12345",
    "wallet_balance": 250.0,
    "created_at": "2025-08-07T10:30:00.000Z"
  }
}
```

### 2. Get Customer Dashboard

**GET** `/api/customers/dashboard`

**Headers:**

```json
{
  "Authorization": "Bearer {{customerToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "dashboard": {
    "totalOrders": 15,
    "pendingOrders": 3,
    "completedOrders": 12,
    "walletBalance": 250.0,
    "totalSpent": 1250.0,
    "recentOrders": [
      {
        "id": 23,
        "service_name": "Wash & Fold",
        "quantity": 2,
        "total_amount": 30.0,
        "status": "completed",
        "order_date": "2025-08-06T14:20:00.000Z"
      }
    ]
  }
}
```

### 3. Update Customer Profile

**PUT** `/api/customers/profile`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{customerToken}}"
}
```

**Request Body:**

```json
{
  "name": "John Updated Doe",
  "phone": "1234567891",
  "address": "456 New Street, City, State 12345"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "customer": {
    "id": 1,
    "name": "John Updated Doe",
    "phone": "1234567891",
    "address": "456 New Street, City, State 12345"
  }
}
```

### 4. Add Money to Wallet

**POST** `/api/customers/wallet/add`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{customerToken}}"
}
```

**Request Body:**

```json
{
  "amount": 100.0
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Money added successfully",
  "transaction": {
    "id": 12,
    "amount": 100.0,
    "type": "credit",
    "description": "Wallet top-up",
    "created_at": "2025-08-07T11:15:00.000Z"
  },
  "newBalance": 350.0
}
```

### 5. Get Wallet Balance

**GET** `/api/customers/wallet/balance`

**Headers:**

```json
{
  "Authorization": "Bearer {{customerToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "balance": 350.0
}
```

### 6. Get All Transactions

**GET** `/api/customers/transactions`

**Headers:**

```json
{
  "Authorization": "Bearer {{customerToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "transactions": [
    {
      "id": 12,
      "amount": 100.0,
      "type": "credit",
      "description": "Wallet top-up",
      "created_at": "2025-08-07T11:15:00.000Z"
    },
    {
      "id": 11,
      "amount": 25.0,
      "type": "debit",
      "description": "Order payment - Dry Cleaning",
      "created_at": "2025-08-06T09:30:00.000Z"
    }
  ]
}
```

### 7. Get Limited Transactions

**GET** `/api/customers/transactions/:limit`

**Headers:**

```json
{
  "Authorization": "Bearer {{customerToken}}"
}
```

**Example URL:** `/api/customers/transactions/5`

**Success Response (200):**

```json
{
  "success": true,
  "transactions": [
    {
      "id": 12,
      "amount": 100.0,
      "type": "credit",
      "description": "Wallet top-up",
      "created_at": "2025-08-07T11:15:00.000Z"
    }
  ]
}
```

### 8. Get Customer Orders

**GET** `/api/customers/orders`

**Headers:**

```json
{
  "Authorization": "Bearer {{customerToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "orders": [
    {
      "id": 23,
      "service_id": 1,
      "service_name": "Wash & Fold",
      "quantity": 2,
      "total_amount": 30.0,
      "status": "completed",
      "employee_name": "Jane Smith",
      "order_date": "2025-08-06T14:20:00.000Z",
      "completed_date": "2025-08-06T16:45:00.000Z"
    }
  ]
}
```

---

## Employee Endpoints

### 1. Get Employee Dashboard

**GET** `/api/employees/dashboard`

**Headers:**

```json
{
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "dashboard": {
    "totalOrders": 45,
    "pendingOrders": 8,
    "completedOrders": 37,
    "totalEarnings": 675.5,
    "todayEarnings": 125.0,
    "recentOrders": [
      {
        "id": 24,
        "customer_name": "John Doe",
        "service_name": "Dry Cleaning",
        "quantity": 1,
        "total_amount": 25.0,
        "status": "in_progress",
        "order_date": "2025-08-07T10:00:00.000Z"
      }
    ]
  }
}
```

### 2. Get Employee Orders

**GET** `/api/employees/orders`

**Headers:**

```json
{
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "orders": [
    {
      "id": 24,
      "customer_id": 1,
      "customer_name": "John Doe",
      "customer_phone": "1234567890",
      "customer_address": "123 Main Street, City, State 12345",
      "service_name": "Dry Cleaning",
      "quantity": 1,
      "total_amount": 25.0,
      "status": "in_progress",
      "order_date": "2025-08-07T10:00:00.000Z"
    }
  ]
}
```

### 3. Update Employee Profile

**PUT** `/api/employees/profile`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Request Body:**

```json
{
  "name": "Jane Updated Smith",
  "phone": "0987654322",
  "email": "jane.updated@laundryola.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "employee": {
    "id": 1,
    "name": "Jane Updated Smith",
    "phone": "0987654322",
    "email": "jane.updated@laundryola.com"
  }
}
```

### 4. Get Employee Earnings

**GET** `/api/employees/earnings`

**Headers:**

```json
{
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "earnings": {
    "totalEarnings": 675.5,
    "todayEarnings": 125.0,
    "weekEarnings": 280.0,
    "monthEarnings": 675.5,
    "earningsHistory": [
      {
        "date": "2025-08-07",
        "amount": 125.0,
        "orders": 5
      },
      {
        "date": "2025-08-06",
        "amount": 95.5,
        "orders": 4
      }
    ]
  }
}
```

---

## Order Management Endpoints

### 1. Place Order (Customer Only)

**POST** `/api/orders`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{customerToken}}"
}
```

**Request Body:**

```json
{
  "service_id": 1,
  "quantity": 2
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": 25,
    "customer_id": 1,
    "service_id": 1,
    "service_name": "Wash & Fold",
    "quantity": 2,
    "total_amount": 30.0,
    "status": "pending",
    "order_date": "2025-08-07T11:30:00.000Z"
  },
  "remainingBalance": 320.0
}
```

**Error Responses:**

- **400 Bad Request:** Insufficient wallet balance
- **404 Not Found:** Service not found

### 2. Get Pending Orders (Employee Only)

**GET** `/api/orders/pending`

**Headers:**

```json
{
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "pendingOrders": [
    {
      "id": 25,
      "customer_id": 1,
      "customer_name": "John Doe",
      "customer_phone": "1234567890",
      "customer_address": "123 Main Street, City, State 12345",
      "service_name": "Wash & Fold",
      "quantity": 2,
      "total_amount": 30.0,
      "status": "pending",
      "order_date": "2025-08-07T11:30:00.000Z"
    }
  ]
}
```

### 3. Manage Order (Employee Only)

**PUT** `/api/orders/:id/manage`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Request Body (Accept Order):**

```json
{
  "action": "accept"
}
```

**Request Body (Complete Order):**

```json
{
  "action": "complete"
}
```

**Request Body (Cancel Order):**

```json
{
  "action": "cancel",
  "reason": "Customer requested cancellation"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "id": 25,
    "status": "in_progress",
    "employee_id": 1,
    "updated_at": "2025-08-07T11:45:00.000Z"
  }
}
```

### 4. Get Single Order

**GET** `/api/orders/:id`

**Headers:**

```json
{
  "Authorization": "Bearer {{token}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "order": {
    "id": 25,
    "customer_id": 1,
    "customer_name": "John Doe",
    "employee_id": 1,
    "employee_name": "Jane Smith",
    "service_name": "Wash & Fold",
    "quantity": 2,
    "total_amount": 30.0,
    "status": "in_progress",
    "order_date": "2025-08-07T11:30:00.000Z",
    "accepted_date": "2025-08-07T11:45:00.000Z"
  }
}
```

---

## Service Management Endpoints

### 1. Get All Services (Public)

**GET** `/api/services`

**Headers:** None required

**Success Response (200):**

```json
{
  "success": true,
  "services": [
    {
      "id": 1,
      "service_name": "Wash & Fold",
      "price": 15.0,
      "created_at": "2025-08-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "service_name": "Dry Cleaning",
      "price": 25.0,
      "created_at": "2025-08-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Create Service (Employee Only)

**POST** `/api/services`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Request Body:**

```json
{
  "service_name": "Premium Wash",
  "price": 20.0
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Service created successfully",
  "service": {
    "id": 3,
    "service_name": "Premium Wash",
    "price": 20.0,
    "created_at": "2025-08-07T12:00:00.000Z"
  }
}
```

### 3. Update Service (Employee Only)

**PUT** `/api/services/:id`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Request Body:**

```json
{
  "service_name": "Premium Wash & Fold",
  "price": 22.0
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Service updated successfully",
  "service": {
    "id": 3,
    "service_name": "Premium Wash & Fold",
    "price": 22.0
  }
}
```

### 4. Delete Service (Employee Only)

**DELETE** `/api/services/:id`

**Headers:**

```json
{
  "Authorization": "Bearer {{employeeToken}}"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

### 5. Get Single Service (Public)

**GET** `/api/services/:id`

**Headers:** None required

**Success Response (200):**

```json
{
  "success": true,
  "service": {
    "id": 1,
    "service_name": "Wash & Fold",
    "price": 15.0,
    "created_at": "2025-08-01T00:00:00.000Z"
  }
}
```

---

## Testing Workflows

### Complete Customer Journey

#### Step 1: Customer Registration

```bash
POST http://localhost:5000/api/auth/customers/register
Content-Type: application/json

{
  "name": "Alice Johnson",
  "phone": "5551234567",
  "email": "alice.johnson@example.com",
  "password": "securepass123",
  "address": "789 Oak Avenue, Springfield, IL 62701"
}
```

#### Step 2: Customer Login

```bash
POST http://localhost:5000/api/auth/customers/login
Content-Type: application/json

{
  "email": "alice.johnson@example.com",
  "password": "securepass123"
}
```

**Save the token from response for subsequent requests**

#### Step 3: Add Money to Wallet

```bash
POST http://localhost:5000/api/customers/wallet/add
Content-Type: application/json
Authorization: Bearer {{customerToken}}

{
  "amount": 200.00
}
```

#### Step 4: View Available Services

```bash
GET http://localhost:5000/api/services
```

#### Step 5: Place an Order

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer {{customerToken}}

{
  "service_id": 1,
  "quantity": 3
}
```

#### Step 6: Check Order Status

```bash
GET http://localhost:5000/api/customers/orders
Authorization: Bearer {{customerToken}}
```

### Complete Employee Journey

#### Step 1: Employee Registration

```bash
POST http://localhost:5000/api/auth/employees/register
Content-Type: application/json

{
  "name": "Bob Wilson",
  "phone": "5559876543",
  "email": "bob.wilson@laundryola.com",
  "password": "employee456"
}
```

#### Step 2: Employee Login

```bash
POST http://localhost:5000/api/auth/employees/login
Content-Type: application/json

{
  "email": "bob.wilson@laundryola.com",
  "password": "employee456"
}
```

**Save the token from response**

#### Step 3: View Pending Orders

```bash
GET http://localhost:5000/api/orders/pending
Authorization: Bearer {{employeeToken}}
```

#### Step 4: Accept an Order

```bash
PUT http://localhost:5000/api/orders/25/manage
Content-Type: application/json
Authorization: Bearer {{employeeToken}}

{
  "action": "accept"
}
```

#### Step 5: Complete the Order

```bash
PUT http://localhost:5000/api/orders/25/manage
Content-Type: application/json
Authorization: Bearer {{employeeToken}}

{
  "action": "complete"
}
```

#### Step 6: Check Earnings

```bash
GET http://localhost:5000/api/employees/earnings
Authorization: Bearer {{employeeToken}}
```

---

## Error Testing Scenarios

### Authentication Errors

#### 1. Test Invalid Login Credentials

```bash
POST http://localhost:5000/api/auth/customers/login
Content-Type: application/json

{
  "email": "nonexistent@example.com",
  "password": "wrongpassword"
}
```

**Expected:** 400 Bad Request

#### 2. Test Duplicate Registration

```bash
POST http://localhost:5000/api/auth/customers/register
Content-Type: application/json

{
  "name": "Alice Johnson",
  "phone": "5551234567",
  "email": "alice.johnson@example.com",
  "password": "securepass123",
  "address": "789 Oak Avenue, Springfield, IL 62701"
}
```

**Expected:** 409 Conflict (if email already exists)

#### 3. Test Expired/Invalid Token

```bash
GET http://localhost:5000/api/customers/profile
Authorization: Bearer invalid_token_here
```

**Expected:** 401 Unauthorized

### Validation Errors

#### 1. Test Invalid Customer Registration Data

```bash
POST http://localhost:5000/api/auth/customers/register
Content-Type: application/json

{
  "name": "A",
  "phone": "123",
  "email": "invalid-email",
  "password": "123",
  "address": "ABC"
}
```

**Expected:** 400 Bad Request with validation errors

#### 2. Test Invalid Order Data

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer {{customerToken}}

{
  "service_id": "invalid",
  "quantity": -1
}
```

**Expected:** 400 Bad Request

#### 3. Test Invalid Money Addition

```bash
POST http://localhost:5000/api/customers/wallet/add
Content-Type: application/json
Authorization: Bearer {{customerToken}}

{
  "amount": -50
}
```

**Expected:** 400 Bad Request

### Business Logic Errors

#### 1. Test Insufficient Balance

```bash
# First, check current balance
GET http://localhost:5000/api/customers/wallet/balance
Authorization: Bearer {{customerToken}}

# Then try to place an order that exceeds balance
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer {{customerToken}}

{
  "service_id": 2,
  "quantity": 100
}
```

**Expected:** 400 Bad Request - Insufficient balance

#### 2. Test Non-existent Service Order

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer {{customerToken}}

{
  "service_id": 9999,
  "quantity": 1
}
```

**Expected:** 404 Not Found

### Authorization Errors

#### 1. Test Customer Accessing Employee Endpoints

```bash
GET http://localhost:5000/api/orders/pending
Authorization: Bearer {{customerToken}}
```

**Expected:** 403 Forbidden

#### 2. Test Employee Accessing Customer Wallet

```bash
GET http://localhost:5000/api/customers/wallet/balance
Authorization: Bearer {{employeeToken}}
```

**Expected:** 403 Forbidden

#### 3. Test Unauthenticated Access to Protected Endpoints

```bash
GET http://localhost:5000/api/customers/profile
```

**Expected:** 401 Unauthorized

---

## Postman Collection Setup

### Environment Setup

Create a new environment in Postman with these variables:

```json
{
  "baseUrl": "http://localhost:5000",
  "customerToken": "",
  "employeeToken": "",
  "customerId": "",
  "employeeId": "",
  "orderId": "",
  "serviceId": ""
}
```

### Pre-request Scripts

#### For Login Requests (Customer)

```javascript
// Pre-request script for customer login
pm.test("Store customer token", function () {
  var jsonData = pm.response.json();
  if (jsonData.token) {
    pm.environment.set("customerToken", jsonData.token);
    pm.environment.set("customerId", jsonData.customer.id);
  }
});
```

#### For Login Requests (Employee)

```javascript
// Pre-request script for employee login
pm.test("Store employee token", function () {
  var jsonData = pm.response.json();
  if (jsonData.token) {
    pm.environment.set("employeeToken", jsonData.token);
    pm.environment.set("employeeId", jsonData.employee.id);
  }
});
```

### Collection Organization

1. **Authentication**

   - Customer Register
   - Customer Login
   - Employee Register
   - Employee Login
   - Logout

2. **Customer Management**

   - Get Profile
   - Update Profile
   - Get Dashboard
   - Add Money
   - Get Balance
   - Get Transactions
   - Get Orders

3. **Employee Management**

   - Get Dashboard
   - Get Orders
   - Update Profile
   - Get Earnings

4. **Order Management**

   - Place Order
   - Get Pending Orders
   - Accept Order
   - Complete Order
   - Get Single Order

5. **Service Management**

   - Get All Services
   - Create Service
   - Update Service
   - Delete Service
   - Get Single Service

6. **Error Testing**
   - Invalid Authentication
   - Validation Errors
   - Authorization Errors
   - Business Logic Errors

### Test Scripts

#### Generic Success Test

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has success property", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("success");
  pm.expect(jsonData.success).to.be.true;
});
```

#### Token Validation Test

```javascript
pm.test("Response contains token", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("token");
  pm.expect(jsonData.token).to.be.a("string");
});
```

#### Error Response Test

```javascript
pm.test("Error response format", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("success");
  pm.expect(jsonData.success).to.be.false;
  pm.expect(jsonData).to.have.property("message");
});
```

---

## Sample Test Data

### Customers

```json
[
  {
    "name": "Alice Johnson",
    "phone": "5551234567",
    "email": "alice.johnson@example.com",
    "password": "securepass123",
    "address": "789 Oak Avenue, Springfield, IL 62701"
  },
  {
    "name": "Bob Smith",
    "phone": "5552345678",
    "email": "bob.smith@example.com",
    "password": "password456",
    "address": "456 Pine Street, Chicago, IL 60601"
  },
  {
    "name": "Carol Davis",
    "phone": "5553456789",
    "email": "carol.davis@example.com",
    "password": "mypassword789",
    "address": "123 Elm Drive, Austin, TX 73301"
  }
]
```

### Employees

```json
[
  {
    "name": "Jane Wilson",
    "phone": "5559876543",
    "email": "jane.wilson@laundryola.com",
    "password": "employee123"
  },
  {
    "name": "Mike Brown",
    "phone": "5558765432",
    "email": "mike.brown@laundryola.com",
    "password": "staff456"
  },
  {
    "name": "Sarah Garcia",
    "phone": "5557654321",
    "email": "sarah.garcia@laundryola.com",
    "password": "worker789"
  }
]
```

### Services

```json
[
  {
    "service_name": "Wash & Fold",
    "price": 15.0
  },
  {
    "service_name": "Dry Cleaning",
    "price": 25.0
  },
  {
    "service_name": "Ironing Service",
    "price": 10.0
  },
  {
    "service_name": "Premium Wash",
    "price": 20.0
  },
  {
    "service_name": "Express Service",
    "price": 30.0
  }
]
```

---

## Testing Checklist

### Authentication Testing

- [ ] Customer registration with valid data
- [ ] Customer registration with invalid data
- [ ] Customer login with valid credentials
- [ ] Customer login with invalid credentials
- [ ] Employee registration with valid data
- [ ] Employee registration with invalid data
- [ ] Employee login with valid credentials
- [ ] Employee login with invalid credentials
- [ ] Logout functionality
- [ ] Token expiration handling

### Customer Functionality Testing

- [ ] Get customer profile
- [ ] Update customer profile
- [ ] Get customer dashboard
- [ ] Add money to wallet
- [ ] Get wallet balance
- [ ] Get all transactions
- [ ] Get limited transactions
- [ ] Get customer orders
- [ ] Place new order
- [ ] Order with insufficient balance

### Employee Functionality Testing

- [ ] Get employee dashboard
- [ ] Get employee orders
- [ ] Update employee profile
- [ ] Get employee earnings
- [ ] View pending orders
- [ ] Accept orders
- [ ] Complete orders
- [ ] Cancel orders

### Service Management Testing

- [ ] Get all services (public)
- [ ] Create new service (employee only)
- [ ] Update existing service (employee only)
- [ ] Delete service (employee only)
- [ ] Get single service

### Authorization Testing

- [ ] Customer accessing employee endpoints (should fail)
- [ ] Employee accessing customer wallet endpoints (should fail)
- [ ] Unauthenticated access to protected endpoints (should fail)
- [ ] Invalid token usage (should fail)

### Error Handling Testing

- [ ] Invalid input validation
- [ ] Database constraint violations
- [ ] Non-existent resource access
- [ ] Server error handling
- [ ] Rate limiting (if implemented)

---

## Notes

1. **Always test with fresh data** - Reset your database between major test runs
2. **Token Management** - Tokens expire, so you may need to re-login during extended testing
3. **Database State** - Some tests depend on existing data (orders, services, etc.)
4. **Error Responses** - All error responses follow a consistent format with `success: false`
5. **Rate Limiting** - If implemented, you may hit rate limits during rapid testing

This guide provides comprehensive coverage of all API endpoints with realistic test scenarios. Use it to thoroughly validate your LaundryOla backend implementation.
