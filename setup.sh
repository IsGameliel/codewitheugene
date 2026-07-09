#!/bin/bash

# CodeWithEugene Setup Script
echo "🚀 Setting up CodeWithEugene..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL v8.0 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo "📦 Setting up backend..."
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create database
echo "Creating database..."
npm run db:create

# Run migrations
echo "Running database migrations..."
npm run db:migrate

echo "✅ Backend setup complete"

# Go back to root
cd ..

# Setup frontend
echo "📦 Setting up frontend..."
npm install

echo "✅ Frontend setup complete"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: npm run dev"
echo ""
echo "Admin credentials:"
echo "Email: admin@codewitheugene.com"
echo "Password: admin123"
echo ""
echo "Make sure to update the backend/.env file with your MySQL credentials if different from defaults."