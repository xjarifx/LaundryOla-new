# LaundryOla - Local Development Guide

## 🎯 Complete Setup Walkthrough

### Step 1: Environment Setup

1. **Clone and Navigate**

   ```bash
   git clone https://github.com/yourusername/LaundryOla-new.git
   cd LaundryOla-new
   ```

2. **Install Dependencies**

   ```bash
   # Backend
   cd server && npm install && cd ..

   # Frontend
   cd client && npm install && cd ..
   ```

### Step 2: Database Configuration

1. **Start MySQL Service**

   ```bash
   # Windows
   net start mysql

   # macOS/Linux
   sudo systemctl start mysql
   ```

2. **Create Database**

   ```sql
   mysql -u root -p
   CREATE DATABASE laundryola_db;
   USE laundryola_db;
   SOURCE database.sql;
   EXIT;
   ```

3. **Configure Backend Environment**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your database credentials
   ```

### Step 3: Start Development Servers

#### Option A: Manual Start

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

#### Option B: Automated Start (Windows)

```bash
# Double-click start-dev.bat
# Or run from command line:
start-dev.bat
```

#### Option C: Automated Start (Linux/macOS)

```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Step 4: Verify Setup

1. **Access Application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

2. **Test Registration**
   - Create a customer account
   - Create an employee account
   - Verify login functionality

## 🔧 Development Workflow

### Daily Routine

1. Start MySQL service
2. Run development servers
3. Check browser console for errors
4. Monitor server logs
5. Test new features

### Database Management

```sql
-- Reset database
DROP DATABASE laundryola_db;
CREATE DATABASE laundryola_db;
USE laundryola_db;
SOURCE database.sql;

-- Check tables
SHOW TABLES;
DESCRIBE Customers;
```

### Testing APIs

```bash
# Test customer registration
curl -X POST http://localhost:5000/api/auth/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "1234567890",
    "email": "test@example.com",
    "password": "password123",
    "address": "123 Test St"
  }'
```

## 🛠️ Common Tasks

### Adding New Features

1. **Backend Route**

   ```bash
   # Add to server/src/routes/
   # Update controller in server/src/controllers/
   # Add validation in server/src/validators/
   ```

2. **Frontend Component**
   ```bash
   # Add to client/src/components/
   # Update routing in client/src/App.jsx
   # Add API call in client/src/utils/
   ```

### Database Changes

```sql
-- Add new column
ALTER TABLE Customers ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;

-- Create new table
CREATE TABLE Categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Troubleshooting

### Port Conflicts

```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID 1234 /F

# Use different port
PORT=5001 npm run dev
```

### Database Connection Issues

```bash
# Test connection
mysql -u root -p laundryola_db

# Check MySQL status
systemctl status mysql
```

### Frontend Build Issues

```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

## 📊 Performance Tips

### Backend Optimization

- Enable MySQL query caching
- Use connection pooling (already configured)
- Monitor slow queries
- Index frequently queried columns

### Frontend Optimization

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size with tree shaking
- Enable Vite's build optimizations

## 🔒 Security Considerations

### Development Security

- Never commit .env files
- Use strong JWT secrets
- Validate all user inputs
- Sanitize database queries

### Production Preparation

- Environment variable validation
- Rate limiting configuration
- HTTPS enforcement
- Security headers with Helmet

## 📈 Monitoring & Debugging

### Logging

```javascript
// Backend logging
console.log("User registered:", userId);
console.error("Database error:", error);

// Frontend logging
console.log("API response:", response.data);
console.error("Request failed:", error);
```

### Browser DevTools

- Network tab for API calls
- Console for JavaScript errors
- Application tab for localStorage
- Performance tab for optimization

---

**Happy Development! 🚀**
