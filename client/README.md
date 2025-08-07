
# LaundryOla Frontend

## Setup Instructions

1. **Install dependencies:**
   ```sh
   cd client
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run dev
   ```

3. **Access the app:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features
- Customer & Employee registration/login
- Role-based dashboards
- JWT authentication (localStorage)
- Customer: wallet, place orders, order history
- Employee: pending orders, accept/reject/complete
- Simple forms, tables, status badges
- Responsive, minimal UI with Tailwind

## Backend
- Make sure your backend is running at `http://localhost:5000/api`

## Notes
- All protected routes require login
- Logout clears JWT and user info
- Error messages shown for failed actions

---

This frontend is minimal and designed for backend testing. No advanced UI or state management.
