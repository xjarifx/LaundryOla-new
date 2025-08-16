# LaundryOla - Local Development Setup

A full-stack laundry management system optimized for local development, featuring customer management, employee dashboards, order processing, and wallet transactions.

## 📁 Project Structure

```
LaundryOla-new/
├── client/                 # React frontend
│   ├── src/
│   ├── .env                # Local API configuration
│   ├── .env.example        # Environment template
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   ├── .env.example        # Database & server config template
│   └── package.json
├── database.sql            # Database schema
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

### 1. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE laundryola_db;
USE laundryola_db;

# Import schema
source database.sql;
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=laundryola_db
# JWT_SECRET=your_super_secret_key
# PORT=5000

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create environment file (optional - defaults already set)
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔧 Development Configuration

### Environment Variables

#### Backend (.env)

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=laundryola_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENV=development
```

### Development Commands

#### Backend Commands

```bash
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
npm test            # Run test suite
npm run lint        # Check code style
```

#### Frontend Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm start           # Start with host binding
npm run lint        # Check code style
```

## 🗄️ Database Features

### Tables

- **Customers**: User accounts with wallet balances
- **Employees**: Staff accounts with earnings tracking
- **Services**: Available laundry services and pricing
- **Orders**: Order management with status tracking
- **Wallet_Transactions**: Transaction history
- **Employee_Earnings**: Earnings and commission tracking

### Stored Procedures

- `sp_register_customer` - Customer registration
- `sp_register_employee` - Employee registration
- `sp_customer_login` - Customer authentication
- `sp_employee_login` - Employee authentication
- `sp_add_money` - Wallet top-up
- `sp_place_order` - Order placement
- `sp_manage_order` - Order status management
- `sp_get_dashboard` - Dashboard data

### Database Views

- `view_customer_complete` - Complete customer profiles
- `view_available_services` - Service catalog
- `view_all_orders` - Order details with relationships
- `view_wallet_transactions` - Transaction history

## 🔐 Authentication

### Customer Flow

1. Register: `POST /api/auth/customers/register`
2. Login: `POST /api/auth/customers/login`
3. Access protected routes with JWT token

### Employee Flow

1. Register: `POST /api/auth/employees/register`
2. Login: `POST /api/auth/employees/login`
3. Access protected routes with JWT token

## 📡 API Endpoints

### Authentication

- `POST /api/auth/customers/register` - Customer registration
- `POST /api/auth/customers/login` - Customer login
- `POST /api/auth/employees/register` - Employee registration
- `POST /api/auth/employees/login` - Employee login
- `POST /api/auth/logout` - Logout

### Customer Management

- `GET /api/customers/profile` - Get profile
- `PUT /api/customers/profile` - Update profile
- `GET /api/customers/dashboard` - Dashboard data
- `POST /api/customers/wallet/add` - Add money
- `GET /api/customers/wallet/balance` - Get balance
- `GET /api/customers/transactions` - Transaction history
- `GET /api/customers/orders` - Order history

### Order Management

- `POST /api/orders` - Place new order
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/pending` - Get pending orders (employee)
- `PUT /api/orders/:id/manage` - Manage order status (employee)

### Service Management

- `GET /api/services` - List all services
- `POST /api/services` - Create service (employee)
- `PUT /api/services/:id` - Update service (employee)
- `DELETE /api/services/:id` - Delete service (employee)

### Employee Management

- `GET /api/employees/dashboard` - Dashboard data
- `GET /api/employees/orders` - Assigned orders
- `PUT /api/employees/profile` - Update profile
- `GET /api/employees/earnings` - Earnings report

## 🧪 Testing

### Manual Testing

Use the provided test data and API testing guide:

```bash
# Sample customer registration
curl -X POST http://localhost:5000/api/auth/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "password": "password123",
    "address": "123 Main St"
  }'
```

### Automated Testing

```bash
cd server
npm test
```

## 🔧 Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MySQL
- REST Client

### Database Management

- MySQL Workbench
- phpMyAdmin
- Sequel Pro (macOS)

### API Testing

- Postman
- Insomnia
- Thunder Client (VS Code)

## 📊 Features

### Customer Portal

- User registration and authentication
- Digital wallet management
- Order placement and tracking
- Transaction history
- Profile management

### Employee Dashboard

- Order queue management
- Earnings tracking
- Customer service tools
- Service management
- Profile management

### Admin Features

- Service creation and pricing
- Order status management
- Employee earnings tracking
- System monitoring

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Error

```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
```

#### Port Already in Use

```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=5001 npm run dev
```

#### CORS Issues

```bash
# Frontend and backend running on different ports is expected
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

#### JWT Token Issues

```bash
# Ensure JWT_SECRET is set in backend .env
JWT_SECRET=your_super_secret_key_here
```

### Debugging Tips

1. **Check browser console** for frontend errors
2. **Monitor server logs** in terminal
3. **Verify database connections** with test queries
4. **Use Postman** to test API endpoints directly
5. **Check network requests** in browser DevTools

## 📝 Development Workflow

1. **Start MySQL service**
2. **Run backend server**: `npm run dev` in `/server`
3. **Run frontend server**: `npm run dev` in `/client`
4. **Access application**: `http://localhost:5173`
5. **API available at**: `http://localhost:5000/api`

## 🎯 Next Steps

1. Explore the API with Postman
2. Test user registration and login flows
3. Create sample services and orders
4. Customize the frontend design
5. Add new features to controllers

## 📚 Documentation

- `client/API-TESTING-GUIDE.md` - Complete API documentation
- `laundry-database-documentation.md` - Database schema details
- `STORED-PROCEDURES.md` - Database procedures reference
- `server/docs/` - Additional backend documentation

---

**Happy coding! 🚀**

For questions or issues, check the troubleshooting section or review the API documentation.
