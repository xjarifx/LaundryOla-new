# LaundryOla Frontend API Documentation

## 1. Frontend Integration Guide

### Authentication Flow

- **Registration:** Customer/Employee registers with email, phone, password, and (for customers) address.
- **Login:** User logs in with email and password, receives JWT token.
- **Token Storage:** Store JWT in `localStorage` or `sessionStorage`. Never store in cookies unless using `HttpOnly`.
- **Token Usage:** Send JWT in `Authorization: Bearer <token>` header for all protected endpoints.
- **Token Refresh:** No refresh endpoint; re-login if token expires.

### Role-Based Routing

- **Customer:** Access customer dashboard, wallet, orders, profile.
- **Employee:** Access employee dashboard, manage orders, view assigned orders.
- **Frontend:** Use JWT payload to determine role and route accordingly.

### Error Handling Patterns

- All errors return `{ success: false, message: string, code?: number }`.
- Handle 401/403 for auth errors, 400 for validation, 500 for server errors.
- Show user-friendly messages and retry options.

---

## 2. All Working Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication

#### Register Customer

- **POST** `/api/auth/register/customer`
- **Body:**

```ts
{
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
}
```

- **Response:**

```ts
{
  success: true;
  data: {
    customer_id: number;
    message: string;
  }
  message: string;
}
```

#### Register Employee

- **POST** `/api/auth/register/employee`
- **Body:**

```ts
{
  name: string;
  phone: string;
  email: string;
  password: string;
}
```

- **Response:**

```ts
{
  success: true;
  data: {
    employee_id: number;
    message: string;
  }
  message: string;
}
```

#### Login (Customer/Employee)

- **POST** `/api/auth/login/customer` or `/api/auth/login/employee`
- **Body:**

```ts
{
  email: string;
  password: string;
}
```

- **Response:**

```ts
{
  success: true;
  data: { token: string; user: { ... } };
  message: string;
}
```

---

### Customer Endpoints

#### Get Profile

- **GET** `/api/customers/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**

```ts
{
  success: true;
  data: CustomerProfile;
  message: string;
}
```

#### Update Profile

- **PUT** `/api/customers/profile`
- **Body:**

```ts
{
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}
```

#### Add Money to Wallet

- **POST** `/api/customers/wallet/add`
- **Body:**

```ts
{
  amount: number;
}
```

#### Place Order

- **POST** `/api/orders`
- **Body:**

```ts
{
  service_id: number;
  quantity: number;
}
```

#### Get Orders

- **GET** `/api/customers/orders`

#### Get Transactions

- **GET** `/api/customers/transactions`

---

### Employee Endpoints

#### Get Profile

- **GET** `/api/employees/profile`

#### Update Profile

- **PUT** `/api/employees/profile`
- **Body:**

```ts
{
  name?: string;
  phone?: string;
  email?: string;
}
```

#### Get Pending Orders

- **GET** `/api/orders/pending`

#### Manage Order

- **PUT** `/api/orders/:id/manage`
- **Body:**

```ts
{
  action: "ACCEPT" | "REJECT" | "COMPLETE";
}
```

#### Get Assigned Orders

- **GET** `/api/employees/orders`

---

### Service Endpoints (Employee Only)

#### Create Service

- **POST** `/api/services`
- **Body:**

```ts
{
  service_name: string;
  price: number;
}
```

#### Update Service

- **PUT** `/api/services/:id`
- **Body:**

```ts
{
  service_name?: string;
  price?: number;
}
```

#### Delete Service

- **DELETE** `/api/services/:id`

#### Get All Services

- **GET** `/api/services`

---

## 3. Authentication Integration

### Registration Flow

- POST to `/api/auth/register/customer` or `/api/auth/register/employee`
- On success, redirect to login

### Login/Logout

- POST to `/api/auth/login/customer` or `/api/auth/login/employee`
- Store JWT on success
- Logout: Remove JWT from storage

### Token Management

- Store JWT securely (localStorage/sessionStorage)
- Attach JWT to all protected requests
- Handle token expiry by redirecting to login

### Protected Route Example (React)

```jsx
// Example: ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/login" />;
};
```

### Role-Based Component Rendering

```jsx
// Example: Dashboard.jsx
if (user.role === "CUSTOMER") {
  // Render customer dashboard
} else if (user.role === "EMPLOYEE") {
  // Render employee dashboard
}
```

---

## 4. Frontend-Specific Examples

### Fetch Example

```js
fetch("http://localhost:5000/api/customers/profile", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => {
    /* handle data */
  })
  .catch((err) => {
    /* handle error */
  });
```

### Axios Example

```js
import axios from "axios";
axios
  .get("/api/customers/profile", {
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => {
    /* handle res.data */
  })
  .catch((err) => {
    /* handle err.response.data */
  });
```

### Error Handling

```js
try {
  const res = await axios.get("/api/customers/profile", { headers });
  // handle res.data
} catch (err) {
  if (err.response) {
    alert(err.response.data.message);
  }
}
```

### Loading States

```js
const [loading, setLoading] = useState(false);
const fetchData = async () => {
  setLoading(true);
  try {
    // fetch...
  } finally {
    setLoading(false);
  }
};
```

### Form Validation

- Use libraries like Yup, Joi, or custom validation
- Validate required fields, email format, password strength

---

## 5. Data Models & Types

### TypeScript Interfaces

```ts
export interface CustomerProfile {
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  wallet_balance: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  lifetime_spent: number;
  last_order_date: string;
}

export interface EmployeeProfile {
  employee_id: number;
  name: string;
  phone: string;
  email: string;
  earnings_balance: number;
  total_orders_handled: number;
  completed_orders: number;
  in_progress_orders: number;
}

export interface Service {
  service_id: number;
  service_name: string;
  price_per_item: number;
}

export type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Completed";
export type UserRole = "CUSTOMER" | "EMPLOYEE";
```

### Form Data Structures

```ts
export interface RegisterCustomerForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
}

export interface RegisterEmployeeForm {
  name: string;
  phone: string;
  email: string;
  password: string;
}
```

### Validation Rules

- Name: required, min 2 chars
- Phone: required, valid format
- Email: required, valid email
- Password: required, min 6 chars
- Address: required for customers
- Service name: required
- Price: required, positive number

---

## 6. Business Logic Flows

### Customer Journey

1. Register → Login → Add Money → Place Order → View Orders/Transactions
2. All actions require JWT except registration/login
3. Wallet must have enough balance to place order

### Employee Workflow

1. Login → View Pending Orders → Accept/Reject → Complete Order
2. Only assigned employee can complete order
3. Earnings update automatically on completion

### Real-Time Updates & State Management

- Use polling or websockets for real-time order updates (not included in backend, but frontend can poll `/api/orders/pending`)
- Use global state (Redux, Context API) for user/session/order data

### Error Scenarios & User Feedback

- Show error messages from API
- Handle token expiry by redirecting to login
- Validate all forms before submission
- Show loading spinners during API calls

---

## Example Success & Error Responses

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error

```json
{
  "success": false,
  "message": "Error message here",
  "code": 400
}
```

---

## Final Notes

- Always send JWT in `Authorization` header for protected endpoints
- Use provided TypeScript interfaces for frontend models
- Follow validation rules for all forms
- Handle all error responses gracefully
- Use role-based routing and rendering for customer/employee interfaces
- All endpoints are RESTful and return consistent JSON responses
