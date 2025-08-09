https://neon-cut-6bf.notion.site/env-crt-22de526928ab8099a866e4853854e8ad?source=copy_link

# LaundryOla - Complete Laundry Service Management System

## Project Overview

LaundryOla is a full-stack laundry service management application that enables customers to place orders, manage wallets, and track service progress, while empowering employees to accept, manage, and complete laundry orders. The system features robust authentication, role-based access control, wallet management, and real-time order tracking.

### High-Level Architecture

- **Frontend**: React 19.1.1 SPA with Vite build system and Tailwind CSS
- **Backend**: Node.js Express API with JWT authentication and bcrypt password hashing
- **Database**: MySQL with stored procedures, views, and triggers for data integrity
- **Authentication**: JWT-based authentication with role-based access (customer/employee)
- **Deployment**: Vercel (frontend) + Render/Node hosting (backend)

### Key Features

- **Authentication System**: Secure JWT-based login for customers and employees
- **Role-Based Access Control**: Separate dashboards and permissions for customers vs employees
- **Wallet Management**: Customer wallet system with balance tracking and recharge functionality
- **Order Management**: Complete order lifecycle from placement to completion
- **Employee Dashboard**: Accept, manage, and complete customer orders
- **Real-Time Updates**: Dynamic status updates and earnings tracking
- **Data Integrity**: MySQL triggers and stored procedures ensure consistent wallet/earnings calculations
- **Session Persistence**: Authentication state survives browser refresh via localStorage

## Tech Stack

### Frontend

- **React**: 19.1.1 with functional components and hooks
- **Vite**: 7.1.0 for fast development and optimized builds
- **Tailwind CSS**: 4.1.11 for utility-first styling
- **React Router**: 7.7.1 for client-side routing and navigation
- **Axios**: 1.11.0 for HTTP client with interceptors
- **Heroicons**: 2.2.0 for consistent iconography

### Backend

- **Node.js**: Runtime environment
- **Express**: 4.18.2 web framework
- **MySQL2**: 3.6.0 database driver with prepared statements
- **jsonwebtoken**: 9.0.2 for JWT token management
- **bcrypt**: 6.0.0 for secure password hashing
- **Joi**: 17.9.2 for request validation
- **CORS**: 2.8.5 for cross-origin resource sharing
- **Helmet**: 7.0.0 for security headers
- **Morgan**: 1.10.0 for HTTP request logging

### Deployment

- **Vercel**: Frontend hosting with SPA rewrites
- **Render/Node Hosting**: Backend API deployment
- **MySQL**: Database hosting (Render, PlanetScale, or dedicated MySQL server)

## Repository Structure

```
LaundryOla-new/
├── README.md                           # This comprehensive guide
├── hostURL.txt                         # Production URLs (single source of truth)
├── database.sql                        # Complete MySQL schema with procedures/triggers
├── verify-production-urls.js           # URL verification script
├── laundry-database-documentation.md   # Database design documentation
├── laundry-backend-todo.md            # Backend development notes
│
├── client/                            # Frontend React application
│   ├── package.json                   # Frontend dependencies and scripts
│   ├── vite.config.js                 # Vite configuration
│   ├── vercel.json                    # Vercel deployment config with SPA rewrites
│   ├── index.html                     # Main HTML template
│   ├── .env                          # Default environment variables
│   ├── .env.development              # Development environment config
│   ├── .env.production               # Production environment config
│   ├── FRONTEND-API-DOCUMENTATION.md # Complete API endpoint documentation
│   ├── API-TESTING-GUIDE.md          # API testing instructions
│   └── src/
│       ├── App.jsx                    # Main app component with routing
│       ├── main.jsx                   # React app entry point
│       ├── index.css                  # Tailwind CSS imports
│       ├── utils/
│       │   ├── api.js                 # Centralized axios instance with interceptors
│       │   └── dateUtils.js           # Date formatting utilities
│       └── components/                # React components (dashboards, forms, etc.)
│
└── server/                            # Backend Node.js application
    ├── package.json                   # Backend dependencies and scripts
    ├── README.md                      # Backend-specific documentation
    ├── src/
    │   ├── index.js                   # Express server entry point
    │   ├── config/
    │   │   ├── app.js                 # Express app configuration
    │   │   └── db.js                  # MySQL connection setup
    │   ├── controllers/               # Business logic controllers
    │   │   ├── authController.js      # Authentication endpoints
    │   │   ├── customerController.js  # Customer management
    │   │   ├── employeeController.js  # Employee management
    │   │   ├── orderController.js     # Order management
    │   │   └── serviceController.js   # Service management
    │   ├── routes/                    # Express route definitions
    │   │   ├── auth.js                # Authentication routes
    │   │   ├── customers.js           # Customer routes
    │   │   ├── employees.js           # Employee routes
    │   │   ├── orders.js              # Order routes
    │   │   └── services.js            # Service routes
    │   ├── middlewares/               # Custom middleware
    │   │   ├── auth.js                # JWT authentication middleware
    │   │   ├── jwtAuth.js             # Token validation
    │   │   ├── validate.js            # Request validation
    │   │   ├── rateLimit.js           # Rate limiting
    │   │   └── errorHandler.js        # Global error handling
    │   ├── validators/                # Joi validation schemas
    │   │   ├── authValidator.js       # Authentication validation
    │   │   ├── customerValidator.js   # Customer validation
    │   │   ├── orderValidator.js      # Order validation
    │   │   └── serviceValidator.js    # Service validation
    │   └── utils/
    │       └── response.js            # Standardized API responses
    ├── tests/                         # Jest test files
    │   ├── auth.test.js               # Authentication tests
    │   └── customer.test.js           # Customer endpoint tests
    └── docs/                          # API documentation
        ├── swagger.yaml               # OpenAPI specification
        ├── database-integration.md    # Database integration guide
        ├── deployment.md              # Deployment instructions
        └── testing.md                 # Testing guide
```

## Prerequisites

### Required Software

- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **MySQL**: Version 8.0 or higher
- **Git**: For version control

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended for development)
- **Storage**: At least 1GB free space for dependencies

### Recommended Tools

- **MySQL Workbench**: For database management
- **Postman**: For API testing (use with `docs/API-TESTING-GUIDE.md`)
- **VS Code**: With recommended extensions (ES7+, Tailwind CSS IntelliSense)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=laundry_service_db

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12

# CORS Configuration (for production)
FRONTEND_URL=https://laundry-ola-new.vercel.app

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

Create environment files in the `client/` directory:

**`.env`** (default):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**`.env.development`**:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**`.env.production`**:

```env
VITE_API_BASE_URL=https://laundryola-new.onrender.com/api
```

### Production URLs Configuration

The `hostURL.txt` file contains the single source of truth for production URLs:

```
CLIENT_URL=https://laundry-ola-new.vercel.app
SERVER_URL=https://laundryola-new.onrender.com
```

**Important**: Always update `VITE_API_BASE_URL` to match the `SERVER_URL` from `hostURL.txt` with `/api` suffix:

- Production API URL: `{SERVER_URL}/api`
- Example: `https://laundryola-new.onrender.com/api`

## Database Setup

### 1. Create MySQL Database

```bash
# Connect to MySQL as root or admin user
mysql -u root -p

# Create database
CREATE DATABASE laundry_service_db;

# Create dedicated user (recommended for production)
CREATE USER 'laundry_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON laundry_service_db.* TO 'laundry_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 2. Import Database Schema

```bash
# Import the complete schema with data
mysql -u laundry_user -p laundry_service_db < database.sql

# Verify import was successful
mysql -u laundry_user -p laundry_service_db -e "SHOW TABLES;"
```

### 3. Database Components

The `database.sql` file includes:

- **Tables**: Customers, Employees, Services, Orders with proper constraints
- **Views**: `customer_order_summary`, `employee_earnings_summary` for optimized queries
- **Triggers**: Automatic wallet/earnings updates on order status changes
- **Stored Procedures**: `GetCustomerOrderHistory`, `GetEmployeeOrderHistory` for complex queries
- **Sample Data**: Default services and test accounts for development

### 4. Safe Re-run Instructions

The database script is designed to be safely re-run:

```sql
-- The script includes DROP TABLE IF EXISTS statements
-- Run this to completely reset the database:
SOURCE database.sql;
```

### 5. Common MySQL Permission Issues

If you encounter permission errors:

```bash
# Grant additional permissions
mysql -u root -p
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'laundry_user'@'localhost';
FLUSH PRIVILEGES;

# For development, you can use root (NOT recommended for production)
# Update server/.env with DB_USER=root and your root password
```

## Backend Setup and Run

### 1. Install Dependencies

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# Verify critical dependencies
npm list express mysql2 jsonwebtoken bcrypt
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env  # If template exists, or create manually

# Edit .env file with your database credentials
# Use the database user you created earlier
```

### 3. Start Development Server

```bash
# Start with nodemon for auto-reload
npm run dev

# Alternative: Start without auto-reload
npm start
```

### 4. Verify Backend is Running

The server should start on `http://localhost:5000` (or your configured PORT):

```bash
# Test health endpoint (if available)
curl http://localhost:5000/api/health

# Test basic route
curl http://localhost:5000/api/services
```

### 5. Production Build and Run

```bash
# For production deployment
NODE_ENV=production npm start

# Using PM2 process manager (recommended)
npm install -g pm2
pm2 start src/index.js --name "laundry-backend"
pm2 startup
pm2 save
```

### 6. CORS Configuration

The backend is configured to accept requests from:

- `http://localhost:3000` (development)
- `https://laundry-ola-new.vercel.app` (production)

Update `FRONTEND_URL` in `.env` for custom domains.

## Frontend Setup and Run

### 1. Install Dependencies

```bash
# Navigate to client directory
cd client

# Install all dependencies
npm install

# Verify critical dependencies
npm list react vite tailwindcss axios react-router
```

### 2. Tailwind CSS Configuration

Tailwind is configured via the Vite plugin in `@tailwindcss/vite`. The `src/index.css` file imports Tailwind:

```css
@import "tailwindcss";
```

**Content Paths**: Tailwind automatically scans all files in `src/` for utility classes.

### 3. Configure API Base URL

Ensure your `.env` file in the `client/` directory contains:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, this is automatically set via Vercel environment variables.

### 4. Start Development Server

```bash
# Start Vite development server
npm run dev

# Server will start on http://localhost:5173 by default
```

### 5. Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### 6. Authentication Persistence

The app uses localStorage for session persistence:

- **Token Storage**: JWT token stored in `localStorage.getItem('token')`
- **User Data**: User profile stored in `localStorage.getItem('user')`
- **Automatic Rehydration**: On app load, tokens are validated and user state restored
- **Auto Logout**: Invalid/expired tokens trigger automatic logout and redirect to login

### 7. Heroicons Usage

Import icons correctly to avoid build errors:

```javascript
import {
  FunnelIcon,
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";

// Use in JSX
<FunnelIcon className="h-6 w-6" />;
```

## Authentication and Authorization

### JWT Authentication Flow

1. **Registration/Login**: User submits credentials
2. **Token Generation**: Server creates JWT with user ID and role
3. **Token Storage**: Client stores token in localStorage
4. **Request Authentication**: Token sent in Authorization header
5. **Token Validation**: Server validates token on protected routes
6. **Role Authorization**: Routes check user role (customer/employee)

### Token Structure

```javascript
// JWT payload example
{
  "userId": 1,
  "role": "customer", // or "employee"
  "iat": 1643723400,
  "exp": 1644328200
}
```

### Token Storage and Refresh

```javascript
// Token storage (handled automatically by api.js)
localStorage.setItem("token", jwtToken);
localStorage.setItem("user", JSON.stringify(userData));

// Automatic token attachment (in requests)
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Token expiration handling (automatic logout)
if (error.response?.status === 401) {
  localStorage.clear();
  window.location.href = "/login";
}
```

### Role-Based Route Protection

- **Customer Routes**: `/dashboard`, `/profile`, `/orders`, `/wallet`
- **Employee Routes**: `/employee-dashboard`, `/employee-profile`, `/manage-orders`
- **Protected Route Behavior**: Unauthorized access redirects to login
- **Dynamic Navigation**: Menu items change based on user role

### Authentication Headers

All API requests must include the JWT token:

```javascript
// Automatic header injection via axios interceptor
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

## API Usage

### Complete API Documentation

The complete API routes, request/response formats, and authentication flows are documented in:

- **`client/FRONTEND-API-DOCUMENTATION.md`**: Complete endpoint reference with examples
- **`server/docs/API-TESTING-GUIDE.md`**: Testing procedures with Postman collections

### Authentication Examples

#### Customer Login

```javascript
// Request
POST /api/auth/customer/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "customer_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "wallet_balance": 150.00,
      "role": "customer"
    }
  }
}
```

#### Employee Login

```javascript
// Request
POST /api/auth/employee/login
Content-Type: application/json

{
  "email": "employee@laundryola.com",
  "password": "employeepass123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "employee_id": 1,
      "name": "Jane Smith",
      "email": "employee@laundryola.com",
      "earnings_balance": 2500.00,
      "role": "employee"
    }
  }
}
```

### Order Management Examples

#### Place Order

```javascript
// Request
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "service_id": 1,
  "quantity": 5
}

// Response
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order_id": 123,
    "service_name": "Wash & Iron",
    "quantity": 5,
    "total_amount": 125.00,
    "status": "Pending",
    "order_date": "2025-08-08T10:30:00.000Z"
  }
}
```

#### Accept Order (Employee)

```javascript
// Request
PUT /api/orders/123/accept
Authorization: Bearer {employee_token}

// Response
{
  "success": true,
  "message": "Order accepted successfully",
  "data": {
    "order_id": 123,
    "status": "Accepted",
    "employee_id": 1,
    "updated_at": "2025-08-08T11:00:00.000Z"
  }
}
```

### Request Authentication

All protected endpoints require the Authorization header:

```javascript
// Using the centralized api instance (recommended)
import api from "./utils/api.js";

// Token is automatically attached by interceptor
const response = await api.get("/orders");
const orders = response.data.data;
```

## Persistent Session and SPA Routing

### Session Persistence Mechanism

The application maintains user sessions across browser refreshes using localStorage:

```javascript
// On app initialization (App.jsx)
useEffect(() => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    // Validate token with server
    api
      .get("/auth/validate")
      .then(() => {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Invalid token - clear storage
        localStorage.clear();
        navigate("/login");
      });
  }
}, []);
```

### SPA Routing and Deep Links

React Router handles client-side navigation. For production deployment, all routes must redirect to `/index.html`:

**Vercel Configuration** (`client/vercel.json`):

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This ensures that:

- Deep links work (e.g., `https://laundry-ola-new.vercel.app/dashboard`)
- Browser refresh preserves the current route
- 404 errors are handled by React Router, not the server

### Route Protection

Protected routes automatically redirect unauthorized users:

```javascript
// Protected route wrapper
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

## Deployment Guide

### Frontend Deployment (Vercel)

#### 1. Prepare for Deployment

```bash
cd client

# Ensure build command works locally
npm run build

# Test production build
npm run preview
```

#### 2. Configure Vercel

Create or verify `client/vercel.json`:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://laundryola-new.onrender.com/api"
  }
}
```

#### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from client directory
cd client
vercel --prod
```

#### 4. Set Environment Variables in Vercel

In the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add `VITE_API_BASE_URL` with value from `hostURL.txt`:
   - Variable: `VITE_API_BASE_URL`
   - Value: `https://laundryola-new.onrender.com/api`

### Backend Deployment

#### 1. Environment Variables for Production

Ensure your production server has all required environment variables:

```env
PORT=5000
NODE_ENV=production

# Database (use production MySQL instance)
DB_HOST=your-production-mysql-host
DB_USER=your-production-mysql-user
DB_PASSWORD=your-production-mysql-password
DB_NAME=laundry_service_db

# Security (use strong, unique values)
JWT_SECRET=your-super-secure-production-jwt-secret-64-characters-minimum
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS (match your frontend URL)
FRONTEND_URL=https://laundry-ola-new.vercel.app
```

#### 2. Database Migration

```bash
# On production server, import database schema
mysql -u your-prod-user -p laundry_service_db < database.sql

# Verify tables and data
mysql -u your-prod-user -p laundry_service_db -e "SHOW TABLES; SELECT COUNT(*) FROM Services;"
```

#### 3. Deployment Options

**Option A: Render Deployment**

1. Connect GitHub repository to Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables in Render dashboard
5. Configure MySQL database connection

**Option B: Railway/Heroku/DigitalOcean**

```bash
# General Node.js deployment steps
cd server
npm install --production
npm start
```

**Option C: PM2 on VPS**

```bash
# On your VPS
npm install -g pm2
cd server
npm install --production

# Start with PM2
pm2 start src/index.js --name "laundry-backend" --env production
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs laundry-backend
```

#### 4. SSL and Domain Configuration

- **Backend**: Ensure HTTPS is enabled (most platforms handle this automatically)
- **Frontend**: Vercel provides automatic HTTPS
- **Custom Domains**: Update `hostURL.txt` and redeploy both frontend and backend

### Domain and HTTPS Notes

- **Production URLs**: Always use HTTPS in production
- **CORS Configuration**: Backend must allow requests from frontend domain
- **Environment Variables**: Update `FRONTEND_URL` in backend and `VITE_API_BASE_URL` in frontend
- **Certificate Management**: Platforms like Vercel and Render handle SSL certificates automatically

## Testing

### Backend API Testing

Use the comprehensive testing guide:

```bash
# Navigate to testing documentation
cd client
open API-TESTING-GUIDE.md  # or cat API-TESTING-GUIDE.md

# The guide includes:
# - Postman collection setup
# - All endpoint examples
# - Authentication flow testing
# - Error case validation
```

### Automated Tests (if available)

```bash
# Run backend tests
cd server
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test auth.test.js
```

### Manual Testing Workflow

#### Complete End-to-End Test:

1. **Customer Registration and Login**

   ```bash
   # Register new customer
   POST /api/auth/customer/register

   # Login with credentials
   POST /api/auth/customer/login
   ```

2. **Wallet Management**

   ```bash
   # Add funds to wallet
   POST /api/customers/wallet/add

   # Check wallet balance
   GET /api/customers/profile
   ```

3. **Place Order**

   ```bash
   # Get available services
   GET /api/services

   # Place order
   POST /api/orders
   ```

4. **Employee Actions**

   ```bash
   # Employee login
   POST /api/auth/employee/login

   # View pending orders
   GET /api/orders/pending

   # Accept order
   PUT /api/orders/{id}/accept

   # Complete order
   PUT /api/orders/{id}/complete
   ```

5. **Verify Database Updates**

   ```sql
   -- Check wallet balance updated
   SELECT wallet_balance FROM Customers WHERE customer_id = 1;

   -- Check employee earnings updated
   SELECT earnings_balance FROM Employees WHERE employee_id = 1;

   -- Check order status
   SELECT status FROM Orders WHERE order_id = 123;
   ```

## Troubleshooting

### Common Issues and Fixes

#### 1. Tailwind CSS Not Working

**Symptoms**: Styles not applying, classes not recognized

**Solutions**:

```bash
# Verify Tailwind import in src/index.css
cat client/src/index.css
# Should contain: @import "tailwindcss";

# Check Vite config includes Tailwind plugin
cat client/vite.config.js
# Should include: tailwindcss() in plugins array

# Restart development server
cd client && npm run dev
```

#### 2. Heroicons Import Errors

**Symptoms**: `Cannot resolve '@heroicons/react'`, icon names not found

**Solutions**:

```bash
# Verify Heroicons is installed
cd client && npm list @heroicons/react

# Use correct import syntax
# ❌ Wrong: import { FunnelIcon } from '@heroicons/react/outline';
# ✅ Correct: import { FunnelIcon } from '@heroicons/react/24/outline';

# Common icon names:
# - FunnelIcon, XMarkIcon, ArrowRightIcon (outline)
# - CheckCircleIcon, StarIcon (solid)
```

#### 3. CORS Problems

**Symptoms**: `Access-Control-Allow-Origin` errors, requests blocked

**Solutions**:

```javascript
// Check backend CORS config (server/src/config/app.js)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    process.env.FRONTEND_URL || 'https://laundry-ola-new.vercel.app'
  ],
  credentials: true
};

// Update FRONTEND_URL in server/.env
FRONTEND_URL=https://your-frontend-domain.com
```

#### 4. Invalid/Expired Token Handling

**Symptoms**: Stuck on login, automatic redirects, "Unauthorized" errors

**Solutions**:

```javascript
// Check token expiration (api.js interceptor handles this)
// Manual fix: Clear localStorage and login again
localStorage.clear();
window.location.href = "/login";

// Check JWT_SECRET matches between sessions
// Verify JWT_EXPIRES_IN is reasonable (7d recommended)
```

#### 5. MySQL Connection Errors

**Symptoms**: `ER_ACCESS_DENIED_ERROR`, `ECONNREFUSED`, connection timeout

**Solutions**:

```bash
# Check MySQL service is running
# Windows:
net start mysql80

# macOS:
brew services start mysql

# Linux:
sudo systemctl start mysql

# Verify database credentials
mysql -u your_username -p
USE laundry_service_db;
SHOW TABLES;

# Check database configuration in server/.env
DB_HOST=localhost      # or your MySQL server IP
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=laundry_service_db
```

#### 6. SPA Refresh 404 Errors

**Symptoms**: Direct URLs or refresh returns 404 instead of React app

**Solutions**:

```json
// Verify vercel.json includes catch-all route
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}

// For other hosting platforms, configure URL rewrites to index.html
```

#### 7. Environment Variable Issues

**Symptoms**: API calls to wrong URL, undefined environment variables

**Solutions**:

```bash
# Check environment files exist and have correct content
ls client/.env*
cat client/.env

# Verify VITE_ prefix for frontend variables
# ❌ Wrong: API_BASE_URL=...
# ✅ Correct: VITE_API_BASE_URL=...

# Restart development server after env changes
cd client && npm run dev
```

#### 8. Build/Production Errors

**Symptoms**: Build fails, production app doesn't work

**Solutions**:

```bash
# Test build locally first
cd client && npm run build
npm run preview

# Check for console errors in browser
# Verify API_BASE_URL points to production backend

# Clear build cache if needed
rm -rf client/dist client/node_modules/.vite
cd client && npm install && npm run build
```

## Security Notes

### Production Security Checklist

#### Environment Variables

- ✅ **Never commit `.env` files** to version control
- ✅ **Use strong JWT secrets**: Minimum 64 characters, cryptographically random
- ✅ **Set secure database passwords**: Complex passwords for production databases
- ✅ **Validate all environment variables** on startup

#### JWT Security

```javascript
// Use strong JWT secret (generate with crypto)
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Set reasonable expiration times
JWT_EXPIRES_IN=7d  // or 1d for high-security applications

// Implement token refresh if needed for longer sessions
```

#### Password Security

```javascript
// Use high bcrypt rounds for production
BCRYPT_ROUNDS = 12; // Minimum 10, 12-15 for high security

// Validate password strength on frontend and backend
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

#### HTTPS and Transport Security

- ✅ **Always use HTTPS in production**: No exceptions
- ✅ **Secure headers**: Helmet.js is configured for security headers
- ✅ **CORS restrictions**: Only allow trusted domains
- ✅ **Rate limiting**: Prevent abuse with request limits

#### Database Security

```sql
-- Use dedicated database user with minimal permissions
CREATE USER 'laundry_app'@'%' IDENTIFIED BY 'secure_random_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON laundry_service_db.* TO 'laundry_app'@'%';

-- Avoid using root user in production
-- Regular security updates for MySQL server
```

#### Rate Limiting Configuration

```javascript
// Implement rate limiting (already configured)
RATE_LIMIT_WINDOW_MS = 900000; // 15 minutes
RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window

// Consider stricter limits for auth endpoints
// auth routes: 5 requests per 15 minutes
// general API: 100 requests per 15 minutes
```

## Maintenance and Conventions

### Code Style and Standards

#### Frontend Conventions

```javascript
// Use functional components with hooks
const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);

  // Custom hooks for reusable logic
  const { user, isAuthenticated } = useAuth();

  return <div className="container mx-auto px-4">{/* JSX content */}</div>;
};

// Consistent file naming: PascalCase for components, camelCase for utilities
// Components: CustomerDashboard.jsx, OrderCard.jsx
// Utils: api.js, dateUtils.js
```

#### Backend Conventions

```javascript
// Use async/await consistently
const createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.body);
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    next(error); // Use error handler middleware
  }
};

// Consistent response format
const responseFormat = {
  success: boolean,
  message: string,
  data?: any,
  error?: string
};
```

### Commit Message Convention

Follow conventional commits for clear history:

```bash
# Format: type(scope): description

# Examples:
git commit -m "feat(auth): add employee login endpoint"
git commit -m "fix(orders): resolve status update bug"
git commit -m "docs(readme): update deployment guide"
git commit -m "style(client): fix tailwind class ordering"

# Types: feat, fix, docs, style, refactor, test, chore
```

### Branching Strategy

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch

# Feature branches
feature/employee-dashboard
feature/wallet-system
fix/auth-token-expiry
hotfix/critical-security-patch

# Workflow
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
# ... make changes ...
git add . && git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request to develop
```

### Adding New Endpoints

Follow this consistent pattern:

#### 1. Create Validator

```javascript
// server/src/validators/newFeatureValidator.js
const Joi = require("joi");

const validateNewFeature = {
  create: {
    body: Joi.object({
      name: Joi.string().required().min(3).max(100),
      description: Joi.string().optional().max(500),
    }),
  },
};

module.exports = validateNewFeature;
```

#### 2. Create Controller

```javascript
// server/src/controllers/newFeatureController.js
const createFeature = async (req, res, next) => {
  try {
    // Business logic here
    const result = await FeatureService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Feature created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createFeature };
```

#### 3. Create Routes

```javascript
// server/src/routes/newFeature.js
const express = require("express");
const { createFeature } = require("../controllers/newFeatureController");
const { validate } = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");
const { validateNewFeature } = require("../validators/newFeatureValidator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(validateNewFeature.create),
  createFeature
);

module.exports = router;
```

#### 4. Register Routes

```javascript
// server/src/routes/index.js
const newFeatureRoutes = require("./newFeature");

app.use("/api/features", newFeatureRoutes);
```

#### 5. Update Documentation

- Add endpoint to `FRONTEND-API-DOCUMENTATION.md`
- Add test cases to `API-TESTING-GUIDE.md`
- Update Postman collection if available

### Database Migration Pattern

For schema changes:

```sql
-- Create migration file: migrations/001_add_new_table.sql
-- Always include rollback instructions

-- Forward migration
ALTER TABLE Customers ADD COLUMN loyalty_points INT DEFAULT 0;

-- Rollback (commented)
-- ALTER TABLE Customers DROP COLUMN loyalty_points;

-- Update any affected views/procedures
-- Document changes in laundry-database-documentation.md
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.

---

## Quick Start Summary

For experienced developers, here's the rapid setup:

```bash
# 1. Clone and setup
git clone <repository-url>
cd LaundryOla-new

# 2. Database setup
mysql -u root -p
CREATE DATABASE laundry_service_db;
mysql -u root -p laundry_service_db < database.sql

# 3. Backend setup
cd server
npm install
cp .env.example .env  # Configure DB credentials and JWT secret
npm run dev

# 4. Frontend setup
cd ../client
npm install
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev

# 5. Test login
# Customer: john@example.com / password123
# Employee: jane@example.com / password123
```

**Production Deployment**:

- Frontend: Deploy `client/` to Vercel with `VITE_API_BASE_URL` env var
- Backend: Deploy `server/` to Render/Node hosting with full `.env` config
- Database: Use hosted MySQL (Render, PlanetScale, etc.)

**Documentation References**:

- API Endpoints: `client/FRONTEND-API-DOCUMENTATION.md`
- Testing Guide: `client/API-TESTING-GUIDE.md`
- Production URLs: `hostURL.txt` (single source of truth)

---

_This README covers every aspect of the LaundryOla application. For specific API details, refer to the linked documentation files. For issues not covered here, check the troubleshooting section or create an issue in the repository._
