// Diagnostic script to check server setup
console.log('🔍 Running diagnostics...\n');

// Check if dotenv loads
try {
  require('dotenv').config();
  console.log('✅ Environment variables loaded');
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✓ Set' : '✗ Not set'}`);
} catch (err) {
  console.error('❌ Error loading environment:', err.message);
}

// Check mongoose connection
const mongoose = require('mongoose');
console.log('\n🔍 Testing MongoDB connection...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    
    // Test models
    console.log('\n🔍 Checking models...');
    try {
      const Student = require('./src/models/student');
      console.log('✅ Student model loaded');
      const Alumni = require('./src/models/alumni');
      console.log('✅ Alumni model loaded');
    } catch (err) {
      console.error('❌ Model error:', err.message);
    }
    
    // Test express server
    console.log('\n🔍 Testing Express server...');
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    app.get('/test', (req, res) => {
      res.json({ message: 'Working!' });
    });
    
    app.post('/api/admin-approval/login', (req, res) => {
      const { username, password } = req.body;
      if (username === 'admin' && password === 'admin') {
        res.json({
          success: true,
          message: 'Login successful',
          token: Buffer.from('admin:' + Date.now()).toString('base64')
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
    
    const PORT = 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server listening on port ${PORT}`);
      console.log(`   Address: http://localhost:${PORT}`);
      console.log(`   Bound to: ${server.address().address}:${server.address().port}`);
      console.log('\n📝 Try this command in another terminal:');
      console.log(`   Invoke-RestMethod -Uri "http://localhost:5000/test" -Method Get`);
      console.log(`   Invoke-RestMethod -Uri "http://localhost:5000/api/admin-approval/login" -Method Post -ContentType "application/json" -Body '{"username":"admin","password":"admin"}'`);
    });
    
    server.on('error', (err) => {
      console.error('❌ Server error:', err.message);
      if (err.code === 'EADDRINUSE') {
        console.error(`   Port ${PORT} is already in use. Kill the process using:`);
        console.error(`   netstat -ano | findstr :${PORT}`);
        console.error(`   taskkill /PID <PID> /F`);
      }
      process.exit(1);
    });
    
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
