#!/bin/bash

# Render Build Script for CampusConnect
echo "🚀 Starting Render Build Process..."

# Install and build frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🔨 Building frontend..."
npm run build

# Verify build
if [ -d "dist" ]; then
  echo "✅ Frontend build successful"
  echo "📊 Build size:"
  du -sh dist
else
  echo "❌ Frontend build failed - dist folder not found"
  exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
npm install

echo "✅ Build process complete!"
