// Load environment variables FIRST (before any other imports that use them)
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const jobRoutes = require('./routes/jobRoutes');
const referralRoutes = require('./routes/referralRoutes');
const adminRoutes = require('./routes/adminRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const otpRoutes = require('./routes/otpRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const profileUpdateRoutes = require('./routes/profileUpdateRoutes');
const profileVerifyRoutes = require('./routes/profileVerifyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'https://campusconnect-1-alql.onrender.com',
    'https://hbtuconnect.me',
    'https://www.hbtuconnect.me',
    'http://hbtuconnect.me',
    'http://www.hbtuconnect.me',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.path.includes('register')) {
    console.log('🔍 REGISTRATION REQUEST DETECTED');
    console.log('  ➜ Full URL:', req.originalUrl);
    console.log('  ➜ Headers:', JSON.stringify(req.headers, null, 2));
  }
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusConnect API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes - with error handling for debugging
try {
  // IMPORTANT: Load specific path routes FIRST before generic /api routes
  console.log('Loading profileVerifyRoutes (PUBLIC - NO AUTH)...');
  app.use('/api/profile-verify', profileVerifyRoutes);
  console.log('✓ profileVerifyRoutes loaded');
  
  console.log('Loading profileUpdateRoutes...');
  app.use('/api/profile-update', profileUpdateRoutes);
  console.log('✓ profileUpdateRoutes loaded');
  
  // Load upload routes FIRST (public routes, no auth needed during registration)
  console.log('Loading uploadRoutes (PUBLIC)...');
  app.use('/api', uploadRoutes);
  console.log('✓ uploadRoutes loaded');
  
  console.log('Loading authRoutes...');
  app.use('/api', authRoutes);
  console.log('✓ authRoutes loaded');
  
  console.log('Loading otpRoutes...');
  app.use('/api', otpRoutes);
  console.log('✓ otpRoutes loaded');
  
  console.log('Loading studentRoutes...');
  app.use('/api', studentRoutes);
  console.log('✓ studentRoutes loaded');
  
  console.log('Loading alumniRoutes...');
  app.use('/api', alumniRoutes);
  console.log('✓ alumniRoutes loaded');
  
  console.log('Loading jobRoutes...');
  app.use('/api', jobRoutes);
  console.log('✓ jobRoutes loaded');
  
  console.log('Loading referralRoutes...');
  app.use('/api', referralRoutes);
  console.log('✓ referralRoutes loaded');
  
  console.log('Loading adminRoutes...');
  app.use('/api/admin', adminRoutes);
  console.log('✓ adminRoutes loaded');
  
  console.log('Loading approvalRoutes (ADMIN APPROVAL SYSTEM)...');
  app.use('/api/admin-approval', approvalRoutes);
  console.log('✓ approvalRoutes loaded');
} catch (error) {
  console.error('Error loading routes:', error);
  throw error;
}

// Serve static files from React build folder
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
console.log(`📁 Serving static files from: ${frontendBuildPath}`);
app.use(express.static(frontendBuildPath));

// Catch-all route - serves index.html for all non-API routes
// This allows React Router to handle client-side routing
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    // API route not found
    res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`🚀 CampusConnect Backend Server Started`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📌 Server is listening on port ${PORT}`);
      console.log(`📌 Bound to address: ${server.address().address}:${server.address().port}`);
      console.log('='.repeat(50));
    });
    
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:');
  console.error(err);
  console.error('Stack:', err.stack);
  // Don't exit immediately to debug
  // process.exit(1);
});