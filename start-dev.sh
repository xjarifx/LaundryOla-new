#!/bin/bash
# LaundryOla Local Development Startup Script

echo "🚀 Starting LaundryOla Local Development Environment..."

# Check if MySQL is running
if ! pgrep mysql > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL service first."
    echo "   sudo systemctl start mysql  # Linux"
    echo "   brew services start mysql  # macOS"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node > /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    cd server
    if [ ! -f ".env" ]; then
        echo "⚠️  Backend .env file not found. Creating from template..."
        cp .env.example .env
        echo "🔧 Please edit server/.env with your database credentials"
        return 1
    fi
    npm run dev &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started on http://localhost:5000"
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend server..."
    cd client
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend started on http://localhost:5173"
}

# Trap to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ Cleanup complete"
}

trap cleanup EXIT

# Start services
if start_backend; then
    sleep 3
    start_frontend
    
    echo ""
    echo "🎉 LaundryOla is running!"
    echo "📱 Frontend: http://localhost:5173"
    echo "🔗 Backend API: http://localhost:5000/api"
    echo "📖 API Docs: See client/API-TESTING-GUIDE.md"
    echo ""
    echo "Press Ctrl+C to stop all servers..."
    
    # Wait for user to stop
    wait
else
    echo "❌ Failed to start backend. Please check configuration."
fi
